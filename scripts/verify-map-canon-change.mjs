import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const root = process.cwd();
const baseSha = process.env.BASE_SHA;
const headSha = process.env.HEAD_SHA;

if (!baseSha || !headSha) {
  console.error("BASE_SHA and HEAD_SHA are required for map-canon change verification.");
  process.exit(1);
}

function git(args) {
  return execFileSync("git", args, { cwd: root, encoding: "utf8" }).trim();
}

function readJsonAt(sha, filePath) {
  try {
    return JSON.parse(git(["show", `${sha}:${filePath}`]));
  } catch (error) {
    throw new Error(`Cannot read ${filePath} at ${sha}: ${error.message}`);
  }
}

function canonicalPlaceProjection(place) {
  return {
    id: place.id,
    name: place.name,
    place_type: place.place_type,
    kind: place.kind,
    q: place.q,
    r: place.r,
    grid_ref: place.grid_ref,
    status: place.status,
    starting_location: place.starting_location === true,
    hidden: place.hidden === true
  };
}

function canonicalRegionProjection(regionLabel) {
  return {
    id: regionLabel.id,
    name: regionLabel.name,
    status: regionLabel.status,
    place_type: regionLabel.place_type,
    gameplay_node: regionLabel.gameplay_node === true,
    anchor_place_ids: [...(regionLabel.anchor_place_ids || [])].sort(),
    description: regionLabel.description,
    source_task: regionLabel.source_task
  };
}

function protectedProjection(canon) {
  return {
    schema_version: canon.schema_version,
    canon_version: canon.canon_version,
    region: {
      id: canon.region?.id,
      name: canon.region?.name,
      width: canon.region?.width,
      height: canon.region?.height,
      coordinate_system: canon.region?.coordinate_system,
      human_grid: canon.region?.human_grid,
      atlas_projection: canon.region?.atlas_projection
    },
    places: (canon.places || [])
      .filter(place => place.status === "CANON" || place.status === "RETIRED")
      .map(canonicalPlaceProjection)
      .sort((a, b) => a.id.localeCompare(b.id)),
    regional_labels: (canon.regional_labels || [])
      .filter(regionLabel => regionLabel.status === "CANON" || regionLabel.status === "RETIRED")
      .map(canonicalRegionProjection)
      .sort((a, b) => a.id.localeCompare(b.id))
  };
}

function stable(value) {
  return JSON.stringify(value);
}

function mapById(canon) {
  return new Map((canon.places || [])
    .filter(place => place.status === "CANON" || place.status === "RETIRED")
    .map(place => [place.id, canonicalPlaceProjection(place)]));
}

function regionsById(canon) {
  return new Map((canon.regional_labels || [])
    .filter(regionLabel => regionLabel.status === "CANON" || regionLabel.status === "RETIRED")
    .map(regionLabel => [regionLabel.id, canonicalRegionProjection(regionLabel)]));
}

const before = readJsonAt(baseSha, "world/map-canon.json");
const after = readJsonAt(headSha, "world/map-canon.json");

if (stable(protectedProjection(before)) === stable(protectedProjection(after))) {
  console.log("No protected map-canon identity/coordinate change detected.");
  process.exit(0);
}

const beforePlaces = mapById(before);
const afterPlaces = mapById(after);
const changedPlaceIds = new Set();

for (const [id, oldPlace] of beforePlaces) {
  const next = afterPlaces.get(id);
  if (!next) {
    console.error(`Protected canonical place id "${id}" disappeared. Retire it instead of deleting/reserving it implicitly.`);
    process.exit(1);
  }
  if (stable(oldPlace) !== stable(next)) changedPlaceIds.add(id);
}

for (const [id] of afterPlaces) {
  if (!beforePlaces.has(id)) changedPlaceIds.add(id);
}

const beforeRegions = regionsById(before);
const afterRegions = regionsById(after);
const changedRegionIds = new Set();

for (const [id, oldRegion] of beforeRegions) {
  const next = afterRegions.get(id);
  if (!next) {
    console.error(`Protected canonical regional label id "${id}" disappeared. Retire it instead of deleting/reserving it implicitly.`);
    process.exit(1);
  }
  if (stable(oldRegion) !== stable(next)) changedRegionIds.add(id);
}

