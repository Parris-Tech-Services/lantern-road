import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

function fail(message) {
  console.error(message);
  process.exit(1);
}

function git(args) {
  return execFileSync("git", args, { encoding: "utf8" }).trim();
}

function readJson(filePath, label = filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (error) {
    fail(`${label}: invalid JSON: ${error.message}`);
  }
}

if (process.env.GITHUB_EVENT_NAME !== "pull_request") {
  console.log("Not a pull_request event; PR claim verification skipped.");
  process.exit(0);
}

const branch = process.env.GITHUB_HEAD_REF || "";
if (!branch.startsWith("agent/")) {
  console.log(`Non-agent branch "${branch}"; agent claim verification skipped.`);
  process.exit(0);
}

const branchTaskMatch = branch.match(/^agent\/(LR-\d{4})-/);
if (!branchTaskMatch) {
  fail(`Agent PR branch "${branch}" does not contain a valid LR task id.`);
}
const branchTaskId = branchTaskMatch[1];

const root = process.cwd();
const claimsDir = path.join(root, ".agent-coordination", "claims");
const queuePath = path.join(root, ".agent-coordination", "WORK-QUEUE.json");
const queue = readJson(queuePath, "WORK-QUEUE.json");
const task = (queue.tasks ?? []).find(item => item.id === branchTaskId);

if (!task) {
  fail(`Agent PR branch "${branch}" references missing queue task ${branchTaskId}.`);
}

const lockEntries = [];
const lockFiles = fs.existsSync(claimsDir)
  ? fs.readdirSync(claimsDir).filter(name => name.endsWith(".lock.json"))
  : [];

for (const file of lockFiles) {
  try {
    const lock = JSON.parse(fs.readFileSync(path.join(claimsDir, file), "utf8"));
    lockEntries.push({ file, lock });
  } catch {
    // Structural lock validation is handled by validate-agent-coordination.mjs.
  }
}

const branchLocks = lockEntries.filter(({ lock }) => lock.branch === branch);
const taskOrScopeLocks = lockEntries.filter(({ lock }) =>
  lock.task_id === task.id || lock.exclusive_scope === task.exclusive_scope
);

if (branchLocks.length > 1) {
  fail(`Agent PR branch "${branch}" has multiple matching active locks; found ${branchLocks.length}.`);
}

const prHead = process.env.PR_HEAD_SHA || "";

function inspectDirectorApproval() {
  const expectedReviewFile = `.agent-coordination/design-reviews/${task.id}.json`;
  const reviewPath = path.join(root, expectedReviewFile);

  if (!prHead) {
    return { present: false, reviewOnly: false, valid: false, error: `${task.id}: PR_HEAD_SHA is unavailable; cannot verify Director approval freshness.` };
  }

  let reviewedHead;
  try {
    reviewedHead = git(["rev-parse", `${prHead}^`]);
  } catch (error) {
    return { present: false, reviewOnly: false, valid: false, error: `${task.id}: cannot resolve the parent of PR head ${prHead}: ${error.message}` };
  }

  let approvalChanges;
  try {
    approvalChanges = git(["diff", "--name-only", reviewedHead, prHead])
      .split("\n")
      .filter(Boolean);
  } catch (error) {
    return { present: false, reviewOnly: false, valid: false, error: `${task.id}: cannot inspect final PR commit: ${error.message}` };
  }

  const reviewOnly = approvalChanges.length === 1 && approvalChanges[0] === expectedReviewFile;
  const present = fs.existsSync(reviewPath);

  if (!present) {
    return {
      present: false,
      reviewOnly,
      valid: false,
      reviewedHead,
      approvalChanges,
      error: `${task.id}: missing Director design review at ${expectedReviewFile}`
    };
  }

  let review;
  try {
    review = JSON.parse(fs.readFileSync(reviewPath, "utf8"));
  } catch (error) {
    return {
      present: true,
      reviewOnly,
      valid: false,
      reviewedHead,
      approvalChanges,
      error: `${task.id}: invalid Director design review JSON: ${error.message}`
    };
  }

  if (!reviewOnly) {
    return {
      present: true,
      reviewOnly: false,
      valid: false,
      review,
      reviewedHead,
      approvalChanges,
      error: `${task.id}: Director approval must be the final PR commit and change only ${expectedReviewFile}; found: ${approvalChanges.join(", ") || "no files"}.`
    };
  }

  if (review.task_id !== task.id || review.reviewer_agent_number !== 7 || review.status !== "APPROVED") {
    return {
      present: true,
      reviewOnly: true,
      valid: false,
      review,
      reviewedHead,
      approvalChanges,
      error: `${task.id}: Director review must match the task, be by Agent 7, and have status APPROVED.`
    };
  }

  if (review.reviewed_head_sha !== reviewedHead) {
    return {
      present: true,
      reviewOnly: true,
      valid: false,
      review,
      reviewedHead,
      approvalChanges,
      error: `${task.id}: Director approval is stale. It reviewed ${review.reviewed_head_sha || "nothing"}, but current feature head before approval is ${reviewedHead}.`
    };
  }

  return {
    present: true,
    reviewOnly: true,
    valid: true,
    review,
    reviewedHead,
    approvalChanges,
    expectedReviewFile
  };
}

