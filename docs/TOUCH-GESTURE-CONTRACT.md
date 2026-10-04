# Lantern Road Touch Gesture Arbitration Contract

Owner: Agent 5 — The Wayfinder  
Task: LR-0080  
Primary runtime consumer: LR-0074  
Accessibility contract: LR-0051

## Purpose

Lantern Road's phone map must distinguish intentional taps from pan, pinch and browser scroll without accidental travel. This document defines interaction rules only; it does not implement the canonical map or own geography.

## Gesture priority

When input begins over the interactive map:

1. one stationary contact may become a tap;
2. one moving contact becomes pan once movement exceeds the tap tolerance;
3. two active contacts become pinch/zoom and cancel any pending tap;
4. browser/page scrolling should remain available outside the map and wherever map manipulation is not deliberately active;
5. critical actions such as travel always have semantic button alternatives.

## Tap versus pan

A pointer-down starts as an **undecided gesture**.

Recommended implementation contract:

- record initial coordinates and time;
- do not travel on pointer-down;
- if movement stays within roughly **8 CSS px** and no second pointer joins, pointer-up may resolve as a tap;
- once movement exceeds the threshold, classify as pan for the rest of that gesture;
- once classified as pan, pointer-up must never trigger travel;
- pointer cancellation, lost capture, context changes or a second pointer cancel the pending tap.

The exact threshold may be tuned after real-phone testing, but should remain small enough for deliberate taps and large enough for natural finger jitter.

## Travel tap

A map tap:

- resolves to a canonical hex through LR-0073 hit-testing;
- may select/focus the current or reachable hex;
- only initiates travel when the tapped target is valid under the map/travel interaction design;
- gives immediate visible feedback before longer travel processing;
- never fires after a pan or pinch sequence.

Where the design requires a second confirmation/select step, the same rule must apply consistently to semantic travel buttons.

## One-finger pan

- pan follows finger movement directly;
- use pointer capture once pan is established so the gesture remains coherent when the finger moves outside the original canvas;
- do not allow page scroll to steal an already-established map pan;
- release/cancel ends the pan immediately;
- no inertial fling is required unless separately approved;
- pan must not alter canonical game coordinates or party position.

## Pinch zoom

When a second pointer joins:

- cancel any pending tap;
- classify the interaction as pinch/zoom;
- preserve the gesture midpoint as the preferred zoom focal point;
- clamp zoom to a documented min/max range;
- ignore transient third/fourth contacts safely;
- when one finger remains after pinch, do not immediately convert the same sequence into travel;
- require a fresh pointer sequence for travel after pinch ends.

## Wheel/trackpad and keyboard equivalents

Desktop/assistive use may offer:

- wheel/trackpad zoom only when intentional and not hijacking ordinary page scroll unexpectedly;
- dedicated Zoom Out / Reset / Zoom In buttons;
- semantic neighbouring travel controls.

No critical action depends on pinch, drag or wheel support.

## Scroll arbitration

### Map surface

When direct map manipulation is active:

- one-finger drag pans the map;
- pinch zooms;
- vertical page scroll should not occur from that established gesture.

### Outside map

Normal document scroll wins.

### Scrollable modal or panel over map

Modal/panel content must scroll normally. The underlying map receives no pointer events while the modal is active.

### Map at min/max zoom

Hitting a zoom boundary must not suddenly convert the same pinch into page zoom or travel. Continue consuming the map gesture until it ends.

## Accidental travel prevention

Required guards:

- no travel on pointer-down;
- no travel if movement exceeded tap tolerance;
- no travel if more than one pointer participated;
- no travel on pointer-cancel;
- no travel from synthetic click events produced after a handled pointer gesture unless deduplicated;
- no travel when a modal overlays the map;
- no travel when the target hex is not eligible;
- no travel when the gesture begins on a map control/button layered over the canvas.

## Control layering

Zoom/reset/centre controls are ordinary buttons and must:

- stop map gesture handling from treating their activation as a canvas tap;
- remain at least 44 × 44 CSS px where practical;
- work with touch, mouse, keyboard and assistive technology;
- remain reachable without precision.

## Browser gesture respect

Lantern Road should not globally suppress browser gestures.

- do not disable pinch zoom for the whole page;
- do not set broad touch-action rules that break normal document scrolling unnecessarily;
- restrict map-specific gesture handling to the map interaction surface;
- browser back/forward gestures at screen edges should not be intentionally overridden unless a proven defect requires a narrow mitigation.

## Gesture state machine

Suggested conceptual states:

- IDLE
- POSSIBLE_TAP
- PANNING
- PINCHING
- CANCELLED

Transitions:

- IDLE → POSSIBLE_TAP on first pointer-down;
- POSSIBLE_TAP → PANNING when movement threshold exceeded;
- POSSIBLE_TAP/PANNING → PINCHING when second pointer joins;
- any active state → CANCELLED on pointer-cancel or invalidation;
- active state → IDLE only after all participating pointers end.

Travel resolution is legal only on POSSIBLE_TAP → IDLE after a valid pointer-up.

## Modal and UI transitions during gesture

If opening a modal, changing tabs or replacing the map surface while a gesture is active:

- cancel the gesture;
- release pointer capture safely;
- clear pending tap/travel state;
- require a fresh gesture after the transition.

## Haptics and sound

Optional haptic/audio feedback may accompany a confirmed travel/select action, but:

- never fires for cancelled pan/pinch;
- never becomes the only confirmation;
- does not delay visual response.

## Real-phone tuning matrix

Test at 320, 360, 390 and 430 px portrait widths:

1. quick deliberate hex tap;
2. slow finger jitter without intended pan;
3. short pan beginning near a reachable hex;
4. long pan across multiple hexes;
5. pinch beginning on a reachable hex;
6. pinch then lift one finger and continue moving the other;
7. map-control tap;
8. pan ending over a reachable hex;
9. pointer interrupted by modal/open-tab change;
10. repeated tap/pan/tap sequences with one thumb.

Pass criteria:

- no unintended travel;
- deliberate taps remain reliable;
- map pan follows the finger;
- pinch does not trigger travel;
- page remains normally scrollable outside the map;
- semantic travel buttons remain available.

## LR-0074 implementation checklist

- [ ] map gesture state is explicit rather than inferred from click timing alone;
- [ ] movement threshold separates tap from pan;
- [ ] pinch cancels tap;
- [ ] synthetic click duplication cannot double-trigger;
- [ ] map controls are excluded from canvas travel handling;
- [ ] modal state cancels/blocks map gestures;
- [ ] semantic travel controls provide non-gesture parity;
- [ ] thresholds are validated on real phone dimensions;
- [ ] gesture handling respects LR-0051 accessibility and LR-0079 responsiveness budgets.
