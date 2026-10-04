const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

const OUT = path.join("QA", "evidence", "LR-0021");
fs.mkdirSync(OUT, { recursive: true });
let browser;
const errors = [];
const consoleErrors = [];
const steps = [];
const events = [];

const clean = s => String(s || "").replace(/\s+/g, " ").trim();

(async () => {
  browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 1,
    hasTouch: true,
    isMobile: true
  });
  const page = await context.newPage();
  page.setDefaultTimeout(5000);
  page.on("pageerror", e => errors.push(String(e)));
  page.on("console", m => { if (m.type() === "error") consoleErrors.push(m.text()); });

  await page.goto("http://127.0.0.1:4173/", { waitUntil: "networkidle" });
  await page.evaluate(() => { localStorage.clear(); sessionStorage.clear(); });
  await page.reload({ waitUntil: "networkidle" });

  async function timeState() {
    const chips = page.locator(".stat-chip");
    const texts = [];
    for (let i = 0; i < await chips.count(); i++) texts.push(clean(await chips.nth(i).innerText()));
    const t = texts.find(x => /^TIME\s/i.test(x)) || "";
    const m = t.match(/Day\s+(\d+),\s*([^•]+)\s*•\s*(.+)$/i);
    const loc = (texts.find(x => /^LOCATION\s/i.test(x)) || "").replace(/^LOCATION\s*/i,"");
    const res = (texts.find(x => /^RESOURCES\s/i.test(x)) || "").replace(/^RESOURCES\s*/i,"");
    const pressure = (texts.find(x => /^PRESSURE\s/i.test(x)) || "").replace(/^PRESSURE\s*/i,"");
    return { day: m ? Number(m[1]) : null, clock: m ? clean(m[2]) : null, weather: m ? clean(m[3]) : null, location: loc, resources: res, pressure };
  }

  async function record(action, extra={}) {
    const s = await timeState();
    const row = { action, ...s, ...extra };
    steps.push(row);
    console.log("WARDEN_STEP", JSON.stringify(row));
    return row;
  }

  async function modalVisible() {
    return await page.locator("#modalRoot").evaluate(el => !el.hidden && getComputedStyle(el).display !== "none");
  }

  async function modalTitle() {
    const root = page.locator("#modalRoot");
    const h = root.locator("h1,h2,h3").first();
    return await h.count() ? clean(await h.innerText()) : clean((await root.innerText()).split("\n")[0]);
  }

  async function resolveModal(tag) {
    let guard = 0;
    while (await modalVisible() && guard++ < 12) {
      const root = page.locator("#modalRoot");
      const title = await modalTitle();
      const text = clean(await root.innerText());
      events.push({ tag, title, text: text.slice(0, 700), state: await timeState() });
      console.log("WARDEN_EVENT", JSON.stringify(events[events.length - 1]));

      const btns = root.getByRole("button");
      const choices = [];
      for (let i = 0; i < await btns.count(); i++) {
        const b = btns.nth(i);
        if (await b.isVisible() && !(await b.isDisabled())) choices.push({ i, label: clean(await b.innerText()) });
      }
      if (!choices.length) break;

      // Prefer a substantive player choice. Fall back to Set out/Continue, then Close/Leave.
      let chosen = choices.find(x => !/^(close|leave\.?|cancel)$/i.test(x.label) && !/^×$/.test(x.label));
      if (!chosen) chosen = choices.find(x => /set out|continue/i.test(x.label));
      if (!chosen) chosen = choices[choices.length - 1];

      await btns.nth(chosen.i).click();
      await page.waitForTimeout(90);
    }
  }

  await page.screenshot({ path: path.join(OUT, "00-historical-start.png"), fullPage: true });
  await record("fresh-campaign");
  if (await modalVisible()) await resolveModal("intro");

  // Opening player actions.
  const rumour = page.getByRole("button", { name: "Hear rumours", exact: true });
  if (await rumour.count()) {
    await rumour.click();
    await page.waitForTimeout(90);
    if (await modalVisible()) await resolveModal("rumour");
    await record("heard-rumours");
  }

  const talk = page.getByRole("button", { name: "Talk", exact: true }).first();
  if (await talk.count()) {
    await talk.click();
    await page.waitForTimeout(90);
    if (await modalVisible()) await resolveModal("opening-dialogue");
    await record("opening-dialogue");
  }

  const save = page.getByRole("button", { name: "Save", exact: true });
  if (await save.count()) {
    await save.click();
    await page.waitForTimeout(90);
    if (await modalVisible()) await resolveModal("save");
    await record("manual-save");
  }

  // Historical baseline endurance path: a plausible but intentionally low-agency player
  // repeatedly camps to expose pacing, repetition, resource-pressure and campaign-end behaviour.
  let camps = 0;
  while (camps < 70) {
    const s = await timeState();
    if (s.day !== null && s.day >= 19) break;

    const camp = page.getByRole("button", { name: "Camp", exact: true });
    if (!(await camp.count()) || !(await camp.isVisible()) || await camp.isDisabled()) {
      await record("camp-unavailable");
      break;
    }

    camps++;
    await camp.click();
    await page.waitForTimeout(90);
    if (await modalVisible()) await resolveModal("camp");
    const after = await record("camp-" + camps);

    if (camps % 8 === 0) {
      await page.screenshot({ path: path.join(OUT, "camp-" + String(camps).padStart(2,"0") + ".png"), fullPage: true });
    }
    if (after.day !== null && after.day >= 18 && camps >= 2) {
      // One more camp may be needed for the campaign end to surface.
      if (await modalVisible()) await resolveModal("late-campaign");
      if (after.day >= 19) break;
    }
  }

  if (await modalVisible()) await resolveModal("final-modal");
  await page.screenshot({ path: path.join(OUT, "99-historical-final.png"), fullPage: true });
  const final = await record("final", { camps });

  const titleCounts = {};
  for (const e of events) titleCounts[e.title] = (titleCounts[e.title] || 0) + 1;
  const repeatedEvents = Object.entries(titleCounts).filter(([,n]) => n > 1).sort((a,b)=>b[1]-a[1]);
  const result = {
    tested_game_base_sha: "70056f6a323b8df3c36f854988dc2cc036fbf88d",
    qa_branch_head: process.env.GITHUB_SHA || null,
    viewport: "390x844 mobile Chromium",
    camps,
    final,
    repeatedEvents,
    steps,
    events,
    errors,
    consoleErrors
  };
  fs.writeFileSync(path.join(OUT, "historical-endurance.json"), JSON.stringify(result, null, 2));
  console.log("WARDEN_RESULT", JSON.stringify({
    tested_game_base_sha: result.tested_game_base_sha,
    camps,
    final,
    repeatedEvents,
    errors,
    consoleErrors
  }));
})().catch(err => {
  errors.push(String(err && err.stack || err));
  console.error("WARDEN_PROBE_FATAL", err);
  process.exitCode = 1;
}).finally(async () => {
  if (browser) await browser.close().catch(() => {});
});
