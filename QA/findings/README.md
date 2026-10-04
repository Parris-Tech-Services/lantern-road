# Structured Warden findings

Each confirmed non-duplicate player-facing finding may be recorded as one JSON file in this directory, named by its `finding_id` (for example `WFD-2026-001.json`) and conforming to `../FINDING-SCHEMA.json`.

The format exists so important player-experience problems do not disappear inside prose reports and so AED can measure whether high-impact findings are actually resolved.

## High-impact rule

A finding is treated as **high impact** for operational triage when either:

- severity is `S0` or `S1`; or
- `player_impact` is `HIGH`, including a reproducible fun/friction problem that makes a major loop boring, misleading, repetitive, exhausting or likely to make a player stop.

High-impact does **not** mean Agent 6 has objectively measured "fun". The Warden records observable evidence and player-impact risk; Josh remains the final creative judge.

## Lifecycle

`OPEN → ROUTED → FIXED_PENDING_RETEST → RESOLVED`

Use `WONT_FIX` only for an explicit design/product decision and `DUPLICATE` only when another finding/task already owns the problem.

A finding is not RESOLVED merely because code merged. Retest the fix against the current build and record the retest SHA/result.

## Current-build evidence

For LR-0140, `tested_source` must be `CURRENT_MAIN` or `CURRENT_DEPLOYED` and `tested_commit` must identify the game actually served in the browser.

QA tooling may live on a Warden task branch, but the **game under test must not be that stale branch checkout**. Historical comparison work such as LR-0021 uses `HISTORICAL_BASELINE` and is not counted as current-build coverage.

## Metrics

AED derives:

- unresolved and resolved high-impact findings;
- pending retests;
- high-impact resolution rate;
- median observed → resolved duration as a **time-to-playable-improvement proxy**;
- finding reopen/rework rate.

If timestamps/data do not exist, AED reports the metric as unavailable rather than fabricating it.
