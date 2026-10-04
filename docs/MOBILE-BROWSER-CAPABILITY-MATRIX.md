# Lantern Road Mobile Browser Capability & Graceful-Fallback Matrix

Owner: Agent 5 — The Wayfinder  
Task: LR-0086  
Consumers: LR-0039, LR-0040, LR-0074  
CI/deployed-smoke ownership remains Agent 1.

## Purpose

Lantern Road should remain playable when an optional mobile-browser capability is missing. This document records which browser/device features are required, optional, or progressive enhancement, plus the expected fallback.

It deliberately avoids claiming browser/version support without real verification.

## Capability classes

### Required for core play

A capability is **required** only when no reasonable fallback preserves the game.

Current expectation:

- standard HTML buttons/forms;
- basic JavaScript execution;
- CSS layout;
- local DOM events;
- Canvas 2D for the current visual map, while semantic travel alternatives remain required.

If a future implementation turns an optional API into a hard requirement, that requires an explicit task/decision.

### Progressive enhancement

Feature may improve experience but core play must remain usable without it.

### Optional convenience

Feature can disappear entirely when unavailable.

## Capability matrix

| Capability | Class | Use | Graceful fallback |
|---|---|---|---|
| Pointer Events | Progressive enhancement | Unified tap/drag/pan handling | Use supported mouse/touch/click path; critical actions remain semantic buttons |
| Multi-touch / pinch | Optional | Map zoom gesture | Zoom Out / Reset / Zoom In buttons |
| Vibration API | Optional | Haptic taps | No vibration; visual/text feedback unchanged |
| Fullscreen API | Optional | Immersive play | Continue in normal browser viewport; hide/disable Fullscreen with explanation |
| Service Worker | Progressive enhancement | Offline shell/update lifecycle | Online browser play continues without install/offline promise |
| Cache API | Progressive enhancement | Offline asset cache | Network-only app shell when service worker/cache unavailable |
| Install prompt event / browser install affordance | Optional | PWA installation | Normal browser play; optional manual instructions only when known-valid |
| Standalone display mode detection | Optional | Adapt installed-app UI | Use normal browser UI |
| localStorage or chosen local persistence backend | Strongly desirable, not launch-blocking by UX policy | Manual Save, Autosave, UI prefs | Allow current-session play where possible; clearly warn saving unavailable |
| Storage quota/persistence APIs | Optional | Better storage diagnostics/persistence request | Use normal persistence attempt/failure handling |
| `env(safe-area-inset-*)` | Progressive enhancement | Notch/gesture-nav spacing | Sensible fixed padding; no assumption that reported inset is non-zero |
| `prefers-reduced-motion` | Progressive enhancement | Reduce decorative motion | Normal restrained motion unless in-game setting requests reduction |
| forced-colors / contrast media signals | Progressive enhancement | Platform accessibility support | In-game High Contrast remains available; preserve semantic borders/text |
| matchMedia | Progressive enhancement | Platform preference detection | Safe defaults and explicit in-game controls |
| Web Audio API | Optional | Ambience/UI audio | Silent play; visual feedback remains complete |
| Page Visibility API | Optional | Pause/refresh nonessential work | Continue safely without visibility optimisation |
| Screen Orientation API | Optional | Orientation awareness/lock | Responsive layout; never require orientation lock |
| Clipboard API | Optional | Copy diagnostic/support info | Selectable text/manual copy fallback |
| Web Share API | Optional | Share support details | Copyable text fallback |
| ResizeObserver | Progressive enhancement | Efficient responsive component updates | Window resize/layout recalculation fallback |
| requestAnimationFrame | Strongly expected web baseline | Smooth visual updates | Correctness first; no game rule may depend on animation frame timing |

## Pointer/touch fallback

Critical interaction must never depend on a precise canvas gesture.

For map travel:

- Pointer Events path may support pan/tap/pinch;
- if multi-touch is absent, zoom buttons remain available;
- if drag support behaves poorly, semantic neighbouring travel buttons still permit movement;
- keyboard/assistive parity follows LR-0051.

Do not add separate gameplay rules for different input APIs.

## Haptic fallback

When `navigator.vibrate` is absent, denied, or throws:

- Haptics setting shows unavailable/disabled as appropriate;
- game actions proceed normally;
- no error modal;
- no missing confirmation because haptics were only supplementary.

## Fullscreen fallback

If Fullscreen is unavailable:

- normal responsive play continues;
- Fullscreen control may be hidden or disabled with **Fullscreen unavailable**;
- no gameplay action is tied to fullscreen state.

If entering fullscreen fails after explicit request, show one concise failure and remain playable.

## Service worker/cache fallback

### Both available

LR-0050/LR-0040 may provide network-first freshness plus cached offline reopening.

### Service Worker unavailable

