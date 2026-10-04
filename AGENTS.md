# Lantern Road agent rules

These rules are mandatory for every coding/research agent working in this repository.

## Before material work

1. Read `docs/VISION.md`, `docs/DECISIONS.md`, and `docs/TERMINOLOGY.md` so product direction and language are shared rather than re-invented per agent.
2. Read `.agent-coordination/CLAIM-PROTOCOL.md`.
3. Read `.agent-coordination/WORK-QUEUE.json`.
4. Identify your assigned Lantern Road agent number from the eight-agent roster in `WORK-QUEUE.json`.
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



## Map canon rule

Grey March geography is protected product canon.

- Read `world/map-canon.json`, `docs/WORLD-MAP-CANON.md`, and `.agent-coordination/MAP-CANON-PROTOCOL.md` before adding, renaming, relocating or retiring any named settlement/site/region or before changing map coordinate meaning.
- Existing canonical place ids, names, `q/r` values and derived grid references must not be changed opportunistically inside unrelated feature work.
- The current `q/r` implementation is a pointy-top **odd-r offset** grid; do not reinterpret it as pure axial coordinates.
- Human grid references are derived from the canonical coordinates: q 0–8 = A–I and r 0–7 = 1–8.
- Text or labels generated inside concept art are **PROPOSED**, not canon, until the controlled map-canon workflow approves them.
- The terrain atlas is visual presentation only. Gameplay-critical labels, roads, site markers, party position, reachable hexes, discovery/fog, quests and mutable world-state overlays are drawn dynamically from canonical data.
- Storyteller, Lamplighter, Mechanist, Wayfinder and Warden may propose or consume geography within their roles, but Agent 7 governs canon and Agent 1 owns technical enforcement/rendering architecture.
- If a task genuinely needs a new canonical place or a canonical move/rename, queue a dedicated map-canon change instead of silently altering the world.


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


## Continuous fun-loop rule

Lantern Road must optimise for **playable improvement**, not merely merged output.

- LR-0021 is the intentional historical Warden baseline. Its findings describe the old build it actually tested and must not be treated as evidence about current `main` unless independently retested.
- LR-0140 is the standing current-build Warden lane. Agent 6 may claim it only when a meaningful player-facing merge has landed since `QA/FUN-LOOP-STATE.json:last_tested_main_sha`, or when Agent 7/Josh explicitly requests a targeted retest.
- QA tooling may live on an Agent 6 branch, but the game-under-test for LR-0140 must be **current main or the current deployed build**, with the exact tested SHA/build recorded. Do not serve the Warden's stale tooling branch as the game-under-test.
- Keep micro-playtests narrow: retest only materially affected loops (for example exploration/map, dialogue/social, combat, progression/economy, save/resume, presentation/mobile).
- Confirmed non-duplicate findings use `QA/FINDING-SCHEMA.json` and live under `QA/findings/`.
- `S0`/`S1` findings and reproducible `HIGH` player-impact fun/friction findings normally outrank filler, speculative polish and new authoring until they are routed and either fixed/retested or explicitly accepted by Agent 7/Josh.
- A merged fix is not a resolved finding. Agent 6 retests the owning fix against a current build before setting the finding to `RESOLVED`.
- Agent 6 reports observable confusion, repetition, pacing, friction, engagement risk and enjoyment signals; Josh remains final judge of whether the game is fun.
- The Warden does not implement specialist fixes. Route them to the correct owner and preserve QA independence.

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



## No-idle waiting rule

An agent must not say it is "waiting on Agent X" merely because its most obvious integration task is blocked.

Before declaring that no useful work can continue:

1. Re-fetch the live queue and run `node scripts/aed-report.mjs`.
2. Check your `NEXT` actionable task. If one exists and you have no active claim, claim it normally and work it.
3. If no actionable READY task exists, inspect your blocked work for a **producer/integration split**:
   - producer work creates a durable specialist-owned deliverable now (story content, balance model, source art, final asset pack, audio sources, UX contract, QA scenario, research/evidence);
   - integration work touches shared runtime/code and may remain gated on another agent;
   - the producer split must not duplicate an existing task, weaken acceptance criteria, or edit another role's live/shared implementation scope.
4. Queue a producer task only when the deliverable will actually be consumed later. Do not invent filler, speculative busywork or duplicate documentation just to avoid being idle.
5. If all useful producer work is already complete/parked and all implementation work is genuinely gated, temporary idleness is correct. Report the exact dependency instead of creating noise.

Examples:
- Lamplighter may generate/curate art and produce audio source packs before Steward runtime integration.
- Storyteller may author scenes/dialogue before the dialogue engine exists.
- Mechanist may produce deterministic system/balance contracts before runtime integration.
- Wayfinder may produce interaction/accessibility contracts and test matrices before shared UI seams exist.
- Warden may prepare reusable scenarios, but black-box findings still require a real current build.

The goal is **parallel specialist production with late integration**, not bypassing dependencies.

## Critical-path drain rule

When the queue contains completed **PARKED** work on the critical path, optimise for finishing flow rather than manufacturing more backlog.

- Agent 7's standing review work should prioritise **priority-0 and high-downstream-fan-out parked PRs** before lower-impact review inventory, unless a correctness/security/data-loss issue is more urgent.
- After required review or merge gates clear, the owning specialist should normally prefer a **fresh claim to reconcile/merge/close the parked task** before starting new authoring, when that closure unblocks downstream work.
- A role with no genuinely actionable work may be temporarily idle. Do not create filler tasks merely to keep every agent busy.
- Use `node scripts/aed-report.mjs` as an advisory flow view; its ranked inbox is not an approval authority and does not override the queue, locks, Agent 7 design governance or Josh.
- Critical-path urgency never permits cross-role claiming, editing another agent's live scope, bypassing exact-head review, or weakening save/map/QA evidence.
- LR-0010 architecture work is staged so specialist runtime lanes may unlock after their required seam lands; cross-system integration/QA still waits for the parent LR-0010 completion gate where the queue says so.

## AED efficiency rule

Agent 8 — **AED (Agent Efficiency Department)** is the cross-agent operations and efficiency role.

- Audit Agents 1–7, the queue, claims, branches/PRs, repository layout, code hotspots, tooling availability, blockers and handoff friction.
- Optimise for less waiting, less duplicate work, smaller collision surfaces and clearer ownership. AED must not become a new approval gate.
- Do not take over or edit another agent's live claimed specialist scope. Route fixes to the existing owner, or create/reassign queue work only when there is a genuine ownership gap and no conflicting live claim.
- AED may implement coordination/reporting tooling, repository-process improvements and audit artifacts only under its own normal claimed tasks.
- Respect Agent 7's design-governance authority and Josh's final creative authority. AED can identify design-process friction but does not approve product direction.
- Prefer measurable evidence: dependency fan-out, READY/BLOCKED distribution, active-lock state, repeated claim/parking cycles, shared-file collision risk, CI/tool failures and stale project surfaces.
- Before proposing a new task, search the queue for an existing owner/task and extend or route there instead of creating filler.
- Efficiency recommendations must preserve correctness, save compatibility, map canon, QA independence and the create-only ownership guarantees.

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
