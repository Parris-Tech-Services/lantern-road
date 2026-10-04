# LR-0108 Responsive Play-Shell Real-Browser Acceptance Matrix

Contract: `docs/RESPONSIVE-PLAY-SHELL-CONTRACT.md`  
Runtime consumer: LR-0096  
Independent QA consumer: LR-0097

## Test configurations

| Code | Viewport | Text/input |
|---|---|---|
| P320 | 320 × 700 portrait | Standard touch |
| P320-X | 320 × 700 portrait | Extra Large touch |
| P390 | 390 × 844 portrait | Standard touch |
| P430-X | 430 × 900 portrait | Extra Large touch |
| D1024 | 1024 × 768 | Keyboard + pointer |
| D1440 | 1440 × 900 | Keyboard + pointer |
| D1440-X | 1440 × 900 | Extra Large |

## Core scenarios

| ID | Scenario | Pass criteria |
|---|---|---|
| S01 | Five consecutive phone travels | No page-level map→result→map vertical shuttle; map remains visible; each result and next action appears in the interaction sheet. |
| S02 | Sheet PEEK → STANDARD → EXPANDED → STANDARD | No focus loss; map camera unchanged; controls never disappear without an alternative expand/collapse action. |
| S03 | Long dialogue with two branches | Interaction region scrolls; map state survives; each branch starts at new logical heading; close returns to Context STANDARD. |
| S04 | Journal → Party → Log → Context | Each mode appears in interaction region; remembered logical scroll/focus is sensible; map state does not reset. |
| S05 | Map expand and return | MAP_EXPANDED preserves current result/sheet state; Return restores previous sheet state and focus. |
| S06 | Settings / save-load modal | Background map/sheet inert; close restores exact useful shell/mode state. |
| S07 | Phone shop | Shop uses one vertical scroll owner; final Buy/Sell/Close controls can clear safe area/tabs; close restores Context. |
| S08 | Phone combat | Current action/target region remains primary; no hidden required control under tabs; combat close/result restores map/context. |
| S09 | 1024/1440 split pane travel | Map stays in world pane; results/actions update in interaction pane; page-level scroll not required for core loop. |
| S10 | Split ↔ sheet via viewport resize | Active mode/content, map camera and logical focus survive; no state reset or duplicate modal. |
| S11 | Extra Large text breakpoint | Layout switches to sheet earlier if needed; no squeezed unreadable split pane, horizontal overflow or hidden actions. |
| S12 | Orientation/viewport-height change | Current mode/map/choice survives; shell reflows without leaving controls outside visible/safe area. |
| S13 | Repeated feedback/results | New result replaces/updates active Context result without unbounded layout jump; player sees what changed immediately. |
| S14 | Keyboard-only shell navigation | Map controls, tabs, sheet expansion, actions and modal close are reachable in deterministic order. |
| S15 | Screen-reader shell semantics | World and interaction regions have useful names; geometry changes do not cause duplicate/noisy announcements. |

## Scroll-trap checks

Fail if any normal flow requires:

- body scroll to reach map, then body scroll back to actions;
- a scrollable list inside a scrollable sheet for routine dialogue/actions;
- a hidden Close/action below a fixed tab bar with no way to bring it fully into view;
- map pan causing document scroll during an established map gesture.

## Evidence expectations

For LR-0096 implementation:

- real browser, not code inspection only;
- screenshots at P320-X, P390, D1024 and D1440-X;
- short screen recording or trace for S01/S05/S10 if practical;
- console errors recorded;
- tested commit/build identity recorded;
- any intentional deviation from contract documented before completion.

## Warden handoff

LR-0097 should independently test player-observable shell behaviour, especially:

- whether the scroll shuttle is actually gone;
- whether bottom-sheet scrolling feels natural;
- whether map context remains understandable during dialogue;
- whether desktop split pane feels spacious rather than cramped;
- whether enlarged text produces interaction traps.
