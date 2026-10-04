import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const contentPath = path.join(root, "content.js");
const failures = [];
const warnings = [];

function fail(message) {
  failures.push(message);
}

function warn(message) {
  warnings.push(message);
}

function loadContent() {
  const source = fs.readFileSync(contentPath, "utf8").trim();
  const json = source
    .replace(/^window\.CONTENT\s*=\s*/, "")
    .replace(/;\s*$/, "");
  try {
    return JSON.parse(json);
  } catch (error) {
    throw new Error(`content.js is not a JSON-compatible window.CONTENT assignment: ${error.message}`);
  }
}

function idSet(name, list) {
  if (!Array.isArray(list)) {
    fail(`${name} must be an array.`);
    return new Set();
  }
  const seen = new Set();
  for (const [index, entry] of list.entries()) {
    if (!entry || typeof entry !== "object") {
      fail(`${name}[${index}] must be an object.`);
      continue;
    }
    if (typeof entry.id !== "string" || !entry.id.trim()) {
      fail(`${name}[${index}] is missing a non-empty string id.`);
      continue;
    }
    if (seen.has(entry.id)) fail(`${name}: duplicate id "${entry.id}".`);
    seen.add(entry.id);
  }
  return seen;
}

function requireRef(set, value, pathLabel, targetLabel) {
  if (typeof value !== "string" || !value.trim()) {
    fail(`${pathLabel}: expected a non-empty ${targetLabel} id.`);
    return;
  }
  if (!set.has(value)) fail(`${pathLabel}: unknown ${targetLabel} id "${value}".`);
}

function requireRefs(set, values, pathLabel, targetLabel) {
  if (!Array.isArray(values)) {
    fail(`${pathLabel}: expected an array of ${targetLabel} ids.`);
    return;
  }
  values.forEach((value, index) => requireRef(set, value, `${pathLabel}[${index}]`, targetLabel));
}

function validateEffects(effects, pathLabel, sets) {
  if (!Array.isArray(effects)) return;
  for (const [index, effect] of effects.entries()) {
    if (!Array.isArray(effect) || typeof effect[0] !== "string") continue;
    const where = `${pathLabel}[${index}]`;
    switch (effect[0]) {
      case "addItem":
        requireRef(sets.items, effect[1], `${where}[1]`, "item");
        break;
      case "addReputation":
        requireRef(sets.factions, effect[1], `${where}[1]`, "faction");
        break;
      case "discoverRumour":
        requireRef(sets.rumours, effect[1], `${where}[1]`, "rumour");
        break;
      case "discoverSite":
        requireRef(sets.sites, effect[1], `${where}[1]`, "site");
        break;
      case "startCombat":
        requireRef(sets.encounters, effect[1], `${where}[1]`, "encounter");
        break;
      default:
        break;
    }
  }
}

function validateOption(option, pathLabel, sets, partyById) {
  if (!option || typeof option !== "object") {
    fail(`${pathLabel}: option must be an object.`);
    return;
  }

  if (option.requiresItem !== undefined) {
    requireRef(sets.items, option.requiresItem, `${pathLabel}.requiresItem`, "item");
  }
  if (option.requiresAnyItem !== undefined) {
    requireRefs(sets.items, option.requiresAnyItem, `${pathLabel}.requiresAnyItem`, "item");
  }

  validateEffects(option.effects, `${pathLabel}.effects`, sets);

  if (option.check !== undefined) {
    const check = option.check;
    if (!check || typeof check !== "object") {
      fail(`${pathLabel}.check must be an object.`);
    } else {
      requireRef(sets.party, check.actor, `${pathLabel}.check.actor`, "party member");
      const actor = partyById.get(check.actor);
      if (actor && typeof check.skill === "string" && !(check.skill in (actor.skills || {}))) {
        fail(`${pathLabel}.check.skill: "${check.skill}" is not a skill on party member "${check.actor}".`);
      }
      validateEffects(check.success, `${pathLabel}.check.success`, sets);
      validateEffects(check.failure, `${pathLabel}.check.failure`, sets);
    }
  }
}

