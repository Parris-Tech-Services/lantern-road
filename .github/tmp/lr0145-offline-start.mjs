import { chromium } from "playwright";
import { createServer } from "node:http";
import { promises as fs } from "node:fs";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const port = 4173;
const origin = `http://127.0.0.1:${port}`;
const types = {
  ".html":"text/html; charset=utf-8",
  ".js":"text/javascript; charset=utf-8",
  ".css":"text/css; charset=utf-8",
  ".json":"application/json; charset=utf-8",
  ".webmanifest":"application/manifest+json; charset=utf-8",
  ".svg":"image/svg+xml",
  ".png":"image/png",
  ".md":"text/markdown; charset=utf-8"
};

const server=createServer(async(req,res)=>{
  try{
    const url=new URL(req.url||"/",origin);
    const rel=url.pathname==="/"?"/index.html":url.pathname;
    const file=path.join(root,rel.replace(/^\/+/, ""));
    const data=await fs.readFile(file);
    res.statusCode=200;
    res.setHeader("Cache-Control","no-store");
    res.setHeader("Content-Type",types[path.extname(file)]||"application/octet-stream");
    res.end(data);
  }catch{
    res.statusCode=404;
    res.end("not found");
  }
});
await new Promise(resolve=>server.listen(port,"127.0.0.1",resolve));

const browser=await chromium.launch();
const context=await browser.newContext({serviceWorkers:"allow",viewport:{width:390,height:844}});
const page=await context.newPage();
const pageErrors=[];
page.on("pageerror",e=>pageErrors.push(String(e)));

try{
  await page.goto(origin+"/index.html",{waitUntil:"domcontentloaded"});
  await page.waitForFunction(()=>typeof window.LanternRoadSave==="object");
  await page.waitForFunction(()=>typeof window.render_game_to_text==="function");
  await page.evaluate(()=>navigator.serviceWorker.ready);
  await page.waitForFunction(()=>navigator.serviceWorker.controller!==null);

  const cached=await page.evaluate(async()=>{
    const keys=await caches.keys();
    const shell=await caches.open("lantern-road-shell");
    const match=await shell.match("./save-system.js");
    return {keys,hasSaveSystem:!!match};
  });
  if(!cached.hasSaveSystem) throw new Error("save-system.js was not precached in lantern-road-shell");
  console.log("PASS app shell contains save-system.js");

  await context.setOffline(true);
  await page.reload({waitUntil:"domcontentloaded"});
  await page.waitForFunction(()=>typeof window.LanternRoadSave==="object");
  await page.waitForFunction(()=>typeof window.render_game_to_text==="function");

  const game=await page.evaluate(()=>JSON.parse(window.render_game_to_text()));
  if(!game?.campaign) throw new Error("offline reload did not initialise a playable campaign");
  console.log("PASS first-install offline reload initialises LanternRoadSave and the game");
  console.log("PASS offline campaign location:", game.campaign.location);

  if(pageErrors.length) throw new Error("uncaught page errors: "+pageErrors.join(" | "));
  console.log("LR-0145 OFFLINE APP-SHELL TEST: PASS");
}finally{
  await context.setOffline(false).catch(()=>{});
  await browser.close();
  await new Promise(resolve=>server.close(resolve));
}
