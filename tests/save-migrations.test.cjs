const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const Save = require("../save-system.js");

const base = () => ({
  seed: 123456789, rngState: 123456789, day: 1, hour: 8, weather: "clear",
  gold: 28, renown: 0, fatigue: 0, position: { q: 0, r: 0 },
  discoveredHexes: {}, discoveredSites: {},
  inventory: { rations: 6, bandage: 2, lantern_oil: 1, rope: 1 },
  factions: { guild: 0, wardens: 0, archive: 0, veil: 0 },
  knownRumours: [],
  quests: {
    lantern_road: { known: false, status: "hidden", stage: "", outcome: "", dueDay: null },
    future_quest: { known: false, status: "hidden", stage: "", outcome: "", dueDay: null }
  },
  party: [
    { id: "garrick", hp: 10, guard: 0, bless: 0 },
    { id: "mira", hp: 8, guard: 0, bless: 0 },
    { id: "oren", hp: 7, guard: 0, bless: 0 },
    { id: "brindle", hp: 9, guard: 0, bless: 0 }
  ],
  characterState: {
    members: {
      garrick: { loyalty: 0, memories: [] }, mira: { loyalty: 0, memories: [] },
      oren: { loyalty: 0, memories: [] }, brindle: { loyalty: 0, memories: [] }
    },
    relationships: {}, seenCampMoments: []
  },
  logs: [], worldFlags: {}, activeScene: null, combat: null,
  ui: { tab: "context", focus: { type: "settlement", id: "hearthwick" }, dialogue: null, shop: null },
  lastSettlement: "hearthwick"
});

const fixture = name => fs.readFileSync(path.join(__dirname, "fixtures", "saves", "legacy", name), "utf8");

test("migrates raw legacy saves and keeps campaign progress", () => {
  const result = Save.decode(fixture("unversioned-v1-basic.json"), base());
  assert.equal(result.sourceVersion, 1);
  assert.equal(result.schemaVersion, 2);
  assert.equal(result.migrated, true);
  assert.equal(result.state.day, 5);
  assert.equal(result.state.gold, 17);
  assert.equal(result.state.quests.lantern_road.status, "active");
  assert.equal(result.state.quests.future_quest.status, "hidden");
  assert.equal(result.state.ui.focus, null);
  assert.equal(result.state.characterState.members.mira.loyalty, 0);
});

test("preserves legacy relationship and memory state", () => {
  const result = Save.decode(fixture("unversioned-v1-character-state.json"), base());
  assert.equal(result.state.characterState.members.garrick.loyalty, 2);
  assert.equal(result.state.characterState.members.mira.memories[0].id, "trusted-mira");
  assert.equal(result.state.characterState.relationships["garrick|mira"], 1);
  assert.equal(result.state.characterState.members.oren.loyalty, 0);
});

test("current version round-trips cleanly", () => {
  const state = base();
  state.day = 11;
  state.characterState.members.mira.loyalty = 3;
  const raw = Save.encode(state, { gameVersion: "1.0.0", savedAt: "2026-10-04T15:30:00+11:00" });
  const result = Save.decode(raw, base());
  assert.equal(result.sourceVersion, 2);
  assert.equal(result.migrated, false);
  assert.equal(result.state.day, 11);
  assert.equal(result.state.characterState.members.mira.loyalty, 3);
  assert.deepEqual(result.warnings, []);
});

test("repairs partial legacy state and rejects future versions", () => {
  const repaired = Save.decode(JSON.stringify({ seed: "bad", position: {}, party: "bad" }), base());
  assert.equal(repaired.state.seed, 123456789);
  assert.equal(repaired.state.party.length, 4);
  assert.ok(repaired.warnings.length > 0);
  assert.throws(
    () => Save.decode(JSON.stringify({ schemaVersion: 99, state: base() }), base()),
    error => error && error.code === "SAVE_VERSION_NEWER"
  );
});