function validateCharacterChoice(choice, pathLabel, sets) {
  for (const field of ["loyalty", "memories", "addMemoryIds"]) {
    if (choice?.[field] && typeof choice[field] === "object") {
      for (const memberId of Object.keys(choice[field])) {
        requireRef(sets.party, memberId, `${pathLabel}.${field}`, "party member");
      }
    }
  }
  if (Array.isArray(choice?.bonds)) {
    choice.bonds.forEach((bond, index) => {
      if (!Array.isArray(bond) || bond.length < 3) {
        fail(`${pathLabel}.bonds[${index}] must be [memberA, memberB, amount].`);
        return;
      }
      requireRef(sets.party, bond[0], `${pathLabel}.bonds[${index}][0]`, "party member");
      requireRef(sets.party, bond[1], `${pathLabel}.bonds[${index}][1]`, "party member");
      if (bond[0] === bond[1]) fail(`${pathLabel}.bonds[${index}] cannot relate a party member to themselves.`);
    });
  }
}

const C = loadContent();

const collections = {
  factions: C.factions,
  party: C.party,
  items: C.items,
  enemies: C.enemyArchetypes,
  settlements: C.settlements,
  npcs: C.npcs,
  rumours: C.rumours,
  sites: C.sites,
  quests: C.quests,
  travelEvents: C.travelEvents,
  campEvents: C.campEvents,
  encounters: C.encounters,
  characterCampMoments: C.characterCampMoments
};

const sets = Object.fromEntries(
  Object.entries(collections).map(([name, list]) => [name, idSet(name, list)])
);
const partyById = new Map((C.party || []).map(member => [member.id, member]));

if (!C.region || !Number.isInteger(C.region.width) || !Number.isInteger(C.region.height)) {
  fail("region must define integer width and height.");
} else if (!Array.isArray(C.region.tiles)) {
  fail("region.tiles must be an array.");
} else {
  const seenCoords = new Set();
  const expectedTiles = C.region.width * C.region.height;
  if (C.region.tiles.length !== expectedTiles) {
    fail(`region.tiles has ${C.region.tiles.length} tiles; expected ${expectedTiles} for ${C.region.width}x${C.region.height}.`);
  }
  C.region.tiles.forEach((tile, index) => {
    const where = `region.tiles[${index}]`;
    if (!Number.isInteger(tile?.q) || !Number.isInteger(tile?.r)) {
      fail(`${where}: q/r must be integers.`);
      return;
    }
    if (tile.q < 0 || tile.q >= C.region.width || tile.r < 0 || tile.r >= C.region.height) {
      fail(`${where}: coordinate (${tile.q},${tile.r}) is outside the region bounds.`);
    }
    const key = `${tile.q},${tile.r}`;
    if (seenCoords.has(key)) fail(`${where}: duplicate map coordinate ${key}.`);
    seenCoords.add(key);
    if (!C.terrainDefs || !Object.prototype.hasOwnProperty.call(C.terrainDefs, tile.terrain)) {
      fail(`${where}.terrain: unknown terrain id "${tile.terrain}".`);
    }
  });
}

const tileCoords = new Set((C.region?.tiles || []).map(tile => `${tile.q},${tile.r}`));
for (const group of [["settlements", C.settlements], ["sites", C.sites]]) {
  const [name, list] = group;
  (list || []).forEach((location, index) => {
    if (!tileCoords.has(`${location.q},${location.r}`)) {
      fail(`${name}[${index}] "${location.id}" is placed at missing map coordinate (${location.q},${location.r}).`);
    }
  });
}

(C.settlements || []).forEach((settlement, index) => {
  requireRefs(sets.items, settlement.shopStock || [], `settlements[${index}].shopStock`, "item");
  requireRefs(sets.npcs, settlement.npcs || [], `settlements[${index}].npcs`, "NPC");
});

(C.npcs || []).forEach((npc, index) => {
  requireRef(sets.factions, npc.faction, `npcs[${index}].faction`, "faction");
  requireRefs(sets.rumours, npc.rumours || [], `npcs[${index}].rumours`, "rumour");
  requireRefs(sets.quests, npc.quests || [], `npcs[${index}].quests`, "quest");
});

(C.sites || []).forEach((site, index) => {
  if (site.discoverRumour) requireRef(sets.rumours, site.discoverRumour, `sites[${index}].discoverRumour`, "rumour");
});

