const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");
const OUT = path.join("QA", "evidence", "LR-0021");
fs.mkdirSync(OUT, { recursive: true });

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, hasTouch: true, isMobile: true,
  });
  const page = await context.newPage();
  page.setDefaultTimeout(4000);
  page.setDefaultNavigationTimeout(10000);
  const pageErrors = [], consoleErrors = [];
  page.on("pageerror", err => pageErrors.push(String(err)));
  page.on("console", msg => { if (msg.type() === "error") consoleErrors.push(msg.text()); });
  const settle = () => page.waitForTimeout(350);

  async function snapshot(label) {
    await page.screenshot({ path: path.join(OUT, label + ".png"), fullPage: true });
    const body = (await page.locator("body").innerText()).replace(/\n{3,}/g, "\n\n");
    const buttons = await page.getByRole("button").evaluateAll(btns => btns.map((b, i) => ({
      i, text:(b.innerText||b.getAttribute("aria-label")||"").trim(), disabled:b.disabled,
      visible:!!(b.offsetWidth||b.offsetHeight||b.getClientRects().length)
    })));
    console.log("\n=== SNAPSHOT " + label + " ===");
    console.log("BODY:\n" + body.slice(0,16000));
    console.log("BUTTONS:", JSON.stringify(buttons));
  }
  async function clickExact(name, label=name) {
    const loc=page.getByRole("button",{name,exact:true});
    if(!await loc.count()){ console.log("ACTION_MISSING",label); return false; }
    console.log("ACTION",label);
    await loc.first().click(); await settle(); return true;
  }
  async function closeModal() {
    const loc=page.locator("#modalRoot").getByRole("button",{name:"Close",exact:true});
    if(await loc.count()){ console.log("ACTION close modal"); await loc.first().click(); await settle(); return true; }
    return false;
  }

  try {
    await page.goto("http://127.0.0.1:4173/",{waitUntil:"commit",timeout:10000});
    await page.waitForLoadState("domcontentloaded",{timeout:5000}).catch(()=>{});
    await page.evaluate(()=>{localStorage.clear();sessionStorage.clear();});
    await page.reload({waitUntil:"commit",timeout:10000});
    await page.waitForLoadState("domcontentloaded",{timeout:5000}).catch(()=>{});
    await settle();

    await snapshot("00-fresh-start");
    await clickExact("Set out from Hearthwick.","opening: set out");

    await clickExact("Hear rumours","Hearthwick: hear rumours");
    await snapshot("01-rumours");
    await closeModal();

    const talks=page.getByRole("button",{name:"Talk",exact:true});
    console.log("ACTION Rowan Pike: talk");
    await talks.first().click(); await settle();
    await snapshot("02-rowan-offer");
    await clickExact("Take the road trouble job.","Rowan: take road trouble job");
    await snapshot("03-road-job-accepted");
    await closeModal();

    await clickExact("Journal","tab: Journal after quest");
    await snapshot("04-journal-after-quest");
    await clickExact("Context","tab: Context");

    await clickExact("Camp","camp at Hearthwick");
    await snapshot("05-camp-first-watch");
    await clickExact("Tell him the weight can be shared.","camp: share Garrick's weight");
    await snapshot("06-camp-response");
    await closeModal();

    const canvas=page.locator("#mapCanvas");
    console.log("ACTION travel visually to Redwater Ferry adjacent hex");
    await canvas.scrollIntoViewIfNeeded();
    const mapBox=await canvas.boundingBox();
    console.log("CANVAS_BOX",JSON.stringify(mapBox));
    await page.touchscreen.tap(mapBox.x+102,mapBox.y+212);
    await settle();
    await snapshot("07-redwater-arrival");

    const modal=page.locator("#modalRoot");
    const modalText=(await modal.innerText()).trim();
    if(modalText){
      const mb=modal.getByRole("button");
      const labels=await mb.evaluateAll(bs=>bs.filter(b=>!b.disabled && (b.offsetWidth||b.offsetHeight||b.getClientRects().length)).map(b=>(b.innerText||"").trim()));
      console.log("ARRIVAL_MODAL_BUTTONS",JSON.stringify(labels));
      const choices=labels.filter(x=>x && x!=="Close" && x!=="⚙");
      if(choices.length){
        await clickExact(choices[0],"arrival/event first visible choice");
        await snapshot("08-arrival-choice-result");
      }
      await closeModal();
    }

    await clickExact("Context","tab: Context at destination");
    await snapshot("09-destination-context");
    await clickExact("Journal","tab: Journal at destination");
    await snapshot("10-destination-journal");

    console.log("\n=== BROWSER ERRORS ===");
    console.log(JSON.stringify({pageErrors,consoleErrors},null,2));
  } finally { await browser.close(); }
})().catch(err=>{console.error("WARDEN_PROBE_FATAL",err);process.exitCode=1;});
