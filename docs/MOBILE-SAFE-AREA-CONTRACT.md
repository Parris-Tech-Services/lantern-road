# Lantern Road Mobile Safe-Area & Floating-Control Collision Contract

Owner: Agent 5 — The Wayfinder  
Task: LR-0081  
Consumers: LR-0009, LR-0040, LR-0074  
Accessibility interaction contract: LR-0051

## Purpose

Phone controls must never be covered by browser safe areas, Lantern Road overlays, or shared external launchers such as the JoshHub podcast/settings dock. This document defines reserved interaction zones and collision rules without prescribing exact runtime CSS or z-index values.

## Supported portrait widths

The contract must hold at:

- 320 px;
- 360 px;
- 390 px;
- 430 px;

and at Standard, Large and Extra Large text sizes.

## Reserved edge zones

### Bottom interaction zone

The lowest interactive region may contain the phone tab bar and must reserve:

- the browser/device bottom safe-area inset;
- the full rendered height of the tab bar;
- additional breathing room so content/action buttons cannot sit underneath the fixed bar.

Scrollable page/modal content must include enough bottom padding to bring its final actionable control fully above this zone.

### Top interaction zone

The top of the page must account for:

- device/browser top inset where exposed;
- Lantern Road top controls/header;
- any transient status surface.

Do not position a floating action over the New Campaign, Save, Load, Settings or close/back controls.

### Corner zones

Bottom-right and bottom-left corners are not free real estate merely because no Lantern Road control occupies them at one text size.

External/floating launchers must be treated as potential occupants. Any optional floating control must relocate, collapse, or hide when it would overlap a higher-priority game control.

## Layer priority

Conceptual priority from highest to lowest:

1. active modal/dialog and its controls;
2. critical confirmation/error surface requiring action;
3. fixed phone navigation and primary game controls;
4. transient feedback/status;
5. optional game utilities;
6. shared/external floating launchers/docks;
7. decorative presentation.

This is ownership priority, not literal z-index numbers.

A lower-priority layer may never solve collision by covering a higher-priority layer.

## Modal rules

When any Lantern Road modal is open:

- modal content owns the interaction layer;
- background map/tabs/top controls are inert according to LR-0051;
- external floating launchers that would overlap modal controls should hide, collapse or move outside the modal action region;
- Close must remain reachable at enlarged text;
- the last modal action must scroll fully above the bottom safe area/tab region.

## Bottom tabs

At phone widths where bottom tabs are fixed:

- tabs reserve their own permanent layout space;
- no page content is allowed to terminate underneath them;
- full-width external docks must sit above them or collapse;
- small external launchers should not occupy the same action strip;
- notification/toast surfaces should prefer a region above tabs rather than covering them.

## Map controls

Map zoom/reset/centre controls must:

- stay inside the visible map/action region;
- not sit under top/header controls or bottom tabs;
- not be covered by feedback toasts;
- remain at least 44 × 44 CSS px where practical;
- relocate or wrap before shrinking below usable size.

## Transient feedback

Feedback/toasts are informational and lower priority than active controls.

Rules:

- never cover modal Close;
- never cover currently required dialogue/combat choice controls;
- never cover fixed phone tabs;
- opening Settings/another modal may clear or relocate an existing transient feedback message;
- long feedback wraps within the viewport rather than extending off-screen.

## Shared external launcher integration

Known launcher/dock patterns include:

- compact floating settings/podcast launcher;
- expanded bottom/right podcast dock;
- launcher surfaces injected outside Lantern Road runtime ownership.

Wayfinder contract:

- on narrow phone layouts, if Lantern Road already exposes a canonical Settings surface that the external integration can use, duplicate floating settings launchers may hide;
- an expanded external dock must clear the Lantern Road bottom-tab reserved zone;
- modal-open state may temporarily hide a dock if it would overlap dialog controls;
- desktop/wide layouts may retain the launcher when no collision exists;
- integrations should use stable hooks/attributes rather than brittle visual guessing where feasible.

Do not delete or disable an external system globally just to solve a Lantern Road collision.

## Text-size interaction

Large/Extra Large text can increase:

- header height;
- tab label wrapping;
- modal Close/action height;
- feedback height;
- settings row height.

Therefore collision checks must use actual rendered bounds, not fixed assumptions from Standard text.

At Extra Large:

- labels may wrap;
- controls may stack;
- optional controls may move;
- content may scroll;

but required actions must not be obscured or clipped.

## Orientation/viewport changes

If the viewport changes:

- reserved zones recompute from actual current dimensions/insets;
- fixed controls remain inside the new visible area;
- an already-open modal remains usable;
- external docks reevaluate collision;
- no stale padding from the prior orientation leaves huge unreachable gaps.

## Safe-area environment values

Where supported, runtime may consume browser CSS environment insets.

Contract:

- insets are additive to required control spacing, not substitutes for it;
- absence of environment values must degrade to sensible ordinary padding;
- code must not assume all Android devices report non-zero insets;
- no gameplay control is allowed to depend on a specific notch/gesture-nav configuration.

## Collision detection acceptance

For each 320/360/390/430 px width, Standard and Extra Large text:

1. open/close Settings;
2. switch all bottom tabs;
3. show a feedback message;
4. open a long dialogue/event;
5. open shop/load chooser;
6. show simulated compact external launcher;
7. show simulated expanded external dock;
8. exercise map controls.

Pass:

- every visible game action remains activatable;
- no element visually covers another required action;
- final scrollable action can be brought fully above fixed controls;
- no horizontal overflow caused by collision workaround;
- external optional surfaces yield to active game controls.

## Implementation handoff

### LR-0009

Preserve:

- Settings/floating-launcher collision handling;
- bottom navigation reserved area;
- modal-over-feedback priority.

### LR-0040

Apply the same reserved zones to:

- install/update/offline/recovery banners;
- app-update prompts;
- any lifecycle status control.

### LR-0074

Apply to:

- atlas zoom/centre controls;
- coordinate/legend overlays;
- party/map labels;
- canonical map floating affordances.

## Acceptance summary

- [x] top/bottom/corner reserved zones defined;
- [x] collision priority defined without hard-coded z-index ownership;
- [x] external dock/settings launcher behaviour specified;
- [x] Standard/Large/Extra Large and representative widths covered;
- [x] handoff provided for LR-0009/LR-0040/LR-0074;
- [x] no runtime CSS implementation included.
