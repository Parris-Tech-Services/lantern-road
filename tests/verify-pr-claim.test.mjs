import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync, spawnSync } from "node:child_process";

const verifier = path.resolve("scripts/verify-pr-claim.mjs");

function git(cwd, args) {
  return execFileSync("git", args, { cwd, encoding: "utf8" }).trim();
}

function writeJson(cwd, relativePath, value) {
  const full = path.join(cwd, relativePath);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, JSON.stringify(value, null, 2) + "\n");
}

function setupRepo(task) {
  const cwd = fs.mkdtempSync(path.join(os.tmpdir(), "lantern-pr-claim-"));
  git(cwd, ["init", "-b", "main"]);
  git(cwd, ["config", "user.email", "tests@example.invalid"]);
  git(cwd, ["config", "user.name", "Lantern Road Test"]);

  writeJson(cwd, ".agent-coordination/WORK-QUEUE.json", {
    schema_version: 1,
    tasks: [task]
  });
  fs.mkdirSync(path.join(cwd, ".agent-coordination", "claims"), { recursive: true });
  fs.mkdirSync(path.join(cwd, ".agent-coordination", "design-reviews"), { recursive: true });
  fs.writeFileSync(path.join(cwd, "README.md"), "fixture\n");

  git(cwd, ["add", "."]);
  git(cwd, ["commit", "-m", "fixture base"]);
  return cwd;
}

function commitFile(cwd, relativePath, content, message) {
  const full = path.join(cwd, relativePath);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content);
  git(cwd, ["add", relativePath]);
  git(cwd, ["commit", "-m", message]);
  return git(cwd, ["rev-parse", "HEAD"]);
}

function runVerifier(cwd, branch, head) {
  return spawnSync(process.execPath, [verifier], {
    cwd,
    encoding: "utf8",
    env: {
      ...process.env,
      GITHUB_EVENT_NAME: "pull_request",
      GITHUB_HEAD_REF: branch,
      PR_HEAD_SHA: head
    }
  });
}

function parkedTask(id, branch, notes = "", stewardReview = "NOT_REQUIRED") {
  return {
    id,
    title: "Fixture parked task",
    status: "READY",
    priority: 0,
    exclusive_scope: "fixture-scope",
    depends_on: [],
    primary_agent: 2,
    steward_review: stewardReview,
    notes: notes || `PARKED HANDOFF branch ${branch}`
  };
}

test("accepts exact final Steward approval for a parked READY task without an idle lock", () => {
  const branch = "agent/LR-0044-personal-arc-test";
  const cwd = setupRepo(parkedTask("LR-0044", branch, "", "REQUIRED"));

  const featureHead = commitFile(cwd, "story/feature.md", "finished feature\n", "feature work");

  // In real PR CI this parked handoff arrives from current main through the merge ref,
  // while PR_HEAD_SHA still points to the feature branch.
  writeJson(cwd, ".agent-coordination/WORK-QUEUE.json", {
    schema_version: 1,
    tasks: [parkedTask(
      "LR-0044",
      branch,
      `PARKED HANDOFF: implementation complete on branch ${branch}, exact useful head ${featureHead}. Frozen after approval.`,
      "REQUIRED"
    )]
  });

  writeJson(cwd, ".agent-coordination/design-reviews/LR-0044.json", {
    schema_version: 1,
    task_id: "LR-0044",
    reviewer_agent_number: 1,
    reviewer: "The Steward",
    status: "APPROVED",
    reviewed_head_sha: featureHead,
    reviewed_at: "2026-10-04T17:00:00+11:00"
  });
  git(cwd, ["add", ".agent-coordination/design-reviews/LR-0044.json"]);
  git(cwd, ["commit", "-m", "Steward approval"]);
  const approvalHead = git(cwd, ["rev-parse", "HEAD"]);

  const result = runVerifier(cwd, branch, approvalHead);
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /Parked Steward-reviewed PR verified for direct merge without owner re-claim/);
});

