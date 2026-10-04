# Lantern Road agent rules

These rules are mandatory for every coding/research agent working in this repository.

## Before material work

1. Read `.agent-coordination/CLAIM-PROTOCOL.md`.
2. Read `.agent-coordination/WORK-QUEUE.json`.
3. Choose one task whose `status` is `READY` and whose dependencies are complete.
4. Generate a fresh UUIDv4 `session_id` and UUIDv4 `claim_token` for this chat/session.
5. Attempt to create the task's **exclusive scope lock** exactly as described in the claim protocol.
6. If creation fails because that scope lock already exists, you **lost the race**. Do not edit, adopt or overwrite the other agent's lock. Re-read the queue and choose another task.
7. Re-fetch the lock and verify the task id, scope, session id and claim token all match your session.
8. Only then create/work on a feature branch and begin material work.

## Non-negotiable coordination rules

- The create-only scope lock is the authority for active ownership. A queue entry by itself never grants ownership.
- Never work on a task or feature scope you did not successfully lock.
- Never overwrite or delete another live agent's claim.
- One session may hold only one active scope lock.
- Stay inside the claimed task scope. If you discover adjacent work, record it as a new proposed task instead of silently expanding scope.
- Do not claim `BLOCKED`, `DONE` or `CANCELLED` tasks.
- Keep the lock until the work is merged or deliberately abandoned.
- Feature branches use: `agent/<task-id>-<short-slug>-<session8>`.
- Pull requests must name the task id and exclusive scope.
- Before merging, run `node scripts/validate-agent-coordination.mjs` plus relevant game checks.
- After a successful merge, mark the queue task `DONE` **before** deleting its lock.
- If abandoning work, leave the task `READY` and delete only your own lock.

## Product rule

Player-facing actions must provide meaningful visible feedback. Silent state changes that make a button appear broken are defects.

The coordination system is intentionally simple: stable task definitions plus GitHub create-only scope locks. See the protocol for race handling, leases and stale-lock recovery.
