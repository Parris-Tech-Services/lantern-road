# Lantern Road multi-agent claim protocol

Version: 1.3  
Effective: 4 October 2026

## Goal

Prevent two agents from working on the same feature area at the same time, while still allowing genuinely independent Lantern Road work to proceed in parallel.

## Core design

Each task has exactly one `exclusive_scope`.

Active ownership is represented by one file:

```
.agent-coordination/claims/<exclusive_scope>.lock.json
```

The lock file must be created with a **create-only** repository operation. Do not use an update/upsert operation for initial claiming.

GitHub's create-file conflict is the concurrency primitive: if two agents race for the same scope, only the first successful create owns it. The loser must choose another task.

The queue is for task discovery and lifecycle. It is **not** the source of truth for active ownership.

## Claim algorithm

1. Read `AGENTS.md`, this file, and `WORK-QUEUE.json`.
2. Confirm your assigned agent number in the queue roster, then select a `READY` task whose `depends_on` tasks are all `DONE` and whose `primary_agent` equals your agent number. A task may only move to another agent if Josh explicitly reassigns it or the queue's `primary_agent` is deliberately changed.
3. Generate:
   - fresh UUIDv4 `session_id`
   - fresh UUIDv4 `claim_token`
4. Check the expected lock path for the task's `exclusive_scope`.
5. Attempt a create-only write of the lock file on `main`.
6. If the create fails because the file already exists, do not retry by overwriting it. Select another eligible task.
7. Re-fetch the newly created lock from `main`.
8. Verify all of these fields match what you just created:
   - `task_id`
   - `exclusive_scope`
   - `agent_number`
   - `session_id`
   - `claim_token`
9. Create a feature branch from the current `main`:
   `agent/<task-id>-<short-slug>-<first-8-of-session_id>`
10. Begin work only after verification succeeds.

## Lock schema

Example:

```json
{
  "schema_version": 1,
  "task_id": "LR-0004",
  "exclusive_scope": "character-relationships",
  "agent_number": 2,
  "agent": "The Storyteller",
  "session_id": "UUIDV4",
  "claim_token": "UUIDV4",
  "claimed_at": "2026-10-04T14:20:00+11:00",
  "expires_at": "2026-10-05T02:20:00+11:00",
  "branch": "agent/LR-0004-character-relationships-12345678",
  "note": "Implementing only LR-0004."
}
```

Use a 12-hour lease. If work continues longer, the owning agent may update only its own lock, preserving the same `session_id` and `claim_token`, and move `expires_at` forward by no more than another 12 hours.

## Role ownership

Every queue task has a `primary_agent`. The claim lock must contain the same integer as `agent_number`. This prevents an agent from accidentally claiming work belonging to another specialist role.

A `supporting_agents` entry permits consultation, review or coordination only. It does not grant a second implementation claim on the primary task or its exclusive scope.

If work genuinely needs to move to another role, change the queue deliberately first or receive an explicit reassignment from Josh; do not simply claim across roles.

## What counts as the same feature

Tasks sharing an `exclusive_scope` are mutually exclusive even if their task ids differ.

Examples:

- two tasks under `character-relationships` cannot run together;
- visual asset work and audio atmosphere work may run together because they have different scopes;
- a task must not quietly expand into another scope without a new queue task and a separate claim after the current task is released.

## Pull request rule

A feature PR should include:

- Task: `LR-xxxx`
- Exclusive scope
- Session id
- Claim token suffix (last 8 characters only)
- What changed
- Tests performed
- Any follow-up tasks discovered

Do not put the full claim token in public PR prose.

## Parking completed implementation behind external gates

A task may be fully implemented but unable to merge because it is waiting only on `merge_gate_depends_on`, required machine evidence, Director review, or another external closure condition. Josh's Android release validation is tracked separately by LR-0056 and must not consume an unrelated specialist's active claim.

Do **not** hold an active scope lock merely to wait.

When there is no material work left that the current owner can legitimately perform:

