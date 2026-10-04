const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

const GAME_SHA = process.env.GAME_SHA || "54ef2802e3a47e2f8cecfa77f7f7a8603e873dd4";
const BASE_URL = process.env.BASE_URL || "http://127.0.0.1:4173/";
const OUT = process.env.WARDEN_OUT || path.join(process.cwd(), "qa-output");
fs.mkdirSync(OUT, { recursive: true });

const clean = s => String(s || "").replace(/\s+/g, " ").trim();

async function makePage(browser) {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 1,
    hasTouch: true,
    isMobile: true
  });
  const page = await context.newPage();
  page.setDefaultTimeout(5000);
  const errors = [];
  const consoleErrors = [];
  page.on("pageerror", e => errors.push(String(e)));
  page.on("console", m => { if (m.type() === "error") consoleErrors.push(m.text()); });
  await page.goto(BASE_URL, { waitUntil: "networkidle" });
  await page.evaluate(() => { localStorage.clear(); sessionStorage.clear(); });
  await page.reload({ waitUntil: "networkidle" });
  return { context, page, errors, consoleErrors };
}

async function chips(page) {
  const loc = page.locator(".stat-chip");
  const texts = [];
  for (let i = 0; i < await loc.count(); i++) texts.push(clean(await loc.nth(i).innerText()));
  const get = label => (texts.find(x => x.toUpperCase().startsWith(label + " ")) || "").slice(label.length).trim();
  const timeText = get("TIME");
  const tm = timeText.match(/Day\s+(\d+),\s*([^•]+)\s*•\s*(.+)$/i);
  return {
    timeText,
    day: tm ? Number(tm[1]) : null,
    clock: tm ? clean(tm[2]) : null,
    weather: tm ? clean(tm[3]) : null,
    location: get("LOCATION"),
    resources: get("RESOURCES"),
    pressure: get("PRESSURE"),
    goal: get("GOAL"),
    party: get("PARTY")
  };
}

async function modalVisible(page) {
  return await page.locator("#modalRoot").evaluate(el => !el.hidden && getComputedStyle(el).display !== "none");
}

async function modalTitle(page) {
  const root = page.locator("#modalRoot");
  const h = root.locator("h1,h2,h3").first();
  if (await h.count()) return clean(await h.innerText());
  return clean((await root.innerText()).split("\n")[0]);
}