for (const [id] of afterRegions) {
  if (!beforeRegions.has(id)) changedRegionIds.add(id);
}

const parentSha = git(["rev-parse", `${headSha}^`]);
const finalChanges = git(["diff", "--name-only", parentSha, headSha])
  .split("\n")
  .filter(Boolean);

const reviewFiles = finalChanges.filter(file =>
  /^\.agent-coordination\/map-canon-reviews\/LR-\d{4}\.json$/.test(file)
);

if (reviewFiles.length !== 1 || finalChanges.length !== 1) {
  console.error(
    "Protected map-canon changes require one final review-only commit. " +
    `Expected exactly one .agent-coordination/map-canon-reviews/LR-xxxx.json file in the final commit; found: ${finalChanges.join(", ") || "nothing"}.`
  );
  process.exit(1);
}

const reviewFile = reviewFiles[0];
const fileTaskId = path.basename(reviewFile, ".json");
const review = readJsonAt(headSha, reviewFile);

const allowedTypes = new Set(["ADD", "MOVE", "RENAME", "RETIRE", "IDENTITY", "GRID", "PROJECTION"]);

if (review.schema_version !== 1) {
  console.error(`${reviewFile}: schema_version must be 1.`);
  process.exit(1);
}
if (review.task_id !== fileTaskId) {
  console.error(`${reviewFile}: task_id must match filename ${fileTaskId}.`);
  process.exit(1);
}
if (review.reviewer_agent_number !== 7 || review.status !== "APPROVED") {
  console.error(`${reviewFile}: requires Agent 7 with status APPROVED.`);
  process.exit(1);
}
if (review.reviewed_head_sha !== parentSha) {
  console.error(
    `${reviewFile}: stale approval. reviewed_head_sha=${review.reviewed_head_sha || "missing"}, expected exact code/canon head ${parentSha}.`
  );
  process.exit(1);
}
if (!allowedTypes.has(review.change_type)) {
  console.error(`${reviewFile}: change_type must be one of ${[...allowedTypes].join(", ")}.`);
  process.exit(1);
}
if (typeof review.josh_approval_required !== "boolean") {
  console.error(`${reviewFile}: josh_approval_required must be boolean.`);
  process.exit(1);
}
if (review.josh_approval_required === true && review.josh_approved !== true) {
  console.error(`${reviewFile}: this change requires Josh approval, but josh_approved is not true.`);
  process.exit(1);
}
if (!Array.isArray(review.affected_place_ids)) {
  console.error(`${reviewFile}: affected_place_ids must be an array.`);
  process.exit(1);
}
if (review.affected_region_ids !== undefined && !Array.isArray(review.affected_region_ids)) {
  console.error(`${reviewFile}: affected_region_ids must be an array when present.`);
  process.exit(1);
}
if (changedRegionIds.size > 0 && !Array.isArray(review.affected_region_ids)) {
  console.error(`${reviewFile}: protected regional-label changes require affected_region_ids.`);
  process.exit(1);
}

const reviewedPlaceIds = new Set(review.affected_place_ids);
for (const id of changedPlaceIds) {
  if (!reviewedPlaceIds.has(id)) {
    console.error(`${reviewFile}: changed canonical place "${id}" is missing from affected_place_ids.`);
    process.exit(1);
  }
}

const reviewedRegionIds = new Set(review.affected_region_ids || []);
for (const id of changedRegionIds) {
  if (!reviewedRegionIds.has(id)) {
    console.error(`${reviewFile}: changed canonical regional label "${id}" is missing from affected_region_ids.`);
    process.exit(1);
  }
}

let queue;
try {
  queue = readJsonAt(headSha, ".agent-coordination/WORK-QUEUE.json");
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
if (!(queue.tasks || []).some(task => task.id === review.task_id)) {
  console.error(`${reviewFile}: task ${review.task_id} does not exist in the live work queue.`);
  process.exit(1);
}

console.log(
  `Protected map-canon change approved for ${review.task_id}; ${changedPlaceIds.size} place id(s) and ${changedRegionIds.size} regional label id(s) changed, exact reviewed head ${parentSha}.`
);
