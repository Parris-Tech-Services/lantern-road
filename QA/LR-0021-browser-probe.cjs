const { chromium } = require("playwright");
(async () => {
  const browser=await chromium.launch({headless:true});
  const context=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true});
  const page=await context.newPage();
  page.setDefaultTimeout(4000);
  async function fresh(){
    await page.goto("http://127.0.0.1:4173/",{waitUntil:"commit",timeout:10000});
    await page.waitForLoadState("domcontentloaded",{timeout:5000}).catch(()=>{});
    await page.evaluate(()=>{localStorage.clear();sessionStorage.clear();});
    await page.reload({waitUntil:"commit",timeout:10000});
    await page.waitForLoadState("domcontentloaded",{timeout:5000}).catch(()=>{});
    await page.waitForTimeout(250);
    await page.getByRole("button",{name:"Set out from Hearthwick.",exact:true}).click();
    await page.waitForTimeout(150);
  }
  async function status(){
    const body=await page.locator("body").innerText();
    const time=(body.match(/Day \d+, [^\n]+/)||[])[0]||"";
    const loc=(body.match(/LOCATION\n([^\n]+)/)||[])[1]||"";
    const feedback=(await page.locator("#feedbackRoot").innerText()).trim();
    return {time,loc,feedback};
  }
  const pts=[
    ["NW",68,267],["NE",102,267],["W",51,297],
    ["E",119,297],["SW",68,328],["SE",102,330]
  ];
  for(const [name,x,y] of pts){
    await fresh();
    const before=await status();
    const canvas=page.locator("#mapCanvas");
    await canvas.scrollIntoViewIfNeeded();
    const box=await canvas.boundingBox();
    console.log("CANVAS_BOX",JSON.stringify(box));
    await page.touchscreen.tap(box.x+x,box.y+y);
    await page.waitForTimeout(80);
    const immediate=await status();
    await page.waitForTimeout(400);
    const later=await status();
    console.log("HEX_PROBE",JSON.stringify({name,x,y,before,immediate,later}));
  }
  await browser.close();
})().catch(e=>{console.error("WARDEN_PROBE_FATAL",e);process.exitCode=1;});
