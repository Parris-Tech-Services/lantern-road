# Lantern Road Steward Game Review Protocol

> Filename retained for repository compatibility. This protocol now governs **Steward game review**, not CEO/Director approval.

Agent 1 — **The Steward** is Lantern Road's project lead, lead game designer, technical lead and program integrator.

Josh remains owner / creative director and final authority on major product direction, fun, tone, emotional effect, premium feel and scope-changing creative decisions.

Agent 7 — **The Director / CEO** provides executive oversight and is **not** a routine game-design, technical or merge approval gate.

## What requires Steward review

Steward review is review-by-exception.

A specialist task requires exact-head Steward approval only when its queue entry explicitly contains:

```json
"steward_review": "REQUIRED"
```

Missing `steward_review` or `"NOT_REQUIRED"` means no separate review commit is required once normal ownership, tests and gates pass.

Agent 1-owned tasks must not set `steward_review: REQUIRED`; Steward does not create a ceremonial self-review file for its own work.

Use `REQUIRED` when a specialist task materially changes or establishes:

- core gameplay behaviour, progression/economy/combat/party design;
- major player-facing narrative meaning, campaign/endings or companion identity/agency;
- interaction/presentation behaviour that changes a product pillar;
- canonical geography or another durable game contract, unless a dedicated Steward-owned protocol already supplies the approval;
- another cross-discipline choice where two legitimate implementations would create meaningfully different player experiences.

Routine tests, tooling, bug fixes, behaviour-preserving refactors, asset production/export and implementation of an already-approved contract normally do not require separate Steward review.

## What The Steward checks

For a required review, The Steward checks the final feature head against:

1. `docs/VISION.md`, `docs/DECISIONS.md` and `docs/TERMINOLOGY.md`.
2. The task's scope and acceptance criteria.
3. Player clarity, meaningful feedback and phone-first behaviour where relevant.
4. Adjacent systems for hidden ownership or save/architecture conflicts.
5. Whether the work actually belongs in the playable game now rather than remaining paper-only.
6. Whether a genuine creative-direction trade-off should escalate to Josh.

## Approval record

For a task marked `steward_review: REQUIRED`, The Steward appends one final review-only commit changing only:

```text
.agent-coordination/design-reviews/<TASK-ID>.json
```

Example:

```json
{
  "schema_version": 1,
  "task_id": "LR-0005",
  "reviewer_agent_number": 1,
  "reviewer": "The Steward",
  "status": "APPROVED",
  "reviewed_head_sha": "FULL_SHA_OF_FEATURE_HEAD_BEFORE_APPROVAL",
  "reviewed_at": "2026-10-05T09:00:00+11:00",
  "pillars_checked": [1, 2, 3, 4, 5],
  "terminology_checked": true,
  "scope_conflicts_checked": true,
  "notes": "Concise game/production review summary."
}
```

CI verifies:

- the task id matches;
- reviewer agent is 1;
- status is `APPROVED`;
- `reviewed_head_sha` is the exact immediately preceding feature head;
- the approval commit changes only the review JSON file.

Any later feature/content/rebase commit invalidates the approval.

A frozen specialist PR may be approved and merged by The Steward in one review session when all other gates are satisfied. The specialist does not need to re-claim merely so someone can press Merge.

## Changes requested

If changes are required, do not create an `APPROVED` record. Leave a concrete PR finding and route the fix to the owning specialist. The Steward should not silently take over another role's implementation scope.

## Escalation boundaries

Escalate to **Josh** when the choice materially changes product identity, major scope, tone, emotional intent or another genuine creative-director decision.

Escalate to **Agent 7 / CEO** for company-level resourcing, organisational risk, staffing/ownership or strategic scheduling issues.

Do not escalate ordinary game-design, technical or integration decisions merely because more than one implementation is possible. Those are Steward decisions.

## Historical approvals

Existing Agent 7 design-review records remain valid historical evidence for work already merged. They do not grant Agent 7 continuing game-approval authority and do not satisfy a new `steward_review: REQUIRED` task unless the queue explicitly records a legacy exception.
