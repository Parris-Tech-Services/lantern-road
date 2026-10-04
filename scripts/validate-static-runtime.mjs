import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { execFileSync } from "node:child_process";

const root = process.cwd();
const failures = [];
const warnings = [];

function fail(message) {
  failures.push(message);
}

function warn(message) {
  warnings.push(message);
}

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function normalizeLocalRef(ref, sourceLabel) {
  if (typeof ref !== "string" || !ref.trim()) {
    fail(`${sourceLabel}: empty local reference.`);
    return null;
  }

  const trimmed = ref.trim();
  if (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("//") ||
    trimmed.startsWith("data:") ||
    trimmed.startsWith("mailto:") ||
    trimmed.startsWith("tel:") ||
    trimmed.startsWith("#")
  ) {
    return null;
  }

  const clean = trimmed.split("#")[0].split("?")[0];
  if (!clean || clean === "." || clean === "./") return ".";

  const withoutLeading = clean.replace(/^\.\//, "").replace(/^\//, "");
  const normalized = path.posix.normalize(withoutLeading);

  if (normalized.startsWith("../") || normalized === "..") {
    fail(`${sourceLabel}: reference escapes repository root: "${ref}".`);
    return null;
  }

  return normalized;
}

function assertExists(localPath, sourceLabel) {
  if (localPath === null) return;
  const absolute = localPath === "." ? root : path.join(root, localPath);
  if (!fs.existsSync(absolute)) {
    fail(`${sourceLabel}: local reference "${localPath}" does not exist.`);
  }
}

function collectHtmlRefs(html) {
  const refs = [];

  for (const match of html.matchAll(/<script\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/gi)) {
    refs.push({ kind: "script", raw: match[1], source: "index.html <script src>" });
  }

  for (const match of html.matchAll(/<link\b[^>]*\bhref=["']([^"']+)["'][^>]*>/gi)) {
    const tag = match[0];
    const rel = (tag.match(/\brel=["']([^"']+)["']/i)?.[1] || "").toLowerCase();
    if (rel.split(/\s+/).some(value => ["stylesheet", "manifest", "icon", "apple-touch-icon"].includes(value))) {
      refs.push({ kind: rel || "link", raw: match[1], source: `index.html <link rel="${rel || "unknown"}">` });
    }
  }

  return refs;
}

function parseServiceWorkerFiles(swSource) {
  const match = swSource.match(/\bconst\s+FILES\s*=\s*(\[[\s\S]*?\]);/);
  if (!match) {
    fail("sw.js: could not find a static const FILES = [...] cache manifest.");
    return [];
  }

  try {
    const value = vm.runInNewContext(`(${match[1]})`, Object.create(null), { timeout: 1000 });
    if (!Array.isArray(value)) {
      fail("sw.js: FILES must evaluate to an array.");
      return [];
    }
    return value;
  } catch (error) {
    fail(`sw.js: FILES could not be parsed: ${error.message}`);
    return [];
  }
}

function collectFirstPartyJavaScript() {
  const roots = [root, path.join(root, "scripts")];
  const files = [];

  function walk(dir) {
    if (!fs.existsSync(dir)) return;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.name === ".git" || entry.name === "node_modules") continue;
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(full);
      } else if (/\.(?:js|mjs|cjs)$/.test(entry.name)) {
        files.push(full);
      }
    }
  }

  for (const dir of roots) walk(dir);
  return [...new Set(files)];
}

const html = read("index.html");
const sw = read("sw.js");
const manifest = JSON.parse(read("manifest.webmanifest"));

const htmlRefs = collectHtmlRefs(html);
const localHtmlRefs = [];

for (const ref of htmlRefs) {
  const local = normalizeLocalRef(ref.raw, ref.source);
  if (local !== null) {
    localHtmlRefs.push({ ...ref, local });
    assertExists(local, ref.source);
  }
}

if (!manifest || typeof manifest !== "object" || Array.isArray(manifest)) {
  fail("manifest.webmanifest: expected a JSON object.");
} else {
  for (const key of ["name", "short_name", "start_url", "display", "background_color", "theme_color"]) {
    if (typeof manifest[key] !== "string" || !manifest[key].trim()) {
      fail(`manifest.webmanifest: required field "${key}" must be a non-empty string.`);
    }
  }

  if (typeof manifest.start_url === "string") {
    const start = normalizeLocalRef(manifest.start_url, "manifest.webmanifest start_url");
    if (start !== null) assertExists(start, "manifest.webmanifest start_url");
  }

  if (manifest.icons !== undefined) {
    if (!Array.isArray(manifest.icons)) {
      fail("manifest.webmanifest: icons must be an array when present.");
    } else {
      manifest.icons.forEach((icon, index) => {
        if (!icon || typeof icon !== "object") {
          fail(`manifest.webmanifest icons[${index}]: expected an object.`);
          return;
        }
        const local = normalizeLocalRef(icon.src, `manifest.webmanifest icons[${index}].src`);
        if (local !== null) assertExists(local, `manifest.webmanifest icons[${index}].src`);
      });
    }
  }
}

const serviceWorkerRefs = parseServiceWorkerFiles(sw);
const normalizedCacheRefs = new Set();

for (const [index, raw] of serviceWorkerRefs.entries()) {
  const local = normalizeLocalRef(raw, `sw.js FILES[${index}]`);
  if (local !== null) {
    normalizedCacheRefs.add(local);
    assertExists(local, `sw.js FILES[${index}]`);
  }
}

for (const required of [".", "index.html"]) {
  if (!normalizedCacheRefs.has(required)) {
    fail(`sw.js FILES: missing core offline shell entry "${required === "." ? "./" : "./" + required}".`);
  }
}

for (const ref of localHtmlRefs) {
  if (!normalizedCacheRefs.has(ref.local)) {
    fail(`sw.js FILES: local ${ref.kind} "${ref.raw}" from index.html is not included in the offline cache manifest.`);
  }
}

const swRegistration = html + "\n" + read("game.js");
if (!/serviceWorker\.register\(\s*["']\.\/sw\.js["']\s*\)/.test(swRegistration)) {
  warn('No exact navigator.serviceWorker.register("./sw.js") call found in index.html/game.js.');
}

const jsFiles = collectFirstPartyJavaScript();
for (const full of jsFiles) {
  const rel = path.relative(root, full).split(path.sep).join("/");
  try {
    execFileSync(process.execPath, ["--check", full], {
      cwd: root,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"]
    });
  } catch (error) {
    const detail = String(error.stderr || error.stdout || error.message || "").trim();
    fail(`${rel}: JavaScript syntax check failed${detail ? `: ${detail}` : "."}`);
  }
}

for (const message of warnings) console.warn(`WARN: ${message}`);

if (failures.length) {
  console.error(`Static runtime integrity failed with ${failures.length} problem(s):`);
  for (const message of failures) console.error(`- ${message}`);
  process.exit(1);
}

console.log(
  `Static runtime integrity OK: ${localHtmlRefs.length} local HTML resources, ${normalizedCacheRefs.size} service-worker cache entries, ${jsFiles.length} first-party JavaScript files syntax-checked.`
);
