const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

const OUT = path.join("QA", "evidence", "LR-0021");
fs.mkdirSync(OUT, { recursive: true });

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 1,
    hasTouch: true,
    isMobile: true,
  });
  const page = await context.newPage();
  page.setDefaultTimeout(4000);
  page.setDefaultNavigationTimeout(10000);

  const pageErrors = [];
  const consoleErrors = [];
  page.on("pageerror", err => pageErrors.push(String(err)));
  page.on("console", msg => { if (msg.type() === "error") consoleErrors.push(msg.text()); });

  async function settle() { await page.waitForTimeout(350); }

  async function snapshot(label) {
    await page.screenshot({ path: path.join(OUT, label + ".png"), fullPage: true });
    const body = (await page.locator("body").innerText()).replace(/\n{3,}/g, "\n\n");
    const buttons = await page.getByRole("button").evaluateAll(btns => btns.map((b, i) => ({
      i,
      text: (b.innerText || b.getAttribute("aria-label") || "").trim(),
      disabled: b.disabled,
      visible: !!(b.offsetWidth || b.offsetHeight || b.getClientRects().length),
      pressed: b.getAttribute("aria-pressed")
    })));
    const modal = page.locator("#modalRoot");
    const modalText = await modal.count() ? (await modal.innerText()).trim() : "";
    console.log("\n=== SNAPSHOT " + label + " ===");
    console.log("BODY:\n" + body.slice(0, 14000));
    console.log("BUTTONS:", JSON.stringify(buttons));
    console.log("MODAL:", JSON.stringify(modalText.slice(0, 5000)));
  }

  async function clickExact(name, label = name) {
    const loc = page.getByRole("button", { name, exact: true }).filter({ visible: true });
    if (!await loc.count()) {
      console.log("ACTION_MISSING", label);
      return false;
    }
    console.log("ACTION", label);
    await loc.first().click();
    await settle();
    return true;
  }

  async function dismissModal() {
    for (const name of ["Close", "Continue", "Done", "Leave"]) {
      const loc = page.getByRole("button", { name, exact: true }).filter({ visible: true });
      if (await loc.count()) {
        console.log("ACTION dismiss modal via", name);
        await loc.first().click();
        await settle();
        return true;
      }
    }
    return false;
  }

  try {
    await page.goto("http://127.0.0.1:4173/", { waitUntil: "commit", timeout: 10000 });
    await page.waitForLoadState("domcontentloaded", { timeout: 5000 }).catch(() => {});
    await page.evaluate(() => { localStorage.clear(); sessionStorage.clear(); });
    await page.reload({ waitUntil: "commit", timeout: 10000 });
    await page.waitForLoadState("domcontentloaded", { timeout: 5000 }).catch(() => {});
    await settle();

    await snapshot("00-fresh-start");

    await clickExact("Set out from Hearthwick.", "opening: set out");
    await snapshot("01-after-opening");

    for (const tab of ["Journal", "Party", "Log", "Context"]) {
      await clickExact(tab, "tab: " + tab);
      await snapshot("tab-" + tab.toLowerCase());
    }

    await clickExact("Hear rumours", "Hearthwick: hear rumours");
    await snapshot("02-rumour");
    await dismissModal();

    const talkButtons = page.getByRole("button", { name: "Talk", exact: true }).filter({ visible: true });
    if (await talkButtons.count()) {
      console.log("ACTION talk to first visible NPC");
      await talkButtons.first().click();
      await settle();
      await snapshot("03-first-npc");
      await dismissModal();
    }

    await clickExact("Visit the market", "Hearthwick: market");
    await snapshot("04-market");
    await dismissModal();

    await clickExact("Camp", "open camp");
    await snapshot("05-camp");
    await dismissModal();

    const canvas = page.locator("#mapCanvas");
    if (await canvas.count()) {
      const box = await canvas.boundingBox();
      console.log("CANVAS_BOX", JSON.stringify(box));
      if (box) {
        const travelPoints = [
          { x: 100, y: 54 },
          { x: 72, y: 78 },
          { x: 128, y: 78 },
          { x: 100, y: 104 }
        ];
        for (const [i, p] of travelPoints.entries()) {
          console.log("ACTION map probe", i, JSON.stringify(p));
          await canvas.click({ position: p, force: true });
          await settle();
          await snapshot("06-map-probe-" + i);
          const modalText = (await page.locator("#modalRoot").innerText()).trim();
          if (modalText) {
            await dismissModal();
          }
        }
      }
    }

    console.log("\n=== BROWSER ERRORS ===");
    console.log(JSON.stringify({ pageErrors, consoleErrors }, null, 2));
  } finally {
    await browser.close();
  }
})().catch(err => {
  console.error("WARDEN_PROBE_FATAL", err);
  process.exitCode = 1;
});
