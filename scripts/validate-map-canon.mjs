import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const failures = [];
const warnings = [];

function fail(message) {
  failures.push(message);
}

function warn(message) {
  warnings.push(message);
}

function readJson(relativePath) {
  const fullPath = path.join(root, relativePath);
  try {
    return JSON.parse(fs.readFileSync(fullPath, "utf8"));
  } catch (error) {
    throw new Error(`${relativePath}: cannot parse JSON: ${error.message}`);
  }
}

function loadContent() {
  const source = fs.readFileSync(path.join(root, "content.js"), "utf8").trim();
  const json = source
    .replace(/^window\.CONTENT\s*=\s*/, "")
    .replace(/;\s*$/, "");
  try {
    return JSON.parse(json);
  } catch (error) {
    throw new Error(`content.js is not a JSON-compatible window.CONTENT assignment: ${error.message}`);
  }
}

function isObject(value) {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

function isInteger(value) {
  return Number.isInteger(value);
}

function requiredString(value, label) {
  if (typeof value !== "string" || !value.trim()) fail(`${label}: expected a non-empty string.`);
}

function exactArray(actual, expected, label) {
  if (!Array.isArray(actual) || actual.length !== expected.length || actual.some((value, index) => value !== expected[index])) {
    fail(`${label}: expected [${expected.join(", ")}], found ${JSON.stringify(actual)}.`);
  }
}

function deriveGridRef(canon, q, r) {
  const columns = canon.region?.human_grid?.columns;
  if (!Array.isArray(columns) || !columns[q]) return null;
  return `${columns[q]}${r + 1}`;
}

function placeLabel(place) {
  return place?.id ? `place "${place.id}"` : "place";
}

const canon = readJson("world/map-canon.json");
const content = loadContent();

if (!isInteger(canon.schema_version) || canon.schema_version < 1) {
  fail("schema_version must be an integer >= 1.");
}
requiredString(canon.canon_version, "canon_version");

if (!isObject(canon.region)) {
  fail("region must be an object.");
} else {
  requiredString(canon.region.id, "region.id");
  requiredString(canon.region.name, "region.name");

  if (!isInteger(canon.region.width) || canon.region.width < 1) fail("region.width must be a positive integer.");
  if (!isInteger(canon.region.height) || canon.region.height < 1) fail("region.height must be a positive integer.");

  const coordinates = canon.region.coordinate_system;
  if (!isObject(coordinates)) {
    fail("region.coordinate_system must be an object.");
  } else {
    if (coordinates.storage !== "odd-r offset") fail('region.coordinate_system.storage must be "odd-r offset".');
    exactArray(coordinates.implementation_fields, ["q", "r"], "region.coordinate_system.implementation_fields");
    exactArray(coordinates.q_range, [0, canon.region.width - 1], "region.coordinate_system.q_range");
    exactArray(coordinates.r_range, [0, canon.region.height - 1], "region.coordinate_system.r_range");
  }

  const grid = canon.region.human_grid;
  if (!isObject(grid)) {
    fail("region.human_grid must be an object.");
  } else {
    if (!Array.isArray(grid.columns) || grid.columns.length !== canon.region.width) {
      fail(`region.human_grid.columns must contain exactly ${canon.region.width} column labels.`);
    } else {
      const uniqueColumns = new Set(grid.columns);
      if (uniqueColumns.size !== grid.columns.length) fail("region.human_grid.columns contains duplicate labels.");
      grid.columns.forEach((column, index) => requiredString(column, `region.human_grid.columns[${index}]`));
    }

    const expectedRows = Array.from({ length: canon.region.height }, (_, index) => index + 1);
    exactArray(grid.rows, expectedRows, "region.human_grid.rows");
    requiredString(grid.formula, "region.human_grid.formula");
  }

  const projection = canon.region.atlas_projection;
  if (!isObject(projection)) {
    fail("region.atlas_projection must be an object.");
  } else {
    if (projection.orientation !== "pointy-top") fail('region.atlas_projection.orientation must be "pointy-top".');
    if (projection.offset_layout !== "odd-r") fail('region.atlas_projection.offset_layout must be "odd-r".');
    if (!isObject(projection.logical_canvas)) fail("region.atlas_projection.logical_canvas must be an object.");
    if (!Number.isFinite(Number(projection.hex_size)) || Number(projection.hex_size) <= 0) fail("region.atlas_projection.hex_size must be positive.");
    if (!isObject(projection.center_formula)) fail("region.atlas_projection.center_formula must be an object.");
    else {
      requiredString(projection.center_formula.x, "region.atlas_projection.center_formula.x");
      requiredString(projection.center_formula.y, "region.atlas_projection.center_formula.y");
    }
    requiredString(projection.scaling_rule, "region.atlas_projection.scaling_rule");
  }
}

const statuses = new Set(["CANON", "PROPOSED", "RETIRED"]);
for (const status of statuses) {
  if (typeof canon.status_vocabulary?.[status] !== "string") {
    fail(`status_vocabulary must define ${status}.`);
  }
}

if (!Array.isArray(canon.places)) {
  fail("places must be an array.");
}

const placeIds = new Set();
const canonById = new Map();
let startingCanonCount = 0;

for (const [index, place] of (canon.places || []).entries()) {
  const where = `places[${index}]`;
  if (!isObject(place)) {
    fail(`${where}: expected an object.`);
    continue;
  }

  requiredString(place.id, `${where}.id`);
  requiredString(place.name, `${where}.name`);
  requiredString(place.kind, `${where}.kind`);

  if (typeof place.id === "string") {
    if (!/^[a-z0-9_]+$/.test(place.id)) fail(`${where}.id "${place.id}" must use lowercase snake_case.`);
    if (placeIds.has(place.id)) fail(`${where}: duplicate place id "${place.id}".`);
    placeIds.add(place.id);
    canonById.set(place.id, place);
  }

  if (!["settlement", "site"].includes(place.place_type)) {
    fail(`${where}.place_type must be "settlement" or "site".`);
  }
  if (!statuses.has(place.status)) fail(`${where}.status "${place.status}" is not recognised.`);

  if (!isInteger(place.q) || !isInteger(place.r)) {
    fail(`${where}: q/r must be integers.`);
  } else if (
    place.q < 0 ||
    place.q >= canon.region.width ||
    place.r < 0 ||
    place.r >= canon.region.height
  ) {
    fail(`${where}: q/r (${place.q},${place.r}) is outside ${canon.region.width}x${canon.region.height} bounds.`);
  } else {
    const expectedRef = deriveGridRef(canon, place.q, place.r);
    if (place.grid_ref !== expectedRef) {
      fail(`${where}.grid_ref is "${place.grid_ref}", expected derived ref "${expectedRef}" from q/r.`);
    }
  }

  if (typeof place.hidden !== "boolean") fail(`${where}.hidden must be boolean.`);
  if (place.starting_location !== undefined && typeof place.starting_location !== "boolean") {
    fail(`${where}.starting_location must be boolean when present.`);
  }
  if (place.status === "CANON" && place.starting_location === true) startingCanonCount += 1;
}

if (startingCanonCount !== 1) {
  fail(`Exactly one CANON place must have starting_location=true; found ${startingCanonCount}.`);
}

if (!Array.isArray(canon.concept_regional_labels)) {
  fail("concept_regional_labels must be an array.");
} else {
  for (const [index, label] of canon.concept_regional_labels.entries()) {
    requiredString(label?.name, `concept_regional_labels[${index}].name`);
    requiredString(label?.source, `concept_regional_labels[${index}].source`);
    if (label?.status !== "PROPOSED") {
      fail(`concept_regional_labels[${index}].status must remain PROPOSED until canonised through the map-canon workflow.`);
    }
  }
}

if (!Array.isArray(canon.invariants) || canon.invariants.some(value => typeof value !== "string" || !value.trim())) {
  fail("invariants must be an array of non-empty strings.");
}

if (!isObject(content.region)) {
  fail("content.js region is missing.");
} else {
  if (content.region.width !== canon.region.width) {
    fail(`content.js region.width=${content.region.width} disagrees with canon width=${canon.region.width}.`);
  }
  if (content.region.height !== canon.region.height) {
    fail(`content.js region.height=${content.region.height} disagrees with canon height=${canon.region.height}.`);
  }
}

const gameplayPlaces = [];
for (const [placeType, list] of [["settlement", content.settlements], ["site", content.sites]]) {
  if (!Array.isArray(list)) {
    fail(`content.js ${placeType === "settlement" ? "settlements" : "sites"} must be an array.`);
    continue;
  }
  for (const entry of list) gameplayPlaces.push({ ...entry, place_type: placeType });
}

const gameplayById = new Map();
for (const place of gameplayPlaces) {
  if (gameplayById.has(place.id)) fail(`content.js has duplicate gameplay place id "${place.id}".`);
  gameplayById.set(place.id, place);

  const registry = canonById.get(place.id);
  if (!registry) {
    fail(`content.js ${place.place_type} "${place.id}" is not registered in world/map-canon.json.`);
    continue;
  }

  if (registry.status !== "CANON") {
    fail(`content.js ${place.place_type} "${place.id}" uses registry status ${registry.status}; gameplay places must be CANON.`);
  }
  if (registry.place_type !== place.place_type) {
    fail(`${placeLabel(registry)}: registry type "${registry.place_type}" disagrees with gameplay type "${place.place_type}".`);
  }
  if (registry.name !== place.name) {
    fail(`${placeLabel(registry)}: registry name "${registry.name}" disagrees with gameplay name "${place.name}".`);
  }
  if (registry.q !== place.q || registry.r !== place.r) {
    fail(`${placeLabel(registry)}: registry q/r (${registry.q},${registry.r}) disagrees with gameplay q/r (${place.q},${place.r}).`);
  }
  if (registry.kind !== place.kind) {
    fail(`${placeLabel(registry)}: registry kind "${registry.kind}" disagrees with gameplay kind "${place.kind}".`);
  }
  if (place.place_type === "site" && registry.hidden !== Boolean(place.hidden)) {
    fail(`${placeLabel(registry)}: registry hidden=${registry.hidden} disagrees with gameplay hidden=${Boolean(place.hidden)}.`);
  }
}

for (const registry of canon.places || []) {
  const gameplay = gameplayById.get(registry.id);
  if (registry.status === "CANON" && !gameplay) {
    fail(`${placeLabel(registry)} is CANON but missing from gameplay settlements/sites.`);
  }
  if (registry.status !== "CANON" && gameplay) {
    fail(`${placeLabel(registry)} is ${registry.status} but appears as active gameplay geography.`);
  }
}

const startingRegistry = (canon.places || []).find(place => place.status === "CANON" && place.starting_location === true);
if (startingRegistry && content.startingLocation !== startingRegistry.id) {
  fail(`content.js startingLocation="${content.startingLocation}" disagrees with canonical starting place "${startingRegistry.id}".`);
}

const occupancy = new Map();
for (const place of (canon.places || []).filter(place => place.status === "CANON")) {
  const key = `${place.q},${place.r}`;
  if (!occupancy.has(key)) occupancy.set(key, []);
  occupancy.get(key).push(place.id);
}
const sharedHexes = [...occupancy.entries()].filter(([, ids]) => ids.length > 1);
for (const [hex, ids] of sharedHexes) {
  warn(`Shared canonical hex ${hex}: ${ids.join(", ")}. This is explicitly allowed.`);
}

for (const message of warnings) console.warn(`WARN: ${message}`);

if (failures.length) {
  console.error(`Map canon validation failed with ${failures.length} problem(s):`);
  for (const message of failures) console.error(`- ${message}`);
  process.exit(1);
}

const canonPlaces = (canon.places || []).filter(place => place.status === "CANON");
console.log(
  `Map canon OK: ${canon.canon_version}, ${canon.region.width}x${canon.region.height}, ${canonPlaces.length} canonical places, ${canon.concept_regional_labels.length} proposed regional labels, ${sharedHexes.length} shared hex(es).`
);
