# Lantern Road Responsive Play-Shell Contract

Owner: Agent 5 — The Wayfinder  
Task: LR-0108  
Research input: LR-0095  
Runtime implementation: LR-0096  
Accessibility foundation: LR-0051  
Touch/safe-area/readability inputs: LR-0080, LR-0081, LR-0082

## Purpose

Lantern Road's core loop should keep **where I am**, **what just happened**, and **what I can do next** visible as one continuous play experience.

This contract turns LR-0095's research recommendation into an implementation-ready shell model. It does not edit runtime code.

The governing rule is:

> The map and active interaction region are separate persistent regions. The player should not repeatedly scroll the document between them.

## Shell regions

The logical shell always contains four concepts even when their geometry changes:

1. **World region** — map, party marker, reachable geography and map controls.
2. **Interaction region** — current result, scene/dialogue, available actions and contextual content.
3. **Compact status region** — day/time and high-value expedition/party state.
4. **Mode navigation** — Context, Journal, Party, Log.

Phone uses a map + bottom-sheet relationship.  
Desktop/tablet uses adjacent map + interaction panes when content fit allows it.

Do not create separate gameplay state models for phone and desktop.

---

## Phone state machine

Phone shell states:

- **PEEK**
- **STANDARD**
- **EXPANDED**
- **FULL_DETAIL**
- **MAP_EXPANDED**

These are presentation states, not campaign states.

### PEEK

Purpose:

- maximise map visibility while preserving awareness of current place/result.

Visible sheet content:

- current location/scene title;
- one-line or compact latest-result summary;
- explicit expand affordance.

Expected map share: roughly 55–70% of usable viewport, depending on status/header needs.

Enter PEEK:

- by explicit player collapse;
- optionally after dismissing secondary information surfaces when no urgent result/choice remains.

Do not auto-collapse to PEEK immediately after a consequential action if the player still needs to read its outcome.

### STANDARD

Default core-loop state.

Visible sheet content:

- current location/scene title;
- latest result/context;
- primary available actions;
- compact requirements/costs where relevant.

Expected map share: roughly 35–50% of usable viewport.

Enter STANDARD automatically:

- after ordinary travel resolves;
- after closing a non-consequential secondary detail;
- after finishing a short local action;
- when returning from Journal/Party/Log to Context.

STANDARD is the main antidote to the map → result → map scroll shuttle.

### EXPANDED

Used when interaction content needs more vertical room but map context should remain partially visible.

Examples:

- longer dialogue;
- multi-choice event;
- shop;
- expanded quest detail;
- complex current-location context.

Expected map visibility:

- retain a visible strip or meaningful portion of map where practical;
- if available height becomes too small, allow the interaction surface to dominate without losing map state.

Enter EXPANDED:

- automatically for content whose primary choices would otherwise begin below a comfortable viewport;
- explicitly when player drags/activates expand;
- when selecting Journal/Party/Log on narrow widths.

### FULL_DETAIL

Used for content whose readability/interaction is harmed by retaining visible map area.

Examples:

- Settings/Accessibility;
- load/save recovery chooser;
- long support/details surfaces;
- potentially dense combat only if implementation proves the expanded sheet is insufficient.

FULL_DETAIL is not a different page/document. It is the shell's dominant interaction state.

Rules:

- preserve underlying map camera/state;
- preserve previous sheet state;
- provide deterministic close/back;
- closing restores the prior useful shell state and focus.

### MAP_EXPANDED

Used when player explicitly wants maximum geography.

Visible:

- map dominates almost all usable viewport;
- compact status remains where it does not obscure map;
- interaction sheet becomes PEEK or compact overlay;
- explicit **Return to context** / collapse action remains available.

Rules:

- map expansion never destroys current scene/result;
- returning restores prior sheet state and scroll position;
- if a required dialogue/combat decision is active, map expansion may be disabled or limited so the player cannot accidentally hide a required choice.

---

## Allowed phone transitions

| From | To | Trigger |
|---|---|---|
| PEEK | STANDARD | tap/activate sheet, new ordinary result, Context action |
| STANDARD | PEEK | explicit collapse when no required decision is hidden |
| STANDARD | EXPANDED | long content, Journal/Party/Log, explicit expand |
| EXPANDED | STANDARD | close/finish long content, explicit collapse |
| Any non-modal shell state | FULL_DETAIL | Settings, save/load recovery, dense support/detail flow |
| FULL_DETAIL | previous state | Close/Back |
| PEEK/STANDARD/EXPANDED | MAP_EXPANDED | explicit map-expand action when allowed |
| MAP_EXPANDED | previous state | Return to context |
| STANDARD/EXPANDED | EXPANDED | dialogue/event/choice content requires room |

