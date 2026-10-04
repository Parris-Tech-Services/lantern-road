import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

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

if ([1, 2, 3, 4, 5].includes(task.primary_agent)) {
  const reviewPath = path.join(
    process.cwd(),
    ".agent-coordination",
    "design-reviews",
    `${task.id}.json`
  );

  if (!fs.existsSync(reviewPath)) {
    console.error(`${task.id}: missing Director design review at .agent-coordination/design-reviews/${task.id}.json`);
    process.exit(1);
  }

  let review;
  try {
    review = JSON.parse(fs.readFileSync(reviewPath, "utf8"));
  } catch (error) {
    console.error(`${task.id}: invalid Director design review JSON: ${error.message}`);
    process.exit(1);
  }

  if (review.task_id !== task.id || review.reviewer_agent_number !== 7 || review.status !== "APPROVED") {
    console.error(`${task.id}: Director review must match the task, be by Agent 7, and have status APPROVED.`);
    process.exit(1);
  }

  const prHead = process.env.PR_HEAD_SHA;
  if (!prHead) {
    console.error(`${task.id}: PR_HEAD_SHA is unavailable; cannot verify Director approval freshness.`);
    process.exit(1);
  }

  let reviewedHead;
  try {
    reviewedHead = execFileSync("git", ["rev-parse", `${prHead}^`], { encoding: "utf8" }).trim();
  } catch (error) {
    console.error(`${task.id}: cannot resolve the parent of PR head ${prHead}: ${error.message}`);
    process.exit(1);
  }

  if (review.reviewed_head_sha !== reviewedHead) {
    console.error(
      `${task.id}: Director approval is stale. It reviewed ${review.reviewed_head_sha || "nothing"}, but current code head before approval is ${reviewedHead}.`
    );
    process.exit(1);
  }

  let approvalChanges;
  try {
    approvalChanges = execFileSync("git", ["diff", "--name-only", reviewedHead, prHead], { encoding: "utf8" })
      .trim()
      .split("\n")
      .filter(Boolean);
  } catch (error) {
    console.error(`${task.id}: cannot inspect Director approval commit: ${error.message}`);
    process.exit(1);
  }

  const expectedReviewFile = `.agent-coordination/design-reviews/${task.id}.json`;
  if (approvalChanges.length !== 1 || approvalChanges[0] !== expectedReviewFile) {
    console.error(
      `${task.id}: the final PR commit must be Director approval only; expected only ${expectedReviewFile}, found: ${approvalChanges.join(", ") || "no files"}.`
    );
    process.exit(1);
  }
}

const expiry = Date.parse(lock.expires_at);
if (!Number.isFinite(expiry) || expiry < Date.now()) {
  console.error(`${file}: claim lease is expired or invalid; renew/recover it before PR work continues.`);
  process.exit(1);
}

console.log(
  `PR claim verified: ${lock.task_id} / ${lock.exclusive_scope} / ${branch}`
);
