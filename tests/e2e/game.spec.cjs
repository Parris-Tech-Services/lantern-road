const { test, expect } = require("@playwright/test");

async function openGame(page) {
  const pageErrors = [];
  page.on("pageerror", error => pageErrors.push(error.message));

  await page.route("https://parris-tech-services.github.io/**", route => {
    route.fulfill({
      status: 200,
      contentType: "application/javascript",
      body: "window.PortalAdapter={init(){}};"
    });
  });

  await page.goto("/?e2e=1");
  await expect(page.locator("#mapCanvas")).toBeVisible();

  const introButton = page.getByRole("button", { name: "Set out from Hearthwick." });
  if (await introButton.isVisible()) await introButton.click();

  return pageErrors;
}

async function snapshot(page) {
  return page.evaluate(() => JSON.parse(window.render_game_to_text()));
}

function expectNoPageErrors(errors) {
  expect(errors, errors.join("\n")).toEqual([]);
}

test("new campaign accepts a real quest through the UI", async ({ page }) => {
  const errors = await openGame(page);

  await expect(page.locator("#tabContent")).toContainText("Hearthwick");
  await page.locator('button[data-action="talk-npc"][data-npc="mayor_rowan"]').click();
  await page.getByRole("button", { name: "Take the road trouble job." }).click();

  await expect(page.locator("#modalRoot")).toContainText("Quest Accepted");
  const state = await snapshot(page);
  expect(state.campaign.activeQuests.some(quest => quest.id === "lantern_road")).toBe(true);

  expectNoPageErrors(errors);
});

test("canvas travel changes the party position", async ({ page }) => {
  const errors = await openGame(page);
  const before = await snapshot(page);

  const target = await page.evaluate(() => {
    const current = JSON.parse(window.render_game_to_text()).campaign.position;
    const width = window.CONTENT.region.width;
    const q = current.q + 1 < width ? current.q + 1 : current.q - 1;
    const r = current.r;
    const canvas = document.getElementById("mapCanvas");
    const rect = canvas.getBoundingClientRect();
    const size = Math.min(
      rect.width / (Math.sqrt(3) * (window.CONTENT.region.width + 1.2)),
      rect.height / (1.5 * (window.CONTENT.region.height + 1.3))
    );
    return {
      x: rect.left + size * Math.sqrt(3) * (q + 0.5 * (r & 1)) + size * 1.6,
      y: rect.top + size * 1.5 * r + size * 1.7,
      q,
      r
    };
  });

  await page.mouse.click(target.x, target.y);

  await expect.poll(async () => {
    const state = await snapshot(page);
    return [state.campaign.position.q, state.campaign.position.r];
  }).toEqual([target.q, target.r]);

  const after = await snapshot(page);
  expect(after.campaign.day >= before.campaign.day).toBe(true);
  expectNoPageErrors(errors);
});

test("save survives a page reload and load restores campaign progress", async ({ page }) => {
  const errors = await openGame(page);

  await page.locator('button[data-action="talk-npc"][data-npc="mayor_rowan"]').click();
  await page.getByRole("button", { name: "Take the road trouble job." }).click();
  await page.locator('#modalRoot button[data-action="close-dialogue"]').click();

  const saved = await snapshot(page);
  expect(saved.campaign.activeQuests.some(quest => quest.id === "lantern_road")).toBe(true);

  await page.locator("#saveBtn").click();
  await expect(page.locator("#modalRoot")).toContainText("Saved");
  await page.locator('#modalRoot button[data-action="close-dialogue"]').click();

  await page.reload();
  const introButton = page.getByRole("button", { name: "Set out from Hearthwick." });
  if (await introButton.isVisible()) await introButton.click();

  await page.locator("#loadBtn").click();
  await expect(page.locator("#feedbackRoot")).toContainText("Campaign loaded");

  const restored = await snapshot(page);
  expect(restored.campaign.activeQuests).toEqual(saved.campaign.activeQuests);
  expect(restored.campaign.day).toBe(saved.campaign.day);
  expect(restored.campaign.hour).toBe(saved.campaign.hour);

  expectNoPageErrors(errors);
});

test("site action and combat action work in a real browser", async ({ page }) => {
  const errors = await openGame(page);

  await page.evaluate(() => window.__lanternRoadTest.placeAtSite("saint_rhel"));
  await expect(page.locator("#tabContent")).toContainText("Saint Rhel");
  await page.locator('button[data-action="site-action"][data-key="saint_rhel:pray"]').click();
  await expect(page.locator("#feedbackRoot")).toContainText("The shrine steadies the party.");

  await page.evaluate(() => window.__lanternRoadTest.startCombat("toll_cutters"));
  await expect(page.locator("#modalRoot")).toContainText("Regression test encounter.");

  const action = page.locator('button[data-action="combat-action"]').first();
  await expect(action).toBeVisible();
  await action.click();

  const target = page.locator('button[data-action="combat-target"]:not([disabled])').first();
  await expect(target).toBeVisible();
  await target.click();

  await expect.poll(async () => {
    const state = await snapshot(page);
    return state.combat ? state.combat.round : 0;
  }).toBeGreaterThanOrEqual(1);

  expectNoPageErrors(errors);
});
