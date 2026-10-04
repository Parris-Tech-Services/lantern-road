# Lantern Road agent rules

These rules are mandatory for every coding/research agent working in this repository.

## Before material work

1. Read `docs/VISION.md`, `docs/DECISIONS.md`, and `docs/TERMINOLOGY.md` so product direction and language are shared rather than re-invented per agent.
2. Read `.agent-coordination/CLAIM-PROTOCOL.md`.
3. Read `.agent-coordination/WORK-QUEUE.json`.
4. Identify your assigned Lantern Road agent number from the seven-agent roster in `WORK-QUEUE.json`.
5. Choose one task whose `status` is `READY`, whose dependencies are complete, and whose `primary_agent` matches your assigned agent number. Do not claim another role's task unless Josh has explicitly reassigned it or the queue itself has been updated.
6. Generate a fresh UUIDv4 `session_id` and UUIDv4 `claim_token` for this chat/session.
7. Attempt to create the task's **exclusive scope lock** exactly as described in the claim protocol, including your `agent_number`.
8. If creation fails because that scope lock already exists, you **lost the race**. Do not edit, adopt or overwrite the other agent's lock. Re-read the queue and choose another eligible task assigned to your role.
9. Re-fetch the lock and verify the task id, scope, agent number, session id and claim token all match your session.
10. Only then create/work on a feature branch and begin material work.

## Non-negotiable coordination rules

- The create-only scope lock is the authority for active ownership. A queue entry by itself never grants ownership.
- Never work on a task or feature scope you did not successfully lock.
- Role ownership is enforced: `agent_number` in the lock must equal the task's `primary_agent`.
- Never overwrite or delete another live agent's claim.
- One session may hold only one active scope lock.
- Stay inside the claimed task scope. If you discover adjacent work, record it as a new proposed task instead of silently expanding scope.
- Do not claim `BLOCKED`, `DONE` or `CANCELLED` tasks.
- Keep the lock while material work is active. If implementation is finished and the task is only waiting on external merge gates or Josh-required evidence, park it using the claim protocol: record the exact handoff, leave the task READY, release your own lock, and claim other eligible work.
- Feature branches use: `agent/<task-id>-<short-slug>-<session8>`.
- Pull requests must name the task id and exclusive scope.
- Implementation PRs owned by Agents 1–5 require a final Agent 7 — The Director approval commit under `.agent-coordination/design-reviews/` before merge. CI rejects stale or missing approval.
- **Small PRs are mandatory:** one claimed task/scope per PR, no unrelated cleanup or opportunistic refactors. Split broad work into follow-up tasks.
- If a task has `merge_gate_depends_on`, work may proceed while claimed but its PR must not merge until every merge-gate task is `DONE`. Once no legitimate implementation work remains, do not keep a lock merely to wait for those gates; park and release it.
- Architectural/product/ownership decisions that future agents may relitigate must be surfaced to The Director and recorded briefly in `docs/DECISIONS.md`.
- Re-fetch `WORK-QUEUE.json` immediately before declaring a task complete or opening its final PR; verify its current acceptance criteria, dependencies and merge gates have not changed while you were working.
- Before merging, run `node scripts/validate-agent-coordination.mjs` plus relevant game checks.
- After a successful merge, mark the queue task `DONE` **before** deleting its lock.
- If abandoning work, leave the task `READY` and delete only your own lock.

## Product rule

Player-facing actions must provide meaningful visible feedback. Silent state changes that make a button appear broken are defects.

The coordination system is intentionally simple: stable task definitions plus GitHub create-only scope locks. See the protocol for race handling, leases and stale-lock recovery.


## Warden QA rule

Agent 6 — The Warden is an independent black-box QA/playtest role.

- Play the game as a player, including trying unusual and adversarial sequences.
- Drive a **real browser** using Playwright, agent-browser or equivalent. Source-code/DOM inspection alone is not a black-box playtest.
- Record findings under `QA/` using the report template.
- A finding must include reproduction steps/evidence, severity, player impact and recommended owner.
- Search the existing queue before adding a follow-up task; do not duplicate an existing task.
- Do not implement specialist fixes inside a Warden QA task. Route implementation defects to Agents 1–5 and cross-role coherence/terminology conflicts to Agent 7, then retest after the fix is merged.
- The Warden may edit QA reports and queue metadata needed to route findings.
- Report evidence about confusion, repetition, pacing, friction and enjoyment signals, but do not present “fun” as an objective QA score. Josh remains the creative director and final creative sign-off.


## Director governance rule

Agent 7 — **The Director** owns design coherence and production governance.

- Maintain `docs/VISION.md`, `docs/DECISIONS.md`, and `docs/TERMINOLOGY.md`.
- Review implementation PRs from Agents 1–5 against the five pillars, non-goals, terminology, task scope and adjacent ownership.
- Follow `.agent-coordination/DESIGN-REVIEW-PROTOCOL.md`.
- The Director may append a review-only approval commit to another agent's feature branch without claiming that feature scope. That commit may modify only `.agent-coordination/design-reviews/<TASK-ID>.json`.
- If code changes after approval, the approval is stale and must be repeated.
- Concrete conflicts may be blocked and routed back to the owning specialist.
- Genuine creative-direction trade-offs must be marked `ESCALATE_TO_JOSH`; Josh remains final creative director.
- The Director must not implement specialist features as part of review or use governance to expand the product beyond the agreed vision.
- Routine PR reviews are standing governance work and do not require a separate feature claim. Substantive Director projects still use its LR-0033+ queue tasks and normal claim locks.


## Evidence-gated foundation completion

LR-0011 and LR-0013 are priority-zero foundation gates and have stricter completion rules.

- Their implementation may merge while the queue task remains `READY`.
- They may be changed to `DONE` only in a later closure change that also adds the required `.agent-coordination/gate-evidence/<TASK-ID>.json`.
- The candidate commit must have a genuinely successful GitHub Actions run with the task-specific required artifact; CI independently queries GitHub to verify the run, exact SHA and artifact.
- Required legacy-save fixtures/browser tests must exist in the repository as specified by the task.
- **Josh must personally complete the task's Android phone check.**
- Agents must never invent, infer or self-assert Josh's phone confirmation. `josh_phone_check.confirmed: true` may be recorded only after Josh explicitly says the check passed.
- Agent 7 verifies that the evidence is coherent and corresponds to the task before closure.
- If any required evidence is absent, the task stays `READY` even if its implementation code is already merged.