Do not transition simply because the browser resized by a few pixels. Presentation should remain stable unless content fit meaningfully changes.

---

## Automatic transition rules

### Travel

Before travel:

- usually STANDARD or PEEK;
- map target visible;
- semantic travel action available.

After travel resolves:

- preserve map camera as much as practical while ensuring party position/destination is visible;
- set interaction mode to Context;
- enter STANDARD;
- place latest travel result at top of interaction region;
- expose next local/travel actions below it.

Do not auto-expand to FULL_DETAIL for ordinary travel.

### Short local action

Examples: rest, rumours, simple item use.

After result:

- remain STANDARD;
- update result at top;
- keep map visible;
- keep the action region stable.

### Dialogue/event

On open:

- preserve map camera;
- enter EXPANDED if content needs space;
- move accessibility focus to scene/dialogue heading under LR-0051.

On branch choice:

- update content in place;
- keep EXPANDED;
- reset interaction-region scroll to the new scene heading unless the branch deliberately appends content.

On close:

- return STANDARD;
- restore logical focus to originating action or Context heading.

### Shop

Enter EXPANDED.

- interaction region scrolls independently;
- map remains non-interactive while modal/exclusive shop focus requires it;
- closing restores STANDARD and originating focus.

### Combat

Preferred phone presentation:

- EXPANDED with map state preserved underneath;
- FULL_DETAIL allowed only if actual combat density requires it.

Combat owns focus while active.

After combat:

- return STANDARD;
- latest result/consequences visible;
- restore map interaction.

### Journal / Party / Log

These modes inhabit the interaction region.

On phone:

- switch active mode;
- enter EXPANDED by default;
- keep world/map state preserved;
- each mode keeps its own interaction-region scroll position during the session;
- returning to Context restores Context's prior useful scroll anchor, not necessarily raw pixel position if content was rerendered.

---

## Desktop/tablet split-pane model

When width/content fit permits, use:

- **World pane:** map and map controls.
- **Interaction pane:** Context/Journal/Party/Log, scenes and actions.
- **Compact status:** shared top/edge surface.

Starting proportion target:

- world: ~55–62%;
- interaction: ~38–45%.

These are design targets, not fixed implementation constants.

### Desktop interaction pane

- owns its own vertical scrolling;
- map pane does not scroll the page vertically as part of normal core play;
- active result/actions appear at a stable top/content anchor;
- tabs switch the interaction pane.

### Desktop dialogue/event/shop

Prefer interaction-pane takeover/transition rather than a full-page modal when sufficient width exists.

Use true modal/exclusive overlay for:

- Settings;
- destructive confirmation;
- save/load recovery;
- content requiring exclusive focus;
- any case where pane presentation fails accessibility or readability.

### Desktop combat

May use the interaction pane if comfortably readable.

If combat needs greater width:

- interaction pane may temporarily widen;
- map pane may reduce but remains stateful;
- full-screen takeover is a last resort and must restore previous split/pane/map state afterward.

---

## Breakpoint rule: content fit, not device names

Do not encode logic as:

- “mobile = phone model”;
- “tablet = 768px”;
- “desktop = 1024px”.

Instead, transition between split-pane and sheet shell when both regions can no longer satisfy their minimum usable widths under the active text/accessibility settings.

Conceptual minimums:

- map must remain meaningfully manipulable/readable;
- interaction pane must fit full action labels without pathological wrapping;
- 44px-class targets must remain usable;
- current result and primary actions should fit without extreme horizontal compression.

Extra Large text may cause the sheet shell to activate at a wider viewport than Standard text.

A small hysteresis/tolerance is recommended so resizing near the threshold does not rapidly oscillate layouts.

---

## Scroll ownership

### Phone core play

- document/body should not be the routine travel-loop scroll surface;
- map region handles pan/zoom, not vertical document scroll;
- interaction sheet owns vertical content scrolling;
- bottom tabs remain outside the sheet's scrollable content;
- status/header remains outside routine sheet scroll where practical.

### Phone FULL_DETAIL

- FULL_DETAIL interaction surface owns vertical scroll;
- underlying map/document is inert/non-scrolling while exclusive focus is active.

### Desktop

- world/map pane: no page vertical scrolling for ordinary map interaction;
- interaction pane: owns vertical content scroll;
- body/page remains fixed or minimally scrolling as required by browser layout, but must not recreate map/context shuttle.

### Nested scroll rules

Avoid:

- a tiny scroll box inside a scrolling sheet;
- combat log scrolling inside a scrolling combat pane unless explicitly collapsed/expanded;
- Journal body inside another scroll container.

One primary vertical scroll owner per visible interaction region.

---

## State preservation model

Presentation state that should survive ordinary rerenders:

- active shell mode: Context/Journal/Party/Log;
- phone sheet state;
- map zoom;
- map pan/camera;
- selected/focused map target where still valid;
- interaction-region logical scroll anchor;
- last focused logical control;
- map-expanded return state.

These are UI/session state, not necessarily campaign-save fields. Persistence policy remains with the relevant implementation tasks.

### Map camera preservation

Do not reset map camera on:

- result feedback;
- tab changes;
- dialogue open/close;
- shop open/close;
- save/status messages;
- ordinary rerender.

Recentre automatically only when:

- new party position is completely outside a useful visible area after travel;
- player explicitly chooses Centre/Reset;
- canonical rendering change makes old camera invalid.

### Interaction scroll preservation

Raw pixel scroll restoration is not always correct after rerender.

Prefer logical anchors:

- scene heading;
- current quest;
- selected party member;
- current Log time block;
- active shop item;
- current combat decision.

---

## Focus preservation

Use LR-0051 modal/focus rules plus shell-specific behaviour.

### Sheet transition

PEEK ↔ STANDARD ↔ EXPANDED:

- do not move keyboard focus merely because geometry changed;
- if focused element remains present, retain it;
- if hidden by collapse, move focus to the sheet expand control.

### Mode switch

Context → Journal/Party/Log:

- move focus to the selected mode's heading or remembered logical control;
- preserve separate remembered focus per mode where practical.

### Map expansion

On MAP_EXPANDED:

- move focus to map heading/control only if the expansion action initiated via keyboard/assistive technology;
- otherwise keep a sensible map control focus target.

On return:

- restore focus to the **Expand map** control or the logical control that initiated expansion.

### Travel result

After travel:

- do not dump focus to document body;
- move focus to latest-result heading/status only when necessary for non-pointer users;
- provide an announcement and then make next actions reachable predictably.

---

## Context mode information order

STANDARD Context order:

1. current location / scene title;
2. latest meaningful result;
3. immediate resource/time/status deltas;
4. primary available actions;
5. supporting local description/details;
6. secondary history.

The active result should not be buried below static description.

---

## Compact status contract

Persistent status should remain small.

Recommended always-visible candidates:

- day/time;
- Gold;
- Rations;
- Fatigue / critical expedition pressure;
- severe party-health warning when relevant.

Do not permanently reserve large space for:

- full inventory;
- full party sheets;
- full Journal;
- long Log;
- support details.

---

## Modal-only surfaces

The following should remain exclusive/modal rather than merely another Context card where appropriate:

- Settings/Accessibility;
- destructive confirmation;
- save/load recovery;
- critical browser/PWA recovery;
- support detail requiring focused action.

When modal opens:

- sheet/map state is frozen/preserved;
- background interaction is inert;
- closing restores the prior shell state.

---

## Browser history/back behaviour

Do not map every sheet snap or tab switch to browser history.

If a later task adds route/history integration:

- browser Back must never silently exit/reload the game instead of closing an active modal/detail;
- history policy must be deliberate and tested separately.

This contract does not require URL routing.

---

## Resize/orientation transitions

When viewport changes:

- preserve campaign state;
- preserve active mode;
- preserve logical interaction anchor;
- preserve map camera;
- transform geometry only.

### Sheet → split pane

- current active mode becomes right pane content;
- sheet scroll anchor becomes interaction-pane anchor;
- map camera remains unchanged.

### Split pane → sheet

- current interaction content becomes sheet content;
- choose STANDARD or EXPANDED based on content type;
- do not reset to PEEK if a required choice/dialogue is active.

---

## Implementation order for LR-0096

1. Create persistent shell regions without changing gameplay handlers.
2. Move Context/Journal/Party/Log into a shared interaction-region controller.
3. Establish phone sheet state machine.
4. Establish desktop split-pane mode.
5. Add content-fit breakpoint evaluation.
6. Preserve map camera across interaction rerenders.
7. Preserve logical scroll/focus anchors.
8. Integrate dialogue/shop/combat/modal transitions.
9. Run real-browser acceptance matrix.
10. Only then tune animation/snap feel.

---

## Non-goals

LR-0108/LR-0096 do not:

- change canonical geography;
- change travel rules;
- change combat mechanics;
- redesign narrative content;
- create a framework rewrite;
- make all surfaces full-screen;
- require gesture-only sheet control.

---

## Acceptance summary

- Phone states and transitions defined.
- Desktop split-pane behaviour defined.
- Content-fit breakpoint policy defined.
- One primary vertical scroll owner per interaction region defined.
- Map camera, mode, scroll-anchor and focus preservation rules defined.
- Context/Journal/Party/Log shell behaviour defined.
- Modal coexistence rules defined.
- Runtime implementation remains LR-0096.
