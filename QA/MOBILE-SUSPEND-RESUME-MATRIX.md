# LR-0119 Mobile Suspend/Resume QA Matrix

Contract: `docs/MOBILE-SUSPEND-RESUME-CONTRACT.md`

| ID | Interruption | Expected |
|---|---|---|
| R01 | App switch during map | Same session/map camera/campaign time on return. |
| R02 | Screen lock during required dialogue | Same unresolved choice; no auto-resolution. |
| R03 | Background during combat targeting | Same pending turn/target; no enemy/background turns. |
| R04 | Background with successful Autosave | Save status only reports success after confirmed write. |
| R05 | Background with storage failure | Current session survives; Autosave failure reported truthfully. |
| R06 | Process kill after unconfirmed progress | Cold restart uses only confirmed persisted data. |
| R07 | Long background duration | No wall-clock campaign time/fatigue/quest progression. |
| R08 | Update becomes ready while hidden | No forced reload on return during required decision. |
| R09 | Audio active before background | Audio pauses/stops appropriately; no duplicate playback on return. |
| R10 | Orientation changes while hidden | Shell reflows; logical map/mode/choice state survives same-session return. |
| R11 | Connectivity changes while hidden | On return, show current state only; no backlog of status spam. |
| R12 | Touch gesture interrupted by notification/app switch | Gesture cancels; no accidental travel/action on return. |

## Test modes

Run where practical in:

- Android browser tab;
- installed/standalone PWA;
- browser with storage writes blocked;
- browser context where service worker/update is available;
- keyboard/screen-reader context for focus restoration.

## Evidence

Record:

- browser/device;
- build identity;
- whether the page survived in the same process or cold-started;
- save state before/after;
- campaign day/hour before/after;
- active scene/combat state;
- audio behaviour;
- pass/fail.

Do not infer process survival from appearance alone; verify using a session marker or equivalent diagnostic when implementation exists.
