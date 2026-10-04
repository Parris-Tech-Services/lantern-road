import test from "node:test";
import assert from "node:assert/strict";
import { buildFindingMetrics, buildReport, findingIsHighImpact, flowState, formatReport, isParked, isReviewReady, parkedAtFromNotes } from "../scripts/aed-report.mjs";

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
    { id: "LR-0002", title: "Parked", status: "READY", primary_agent: 1, director_review: "REQUIRED", depends_on: [], exclusive_scope: "b", notes: "PARKED HANDOFF: awaiting Agent 7 Director approval." },
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
  assert.equal(isReviewReady({ status: "READY", director_review: "REQUIRED", notes: "PARKED awaiting Director review" }), true);
});


test("ranks critical-path flow inbox and distinguishes review from owner merge", () => {
  const report = buildReport(queue([
    {
      id: "LR-0001", title: "Low impact review", status: "READY", primary_agent: 1, director_review: "REQUIRED", priority: 1,
      depends_on: [], exclusive_scope: "a",
      notes: "PARKED HANDOFF. Awaiting Agent 7 Director approval."
    },
    {
      id: "LR-0002", title: "Critical review", status: "READY", primary_agent: 1, director_review: "REQUIRED", priority: 0,
      depends_on: [], exclusive_scope: "b",
      notes: "PARKED HANDOFF. Next action: Agent 7 exact-head approval."
    },
    {
      id: "LR-0003", title: "Owner merge", status: "READY", primary_agent: 2, director_review: "REQUIRED", priority: 0,
      depends_on: ["LR-0002"], exclusive_scope: "c",
      notes: "PARKED HANDOFF. Agent 7 approved exact useful head. Fresh claimant should reconcile, then merge and mark DONE."
    },
    {
      id: "LR-0004", title: "Downstream", status: "BLOCKED", primary_agent: 2, priority: 1,
      depends_on: ["LR-0002"], exclusive_scope: "d", notes: ""
    }
  ]));

  assert.equal(flowState({ status: "READY", director_review: "REQUIRED", notes: "PARKED. Awaiting Director review." }), "DIRECTOR_REVIEW");
  assert.equal(flowState({ status: "READY", director_review: "REQUIRED", notes: "PARKED. Agent 7 approved exact useful head. Fresh claim then merge." }), "OWNER_MERGE");
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


test("computes player-impact resolution, retest and rework metrics", () => {
  const findings = [
    {
      finding_id: "WFD-2026-001", status: "RESOLVED", severity: "S1", player_impact: "HIGH",
      tested_source: "CURRENT_MAIN", observed_at: "2026-10-04T00:00:00Z", resolved_at: "2026-10-04T06:00:00Z",
      reopen_count: 0
    },
    {
      finding_id: "WFD-2026-002", status: "FIXED_PENDING_RETEST", severity: "S2", player_impact: "HIGH",
      tested_source: "CURRENT_DEPLOYED", observed_at: "2026-10-04T01:00:00Z", resolved_at: null,
      reopen_count: 1
    },
    {
      finding_id: "WFD-2026-003", status: "OPEN", severity: "S3", player_impact: "LOW",
      tested_source: "HISTORICAL_BASELINE", observed_at: "2026-10-04T02:00:00Z", resolved_at: null,
      reopen_count: 0
    }
  ];
  const metrics = buildFindingMetrics(findings);
  assert.equal(findingIsHighImpact(findings[0]), true);
  assert.equal(findingIsHighImpact(findings[2]), false);
  assert.equal(metrics.total, 3);
  assert.equal(metrics.current_build, 2);
  assert.equal(metrics.unresolved_high_impact, 1);
  assert.equal(metrics.resolved_high_impact, 1);
  assert.equal(metrics.pending_retest, 1);
  assert.equal(metrics.high_impact_resolution_rate_percent, 50);
  assert.equal(metrics.median_time_to_playable_improvement_hours, 6);
  assert.equal(metrics.reopened_findings, 1);
  assert(Math.abs(metrics.rework_rate_percent - (100 / 3)) < 1e-9);
});

test("derives parked-review age when parking timestamps exist", () => {
  assert.equal(
    parkedAtFromNotes({ notes: "PARKED HANDOFF parked_at=2026-10-04T06:00:00Z branch x" }),
    "2026-10-04T06:00:00.000Z"
  );
  assert.equal(
    parkedAtFromNotes({ notes: "PARKED 2026-10-04 by Agent 3" }),
    "2026-10-04T00:00:00.000Z"
  );

  const report = buildReport(
    {
      project: "Fixture",
      updated_at: "2026-10-04T12:00:00Z",
      agent_roster: [{ number: 1, name: "One" }],
      tasks: [{
        id: "LR-0001", title: "Parked", status: "READY", primary_agent: 1, priority: 0,
        depends_on: [], exclusive_scope: "a",
        notes: "PARKED HANDOFF parked_at=2026-10-04T06:00:00Z awaiting Director review"
      }]
    },
    [],
    [],
    { funLoopState: { last_tested_main_sha: null } }
  );
  assert.equal(report.flow_metrics.oldest_parked_review_age_hours, 6);
  assert.match(formatReport(report), /oldest parked review age: 6\.0h/);
  assert.match(formatReport(report), /last current-main playtest: none recorded/);
});


test("classifies agent work state and chooses the highest-priority actionable task", () => {
  const report = buildReport(
    {
      project: "Fixture",
      updated_at: "2026-10-04T12:00:00Z",
      agent_roster: [
        { number: 1, name: "One" },
        { number: 2, name: "Two" }
      ],
      tasks: [
        { id: "LR-0001", title: "Blocked integration", status: "BLOCKED", primary_agent: 1, priority: 0, depends_on: ["LR-0004"], exclusive_scope: "a" },
        { id: "LR-0002", title: "Useful producer work", status: "READY", primary_agent: 1, priority: 1, depends_on: [], exclusive_scope: "b", notes: "" },
        { id: "LR-0003", title: "Lower priority producer", status: "READY", primary_agent: 1, priority: 2, depends_on: [], exclusive_scope: "c", notes: "" },
        { id: "LR-0004", title: "Parked review", status: "READY", primary_agent: 2, priority: 0, depends_on: [], exclusive_scope: "d", notes: "PARKED HANDOFF awaiting Director review" }
      ]
    },
    []
  );

  const one = report.agents.find(a => a.number === 1);
  const two = report.agents.find(a => a.number === 2);
  assert.equal(one.work_state, "READY");
  assert.equal(one.next_task.id, "LR-0002");
  assert.equal(two.work_state, "REVIEW_DRAIN");
  assert.equal(two.next_task, null);
  assert.match(formatReport(report), /One: READY/);
  assert.match(formatReport(report), /NEXT LR-0002 P1: Useful producer work/);
});

test("active claim takes precedence over extra READY work in work-state classification", () => {
  const report = buildReport(
    {
      project: "Fixture",
      updated_at: "2026-10-04T12:00:00Z",
      agent_roster: [{ number: 1, name: "One" }],
      tasks: [
        { id: "LR-0001", title: "Active work", status: "READY", primary_agent: 1, priority: 0, depends_on: [], exclusive_scope: "active", notes: "" },
        { id: "LR-0002", title: "Next work", status: "READY", primary_agent: 1, priority: 1, depends_on: [], exclusive_scope: "next", notes: "" }
      ]
    },
    [{
      _file: "active.lock.json",
      task_id: "LR-0001",
      exclusive_scope: "active",
      agent_number: 1,
      session_id: "session-one",
      branch: "agent/LR-0001-active"
    }]
  );
  const one = report.agents[0];
  assert.equal(one.work_state, "ACTIVE");
  assert.equal(one.active_claims, 1);
});


test("review-by-exception ignores stale Director-wait notes for NOT_REQUIRED tasks", () => {
  const report = buildReport(queue([
    {
      id: "LR-0013",
      title: "Technical harness",
      status: "READY",
      primary_agent: 1,
      director_review: "NOT_REQUIRED",
      priority: 0,
      depends_on: [],
      merge_gate_depends_on: [],
      exclusive_scope: "harness",
      notes: "PARKED HANDOFF: awaiting Agent 7 exact-head approval. branch agent/LR-0013-test exact useful head deadbeef."
    }
  ]));
  assert.equal(flowState(report ? {
    status: "READY",
    director_review: "NOT_REQUIRED",
    notes: "PARKED HANDOFF awaiting Agent 7 approval"
  } : {}), "PARKED_WAIT");
  assert.equal(report.totals.director_review, 0);
  assert.equal(report.totals.owner_merge, 1);
  assert.equal(report.flow_inbox[0].flow_state, "OWNER_MERGE");
});