1. Re-fetch `WORK-QUEUE.json` and confirm the task itself is still `READY` and the remaining blocker is external to the implementation work.
2. Record a precise handoff in the task `notes`: branch, exact useful head SHA, PR if any, tests/evidence already completed, remaining gates, and the next action after those gates clear.
3. Leave the task `READY`; parking is neither `DONE` nor `BLOCKED` when its normal dependencies are satisfied.
4. Re-fetch the lock and verify it still belongs to your `session_id` and `claim_token`.
5. Delete **your own** scope lock.
6. Keep the useful branch/PR. Do not discard tested work merely because it is waiting.
7. The agent may immediately claim another eligible task assigned to its role.

Before any later code/content change, rebase/reconciliation, final-PR refresh, or merge preparation on the parked task, a fresh claimant must acquire the normal create-only scope lock. A parked branch does not confer continuing ownership.

### Director review of parked work

Agent 7 may append the required **review-only** design approval commit to a parked Agent 1–5 branch without forcing the implementation owner to hold an idle lock.

CI permits the missing implementation lock only when all of these are true:

- the queue task is still `READY`;
- there is no active lock for that task or exclusive scope;
- the final PR commit changes only `.agent-coordination/design-reviews/<TASK-ID>.json`;
- the review is `APPROVED` by Agent 7;
- `reviewed_head_sha` is exactly the immediately preceding feature/content commit;
- the queue notes identify the task as parked and contain the exact same branch name and reviewed useful head.

This exception grants **review authority only**. It does not grant implementation ownership.

A fresh normal claim is still mandatory before:

- any feature/code/content edit;
- rebase or reconciliation changes;
- changing the reviewed implementation after approval;
- final merge preparation by the implementation owner.

If another active lock has since claimed the same task/scope, the old parked branch cannot use the no-lock review exception until ownership is reconciled.

This rule does not permit bypassing merge gates, machine evidence, Director review, or the separate LR-0056 human release gate. It only prevents waiting from consuming an active agent/lock slot.

## Technical foundation versus human release gates

LR-0011 and LR-0013 are technical development gates. They become `DONE` only after merged implementation plus independently verified CI/artifact evidence and Agent 7 evidence verification. Once they are `DONE`, normal dependencies on them are satisfied and specialist agents may proceed.

Josh's Android validation is deliberately separate in LR-0056. LR-0056 may remain incomplete while specialist development continues. Final integration/release tasks may depend on LR-0056.

No agent may self-assert Josh's validation. The human validation record may be completed only after Josh explicitly reports the check passed.

## Completing work

1. Finish and test the feature branch.
2. Open/review/merge the PR.
3. Update the task in `WORK-QUEUE.json` from `READY` to `DONE`.
4. Re-fetch your scope lock and verify the `session_id` and `claim_token`.
5. Delete that lock.
6. Run the validator again.

Marking `DONE` before deleting the lock makes the task non-claimable during the release transition.

## Abandoning work

Abandoning is different from parking. Parking preserves completed/useful implementation that is waiting on an external gate; abandoning means the current attempt should no longer be treated as the active implementation path.

If no merged change should count as completion:

1. Record useful handoff notes in the task's `notes` field.
2. Leave or restore the task status as `READY` (unless genuinely `BLOCKED`).
3. Verify the lock still belongs to your session.
4. Delete your lock.
5. Do not delete the branch if it contains useful unmerged evidence; clearly mark it abandoned/handoff instead.

## Stale lock recovery

A lock is stale only when:

- `expires_at` is in the past, **and**
- there is no clear recent branch/PR activity showing the original agent is still working.

Recovery procedure:

1. Re-fetch the stale lock.
2. Inspect its branch/PR for recent activity.
3. Record why recovery is safe.
4. Delete the stale lock.
5. Competing agents may then attempt a normal create-only claim; the first successful create wins.

Never overwrite a stale lock in place to "take it over".

## Queue editing

Active claiming does not modify the queue, avoiding a central read-modify-write race.

Queue edits are limited to:
- adding tasks,
- changing task lifecycle status,
- dependencies,
- priority,
- acceptance criteria,
- notes.

If an update to `WORK-QUEUE.json` conflicts with another concurrent update, fetch the newest version, reconcile both changes, then retry. Do not force-overwrite someone else's queue edit.

## Validation

Run:

```bash
node scripts/validate-agent-coordination.mjs
```

The GitHub Actions workflow runs the same validator for coordination changes and pull requests.
