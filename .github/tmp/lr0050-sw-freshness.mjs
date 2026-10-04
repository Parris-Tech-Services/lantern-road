import { chromium } from "playwright";
import { createServer } from "node:http";
import { promises as fs } from "node:fs";
import path from "node:path";
import process from "node:process";

const root = path.join(process.cwd(), ".tmp-lr0050-sw-site");
const port = 4173;
const origin = `http://127.0.0.1:${port}`;

const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8",
  ".md": "text/markdown; charset=utf-8"
};

function html(marker) {
  return `<!doctype html>
<html>
  <head><meta charset="utf-8"><title>LR-0050 fixture</title></head>
  <body>
    <main id="marker">${marker}</main>
    <script>
      window.__swReady = navigator.serviceWorker.register("./sw.js").then(() => navigator.serviceWorker.ready);
    </script>
  </body>
</html>`;
}

async function expectMarker(page, expected, label) {
  const actual = (await page.locator("#marker").textContent())?.trim();
  if (actual !== expected) {
    throw new Error(`${label}: expected marker ${expected}, got ${actual}`);
  }
  console.log(`PASS ${label}: ${actual}`);
}

await fs.rm(root, { recursive: true, force: true });
await fs.mkdir(root, { recursive: true });
await fs.copyFile(path.join(process.cwd(), "sw.js"), path.join(root, "sw.js"));
await fs.writeFile(path.join(root, "index.html"), html("OLD_SHELL"));
await fs.writeFile(path.join(root, "style.css"), "body{font-family:sans-serif}");
await fs.writeFile(path.join(root, "content.js"), "window.CONTENT={};");
await fs.writeFile(path.join(root, "game.js"), "window.__fixtureGame=true;");
await fs.writeFile(path.join(root, "manifest.webmanifest"), JSON.stringify({ name: "LR fixture", start_url: "./index.html", display: "standalone" }));
await fs.writeFile(path.join(root, "LICENSE"), "fixture");
await fs.writeFile(path.join(root, "README.md"), "fixture");

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url || "/", origin);
    const pathname = url.pathname === "/" ? "/index.html" : url.pathname;
    const file = path.join(root, pathname.replace(/^\/+/, ""));
    const data = await fs.readFile(file);
    res.statusCode = 200;
    res.setHeader("Cache-Control", "no-store");
    res.setHeader("Content-Type", contentTypes[path.extname(file)] || "application/octet-stream");
    res.end(data);
  } catch {
    res.statusCode = 404;
    res.end("not found");
  }
});

await new Promise(resolve => server.listen(port, "127.0.0.1", resolve));

const browser = await chromium.launch();
const context = await browser.newContext({ serviceWorkers: "allow" });
const page = await context.newPage();

try {
  await page.goto(`${origin}/index.html`, { waitUntil: "domcontentloaded" });
  await page.evaluate(() => window.__swReady);
  await page.waitForFunction(() => navigator.serviceWorker.controller !== null);
  await page.reload({ waitUntil: "domcontentloaded" });
  await expectMarker(page, "OLD_SHELL", "initial cached shell");

  await page.evaluate(async () => {
    const obsolete = await caches.open("lantern-road-v4");
    await obsolete.put("./legacy", new Response("legacy"));
  });

  await fs.appendFile(path.join(root, "sw.js"), "\n// lr0050-test-revision\n");
  await page.evaluate(async () => {
    const registration = await navigator.serviceWorker.getRegistration();
    if (!registration) throw new Error("service worker registration missing");
    await registration.update();
  });

  await page.waitForFunction(async () => {
    const keys = await caches.keys();
    return keys.includes("lantern-road-shell") && !keys.includes("lantern-road-v4");
  });
  console.log("PASS obsolete Lantern Road cache cleanup");

  await fs.writeFile(path.join(root, "index.html"), html("NEW_SHELL"));
  await page.reload({ waitUntil: "domcontentloaded" });
  await expectMarker(page, "NEW_SHELL", "online navigation receives fresh shell");

  await context.setOffline(true);
  await page.reload({ waitUntil: "domcontentloaded" });
  await expectMarker(page, "NEW_SHELL", "offline navigation reopens latest cached shell");

  console.log("LR-0050 SERVICE WORKER FRESHNESS TEST: PASS");
} finally {
  await context.setOffline(false).catch(() => {});
  await browser.close();
  await new Promise(resolve => server.close(resolve));
  await fs.rm(root, { recursive: true, force: true });
}
