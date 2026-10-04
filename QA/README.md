# Lantern Road QA

This folder is owned by Agent 6 — The Warden for black-box playtesting evidence and reports.

The Warden does not implement specialist feature fixes inside QA tasks. It plays, reproduces, classifies, routes and later retests findings.

## Real-browser requirement

A Warden playtest must drive Lantern Road in a real browser using Playwright, agent-browser or an equivalent browser engine. Reading `game.js`, inspecting the DOM statically, or reasoning from source is useful preparation but **does not count as black-box testing**.

The one early baseline pass (LR-0021) establishes a before-state. Other Warden passes intentionally wait for their relevant foundations so stale findings do not flood the queue.

## Severity

- **S0 — Blocker:** crash, corruption, hard lock, campaign cannot continue, or severe data loss.
- **S1 — High:** major feature is broken, reliable exploit, serious soft lock, or issue likely to ruin a run.
- **S2 — Medium:** confusing/broken interaction, balance/pacing/tedium concern, continuity error, or repeated friction with a workaround.
- **S3 — Low:** polish, minor inconsistency, small clarity issue or low-impact annoyance.

## Required evidence

Each finding should include:

1. Build/commit or branch tested.
2. Campaign state and device/browser where relevant.
3. Exact reproduction steps.
4. Expected player-facing behaviour.
5. Observed behaviour.
6. Reproducibility: always / intermittent / once.
7. Severity and player impact.
8. Recommended owner: Steward, Storyteller, Mechanist, Lamplighter or Wayfinder.
9. Existing queue search result so duplicate work is avoided.
10. Retest status after a fix is merged.

A QA report may contain many findings. Only confirmed, useful, non-duplicate findings should become queue tasks.

## Creative judgement

The Warden can document repetition, friction, pacing, readability, confusion and player-experience observations. Those are evidence, not an objective measure of fun. **Josh is the creative director and makes the final call on whether something is fun, emotionally effective or premium-feeling.**


## Current-build micro-playtests

LR-0021 remains the intentional early/historical baseline. It is valuable for before/after comparison, but its findings must be labelled against the exact branch/build it tested.

LR-0140 is the standing rapid feedback lane after LR-0021:

1. Confirm a meaningful player-facing merge landed since `QA/FUN-LOOP-STATE.json:last_tested_main_sha`.
2. Keep QA tooling separate from the game under test.
3. Serve/check out the current `main` SHA or current deployed build for the actual browser session.
4. Exercise only the loops materially touched by recent merges.
5. Record confirmed non-duplicate findings under `QA/findings/` using `QA/FINDING-SCHEMA.json`.
6. Route specialist fixes; do not implement them in Warden QA.
7. Retest merged fixes and only then mark findings `RESOLVED`.
8. Update `QA/FUN-LOOP-STATE.json` with the current tested SHA/build and report reference.
9. Park/release LR-0140 after the run so Agent 6 does not hold an idle lock. The task intentionally remains READY as a standing lane until release closure.

If no meaningful gameplay-facing change has landed, do not run a ceremonial playtest or manufacture findings.

## Player-impact triage

Operational priority is based on both technical severity and player impact.

- S0/S1 remain immediate.
- A reproducible `HIGH` player-impact finding can also be urgent when it makes a major loop boring, misleading, repetitive, exhausting or likely to make a player stop, even if the software technically continues running.
- Medium/low findings should not pre-empt critical-path foundations unless they expose a systematic player-experience problem.

This triage guides production order. It does not turn fun into an objective numeric score.
