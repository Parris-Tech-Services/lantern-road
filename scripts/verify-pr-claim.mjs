import fs from "node:fs";
import path from "node:path";

if (process.env.GITHUB_EVENT_NAME !== "pull_request") {
  console.log("Not a pull_request event; PR claim verification skipped.");
  process.exit(0);
}

const branch = process.env.GITHUB_HEAD_REF || "";
if (!branch.startsWith("agent/")) {
  console.log(`Non-agent branch "${branch}"; agent claim verification skipped.`);
  process.exit(0);
}

const claimsDir = path.join(process.cwd(), ".agent-coordination", "claims");
const queuePath = path.join(process.cwd(), ".agent-coordination", "WORK-QUEUE.json");
const files = fs.existsSync(claimsDir)
  ? fs.readdirSync(claimsDir).filter(name => name.endsWith(".lock.json"))
  : [];

const matches = [];
for (const file of files) {
  try {
    const lock = JSON.parse(fs.readFileSync(path.join(claimsDir, file), "utf8"));
    if (lock.branch === branch) matches.push({ file, lock });
  } catch {
    // Structural validation is handled by validate-agent-coordination.mjs.
  }
}

if (matches.length !== 1) {
  console.error(
    `Agent PR branch "${branch}" must have exactly one matching active scope lock; found ${matches.length}.`
  );
  process.exit(1);
}

const { file, lock } = matches[0];
if (!branch.startsWith(`agent/${lock.task_id}-`)) {
  console.error(`${file}: branch does not match task id ${lock.task_id}.`);
  process.exit(1);
}

let queue;
try {
  queue = JSON.parse(fs.readFileSync(queuePath, "utf8"));
} catch (error) {
  console.error(`Cannot read WORK-QUEUE.json: ${error.message}`);
  process.exit(1);
}

const task = (queue.tasks ?? []).find(item => item.id === lock.task_id);
if (!task) {
  console.error(`${file}: claimed task ${lock.task_id} is missing from the queue.`);
  process.exit(1);
}

const incompleteGates = (task.merge_gate_depends_on ?? []).filter(
  id => (queue.tasks ?? []).find(item => item.id === id)?.status !== "DONE"
);
if (incompleteGates.length) {
  console.error(
    `${lock.task_id}: PR cannot merge until merge gates are DONE: ${incompleteGates.join(", ")}`
  );
  process.exit(1);
}

const expiry = Date.parse(lock.expires_at);
if (!Number.isFinite(expiry) || expiry < Date.now()) {
  console.error(`${file}: claim lease is expired or invalid; renew/recover it before PR work continues.`);
  process.exit(1);
}

console.log(
  `PR claim verified: ${lock.task_id} / ${lock.exclusive_scope} / ${branch}`
);
