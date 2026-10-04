# LR-0131 Mobile Audio Controls QA Matrix

Contract: `docs/MOBILE-AUDIO-CONTROLS-AUDIT.md`

## Configurations

- 320×700 phone viewport
- 390×844 phone viewport
- Extra Large text
- High Contrast
- keyboard-only browser
- screen reader
- Android phone browser
- installed PWA where available
- Web Audio unavailable/disabled context where testable

## Core controls

| ID | Scenario | Expected |
| --- | --- | --- |
| A01 | First launch | Sound defaults Off; no autoplay. |
| A02 | Enable Sound | Requires/uses player gesture; visible confirmation; actual audio context reaches running state or failure is shown. |
| A03 | Disable Sound | All continuous/cue output stops; preference Off; gameplay unchanged. |
| A04 | Ambience Off | Continuous ambience stops; short action cues remain available. |
| A05 | Sound Off + saved Ambience On | Ambience control clearly explains subordinate disabled state. |
| A06 | Volume 28→0 | Sound remains logically On unless user toggles master; UI exposes 0% clearly. |
| A07 | Volume range keyboard | Arrow keys adjust value with visible focus; intuitive value announced. |
| A08 | Volume range touch | Thumb/track usable one-handed without precision. |
| A09 | Extra Large | Labels/slider remain reachable without horizontal overflow. |

## Lifecycle

| ID | Scenario | Expected |
| --- | --- | --- |
| L01 | Background while ambience running | Continuous audio suspends/stops appropriately; preference remains On. |
| L02 | Return same session | Actual AudioContext state checked; resumes only when allowed. |
| L03 | OS/browser suspends context | UI does not falsely assume cached boolean means running. |
| L04 | First resume gesture fails | Later safe gesture can retry without toggling preference Off/On. |
| L05 | Screen lock/unlock | No duplicate ambience nodes; preference preserved. |
| L06 | Process eviction/reopen | Preference reloads; autoplay still waits for permitted gesture. |
| L07 | Update/reload | Audio does not interrupt save/update safety flow. |

## Accessibility

| ID | Scenario | Expected |
| --- | --- | --- |
| X01 | Screen reader Sound | Announces Sound + on/off/unavailable state once. |
| X02 | Screen reader Ambience | Announces state and reason when unavailable due master Sound Off. |
| X03 | Screen reader Volume | Announces Sound volume and understandable percent value. |
| X04 | High Contrast | Toggle/focus state visible without colour only. |
| X05 | Muted play | Every gameplay-semantic cue has visible equivalent. |
| X06 | Reduced motion + audio On | Audio remains independently configurable. |
| X07 | Mono output | No gameplay information depends on stereo location. |

## Outcome semantics

| ID | Scenario | Expected |
| --- | --- | --- |
| O01 | Blocked action | Visible blocked reason exists; sound only reinforces it. |
| O02 | Manual Save success | Any save-success cue occurs only after confirmed persistence. |
| O03 | Manual Save failure | No success cue; visible failure. |
| O04 | Autosave | No repetitive cue spam. |
| O05 | Combat muted | Turns, damage, heal and statuses remain fully understandable. |
| O06 | Audio asset failure | Procedural fallback or silence; gameplay continues. |

## Persistence

| ID | Scenario | Expected |
| --- | --- | --- |
| P01 | Preference write succeeds | Reload preserves Sound/Ambience/Volume. |
| P02 | Preference write fails | Current-session setting may apply, but UI does not falsely claim persistence. |
| P03 | New Campaign | Audio preferences remain device/UI preference and are not reset with campaign. |
| P04 | Load different save | Audio preferences remain unchanged. |

## Evidence

Record:

- build identity;
- browser/device;
- PWA/browser mode;
- audio context state before/after;
- Sound/Ambience/Volume preference state;
- whether output was audible;
- accessible name/value;
- screenshot for layout/focus issue;
- pass/fail.

Agent 6 should independently run player-facing cases after LR-0032/LR-0040 runtime integration.