async function resolveModal(page, events, tag) {
  let guard = 0;
  while (await modalVisible(page) && guard++ < 14) {
    const root = page.locator("#modalRoot");
    const title = await modalTitle(page);
    const text = clean(await root.innerText());
    events.push({ tag, title, text: text.slice(0, 800), state: await chips(page) });
    const btns = root.getByRole("button");
    const choices = [];
    for (let i=0;i<await btns.count();i++) {
      const b=btns.nth(i);
      if (await b.isVisible() && !(await b.isDisabled())) choices.push({i,label:clean(await b.innerText())});
    }
    if (!choices.length) break;
    let chosen = choices.find(x => !/^(close|leave\.?|cancel)$/i.test(x.label) && !/^×$/.test(x.label));
    if (!chosen) chosen = choices.find(x => /set out|continue/i.test(x.label));
    if (!chosen) chosen = choices[choices.length-1];
    await btns.nth(chosen.i).click();
    await page.waitForTimeout(80);
  }
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    const result = { tested_commit: GAME_SHA, tested_source: "CURRENT_MAIN", scenarios: {}, errors: [] };

    {
      const { context, page, errors, consoleErrors } = await makePage(browser);
      const events = [];
      await page.screenshot({ path: path.join(OUT, "current-opening-modal.png"), fullPage: true });
      const opening = await chips(page);
      if (await modalVisible(page)) await resolveModal(page, events, "intro");
      const afterIntro = await chips(page);

      const canvas = page.locator("#mapCanvas");
      const box = await canvas.boundingBox();
      let travelled = false;
      let afterTravel = afterIntro;
      if (box) {
        const points = [[.20,.43],[.20,.50],[.30,.45],[.28,.53],[.36,.48]];
        for (const [xf,yf] of points) {
          await page.mouse.click(box.x + box.width*xf, box.y + box.height*yf);
          await page.waitForTimeout(120);
          if (await modalVisible(page)) await resolveModal(page, events, "travel");
          const after = await chips(page);
          if (after.location && after.location !== afterIntro.location) {
            travelled = true;
            afterTravel = after;
            await page.screenshot({ path: path.join(OUT, "current-after-travel.png"), fullPage: true });
            break;
          }
        }
      }

      result.scenarios.mobile_shell = {
        opening, afterIntro, travelled, afterTravel,
        events: events.map(e => ({tag:e.tag,title:e.title,state:e.state})),
        errors, consoleErrors
      };
      result.errors.push(...errors, ...consoleErrors);
      await context.close();
    }

    {
      const { context, page, errors, consoleErrors } = await makePage(browser);
      const events = [];
      const timeline = [];
      if (await modalVisible(page)) await resolveModal(page, events, "intro");

      const talk = page.getByRole("button", {name:"Talk", exact:true}).first();
      if (await talk.count()) {
        await talk.click(); await page.waitForTimeout(80);
        if (await modalVisible(page)) await resolveModal(page, events, "opening-dialogue");
      }

      let zeroRationFirst = null;
      let camps = 0;
      while (camps < 70) {
        const pre = await chips(page);
        if (pre.day !== null && pre.day >= 19) break;
        const camp = page.getByRole("button", {name:"Camp", exact:true});
        if (!(await camp.count()) || !(await camp.isVisible()) || await camp.isDisabled()) break;
        camps++;
        await camp.click();
        await page.waitForTimeout(75);
        if (await modalVisible(page)) await resolveModal(page, events, "camp");
        const s = await chips(page);
        timeline.push({camp:camps,...s});
        if (!zeroRationFirst && /(?:^|\D)0\s+rations/i.test(s.resources)) zeroRationFirst = {camp:camps,...s};
        if ([1,8,16,32,48,53].includes(camps)) {
          await page.screenshot({path:path.join(OUT, "current-camp-"+String(camps).padStart(2,"0")+".png"),fullPage:true});
        }
      }

      const final = await chips(page);
      await page.screenshot({path:path.join(OUT,"current-final.png"),fullPage:true});
      const counts = {};
      for (const e of events.filter(e=>e.tag==="camp")) counts[e.title]=(counts[e.title]||0)+1;
      const repeats = Object.entries(counts).filter(([,n])=>n>1).sort((a,b)=>b[1]-a[1]);
      result.scenarios.endurance = {
        camps, zeroRationFirst, final, repeats, timeline,
        events: events.filter(e=>e.tag==="camp").map(e=>({title:e.title,state:e.state})),
        errors, consoleErrors
      };
      result.errors.push(...errors, ...consoleErrors);
      await context.close();
    }

    fs.writeFileSync(path.join(OUT,"current-main-result.json"), JSON.stringify(result,null,2));
    console.log("WARDEN_CURRENT_RESULT", JSON.stringify({
      tested_commit: result.tested_commit,
      mobile_shell: {
        opening: result.scenarios.mobile_shell.opening,
        travelled: result.scenarios.mobile_shell.travelled,
        afterTravel: result.scenarios.mobile_shell.afterTravel,
        errors: result.scenarios.mobile_shell.errors,
        consoleErrors: result.scenarios.mobile_shell.consoleErrors
      },
      endurance: {
        camps: result.scenarios.endurance.camps,
        zeroRationFirst: result.scenarios.endurance.zeroRationFirst,
        final: result.scenarios.endurance.final,
        repeats: result.scenarios.endurance.repeats,
        errors: result.scenarios.endurance.errors,
        consoleErrors: result.scenarios.endurance.consoleErrors
      }
    }));
  } finally {
    await browser.close();
  }
})().catch(err => {
  console.error("WARDEN_CURRENT_FATAL", err);
  process.exitCode = 1;
});
