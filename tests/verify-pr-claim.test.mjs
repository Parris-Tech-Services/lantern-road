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

function parkedTask(id, branch, notes = "") {
  return {
    id,
    title: "Fixture parked task",
    status: "READY",
    priority: 0,
    exclusive_scope: "fixture-scope",
    depends_on: [],
    primary_agent: 2,
    notes: notes || `PARKED HANDOFF branch ${branch}`
  };
}

test("accepts exact final Director approval for a parked READY task without an idle lock", () => {
  const branch = "agent/LR-0044-personal-arc-test";
  const cwd = setupRepo(parkedTask("LR-0044", branch));

  const featureHead = commitFile(cwd, "story/feature.md", "finished feature\n", "feature work");

  // In real PR CI this parked handoff arrives from current main through the merge ref,
  // while PR_HEAD_SHA still points to the feature branch.
  writeJson(cwd, ".agent-coordination/WORK-QUEUE.json", {
    schema_version: 1,
    tasks: [parkedTask(
      "LR-0044",
      branch,
      `PARKED HANDOFF: implementation complete on branch ${branch}, exact useful head ${featureHead}. Fresh claim required before later edits or merge preparation.`
    )]
  });

  writeJson(cwd, ".agent-coordination/design-reviews/LR-0044.json", {
    schema_version: 1,
    task_id: "LR-0044",
    reviewer_agent_number: 7,
    reviewer: "The Director",
    status: "APPROVED",
    reviewed_head_sha: featureHead,
    reviewed_at: "2026-10-04T17:00:00+11:00"
  });
  git(cwd, ["add", ".agent-coordination/design-reviews/LR-0044.json"]);
  git(cwd, ["commit", "-m", "Director approval"]);
  const approvalHead = git(cwd, ["rev-parse", "HEAD"]);

  const result = runVerifier(cwd, branch, approvalHead);
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /Parked PR Director approval verified without idle lock/);
});

test("accepts parked map-canon review followed by final Director approval while notes retain the feature head", () => {
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
    reviewer_agent_number: 7,
    status: "APPROVED",
    reviewed_head_sha: featureHead
  });
  git(cwd, ["add", ".agent-coordination/map-canon-reviews/LR-0105.json"]);
  git(cwd, ["commit", "-m", "map canon approval"]);
  const mapReviewHead = git(cwd, ["rev-parse", "HEAD"]);

  writeJson(cwd, ".agent-coordination/design-reviews/LR-0105.json", {
    schema_version: 1,
    task_id: "LR-0105",
    reviewer_agent_number: 7,
    reviewer: "The Director",
    status: "APPROVED",
    reviewed_head_sha: mapReviewHead,
    reviewed_at: "2026-10-04T21:30:00+11:00"
  });
  git(cwd, ["add", ".agent-coordination/design-reviews/LR-0105.json"]);
  git(cwd, ["commit", "-m", "Director approval"]);
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
  assert.match(result.stderr, /missing Director design review|no active scope lock/i);
});

test("rejects a stale Director approval on a parked task", () => {
  const branch = "agent/LR-0044-personal-arc-test";
  const cwd = setupRepo(parkedTask("LR-0044", branch));
  const baseHead = git(cwd, ["rev-parse", "HEAD"]);
  const featureHead = commitFile(cwd, "story/feature.md", "finished feature\n", "feature work");

  writeJson(cwd, ".agent-coordination/WORK-QUEUE.json", {
    schema_version: 1,
    tasks: [parkedTask(
      "LR-0044",
      branch,
      `PARKED HANDOFF: branch ${branch}, exact useful head ${featureHead}. Fresh claim required.`
    )]
  });
  writeJson(cwd, ".agent-coordination/design-reviews/LR-0044.json", {
    schema_version: 1,
    task_id: "LR-0044",
    reviewer_agent_number: 7,
    reviewer: "The Director",
    status: "APPROVED",
    reviewed_head_sha: baseHead,
    reviewed_at: "2026-10-04T17:00:00+11:00"
  });
  git(cwd, ["add", ".agent-coordination/design-reviews/LR-0044.json"]);
  git(cwd, ["commit", "-m", "stale Director approval"]);
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
