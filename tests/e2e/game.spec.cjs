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

  const target = await page.evaluate(() => window.__lanternRoadTest.adjacentHexCenter());
  expect(target).not.toBeNull();

  await page.locator("#mapCanvas").click({
    position: { x: target.x, y: target.y }
  });

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
