import test from "node:test";
import assert from "node:assert/strict";
import { buildReport, flowState, formatReport, isParked, isReviewReady } from "../scripts/aed-report.mjs";

function queue(tasks) {
  return {
    project: "Fixture",
    updated_at: "2026-10-04T19:00:00+11:00",
    agent_roster: [
      { number: 1, name: "One" },
      { number: 2, name: "Two" }
    ],
    tasks
  };
}

test("separates actionable READY from parked READY and review-ready", () => {
  const report = buildReport(queue([
    { id: "LR-0001", title: "Actionable", status: "READY", primary_agent: 1, depends_on: [], exclusive_scope: "a", notes: "" },
    { id: "LR-0002", title: "Parked", status: "READY", primary_agent: 1, depends_on: [], exclusive_scope: "b", notes: "PARKED HANDOFF: awaiting Agent 7 Director approval." },
    { id: "LR-0003", title: "Blocked", status: "BLOCKED", primary_agent: 2, depends_on: ["LR-0001"], exclusive_scope: "c", notes: "" },
    { id: "LR-0004", title: "Done", status: "DONE", primary_agent: 2, depends_on: [], exclusive_scope: "d", notes: "" }
  ]));

  const one = report.agents.find(a => a.number === 1);
  assert.equal(one.READY, 2);
  assert.equal(one.actionable_ready, 1);
  assert.equal(one.parked_ready, 1);
  assert.equal(report.totals.parked_ready, 1);
  assert.equal(report.totals.review_ready, 1);
  assert.equal(isParked({ status: "READY", notes: "PARKED" }), true);
  assert.equal(isReviewReady({ status: "READY", notes: "PARKED awaiting Director review" }), true);
});


test("ranks critical-path flow inbox and distinguishes review from owner merge", () => {
  const report = buildReport(queue([
    {
      id: "LR-0001", title: "Low impact review", status: "READY", primary_agent: 1, priority: 1,
      depends_on: [], exclusive_scope: "a",
      notes: "PARKED HANDOFF. Awaiting Agent 7 Director approval."
    },
    {
      id: "LR-0002", title: "Critical review", status: "READY", primary_agent: 1, priority: 0,
      depends_on: [], exclusive_scope: "b",
      notes: "PARKED HANDOFF. Next action: Agent 7 exact-head approval."
    },
    {
      id: "LR-0003", title: "Owner merge", status: "READY", primary_agent: 2, priority: 0,
      depends_on: ["LR-0002"], exclusive_scope: "c",
      notes: "PARKED HANDOFF. Agent 7 approved exact useful head. Fresh claimant should reconcile, then merge and mark DONE."
    },
    {
      id: "LR-0004", title: "Downstream", status: "BLOCKED", primary_agent: 2, priority: 1,
      depends_on: ["LR-0002"], exclusive_scope: "d", notes: ""
    }
  ]));

  assert.equal(flowState({ status: "READY", notes: "PARKED. Awaiting Director review." }), "DIRECTOR_REVIEW");
  assert.equal(flowState({ status: "READY", notes: "PARKED. Agent 7 approved exact useful head. Fresh claim then merge." }), "OWNER_MERGE");
  assert.equal(report.flow_inbox[0].id, "LR-0002");
  assert.equal(report.flow_inbox[0].flow_state, "DIRECTOR_REVIEW");
  assert.equal(report.totals.director_review, 2);
  assert.equal(report.totals.owner_merge, 1);
  assert.match(formatReport(report), /Critical-path flow inbox/);
});

test("computes direct and transitive incomplete dependency fan-out", () => {
  const report = buildReport(queue([
    { id: "LR-0001", title: "Root", status: "READY", primary_agent: 1, depends_on: [], exclusive_scope: "a" },
    { id: "LR-0002", title: "Child", status: "BLOCKED", primary_agent: 1, depends_on: ["LR-0001"], exclusive_scope: "b" },
    { id: "LR-0003", title: "Grandchild", status: "BLOCKED", primary_agent: 2, depends_on: ["LR-0002"], exclusive_scope: "c" },
    { id: "LR-0004", title: "Second child", status: "BLOCKED", primary_agent: 2, depends_on: ["LR-0001"], exclusive_scope: "d" }
  ]));

  const root = report.fanout.find(row => row.id === "LR-0001");
  const child = report.fanout.find(row => row.id === "LR-0002");
  assert.deepEqual({ direct: root.direct, transitive: root.transitive }, { direct: 2, transitive: 3 });
  assert.deepEqual({ direct: child.direct, transitive: child.transitive }, { direct: 1, transitive: 1 });
});

test("reports queue and claim inconsistencies without mutating input", () => {
  const input = queue([
    { id: "LR-0001", title: "Blocked root", status: "BLOCKED", primary_agent: 1, depends_on: [], exclusive_scope: "a" },
    { id: "LR-0002", title: "Invalid ready", status: "READY", primary_agent: 2, depends_on: ["LR-0001", "LR-9999"], exclusive_scope: "b" },
    { id: "LR-0003", title: "Done gate", status: "DONE", primary_agent: 2, depends_on: [], merge_gate_depends_on: ["LR-0001"], exclusive_scope: "c" }
  ]);
  const snapshot = JSON.stringify(input);
  const report = buildReport(input, [{
    _file: "b.lock.json",
    task_id: "LR-0002",
    exclusive_scope: "wrong",
    agent_number: 1,
    session_id: "same",
    branch: "agent/LR-0002-x"
  }]);

  assert.equal(JSON.stringify(input), snapshot);
  assert(report.inconsistencies.some(x => x.includes("unknown dependency LR-9999")));
  assert(report.inconsistencies.some(x => x.includes("READY with incomplete dependencies")));
  assert(report.inconsistencies.some(x => x.includes("DONE with incomplete merge gates")));
  assert(report.inconsistencies.some(x => x.includes("scope does not match")));
  assert(report.inconsistencies.some(x => x.includes("agent 1 does not own")));
});

test("summarises active claims and collision surfaces deterministically", () => {
  const fixture = queue([
    { id: "LR-0001", title: "A", status: "READY", primary_agent: 1, depends_on: [], exclusive_scope: "a", likely_files: ["game.js", "docs/"] },
    { id: "LR-0002", title: "B", status: "BLOCKED", primary_agent: 2, depends_on: ["LR-0001"], exclusive_scope: "b", likely_files: ["game.js"] }
  ]);
  const locks = [{ _file: "a.lock.json", task_id: "LR-0001", exclusive_scope: "a", agent_number: 1, session_id: "s1", branch: "agent/LR-0001-a" }];
  const first = buildReport(fixture, locks);
  const second = buildReport(fixture, locks);
  assert.deepEqual(first, second);
  assert.equal(first.active_claims.length, 1);
  assert.equal(first.agents.find(a => a.number === 1).active_claims, 1);
  assert.deepEqual(first.collisions[0], { file: "game.js", count: 2, agent_count: 2, agents: [1, 2] });
  assert.match(formatReport(first), /advisory only; not a merge gate/);
});
