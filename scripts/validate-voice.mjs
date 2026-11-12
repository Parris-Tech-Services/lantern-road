#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const root = process.cwd();
const errors = [];
const readJson = (file) => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));

let voice;
try {
  voice = readJson('voice.json');
} catch (error) {
  console.error(`voice.json is not valid JSON: ${error.message}`);
  process.exit(1);
}

for (const field of ['given', 'surname', 'place', 'trades', 'quirks', 'wants', 'reserved']) {
  if (!voice[field] || (Array.isArray(voice[field]) && voice[field].length === 0)) {
    errors.push(`voice.json: missing or empty ${field}`);
  }
}
for (const field of ['reserved', 'avoid', 'banned_words', 'banned_phrases']) {
  if (voice[field] !== undefined && !Array.isArray(voice[field])) errors.push(`voice.json: ${field} must be an array`);
}

const content = { window: {} };
vm.createContext(content);
vm.runInContext(fs.readFileSync(path.join(root, 'content.js'), 'utf8'), content);
const C = content.window.CONTENT;
const map = readJson('world/map-canon.json');
const reserved = new Set((voice.reserved || []).map((value) => value.toLowerCase()));
const avoid = (voice.avoid || []).map((value) => value.toLowerCase());

for (const npc of C.npcs || []) {
  if (!reserved.has(npc.name.toLowerCase())) errors.push(`voice.json: canonical NPC is not reserved: ${npc.name}`);
}
for (const place of map.places || []) {
  if (!reserved.has(`place:${place.name}`.toLowerCase())) errors.push(`voice.json: canonical place is not reserved: ${place.name}`);
}
for (const name of avoid) {
  if (reserved.has(name)) errors.push(`voice.json: watchlist name is also reserved: ${name}`);
}

// Scan committed player-facing story prose for new watchlist names. Existing canon
// names must be reserved above; a watchlist hit is a new generic default that needs review.
const storyRoot = path.join(root, 'story');
const files = [];
function walk(dir) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.isFile() && entry.name.endsWith('.md')) files.push(full);
  }
}
walk(storyRoot);
let watchlistHits = 0;
for (const file of files) {
  const text = fs.readFileSync(file, 'utf8');
  for (const name of avoid) {
    const pattern = new RegExp(`(?<![\\w-])${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?![\\w-])`, 'i');
    if (pattern.test(text)) {
      watchlistHits += 1;
      errors.push(`${path.relative(root, file)}: watchlist name "${name}" appears in story prose`);
    }
  }
}

if (errors.length) {
  console.error('Voice/name registry validation failed:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}
console.log(`Voice/name registry OK: ${(C.npcs || []).length} canon NPCs, ${(map.places || []).length} canon places, ${avoid.length} watchlist names, ${watchlistHits} story hits.`);
