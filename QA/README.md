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
