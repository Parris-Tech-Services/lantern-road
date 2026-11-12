# Lantern Road multi-agent claim protocol

Version: 1.4  
Effective: 5 October 2026

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

If work genuinely needs to move to another role, change the queue deliberately first. Josh may explicitly reassign work. Agent 7 as CEO may make executive resourcing reassignments, and Agent 1 as project lead may make game-production ownership reassignments, only when there is **no conflicting live task/scope lock**, the new owner is reasonably within role boundaries, and the task notes record why. Never simply claim across roles.

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

A task may be fully implemented but unable to merge because it is waiting only on `merge_gate_depends_on`, required machine evidence, required Steward game review, Josh-only validation, or another external closure condition.

Do **not** hold an active scope lock merely to wait.

When there is no material work left that the current owner can legitimately perform:

1. Re-fetch `WORK-QUEUE.json` and confirm the task itself is still `READY` and the remaining blocker is external to implementation work.
2. Record a precise handoff in task `notes`: `parked_at=<ISO-8601 timestamp>`, branch, exact useful head SHA, PR if any, tests/evidence already completed, remaining gates, and next action.
3. Leave the task `READY`; parking is neither `DONE` nor `BLOCKED` when its normal dependencies are satisfied.
4. Re-fetch the lock and verify it still belongs to your `session_id` and `claim_token`.
5. Delete **your own** scope lock.
6. Keep the useful branch/PR.
7. Immediately claim another eligible task if one exists.

Before later code/content change, rebase/reconciliation, conflict resolution or refreshed implementation work on the parked task, a fresh role-owned claimant must reacquire the normal create-only scope lock.

### Frozen parked PR merge path

Steward game review is review-by-exception. Read `steward_review`:

- `REQUIRED` — exact-head Agent 1 Steward review is required.
- missing or `NOT_REQUIRED` — no separate Steward review commit is required.

Agent 1-owned tasks must not require a separate self-review file.

A parked PR may merge **without reacquiring the implementation lock** when:

- the task is still `READY`;
- no active lock owns that task or scope;
- all `merge_gate_depends_on` tasks are `DONE`;
- queue notes identify the frozen branch and exact useful head;
- no implementation/content/rebase/reconciliation change occurred after parking.

For a specialist task with `steward_review: REQUIRED`, Agent 1 may append one review-only commit without taking the specialist implementation lock. That commit may change only:

```text
.agent-coordination/design-reviews/<TASK-ID>.json
```

The review must identify Agent 1 / The Steward, status `APPROVED`, and the exact immediately preceding feature head. If every other gate is satisfied, Agent 1 may merge the approved frozen PR immediately in the same review session and close the task where no separate evidence rule prevents closure.

For a task with no required Steward review, queue notes must name the exact current parked PR head. Historical Agent 7 review-only commits may remain on old parked branches; they are historical evidence only and do not create a new CEO approval requirement.

A fresh normal role-owned claim is still mandatory before:

- any feature/code/content edit;
- any rebase or reconciliation;
- changing frozen implementation after review/parking;
- resolving a merge conflict that changes branch content.

This rule never bypasses merge gates, machine evidence, map-canon protection or Josh-only human evidence.

## Technical foundation versus human release gates

LR-0011 and LR-0013 are technical development gates. They become `DONE` only after merged implementation plus a genuinely successful exact-commit CI run, the required unexpired artifact, required repository paths and **Agent 1 Steward verification** recorded in the gate-evidence file. The machine evidence is independently checked by CI.

Josh's Android validation is deliberately separate in LR-0056. No agent may self-assert, infer or fabricate it. LR-0056 may remain incomplete while technically eligible specialist development continues, but final integration/release tasks may depend on it.

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
- notes,
- deliberate `primary_agent` reassignment by Josh, Agent 1 for game-production ownership, or Agent 7 for executive resourcing.

Agent 1 owns routine playable-game sequencing and critical-path production. Agent 7 may set company-level priorities and resourcing constraints. Neither may steal an actively locked task: verify there is no conflicting live task/scope lock, keep the new owner within a reasonable role boundary, and record the reason in task notes.

If an update to `WORK-QUEUE.json` conflicts with another concurrent update, fetch the newest version, reconcile both changes, then retry. Do not force-overwrite someone else's queue edit.

## Validation

Run:

```bash
node scripts/validate-agent-coordination.mjs
```

The GitHub Actions workflow runs the same validator for coordination changes and pull requests.
