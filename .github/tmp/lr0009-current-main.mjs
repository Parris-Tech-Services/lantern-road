import { chromium } from "playwright";
import { spawn } from "node:child_process";
import process from "node:process";

const port = 4173;
const origin = `http://127.0.0.1:${port}`;
const server = spawn("python3", ["-m", "http.server", String(port), "--bind", "127.0.0.1"], {
  stdio: ["ignore", "pipe", "pipe"]
});

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
async function waitForServer() {
  for (let i = 0; i < 50; i++) {
    try {
      const r = await fetch(origin + "/index.html");
      if (r.ok) return;
    } catch {}
    await sleep(100);
  }
  throw new Error("server did not start");
}
function assert(condition, message) {
  if (!condition) throw new Error(message);
}

await waitForServer();
const browser = await chromium.launch();

try {
  for (const vp of [
    { width: 320, height: 700 },
    { width: 360, height: 780 },
    { width: 390, height: 844 },
    { width: 430, height: 900 }
  ]) {
    const context = await browser.newContext({ viewport: vp, isMobile: true, hasTouch: true });
    const page = await context.newPage();
    const pageErrors = [];
    page.on("pageerror", e => pageErrors.push(String(e)));

    await page.goto(origin + "/index.html?lr0009=1", { waitUntil: "domcontentloaded" });
    await page.waitForFunction(() => typeof window.render_game_to_text === "function");
    await page.waitForTimeout(500);

    assert(await page.locator("#accessibilityBtn").isVisible(), `${vp.width}: Settings button missing`);
    assert((await page.locator("#nearbyTravel button").count()) === 6, `${vp.width}: expected 6 nearby travel buttons`);
    assert(await page.locator("#mapZoomOutBtn").isVisible(), `${vp.width}: map zoom out missing`);
    assert(await page.locator("#mapResetBtn").isVisible(), `${vp.width}: map centre missing`);
    assert(await page.locator("#mapZoomInBtn").isVisible(), `${vp.width}: map zoom in missing`);

    await page.evaluate(() => {
      const b = document.createElement("button");
      b.id = "jup-reopen";
      b.textContent = "⚙ Podcast settings";
      b.style.position = "fixed";
      b.style.right = "8px";
      b.style.bottom = "8px";
      document.body.appendChild(b);
    });
    const externalDisplay = await page.locator("#jup-reopen").evaluate(el => getComputedStyle(el).display);
    assert(externalDisplay === "none", `${vp.width}: external floating settings launcher should yield on phone`);

    await page.locator("#accessibilityBtn").click();
    await page.locator('[data-action="set-text-scale"][data-value="xlarge"]').click();
    await page.locator('[data-action="toggle-contrast"]').click();

    const settingsText = await page.locator(".settings-modal").innerText();
    assert(settingsText.includes("Version 1.0.0"), `${vp.width}: version missing from Settings`);
    assert(settingsText.includes("2026.10.04-lr0009-v7"), `${vp.width}: build id missing from Settings`);

    const closeBox = await page.locator(".settings-modal .close-btn").boundingBox();
    assert(closeBox && closeBox.x >= 0 && closeBox.x + closeBox.width <= vp.width + 1, `${vp.width}: Settings Close overflows horizontally`);
    assert(closeBox && closeBox.y >= 0 && closeBox.y < vp.height, `${vp.width}: Settings Close not reachable in viewport`);

    await page.locator('[data-action="close-accessibility"]').click();

    await page.locator("#saveBtn").click();
    await page.locator('[data-action="dialogue-choice"][data-key="close"]').click();
    const manualBefore = await page.evaluate(() => localStorage.getItem("lantern-road-save-v1"));
    assert(manualBefore, `${vp.width}: Manual Save missing`);
    const manualEnvelope = JSON.parse(manualBefore);
    assert(manualEnvelope.schemaVersion === 2, `${vp.width}: Manual Save did not use shared schema v2 envelope`);

    await page.locator("#nearbyTravel button").first().click();
    await page.waitForTimeout(700);
    const slots = await page.evaluate(() => ({
      manual: localStorage.getItem("lantern-road-save-v1"),
      auto: localStorage.getItem("lantern-road-autosave-v1")
    }));
    assert(slots.auto, `${vp.width}: Autosave missing after travel`);
    assert(JSON.parse(slots.auto).schemaVersion === 2, `${vp.width}: Autosave did not use shared schema v2 envelope`);
    assert(slots.manual === manualBefore, `${vp.width}: Autosave unexpectedly overwrote Manual Save`);

    await page.locator("#newGameBtn").click();
    const confirmText = await page.locator(".modal").innerText();
    assert(confirmText.includes("Manual Save will stay unchanged"), `${vp.width}: New Campaign protection copy missing`);
    await page.locator('[data-action="dialogue-choice"][data-key="newCampaignConfirm"]').click();
    await page.waitForTimeout(700);
    const manualAfterNew = await page.evaluate(() => localStorage.getItem("lantern-road-save-v1"));
    assert(manualAfterNew === manualBefore, `${vp.width}: New Campaign overwrote Manual Save`);

    await page.locator("#loadBtn").click();
    assert(await page.locator('[data-action="dialogue-choice"][data-key="loadManual"]').isVisible(), `${vp.width}: Manual Save load option missing`);
    assert(await page.locator('[data-action="dialogue-choice"][data-key="loadAutosave"]').isVisible(), `${vp.width}: Autosave load option missing`);
    await page.locator('[data-action="dialogue-choice"][data-key="loadManual"]').click();
    await page.waitForTimeout(250);

    const loadedManual = await page.evaluate(() => localStorage.getItem("lantern-road-save-v1"));
    assert(loadedManual === manualBefore, `${vp.width}: loading Manual Save mutated its stored bytes unexpectedly`);

    const tabBoxes = await page.locator(".tabs").boundingBox();
    assert(tabBoxes && tabBoxes.y + tabBoxes.height <= vp.height + 1, `${vp.width}: thumb tabs extend below viewport`);

    assert(pageErrors.length === 0, `${vp.width}: page errors: ${pageErrors.join(" | ")}`);
    console.log(`PASS ${vp.width}x${vp.height}`);
    await context.close();
  }

  console.log("LR-0009 CURRENT-MAIN MOBILE RECONCILIATION: PASS");
} finally {
  await browser.close();
  server.kill("SIGTERM");
}
