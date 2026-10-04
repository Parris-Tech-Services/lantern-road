import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const failures = [];

function fail(message) {
  failures.push(message);
}

function lineNumber(source, offset) {
  return source.slice(0, offset).split("\n").length;
}

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function runtimeJavaScriptFiles() {
  const files = [];
  const candidates = ["game.js"];
  for (const candidate of candidates) {
    if (fs.existsSync(path.join(root, candidate))) files.push(candidate);
  }

  const srcRoot = path.join(root, "src");
  function walk(dir) {
    if (!fs.existsSync(dir)) return;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (/\.js$/i.test(entry.name)) files.push(path.relative(root, full).split(path.sep).join("/"));
    }
  }
  walk(srcRoot);
  return [...new Set(files)];
}

const html = read("index.html");
const ids = new Map();

for (const match of html.matchAll(/\bid\s*=\s*["\']([^"\']+)["\']/gi)) {
  const id = match[1].trim();
  if (!id) continue;
  const line = lineNumber(html, match.index);
  if (ids.has(id)) {
    fail(`index.html:${line}: duplicate id "${id}" (first seen on line ${ids.get(id)}).`);
  } else {
    ids.set(id, line);
  }
}

function validateHtmlAttributeReferences(attribute, splitTokens) {
  const pattern = new RegExp("\\b" + attribute + "\\s*=\\s*[\\\"\\\']([^\\\"\\\']+)[\\\"\\\']", "gi");
  for (const match of html.matchAll(pattern)) {
    const line = lineNumber(html, match.index);
    const values = splitTokens ? match[1].trim().split(/\s+/).filter(Boolean) : [match[1].trim()];
    for (const target of values) {
      if (!target) continue;
      if (!ids.has(target)) {
        fail(`index.html:${line}: ${attribute} references missing id "${target}".`);
      }
    }
  }
}

validateHtmlAttributeReferences("for", false);
validateHtmlAttributeReferences("aria-controls", true);
validateHtmlAttributeReferences("aria-labelledby", true);
validateHtmlAttributeReferences("aria-describedby", true);

function validateRuntimeFile(relativePath) {
  const source = read(relativePath);

  for (const match of source.matchAll(/\bdocument\.getElementById\(\s*["\']([^"\']+)["\']\s*\)/g)) {
    const target = match[1];
    if (!ids.has(target)) {
      fail(`${relativePath}:${lineNumber(source, match.index)}: document.getElementById references missing id "${target}".`);
    }
  }

  for (const match of source.matchAll(/\b(?:document|[A-Za-z_$][\\w$]*(?:\.[A-Za-z_$][\\w$]*)*)\.querySelector(?:All)?\(\s*["\']([^"\']+)["\']\s*\)/g)) {
    const selector = match[1];
    const line = lineNumber(source, match.index);
    for (const idMatch of selector.matchAll(/#([A-Za-z_][A-Za-z0-9_:.-]*)/g)) {
      const target = idMatch[1];
      if (!ids.has(target)) {
        fail(`${relativePath}:${line}: literal selector "${selector}" references missing id "${target}".`);
      }
    }
  }
}

const runtimeFiles = runtimeJavaScriptFiles();
for (const file of runtimeFiles) validateRuntimeFile(file);

if (failures.length) {
  console.error(`DOM contract integrity failed with ${failures.length} problem(s):`);
  for (const message of failures) console.error("- " + message);
  process.exit(1);
}

console.log(`DOM contract integrity OK: ${ids.size} unique HTML ids, ${runtimeFiles.length} runtime JavaScript file(s) checked.`);