test("accepts parked map-canon review followed by final Steward approval while notes retain the feature head", () => {
  const branch = "agent/LR-0105-regional-canon-test";
  const cwd = setupRepo(parkedTask("LR-0105", branch));

  const featureHead = commitFile(cwd, "world/map-canon.json", "{\"regional_labels\":[]}\n", "map canon feature work");

  writeJson(cwd, ".agent-coordination/WORK-QUEUE.json", {
    schema_version: 1,
    tasks: [parkedTask(
      "LR-0105",
      branch,
      `PARKED HANDOFF: implementation complete on branch ${branch}, exact useful head ${featureHead}. Fresh claim required before later edits or merge preparation.`
    )]
  });

  writeJson(cwd, ".agent-coordination/map-canon-reviews/LR-0105.json", {
    schema_version: 1,
    task_id: "LR-0105",
    reviewer_agent_number: 1,
    status: "APPROVED",
    reviewed_head_sha: featureHead
  });
  git(cwd, ["add", ".agent-coordination/map-canon-reviews/LR-0105.json"]);
  git(cwd, ["commit", "-m", "map canon approval"]);
  const mapReviewHead = git(cwd, ["rev-parse", "HEAD"]);

  writeJson(cwd, ".agent-coordination/design-reviews/LR-0105.json", {
    schema_version: 1,
    task_id: "LR-0105",
    reviewer_agent_number: 1,
    reviewer: "The Steward",
    status: "APPROVED",
    reviewed_head_sha: mapReviewHead,
    reviewed_at: "2026-10-04T21:30:00+11:00"
  });
  git(cwd, ["add", ".agent-coordination/design-reviews/LR-0105.json"]);
  git(cwd, ["commit", "-m", "Steward approval"]);
  const approvalHead = git(cwd, ["rev-parse", "HEAD"]);

  const result = runVerifier(cwd, branch, approvalHead);
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /parked useful head/);
});

test("rejects an unlocked feature commit", () => {
  const branch = "agent/LR-0044-personal-arc-test";
  const cwd = setupRepo(parkedTask("LR-0044", branch));
  const featureHead = commitFile(cwd, "story/feature.md", "unreviewed feature\n", "feature work");

  const result = runVerifier(cwd, branch, featureHead);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /do not name the exact current or accepted underlying parked head|no active scope lock|frozen parked/i);
});

test("rejects a stale Steward approval on a parked task", () => {
  const branch = "agent/LR-0044-personal-arc-test";
  const cwd = setupRepo(parkedTask("LR-0044", branch));
  const baseHead = git(cwd, ["rev-parse", "HEAD"]);
  const featureHead = commitFile(cwd, "story/feature.md", "finished feature\n", "feature work");

  writeJson(cwd, ".agent-coordination/WORK-QUEUE.json", {
    schema_version: 1,
    tasks: [parkedTask(
      "LR-0044",
      branch,
      `PARKED HANDOFF: branch ${branch}, exact useful head ${featureHead}. Frozen after approval.`,
      "REQUIRED"
    )]
  });
  writeJson(cwd, ".agent-coordination/design-reviews/LR-0044.json", {
    schema_version: 1,
    task_id: "LR-0044",
    reviewer_agent_number: 1,
    reviewer: "The Steward",
    status: "APPROVED",
    reviewed_head_sha: baseHead,
    reviewed_at: "2026-10-04T17:00:00+11:00"
  });
  git(cwd, ["add", ".agent-coordination/design-reviews/LR-0044.json"]);
  git(cwd, ["commit", "-m", "stale Steward approval"]);
  const approvalHead = git(cwd, ["rev-parse", "HEAD"]);

  const result = runVerifier(cwd, branch, approvalHead);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /stale/i);
});

