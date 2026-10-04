const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

const OUT = path.join("QA", "evidence", "LR-0021");
fs.mkdirSync(OUT, { recursive: true });

const errors = [];
const consoleErrors = [];
const journey = [];
let browser;

function compact(text) {
  return String(text || "").replace(/\s+/g, " ").trim();
}

(async () => {
  browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 1,
    hasTouch: true,
    isMobile: true,
  });
  const page = await context.newPage();
  page.setDefaultTimeout(6000);
  page.on("pageerror", err => errors.push(String(err)));
  page.on("console", msg => {
    if (msg.type() === "error") consoleErrors.push(msg.text());
  });

  await page.goto("http://127.0.0.1:4173/", { waitUntil: "networkidle" });
  await page.evaluate(() => { localStorage.clear(); sessionStorage.clear(); });
  await page.reload({ waitUntil: "networkidle" });

  async function bodyText() {
    return await page.locator("body").innerText();
  }

  function visibleState(text) {
    const one = compact(text);
    const day = one.match(/Day\s+(\d+),\s*([^•]+)\s*•\s*([^A-Z]+?)(?= LOCATION|$)/i);
    const location = one.match(/LOCATION\s+(.+?)(?= RESOURCES|$)/i);
    const resources = one.match(/RESOURCES\s+(.+?)(?= PRESSURE|$)/i);
    const pressure = one.match(/PRESSURE\s+(.+?)(?= GOAL|$)/i);
    return {
      day: day ? Number(day[1]) : null,
      clock: day ? compact(day[2]) : null,
      weather: day ? compact(day[3]) : null,
      location: location ? compact(location[1]) : null,
      resources: resources ? compact(resources[1]) : null,
      pressure: pressure ? compact(pressure[1]) : null,
    };
  }

  async function record(action, extra = {}) {
    const text = await bodyText();
    const state = visibleState(text);
    journey.push({ action, ...state, ...extra });
    console.log("WARDEN_STEP", JSON.stringify(journey[journey.length - 1]));
  }

  async function screenshot(label) {
    await page.screenshot({ path: path.join(OUT, label + ".png"), fullPage: true });
  }

  async function modalVisible() {
    return await page.locator("#modalRoot").evaluate(el => !el.hidden && getComputedStyle(el).display !== "none");
  }

  async function dismissOrAdvanceModal(tag = "modal") {
    let steps = 0;
    let last = "";
    let stagnant = 0;
    while (await modalVisible() && steps < 30) {
      steps++;
      const modal = page.locator("#modalRoot");
      const text = compact(await modal.innerText());
      if (text === last) stagnant++; else stagnant = 0;
      last = text;
      console.log("WARDEN_MODAL", JSON.stringify({tag, steps, text: text.slice(0, 1200)}));

      const buttons = modal.getByRole("button").filter({ visible: true });
      const count = await buttons.count();
      if (!count) break;

      const labels = [];
      for (let i = 0; i < count; i++) {
        const b = buttons.nth(i);
        labels.push({ i, text: compact(await b.innerText()), disabled: await b.isDisabled() });
      }
      console.log("WARDEN_MODAL_BUTTONS", JSON.stringify(labels));

      let chosen = null;
      const preferred = [
        /set out/i, /continue/i, /accept/i, /agree/i, /investigate/i, /help/i,
        /attack/i, /strike/i, /guard/i, /heal/i, /use/i, /take/i, /leave/i,
        /close/i
      ];
      for (const re of preferred) {
        for (const x of labels) {
          if (!x.disabled && re.test(x.text)) { chosen = x; break; }
        }
        if (chosen) break;
      }
      if (!chosen) chosen = labels.find(x => !x.disabled) || null;
      if (!chosen) break;

      // If a modal is visibly stuck on one choice, try a different enabled button.
      if (stagnant >= 2) {
        const alt = labels.find(x => !x.disabled && x.i !== chosen.i);
        if (alt) chosen = alt;
      }

      await buttons.nth(chosen.i).click();
      await page.waitForTimeout(180);
    }
    await record(tag + "-resolved", { modal_steps: steps });
  }

  await screenshot("00-intro");
  await record("fresh-campaign");
  if (await modalVisible()) await dismissOrAdvanceModal("intro");
  await screenshot("01-after-intro");

  // Baseline information tabs as a normal curious first-time player.
  for (const tab of ["Context", "Journal", "Party", "Log"]) {
    const b = page.getByRole("button", { name: tab, exact: true });
    if (await b.count()) {
      await b.click();
      await page.waitForTimeout(120);
      await record("view-" + tab.toLowerCase());
    }
  }
  await page.getByRole("button", { name: "Context", exact: true }).click();

  // Try the obvious starting-town actions before setting off.
  for (const action of ["Hear rumours", "Talk", "Visit the market"]) {
    const b = page.getByRole("button", { name: action, exact: true }).first();
    if (await b.count() && await b.isVisible() && await b.isEnabled()) {
      await b.click();
      await page.waitForTimeout(150);
      await record("click-" + action.toLowerCase().replace(/\s+/g, "-"));
      if (await modalVisible()) await dismissOrAdvanceModal(action);
    }
  }

  // Save once as a normal player before travelling.
  const save = page.getByRole("button", { name: "Save", exact: true });
  if (await save.count()) {
    await save.click();
    await page.waitForTimeout(120);
    await record("manual-save");
  }

  async function tryCanvasTravel() {
    const canvas = page.locator("#mapCanvas");
    const box = await canvas.boundingBox();
    if (!box) return false;
    const before = visibleState(await bodyText());

    // A human taps the highlighted neighbour. The probe searches visible canvas positions,
    // never game internals, until one behaves as a legal adjacent move.
    const xs = [0.22,0.34,0.46,0.58,0.70,0.82];
    const ys = [0.18,0.30,0.42,0.54,0.66,0.78,0.88];
    for (const yf of ys) {
      for (const xf of xs) {
        await page.mouse.click(box.x + box.width * xf, box.y + box.height * yf);
        await page.waitForTimeout(120);
        if (await modalVisible()) await dismissOrAdvanceModal("travel-event");
        const after = visibleState(await bodyText());
        if (after.location && (after.location !== before.location || after.day !== before.day || after.clock !== before.clock)) {
          await record("travel-by-map", { from: before.location });
          return true;
        }
      }
    }
    await record("map-travel-attempt-no-move");
    return false;
  }

  let loops = 0;
  while (loops < 55) {
    loops++;
    if (await modalVisible()) await dismissOrAdvanceModal("ambient-modal");

    const state = visibleState(await bodyText());
    if (state.day && state.day >= 18) break;

    // At settlements, interact lightly rather than rushing straight through.
    const rumour = page.getByRole("button", { name: "Hear rumours", exact: true });
    if (await rumour.count() && await rumour.first().isVisible() && await rumour.first().isEnabled() && loops % 4 === 0) {
      await rumour.first().click();
      await page.waitForTimeout(120);
      await record("hear-rumour-during-run");
      if (await modalVisible()) await dismissOrAdvanceModal("rumour");
    }

    const moved = await tryCanvasTravel();
    if (!moved) {
      const camp = page.getByRole("button", { name: "Camp", exact: true });
      if (await camp.count() && await camp.isVisible() && await camp.isEnabled()) {
        await camp.click();
        await page.waitForTimeout(140);
        await record("camp");
        if (await modalVisible()) await dismissOrAdvanceModal("camp-event");
      } else {
        break;
      }
    }

    if (loops % 10 === 0) await screenshot("progress-" + String(loops).padStart(2,"0"));
  }

  await screenshot("99-final");
  await record("final");

  const result = { journey, errors, consoleErrors };
  fs.writeFileSync(path.join(OUT, "journey.json"), JSON.stringify(result, null, 2));
  console.log("\n=== WARDEN_RESULT ===\n" + JSON.stringify(result, null, 2));
})().catch(err => {
  errors.push(String(err && err.stack || err));
  console.error("WARDEN_PROBE_FATAL", err);
  try {
    fs.writeFileSync(path.join(OUT, "fatal.json"), JSON.stringify({ errors, consoleErrors, journey }, null, 2));
  } catch {}
  process.exitCode = 1;
}).finally(async () => {
  if (browser) await browser.close().catch(() => {});
});
