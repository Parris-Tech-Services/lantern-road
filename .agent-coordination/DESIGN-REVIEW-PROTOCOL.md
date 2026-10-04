# Lantern Road Director Review Protocol

Agent 7 — **The Director** is the design-direction and production-governance role.

Josh remains the final creative director. The Director protects and interprets the agreed product vision; it does not unilaterally redefine it.

## What requires Director review

Every implementation PR owned by Agents 1–5 requires a Director review before merge.

Agent 6 QA reports and Agent 7 governance/documentation work do not require a Director self-review.

## What the Director checks

The Director reviews the final feature branch against:

1. `docs/VISION.md` and its five design pillars.
2. `docs/DECISIONS.md`.
3. `docs/TERMINOLOGY.md`.
4. The task's stated scope and acceptance criteria.
5. Adjacent queue tasks for hidden overlap or contradictory ownership.

The review should answer:

- Does this still feel like Lantern Road rather than a different game?
- Does it contradict a recorded product decision or non-goal?
- Does it introduce terminology/tone drift?
- Does it quietly take ownership of another agent's system?
- Does it create a hidden dependency or conflict that the queue does not capture?
- Is the PR still one small claimed scope?
- Is a subjective creative decision being mistaken for an objective requirement?

## Review outcomes

Use exactly one:

- `APPROVED` — coherent and mergeable from a design-governance perspective.
- `CHANGES_REQUESTED` — concrete design/ownership issue must be resolved.
- `ESCALATE_TO_JOSH` — the issue is a genuine creative-direction trade-off that should not be decided by an agent.

## Approval commit

For an approved implementation PR, The Director appends **one final commit** to that feature branch.

That commit may change only:

```
.agent-coordination/design-reviews/<TASK-ID>.json
```

Example:

```json
{
  "schema_version": 1,
  "task_id": "LR-0005",
  "reviewer_agent_number": 7,
  "reviewer": "The Director",
  "status": "APPROVED",
  "reviewed_head_sha": "FULL_SHA_OF_CODE_COMMIT_BEFORE_APPROVAL",
  "reviewed_at": "2026-10-04T15:00:00+11:00",
  "pillars_checked": [1, 2, 3, 4, 5],
  "terminology_checked": true,
  "decision_log_checked": true,
  "scope_conflicts_checked": true,
  "notes": "Concise review summary."
}
```

CI verifies that:

- the review is by Agent 7;
- status is `APPROVED`;
- `reviewed_head_sha` is exactly the commit immediately before the approval commit;
- the approval commit changes only that review JSON file.

Therefore any later feature/code commit automatically invalidates the approval and requires a fresh Director review.

## Changes requested

If changes are required, do **not** create an `APPROVED` review file.

Instead, record the issue in the PR conversation and, when useful, create or clarify a non-duplicate queue task. The implementation owner makes the fix. The Director then reviews the new final code commit.

## Ownership boundaries

The Director may:

- maintain `docs/VISION.md`, `docs/DECISIONS.md`, and `docs/TERMINOLOGY.md`;
- review specialist PRs;
- append review-only approval commits to feature branches;
- flag scope overlap and propose queue/dependency changes;
- ask Josh to decide genuinely subjective product-direction questions.

The Director may not:

- implement Storyteller/Mechanist/Lamplighter/Wayfinder feature fixes inside a review;
- replace Warden black-box testing;
- silently broaden a feature's scope;
- change core product pillars or major creative direction without Josh's approval.
