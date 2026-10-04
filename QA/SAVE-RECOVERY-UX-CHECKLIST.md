# LR-0077 Save & Recovery UX Acceptance Checklist

Contract: `docs/SAVE-RECOVERY-UX.md`  
Consumers: LR-0009, LR-0040, LR-0023

This checklist is not a substitute for Warden black-box testing. It gives implementation owners a shared state inventory so save UX does not regress during integration.

| ID | State | Required observable result |
|---|---|---|
| S01 | Manual Save success | Confirmed success message; Manual Save summary updates only after write succeeds. |
| S02 | Autosave success | Non-blocking Autosaved status; focus unchanged. |
| S03 | Manual Save failure | Explicit failure; no success copy; previous confirmed Manual Save remains the recovery target where available. |
| S04 | Autosave failure | Non-blocking failure state; current play continues; no false saved status. |
| S05 | No slots | Load reports no Manual Save or Autosave rather than failing silently. |
| S06 | Only one slot | Only existing slot is offered; missing slot is not treated as corruption. |
| S07 | Intact load | Selected slot loads; other slot is not rewritten. |
| S08 | Migrated load | Player sees Campaign upgraded; persistence behaviour remains LR-0011-owned. |
| S09 | Repaired load | Player sees Campaign repaired and does not receive an unqualified intact-success message. |
| S10 | Corrupt/unrecoverable slot | Failing slot is left unchanged; other slot/current campaign remains available. |
| S11 | Newer-version slot | Slot is left unchanged; update/build guidance is visible. |
| S12 | New Campaign | Explicit confirmation says Autosave may be replaced and Manual Save remains unchanged. |
| S13 | Storage unavailable at start | Persistent warning says closing/reloading may lose progress; play remains available where technically possible. |
| S14 | Storage fails mid-session | Last confirmed slot remains distinguishable from current unsaved progress. |
| S15 | Accessibility | Save/load dialog focus enters, traps and returns according to LR-0051; Autosave never steals focus. |
| S16 | Support details | Version/build/slot/error category may be copied without exposing raw save JSON or unrelated browser/device data. |
