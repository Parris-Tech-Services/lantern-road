# AED Claim, Parking, PR and Review Lifecycle Audit

**Task:** LR-0117  
**Agent:** 8 — AED (Agent Efficiency Department)  
**Snapshot:** 4 October 2026

## Executive finding

The current coordination design is fundamentally sound. The expensive parts are no longer ownership safety itself; they are **manual rediscovery of state** and **repeated handoff/merge bookkeeping**.

LR-0101 already fixed the worst flaw: a completed parked implementation no longer needs to hold an idle scope lock merely so Agent 7 can append an exact-head review commit.

AED recommends keeping these safety invariants:

1. create-only exclusive-scope claims;
2. one live scope per session;
3. role ownership;
4. exact-head Director approval for Agents 1–5;
5. fresh ownership before any implementation edit/reconciliation/merge preparation;
6. queue DONE before deleting the completing lock.

Automation should make those states easier to see and verify, not bypass them.

## Representative lifecycle

### A. Normal active task

1. Read rules/queue.
2. Select eligible READY role-owned task.
3. Generate fresh session + claim token.
4. Create-only lock on `main`.
5. Re-fetch/verify lock.
6. Create feature branch.
7. Work/test.
8. Open PR while lock is active.
9. For Agents 1–5, Director approves exact final implementation head.
10. Merge.
11. Mark DONE.
12. Verify/delete own lock.

This is safe and should remain the default for work that can proceed directly to merge.

### B. Completed work blocked on external review/gate

Observed across many Storyteller/Mechanist/Wayfinder/Lamplighter tasks:

1. claim normally;
2. author/implement and test;
3. open PR;
4. record parked handoff with branch + exact useful head + PR + evidence + next action;
5. release own lock;
6. Agent 7 reviews parked work without an idle implementation lock;
7. when merge/reconciliation is needed, owner/role freshly claims;
8. verify exact approved head is still current;
9. merge;
10. mark DONE and release.

This is the correct pattern. The parked branch itself conveys **no ownership**.

### C. Foundation task with machine + human evidence

LR-0011/LR-0013 add another phase:

1. implementation PR and CI artifact;
2. Director review;
3. merge may occur while task remains READY;
4. closure evidence record references exact candidate/run/artifacts;
5. current policy also requires Josh-only Android confirmation;
6. Agent 7 verifies evidence;
7. closure change marks DONE.

LR-0055 proposes separating technical completion from human release validation. Until that lands, current stricter policy remains authoritative.

## What LR-0101 successfully removed

Before LR-0101, the verifier demanded an active implementation lock before it could accept the Director approval commit. This contradicted the parking rule and forced idle ownership.

LR-0101 introduced the narrow parked-review exception. Its regression tests cover:

- valid parked exact-head approval with no idle lock;
- unlocked feature commit rejection;
- stale Director approval rejection;
- ordinary active-claim PR acceptance.

That was the right simplification because it removed waiting without weakening implementation ownership.

## Remaining manual churn

### 1. Parked state is encoded in prose

Queue notes contain branch, head SHA, PR, evidence and next action, but there is no generated operational view.

Cost:
- every agent re-parses large notes;
- Director review priority is hidden;
- "READY" conflates unstarted/actionable work with completed parked work.

**Fix:** LR-0118 derives parked/review-ready information from queue notes. Do not add a manually maintained second status registry.

### 2. Review inbox is implicit

Agent 7 has standing review work but zero READY feature tasks.

Cost:
- orchestration can incorrectly classify the Director as idle;
- high-fan-out foundation reviews compete invisibly with low-risk authoring reviews.

**Fix:** AED report should surface parked tasks mentioning Director review/approval and rank them by dependency fan-out/priority.

### 3. Fresh merge claims require state reconstruction

Fresh ownership before merge is useful, but the claimant repeatedly has to rediscover:
- parked branch;
- approved head;
- PR;
- gates/evidence;
- whether another lock appeared.

**Fix:** generated report should print the parked handoff summary and conflicting-lock state. Future helper tooling may validate a merge candidate, but should not create/delete locks automatically until race behaviour is tested.

### 4. Queue updates conflict under parallel work

The queue is a single JSON file. Fetch/reconcile/retry is safe but repetitive.

