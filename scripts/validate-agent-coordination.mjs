import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const queuePath = path.join(root, ".agent-coordination", "WORK-QUEUE.json");
const claimsDir = path.join(root, ".agent-coordination", "claims");

const errors = [];
const warnings = [];

function fail(message) { errors.push(message); }
function warn(message) { warnings.push(message); }

let queue;
try {
  queue = JSON.parse(fs.readFileSync(queuePath, "utf8"));
} catch (error) {
  console.error("Cannot read WORK-QUEUE.json:", error.message);
  process.exit(1);
}

const allowedStatuses = new Set(["READY", "BLOCKED", "DONE", "CANCELLED"]);
const roster = Array.isArray(queue.agent_roster) ? queue.agent_roster : [];
const rosterNumbers = new Set(roster.map(agent => agent.number));
if (roster.length !== 6) fail(`agent_roster must contain exactly 6 agents; found ${roster.length}.`);
for (const required of [1, 2, 3, 4, 5, 6]) {
  if (!rosterNumbers.has(required)) fail(`agent_roster is missing agent ${required}.`);
}
const tasks = Array.isArray(queue.tasks) ? queue.tasks : [];
const byId = new Map();
const scopeToTasks = new Map();

for (const task of tasks) {
  if (!task?.id) { fail("Task missing id."); continue; }
  if (byId.has(task.id)) fail(`Duplicate task id: ${task.id}`);
  byId.set(task.id, task);

  if (!allowedStatuses.has(task.status)) fail(`${task.id}: invalid status ${task.status}`);
  if (!task.exclusive_scope || !/^[a-z0-9-]+$/.test(task.exclusive_scope)) {
    fail(`${task.id}: invalid exclusive_scope.`);
  }
  if (!Array.isArray(task.depends_on)) fail(`${task.id}: depends_on must be an array.`);
  if (!rosterNumbers.has(task.primary_agent)) fail(`${task.id}: primary_agent must be one of the six roster agent numbers.`);
  if (task.supporting_agents !== undefined) {
    if (!Array.isArray(task.supporting_agents)) fail(`${task.id}: supporting_agents must be an array when present.`);
    else for (const agentNumber of task.supporting_agents) {
      if (!rosterNumbers.has(agentNumber)) fail(`${task.id}: unknown supporting agent ${agentNumber}.`);
      if (agentNumber === task.primary_agent) fail(`${task.id}: primary agent must not also be a supporting agent.`);
    }
  }

  const list = scopeToTasks.get(task.exclusive_scope) ?? [];
  list.push(task.id);
  scopeToTasks.set(task.exclusive_scope, list);
}

for (const task of tasks) {
  for (const dependency of task.depends_on ?? []) {
    if (!byId.has(dependency)) fail(`${task.id}: unknown dependency ${dependency}`);
    if (dependency === task.id) fail(`${task.id}: cannot depend on itself.`);
  }

  if (task.status === "READY") {
    const incomplete = (task.depends_on ?? []).filter(id => byId.get(id)?.status !== "DONE");
    if (incomplete.length) {
      fail(`${task.id}: READY but dependencies are not DONE: ${incomplete.join(", ")}`);
    }
  }
}

const claimFiles = fs.existsSync(claimsDir)
  ? fs.readdirSync(claimsDir).filter(name => name.endsWith(".lock.json"))
  : [];

const seenSessions = new Map();
const now = Date.now();

for (const file of claimFiles) {
  const fullPath = path.join(claimsDir, file);
  let lock;
  try {
    lock = JSON.parse(fs.readFileSync(fullPath, "utf8"));
  } catch (error) {
    fail(`${file}: invalid JSON (${error.message})`);
    continue;
  }

  const task = byId.get(lock.task_id);
  if (!task) {
    fail(`${file}: references unknown task ${lock.task_id}`);
    continue;
  }

  const expectedFile = `${task.exclusive_scope}.lock.json`;
  if (file !== expectedFile) fail(`${file}: expected filename ${expectedFile}`);
  if (lock.exclusive_scope !== task.exclusive_scope) fail(`${file}: scope does not match queue task.`);

  for (const field of ["session_id", "claim_token", "agent", "claimed_at", "expires_at", "branch"]) {
    if (!lock[field]) fail(`${file}: missing ${field}`);
  }

  const roleOwnershipCutover = Date.parse("2026-10-04T14:31:22+11:00");
  if (lock.agent_number === undefined || lock.agent_number === null) {
    const claimed = Date.parse(lock.claimed_at);
    if (Number.isFinite(claimed) && claimed < roleOwnershipCutover) {
      warn(`${file}: legacy pre-role-enforcement claim has no agent_number; owner should add it before renewing the lease.`);
    } else {
      fail(`${file}: missing agent_number`);
    }
  } else if (lock.agent_number !== task.primary_agent) {
    fail(`${file}: agent_number ${lock.agent_number} does not own ${task.id}; primary_agent is ${task.primary_agent}.`);
  }

  if (task.status === "BLOCKED" || task.status === "CANCELLED") {
    fail(`${file}: task ${task.id} is ${task.status} and must not have an active claim.`);
  }
  if (task.status === "DONE") {
    warn(`${file}: task is DONE; lock should be deleted after ownership verification.`);
  }

  if (seenSessions.has(lock.session_id)) {
    fail(`${file}: session ${lock.session_id} already holds ${seenSessions.get(lock.session_id)}; one active scope per session.`);
  } else if (lock.session_id) {
    seenSessions.set(lock.session_id, file);
  }

  const expiry = Date.parse(lock.expires_at);
  if (!Number.isFinite(expiry)) fail(`${file}: expires_at is not a valid date.`);
  else if (expiry < now) warn(`${file}: lease expired; perform stale-lock recovery before reclaiming.`);

  if (typeof lock.branch === "string" && !lock.branch.startsWith(`agent/${task.id}-`)) {
    fail(`${file}: branch must start with agent/${task.id}-`);
  }
}

if (warnings.length) {
  console.warn("\nCoordination warnings:");
  for (const message of warnings) console.warn(`- ${message}`);
}

if (errors.length) {
  console.error("\nCoordination validation failed:");
  for (const message of errors) console.error(`- ${message}`);
  process.exit(1);
}

console.log(`Coordination valid: ${tasks.length} tasks, ${claimFiles.length} active scope lock(s).`);