test("continues to accept an ordinary active-claim PR", () => {
  const branch = "agent/LR-0021-qa-baseline-test";
  const task = {
    id: "LR-0021",
    title: "Fixture active task",
    status: "READY",
    priority: 0,
    exclusive_scope: "fixture-active-scope",
    depends_on: [],
    primary_agent: 6,
    notes: ""
  };
  const cwd = setupRepo(task);
  const featureHead = commitFile(cwd, "QA/report.md", "active work\n", "active feature work");

  writeJson(cwd, ".agent-coordination/claims/fixture-active-scope.lock.json", {
    schema_version: 1,
    task_id: "LR-0021",
    exclusive_scope: "fixture-active-scope",
    agent_number: 6,
    agent: "The Warden",
    session_id: "11111111-1111-4111-8111-111111111111",
    claim_token: "22222222-2222-4222-8222-222222222222",
    claimed_at: "2026-10-04T17:00:00+11:00",
    expires_at: "2999-01-01T00:00:00Z",
    branch
  });

  const result = runVerifier(cwd, branch, featureHead);
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /PR claim verified/);
});


test("accepts an active specialist PR with review NOT_REQUIRED and no Steward commit", () => {
  const branch = "agent/LR-0044-low-risk-test";
  const task = {
    id: "LR-0044",
    title: "Fixture low-risk task",
    status: "READY",
    priority: 1,
    exclusive_scope: "fixture-low-risk",
    depends_on: [],
    primary_agent: 2,
    steward_review: "NOT_REQUIRED",
    notes: ""
  };
  const cwd = setupRepo(task);
  const featureHead = commitFile(cwd, "story/feature.md", "routine implementation\n", "feature work");

  writeJson(cwd, ".agent-coordination/claims/fixture-low-risk.lock.json", {
    schema_version: 1,
    task_id: "LR-0044",
    exclusive_scope: "fixture-low-risk",
    agent_number: 2,
    agent: "The Storyteller",
    session_id: "33333333-3333-4333-8333-333333333333",
    claim_token: "44444444-4444-4444-8444-444444444444",
    claimed_at: "2026-10-04T17:00:00+11:00",
    expires_at: "2999-01-01T00:00:00Z",
    branch
  });

  const result = runVerifier(cwd, branch, featureHead);
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /PR claim verified/);
});

test("rejects an active REQUIRED-review PR without Steward approval", () => {
  const branch = "agent/LR-0006-required-review-test";
  const task = {
    id: "LR-0006",
    title: "Fixture design-sensitive task",
    status: "READY",
    priority: 0,
    exclusive_scope: "fixture-required",
    depends_on: [],
    primary_agent: 3,
    steward_review: "REQUIRED",
    notes: ""
  };
  const cwd = setupRepo(task);
  const featureHead = commitFile(cwd, "systems/feature.md", "design-sensitive work\n", "feature work");

  writeJson(cwd, ".agent-coordination/claims/fixture-required.lock.json", {
    schema_version: 1,
    task_id: "LR-0006",
    exclusive_scope: "fixture-required",
    agent_number: 3,
    agent: "The Mechanist",
    session_id: "55555555-5555-4555-8555-555555555555",
    claim_token: "66666666-6666-4666-8666-666666666666",
    claimed_at: "2026-10-04T17:00:00+11:00",
    expires_at: "2999-01-01T00:00:00Z",
    branch
  });

  const result = runVerifier(cwd, branch, featureHead);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /missing Steward game review/i);
});

test("accepts a frozen parked NOT_REQUIRED-review PR at the exact recorded head without owner re-claim", () => {
  const branch = "agent/LR-0124-asset-pack-test";
  const cwd = setupRepo(parkedTask("LR-0124", branch, "", "NOT_REQUIRED"));
  const featureHead = commitFile(cwd, "assets/ui/material.svg", "<svg/>\n", "asset pack");

  writeJson(cwd, ".agent-coordination/WORK-QUEUE.json", {
    schema_version: 1,
    tasks: [parkedTask(
      "LR-0124",
      branch,
      `PARKED HANDOFF: branch ${branch}, exact useful head ${featureHead}; implementation frozen and ready to merge.`,
      "NOT_REQUIRED"
    )]
  });

  const result = runVerifier(cwd, branch, featureHead);
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /Parked no-review PR verified for direct merge without owner re-claim/);
});