**Fix:** continue using optimistic re-fetch/retry. Do not split the queue merely to avoid conflicts; that would make global dependency validation harder. A future mutation helper could apply one task update against the latest queue and fail on semantic conflicts.

### 5. Director approval is one commit per PR

Exact-head review is intentionally serial at the PR level.

**Efficiency improvement:** Agent 7 can process many parked PRs in one session without task claims, prioritised by fan-out. Do not batch multiple task approvals into one shared commit, because exact per-PR head provenance is valuable.

## What can be safely automated now

### Read-only/advisory — low risk
- per-agent READY/BLOCKED/DONE/parked counts;
- active lock listing;
- direct/transitive dependency fan-out;
- longest downstream chains;
- parked/review-ready list;
- obvious queue inconsistencies;
- stale/expired-lock warnings;
- likely-file collision counts.

This is LR-0118.

### Validation helpers — medium risk, future
A future helper may *validate* a parked merge candidate:
- queue task still READY;
- no competing task/scope lock;
- branch/head matches parked notes;
- Director review is exact-head and valid;
- merge gates are DONE;
- required CI evidence exists.

It should exit non-zero on uncertainty and must not mutate state by default.

### Mutation helpers — higher risk, defer
Potential helpers for claim creation, parking, DONE transitions or lock deletion touch concurrency-critical state. Do not automate them until transactional/race tests exist.

## Candidate future simplification: approved parked merge without fresh implementation lock

There is a theoretical simplification: if a parked Agent 1–5 PR has an exact-head Director approval, no competing lock, no implementation changes after approval, all merge gates complete, and CI is green, the system could permit a narrowly controlled merge/closure path without reacquiring the feature lock.

**AED does not recommend adopting this yet.**

Why:
- merge/rebase may change code;
- queue DONE transition can race;
- a new claimant could legitimately begin work between checks;
- current fresh claim is a simple concurrency barrier.

If explored later, required regression tests should include:

1. exact approved parked head + no lock + no rebase can merge;
2. competing task/scope lock rejects merge;
3. stale approval rejects merge;
4. any feature commit after approval rejects merge;
5. rebase/merge-base change rejects until fresh approval;
6. incomplete `merge_gate_depends_on` rejects merge;
7. queue task not READY rejects merge;
8. wrong parked branch/head in notes rejects merge;
9. concurrent DONE transition is detected rather than overwritten;
10. evidence-gated tasks cannot bypass required evidence/human policy.

Until those tests exist and an explicit decision changes the protocol, **fresh merge ownership remains mandatory**.

## Regression-test improvements for the existing protocol

Extend `tests/verify-pr-claim.test.mjs` over time with:
- parked approval rejected when another active scope lock exists;
- parked approval rejected when notes name a different branch;
- parked approval rejected when notes contain a different useful head;
- approval JSON with wrong task/reviewer/status rejected;
- approval followed by a second content commit rejected;
- active claim with mismatched role rejected;
- expired lock behaviour separated from ownership takeover policy.

These tests should accompany any verifier change; do not expand LR-0117 into implementation work.

## Recommended review/merge service levels

These are operational priorities, not hard deadlines:

1. high-fan-out foundation/tooling review first;
2. first-wave feature review next;
3. low-risk authoring/specification batches after foundations;
4. art/UX contract batches can be reviewed together in one Director session, while still producing one exact-head approval commit per PR.

This reduces critical-path waiting without changing review quality.

## Metrics for LR-0118

The lifecycle audit confirms LR-0118 should report:

- active claims;
- parked READY tasks;
- parked tasks apparently awaiting Director review;
- per-agent actionable READY = READY minus parked;
- dependency fan-out;
- expired lock warnings;
- queue consistency errors/warnings;
- review-ready work ranked by priority and downstream fan-out.

The output must stay advisory and deterministic from local repository files.

## Conclusion

The create-only lock and exact-head approval rules are not the problem. They are valuable safety barriers.

The remaining inefficiency comes from humans/agents repeatedly reconstructing hidden operational state from a large queue and many PR notes. LR-0118 should solve that read-only visibility problem first. More aggressive lifecycle automation should wait for explicit transactional regression coverage.
