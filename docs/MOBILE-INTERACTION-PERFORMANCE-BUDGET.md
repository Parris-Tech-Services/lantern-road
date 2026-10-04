# Lantern Road Mobile Interaction Performance Budget

Owner: Agent 5 — The Wayfinder  
Task: LR-0079  
Runtime performance owner: LR-0012  
Map consumers: LR-0073 / LR-0074  
PWA consumer: LR-0040

## Purpose

“Phone-first” needs measurable interaction targets. This document defines player-experience budgets; it does not implement profiling, CI thresholds or runtime optimisation.

Targets apply to representative portrait widths: 320, 360, 390 and 430 CSS px.

## Priority classes

### P0 — immediate acknowledgement

A tap, key press or selected control should show visible acknowledgement by the next rendered frame wherever practical.

Target:

- visible pressed/focus/selected acknowledgement: **within 100 ms**;
- never leave a player wondering whether the input registered.

If the underlying action takes longer, acknowledgement happens first and completion feedback follows.

### P1 — local UI response

For actions that do not require a deliberate narrative pause:

- tab switch first meaningful visual update: **≤150 ms target**;
- modal open/close first meaningful visual update: **≤150 ms target**;
- Settings toggle state: **≤150 ms target**;
- save/load chooser open: **≤200 ms target**;
- ordinary button feedback: **≤200 ms target**.

If an operation will exceed roughly half a second, show explicit in-progress feedback rather than a frozen-looking surface.

### P2 — state-changing gameplay response

Travel, save/load, shop transaction, combat resolution and similar actions may do more work, but:

- input acknowledgement remains P0;
- meaningful result feedback should normally appear **within 500 ms** for local-only work;
- if longer, show a stable progress/busy state without blocking accessibility focus unpredictably.

These are experience targets, not permission to hide correctness problems.

## Map interaction budget

Desired experience on a representative mid-range Android phone:

- pointer-to-pan visual response should feel frame-coupled, with no deliberate debounce;
- target **60 Hz where the device/browser can sustain it**;
- avoid sustained interaction below roughly **45 rendered frames per second** during ordinary pan/zoom;
- no single long task should visibly freeze map manipulation for about **100 ms or more** during direct gesture input;
- pinch/zoom should preserve the gesture focal area without large delayed jumps;
- releasing a pan should settle immediately unless an explicit easing decision exists;
- tap-to-travel feedback must appear before any longer transition work.

LR-0074 owns phone map interaction implementation. LR-0012 owns runtime profiling/optimisation.

## Scroll and modal responsiveness

During normal scrolling:

- avoid script-driven work tied to every scroll event unless scheduled efficiently;
- fixed controls should not visibly lag behind content;
- opening a modal must not trigger a noticeable multi-stage reflow where controls move after becoming actionable;
- Close and primary choice controls should be stable before receiving focus.

## Layout stability

At 320/360/390/430 px, Standard/Large/Extra Large text:

- normal interaction should not cause horizontal page scrolling;
- status/toast appearance should not push critical controls off-screen unexpectedly;
- bottom navigation should keep a stable reserved area;
- image/font loading should not cause repeated large jumps in active controls;
- modal opening may intentionally change layout but its own controls should not continue shifting after focus enters.

Where formal CLS-style measurement is later adopted, Agent 1 may translate this behaviour into CI/performance metrics.

## Orientation and viewport changes

On viewport resize/orientation changes:

- preserve current logical tab/modal/game state;
- first usable reflow target: **≤300 ms** after the browser viewport settles;
- do not reset map position/zoom unless required by the specific map UX contract;
- do not drop focused modal/action control because the viewport changed;
- safe-area changes should not cause controls to animate through unreachable positions.

## Audio/haptic responsiveness

Optional feedback should not block the UI thread.

- haptic request should be issued with the player action, not after unrelated work;
- unsupported vibration must fail silently;
- audio startup/unlock may be asynchronous, but the visual action response must not wait for it.

## Save/autosave responsiveness

LR-0011 owns persistence correctness; LR-0077 owns save/recovery UX.

Performance expectations:

- Autosave scheduling must not visibly interrupt map pan, scrolling or combat input;
- Manual Save must acknowledge immediately and report confirmed success only after persistence completes;
- large serialization/migration work should not leave the player with no visible state;
- migration/repair may legitimately take longer than a normal load, but should show stable progress/status if it becomes perceptible.

## Reduced-device behaviour

On slower hardware:

1. preserve input correctness and readable feedback;
2. reduce decorative motion before reducing information;
3. prefer fewer simultaneous visual effects over delayed controls;
4. never skip save validation, consequences or accessibility semantics to meet a frame budget.

A “performance mode” toggle is not required by this contract.

## Representative measurement scenarios

### M01 — rapid tabs

At each phone width, tap Context → Journal → Party → Log repeatedly.

Pass:

- every tap visibly acknowledges;
- no lost/duplicate activation;
- active content appears without a frozen interval;
- bottom tabs remain stable.

### M02 — map pan/zoom

Perform 10 seconds of continuous pan and pinch/zoom.

Pass:

- no repeated long stalls;
- no accidental travel;
- pan follows input continuously;
- controls remain responsive during/after gesture.

### M03 — modal churn

Open/close Settings, a dialogue, shop and load chooser repeatedly.

Pass:

- each opens/closes promptly;
- focus is not delayed until after visible controls settle;
- no cumulative slowdown.

### M04 — combat actions

Complete several party turns rapidly but intentionally.

Pass:

- selected action acknowledges immediately;
- target controls appear without a confusing pause;
- result feedback appears before the next decision is expected.

### M05 — save under interaction load

Trigger Manual Save after map interaction and during a content-heavy state.

Pass:

- visual acknowledgement is immediate;
- save work does not freeze scrolling/pan;
- success/failure arrives accurately.

### M06 — enlarged text reflow

Repeat tabs/modals/map controls using Extra Large text at 320 px.

Pass:

- responsiveness remains comparable;
- wrapping/reflow does not cause repeated layout thrashing or unusable control movement.

## Handoff to LR-0012

Agent 1 may choose the tooling and metrics used to establish the runtime baseline.

The implementation should specifically investigate:

- long tasks around `renderAll`;
- full-canvas redraw cost during direct manipulation;
- repeated DOM replacement in modal/tab surfaces;
- save serialization/migration duration;
- resize/orientation redraw work;
- audio/animation work competing with interaction.

This document defines the player-facing budget, not the technical fix.

## Handoff to LR-0074

Canonical atlas phone interaction should preserve:

- immediate pan/tap acknowledgement;
- stable centre/reset controls;
- smooth zoom under expected atlas asset size;
- no performance-driven removal of semantic travel alternatives;
- label decluttering that reduces rendering load without hiding critical reachable-location information.

## Acceptance summary

- [x] measurable targets for tap feedback, modals, tabs, map and reflow;
- [x] phone-width stability expectations;
- [x] critical interaction latency separated from background work;
- [x] degraded-device priority order;
- [x] manual measurement scenarios;
- [x] runtime optimisation remains LR-0012-owned.