const reviewCapable = [1, 2, 3, 4, 5].includes(task.primary_agent);
const needsDirectorReview = task.director_review === "REQUIRED";
const director = reviewCapable ? inspectDirectorApproval() : null;

function assertMergeGatesComplete() {
  const incompleteGates = (task.merge_gate_depends_on ?? []).filter(
    id => (queue.tasks ?? []).find(item => item.id === id)?.status !== "DONE"
  );
  if (incompleteGates.length) {
    fail(`${task.id}: PR cannot merge until merge gates are DONE: ${incompleteGates.join(", ")}`);
  }
}

if (branchLocks.length === 0) {
  // A frozen parked PR may merge without waking the implementation owner back up.
  // REQUIRED-review tasks need an exact final Director approval commit.
  // NOT_REQUIRED (or omitted) tasks may merge at the exact parked feature head.
  if (task.status !== "READY") {
    fail(`${task.id}: parked no-lock merge requires task status READY; found ${task.status}.`);
  }
  if (taskOrScopeLocks.length !== 0) {
    fail(`${task.id}: parked branch cannot use the no-lock merge exception while another active lock owns the task/scope.`);
  }

  const notes = String(task.notes || "");
  const parkedMarker = /(parked|parking|fresh(?:ly)?\s+(?:re-)?claim|re-claim|release(?:d)?\s+(?:the\s+)?(?:own\s+)?lock|partial\s+handoff)/i;
  if (!parkedMarker.test(notes)) {
    fail(`${task.id}: queue notes do not identify this work as parked/frozen under the claim protocol.`);
  }
  if (!notes.includes(branch)) {
    fail(`${task.id}: parked queue notes do not name this PR branch "${branch}".`);
  }

  assertMergeGatesComplete();

  if (needsDirectorReview) {
    if (!director?.valid) {
      fail(director?.error || `${task.id}: missing valid Director approval.`);
    }
    if (!notes.includes(director.reviewedHead)) {
      fail(`${task.id}: parked queue notes do not name the exact reviewed useful head ${director.reviewedHead}.`);
    }

    console.log(
      `Parked REQUIRED-review PR verified for direct merge without owner re-claim: ${task.id} / ${task.exclusive_scope} / ${branch} / reviewed ${director.reviewedHead}`
    );
    process.exit(0);
  }

  if (director?.valid && notes.includes(director.reviewedHead)) {
    console.log(
      `Parked NOT_REQUIRED-review PR with optional legacy Director approval verified for direct merge: ${task.id} / ${task.exclusive_scope} / ${branch} / reviewed ${director.reviewedHead}`
    );
    process.exit(0);
  }

  if (!prHead) {
    fail(`${task.id}: PR_HEAD_SHA is unavailable; cannot verify frozen parked no-review head.`);
  }
  if (!notes.includes(prHead)) {
    fail(`${task.id}: parked queue notes do not name exact current PR head ${prHead}; fresh ownership is required before reconciliation/rebase changes.`);
  }

  console.log(
    `Parked NOT_REQUIRED-review PR verified for direct merge without owner re-claim: ${task.id} / ${task.exclusive_scope} / ${branch} / head ${prHead}`
  );
  process.exit(0);
}

const { file, lock } = branchLocks[0];

if (lock.task_id !== task.id) {
  fail(`${file}: branch task ${task.id} does not match lock task ${lock.task_id}.`);
}
if (lock.exclusive_scope !== task.exclusive_scope) {
  fail(`${file}: lock scope ${lock.exclusive_scope} does not match queue scope ${task.exclusive_scope}.`);
}
if (lock.agent_number !== task.primary_agent) {
  fail(`${file}: lock agent ${lock.agent_number} does not match task primary_agent ${task.primary_agent}.`);
}
if (!branch.startsWith(`agent/${lock.task_id}-`)) {
  fail(`${file}: branch does not match task id ${lock.task_id}.`);
}
if (task.status !== "READY") {
  fail(`${file}: active PR task must remain READY until merge completion; found ${task.status}.`);
}

assertMergeGatesComplete();

if (needsDirectorReview) {
  if (!director?.valid) fail(director?.error || `${task.id}: missing valid Director approval.`);
}

const expiry = Date.parse(lock.expires_at);
if (!Number.isFinite(expiry) || expiry < Date.now()) {
  fail(`${file}: claim lease is expired or invalid; renew/recover it before PR work continues.`);
}

console.log(
  `PR claim verified: ${lock.task_id} / ${lock.exclusive_scope} / ${branch}`
);