test("rejects a frozen parked NOT_REQUIRED-review PR when the recorded head is stale", () => {
  const branch = "agent/LR-0124-asset-pack-test";
  const cwd = setupRepo(parkedTask("LR-0124", branch, "", "NOT_REQUIRED"));
  const recordedHead = commitFile(cwd, "assets/ui/material.svg", "<svg/>\n", "asset pack");
  const currentHead = commitFile(cwd, "assets/ui/other.svg", "<svg/>\n", "unrecorded follow-up");

  writeJson(cwd, ".agent-coordination/WORK-QUEUE.json", {
    schema_version: 1,
    tasks: [parkedTask(
      "LR-0124",
      branch,
      `PARKED HANDOFF: branch ${branch}, exact useful head ${recordedHead}.`,
      "NOT_REQUIRED"
    )]
  });

  const result = runVerifier(cwd, branch, currentHead);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /do not name the exact current or accepted underlying parked head|fresh ownership/i);
});


test("accepts an optional legacy Director approval on a now-NOT_REQUIRED parked task", () => {
  const branch = "agent/LR-0124-legacy-approved-test";
  const cwd = setupRepo(parkedTask("LR-0124", branch, "", "NOT_REQUIRED"));
  const featureHead = commitFile(cwd, "assets/ui/material.svg", "<svg/>\n", "asset pack");

  writeJson(cwd, ".agent-coordination/WORK-QUEUE.json", {
    schema_version: 1,
    tasks: [parkedTask(
      "LR-0124",
      branch,
      `PARKED HANDOFF: branch ${branch}, exact useful head ${featureHead}; old Director approval may remain on top.`,
      "NOT_REQUIRED"
    )]
  });
  writeJson(cwd, ".agent-coordination/design-reviews/LR-0124.json", {
    schema_version: 1,
    task_id: "LR-0124",
    reviewer_agent_number: 7,
    reviewer: "The Director",
    status: "APPROVED",
    reviewed_head_sha: featureHead,
    reviewed_at: "2026-10-04T17:00:00+11:00"
  });
  git(cwd, ["add", ".agent-coordination/design-reviews/LR-0124.json"]);
  git(cwd, ["commit", "-m", "legacy Director approval"]);
  const approvalHead = git(cwd, ["rev-parse", "HEAD"]);

  const result = runVerifier(cwd, branch, approvalHead);
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /Parked no-review PR verified for direct merge/);
});


test("rejects parked direct merge when another active lock owns the scope", () => {
  const branch = "agent/LR-0124-frozen-test";
  const cwd = setupRepo(parkedTask("LR-0124", branch, "", "NOT_REQUIRED"));
  const featureHead = commitFile(cwd, "assets/ui/material.svg", "<svg/>\n", "asset pack");

  writeJson(cwd, ".agent-coordination/WORK-QUEUE.json", {
    schema_version: 1,
    tasks: [parkedTask(
      "LR-0124",
      branch,
      `PARKED HANDOFF: branch ${branch}, exact useful head ${featureHead}.`,
      "NOT_REQUIRED"
    )]
  });
  writeJson(cwd, ".agent-coordination/claims/fixture-scope.lock.json", {
    schema_version: 1,
    task_id: "LR-0124",
    exclusive_scope: "fixture-scope",
    agent_number: 2,
    agent: "The Storyteller",
    session_id: "77777777-7777-4777-8777-777777777777",
    claim_token: "88888888-8888-4888-8888-888888888888",
    claimed_at: "2026-10-04T17:00:00+11:00",
    expires_at: "2999-01-01T00:00:00Z",
    branch: "agent/LR-0124-new-owner-77777777"
  });

  const result = runVerifier(cwd, branch, featureHead);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /another active lock owns the task\/scope/i);
});