(C.quests || []).forEach((quest, index) => {
  requireRef(sets.npcs, quest.giver, `quests[${index}].giver`, "NPC");
  if (!Array.isArray(quest.stages) || quest.stages.length === 0) {
    fail(`quests[${index}] "${quest.id}" must define at least one stage.`);
  } else {
    const stages = new Set();
    quest.stages.forEach((stage, stageIndex) => {
      if (!stage || typeof stage.id !== "string" || !stage.id) {
        fail(`quests[${index}].stages[${stageIndex}] is missing an id.`);
      } else if (stages.has(stage.id)) {
        fail(`quests[${index}] "${quest.id}" has duplicate stage id "${stage.id}".`);
      } else {
        stages.add(stage.id);
      }
    });
  }
});

(C.enemyArchetypes || []).forEach((enemy, index) => {
  (enemy.loot || []).forEach((loot, lootIndex) => {
    requireRef(sets.items, loot?.id, `enemyArchetypes[${index}].loot[${lootIndex}].id`, "item");
  });
});

(C.encounters || []).forEach((encounter, index) => {
  requireRefs(sets.enemies, encounter.enemies || [], `encounters[${index}].enemies`, "enemy");
  validateEffects(encounter.onWin, `encounters[${index}].onWin`, sets);
  validateEffects(encounter.onLose, `encounters[${index}].onLose`, sets);
});

for (const [collectionName, events] of [["travelEvents", C.travelEvents], ["campEvents", C.campEvents]]) {
  (events || []).forEach((event, eventIndex) => {
    if (Array.isArray(event.conditions?.terrain)) {
      event.conditions.terrain.forEach((terrain, terrainIndex) => {
        if (!C.terrainDefs || !Object.prototype.hasOwnProperty.call(C.terrainDefs, terrain)) {
          fail(`${collectionName}[${eventIndex}].conditions.terrain[${terrainIndex}]: unknown terrain id "${terrain}".`);
        }
      });
    }
    (event.options || []).forEach((option, optionIndex) => {
      validateOption(option, `${collectionName}[${eventIndex}].options[${optionIndex}]`, sets, partyById);
    });
  });
}

requireRef(sets.settlements, C.startingLocation, "startingLocation", "settlement");
requireRefs(sets.rumours, C.startingRumours || [], "startingRumours", "rumour");

(C.characterCampMoments || []).forEach((moment, index) => {
  requireRef(sets.party, moment.character, `characterCampMoments[${index}].character`, "party member");
  if (!Array.isArray(moment.choices) || moment.choices.length === 0) {
    fail(`characterCampMoments[${index}] "${moment.id}" must define at least one choice.`);
  } else {
    moment.choices.forEach((choice, choiceIndex) => {
      validateCharacterChoice(choice, `characterCampMoments[${index}].choices[${choiceIndex}]`, sets);
    });
  }
});

if (!C.characterDecisionReactions || typeof C.characterDecisionReactions !== "object" || Array.isArray(C.characterDecisionReactions)) {
  fail("characterDecisionReactions must be an object keyed by decision id.");
} else {
  for (const [decisionId, reaction] of Object.entries(C.characterDecisionReactions)) {
    const where = `characterDecisionReactions.${decisionId}`;
    validateCharacterChoice(reaction, where, sets);
    (reaction.reactions || []).forEach((entry, index) => {
      requireRef(sets.party, entry?.member, `${where}.reactions[${index}].member`, "party member");
    });
  }
}

if (typeof C.title !== "string" || !C.title.trim()) fail("title must be a non-empty string.");
if (typeof C.version !== "string" || !C.version.trim()) fail("version must be a non-empty string.");
if (!C.success || !Number.isFinite(Number(C.success.days)) || !Number.isFinite(Number(C.success.renownTarget))) {
  fail("success must define numeric days and renownTarget.");
}

for (const message of warnings) console.warn(`WARN: ${message}`);

if (failures.length) {
  console.error(`Content integrity validation failed with ${failures.length} problem(s):`);
  for (const message of failures) console.error(`- ${message}`);
  process.exit(1);
}

console.log(
  `Content integrity OK: ${C.region.tiles.length} tiles, ${sets.settlements.size} settlements, ${sets.sites.size} sites, ${sets.npcs.size} NPCs, ${sets.quests.size} quests, ${sets.travelEvents.size + sets.campEvents.size} events, ${sets.encounters.size} encounters.`
);