- game remains an online browser game;
- do not show fake offline-ready status;
- install/offline controls that depend on SW should be absent or explanatory;
- Manual Save may still work if persistence is available.

### Cache API failure

- do not treat campaign saves as lost;
- network use continues when online;
- offline reopening cannot be promised.

Connectivity state and save state remain separate under LR-0077/LR-0078.

## Install fallback

Do not rely on a single install-prompt API.

When browser exposes a trusted install prompt:

- optional Install action may use it.

When it does not:

- core play continues;
- Settings/About may omit Install entirely;
- only show manual install guidance if verified for the browser family being tested;
- no dead Install button.

## Safe-area fallback

Use safe-area environment values when available, but:

- ordinary padding still exists;
- zero/unsupported values are valid;
- controls remain reachable at 320–430 px without a notch-specific assumption.

LR-0081 defines collision ownership.

## Platform preference fallback

### Reduced motion signal unavailable

- use normal restrained motion;
- any explicit in-game Reduce Motion setting still wins when implemented.

### Contrast signal unavailable

- default visual theme remains;
- explicit High Contrast remains available;
- semantic selected/disabled/focus state never depends solely on OS signal.

## Persistence fallback

Storage access can fail for reasons unrelated to connectivity.

When persistence is unavailable:

- allow current-session play where technically safe;
- persistent warning: **Saving unavailable on this browser**;
- Manual Save/Autosave do not falsely report success;
- UI preferences may remain session-only;
- campaign and preferences are treated separately.

Raw storage API errors remain support detail, not player copy.

## Audio fallback

If Web Audio is unavailable or blocked:

- show Sound unavailable or keep sound disabled;
- no error loop;
- combat/travel/UI feedback remains understandable visually/textually;
- saved audio preference may remain but cannot force unsupported playback.

## Browser zoom and viewport

Lantern Road must not depend on disabling user zoom.

Fallback rules:

- if dynamic viewport/safe-area behaviour differs, responsive document scroll remains a safe baseline;
- required controls may stack rather than assume fixed screen height;
- page remains usable with browser UI expanded/collapsed.

## Feature detection policy

Implementation should prefer feature detection over user-agent string branching.

Allowed:

- checking whether an API exists;
- checking whether a call succeeds;
- detecting display mode / media preferences through supported APIs.

Avoid:

- “Chrome means feature X always works”;
- hard-coded browser version assumptions without a documented compatibility reason;
- blocking unknown browsers that satisfy required capabilities.

## Manual compatibility matrix

Do not claim coverage until executed.

Minimum practical matrix once implementation exists:

| Case | Target | Purpose |
|---|---|---|
| A1 | Current Android Chromium/Chrome-family browser on Josh's real phone | Primary phone path: touch, save, SW/cache, settings, map |
| A2 | Android Chromium-based standalone/PWA when installable | Installed lifecycle/update/offline behaviour |
| A3 | At least one non-Chromium mobile browser where available to tester | Verify graceful fallback rather than Chromium-only assumptions |
| A4 | Desktop Chromium with keyboard | Keyboard parity and capability fallback controls |
| A5 | Browser context with service workers disabled/unavailable | Online play fallback |
| A6 | Context with vibration unavailable | Haptic fallback |
| A7 | Context with storage blocked | Save warning/failure truthfulness |
| A8 | Reduced-motion/high-contrast emulation or real platform setting | Platform preference response |

Record:

- browser/device;
- build/commit;
- capabilities observed;
- fallback path used;
- pass/fail;
- screenshots/logs only as needed.

## What not to infer

A successful test on one Android Chromium build does not prove:

- all Samsung/Chrome/WebView variants behave identically;
- install prompts exist everywhere;
- vibration permission/behaviour is uniform;
- storage limits are identical;
- service worker update timing is identical.

Document verified cases, not universal claims.

## Consumer handoff

### LR-0039

Use capability fallbacks for:

- keyboard/input parity;
- accessibility media signals;
- haptic unavailable state;
- focus/semantic controls independent of gesture APIs.

### LR-0040

Use capability fallbacks for:

- installability;
- Service Worker/Cache API;
- offline/update lifecycle;
- storage/unavailable messaging.

### LR-0074

Use capability fallbacks for:

- Pointer Events;
- pinch/zoom;
- safe areas;
- semantic travel alternatives.

### Agent 1 boundary

LR-0064/deployed smoke and other CI tasks may automate selected capability scenarios. This contract does not create CI infrastructure or own deployment verification.

## Acceptance summary

- [x] Pointer Events, vibration, Fullscreen, SW/Cache, install, safe-area, accessibility signals and storage catalogued;
- [x] required/progressive/optional classes and fallbacks defined;
- [x] feature detection/support claims separated from assumptions;
- [x] representative Chromium Android plus non-Chromium/failure cases specified;
- [x] LR-0039/LR-0040/LR-0074 handoffs defined;
- [x] no runtime or CI implementation included.
