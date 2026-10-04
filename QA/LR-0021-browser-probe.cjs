const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

const OUT = path.join("QA", "evidence", "LR-0021");
fs.mkdirSync(OUT, { recursive: true });

const errors = [];
const consoleErrors = [];

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 1,
    hasTouch: true,
    isMobile: true,
  });
  const page = await context.newPage();
  page.setDefaultTimeout(5000);
  page.setDefaultNavigationTimeout(10000);
  page.on("pageerror", err => errors.push(String(err)));
  page.on("console", msg => {
    if (msg.type() === "error") consoleErrors.push(msg.text());
  });

  await page.goto("http://127.0.0.1:4173/", { waitUntil: "commit", timeout: 10000 });
  await page.waitForLoadState("domcontentloaded", { timeout: 5000 }).catch(err => console.log("DOMContentLoaded delay:", String(err)));
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
  await page.reload({ waitUntil: "commit", timeout: 10000 });
  await page.waitForLoadState("domcontentloaded", { timeout: 5000 }).catch(err => console.log("Reload DOMContentLoaded delay:", String(err)));
  await page.waitForTimeout(1000);

  async function snapshot(label) {
    await page.screenshot({ path: path.join(OUT, label + ".png"), fullPage: true });
    const body = (await page.locator("body").innerText()).replace(/\n{3,}/g, "\n\n");
    const buttons = await page.getByRole("button").evaluateAll(btns => btns.map((b, i) => ({
      i,
      text: (b.innerText || b.getAttribute("aria-label") || "").trim(),
      disabled: b.disabled,
      pressed: b.getAttribute("aria-pressed")
    })));
    const canvas = page.locator("canvas");
    const canvasBox = await canvas.count() ? await canvas.first().boundingBox() : null;
    console.log("\n=== SNAPSHOT " + label + " ===");
    console.log("URL:", page.url());
    console.log("TITLE:", await page.title());
    console.log("BODY:\n" + body.slice(0, 14000));
    console.log("BUTTONS:", JSON.stringify(buttons));
    console.log("CANVAS:", JSON.stringify(canvasBox));
  }

  await snapshot("00-fresh-start");

  for (const tab of ["Context", "Journal", "Party", "Log"]) {
    const b = page.getByRole("button", { name: tab, exact: true });
    if (await b.count()) {
      await b.click();
      await page.waitForTimeout(250);
      await snapshot("tab-" + tab.toLowerCase());
    }
  }

  const contextButton = page.getByRole("button", { name: "Context", exact: true });
  if (await contextButton.count()) {
    await contextButton.click();
    await page.waitForTimeout(250);
  }

  console.log("\n=== BROWSER ERRORS ===");
  console.log(JSON.stringify({ errors, consoleErrors }, null, 2));
  await browser.close();
})().catch(err => {
  console.error("WARDEN_PROBE_FATAL", err);
  process.exitCode = 1;
});
