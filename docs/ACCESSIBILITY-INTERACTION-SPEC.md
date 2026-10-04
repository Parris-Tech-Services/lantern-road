# Lantern Road Accessibility & Interaction Contract

Owner: Agent 5 — The Wayfinder  
Task: LR-0051  
Primary consumers: LR-0039, LR-0022, LR-0029  
Status: implementation contract; this file does not itself change runtime behaviour.

## Purpose

Lantern Road is phone-first, but phone-first must not mean pointer-only. Every critical game loop must remain operable and understandable through touch, keyboard/non-pointer input and assistive technology without requiring precision on the canvas.

This contract defines the interaction behaviour LR-0039 should implement after the architecture gate. Agent 6 then black-box validates the result through LR-0022 and LR-0029.

## Core rules

1. **No canvas-only critical action.** The map canvas may remain the visual map, but travel must also be available through ordinary semantic controls.
2. **One action, one understandable state.** Selected, disabled, loading, success and failure states must be exposed visually and semantically. Colour alone is never the only signal.
3. **Focus follows the player's task.** Opening a modal moves focus into it; closing returns focus to the control that opened it or a sensible equivalent.
4. **Modal background is not interactive.** While a modal is open, keyboard and assistive-technology focus must not escape into controls behind it.
5. **Announcements are concise.** Announce important changes once. Do not make entire logs or frequently rerendered regions live.
6. **Touch and keyboard paths must converge on the same game action.** Alternate controls may look different, but they must call the same underlying travel, shop, dialogue and combat behaviour.
7. **Accessibility preferences are additive.** Text size, contrast, reduced motion and optional haptics must never hide information or become required to understand an event.
8. **Phone-first means reachable and readable, not merely responsive.** Primary repeated controls should remain comfortable one-handed and must not be obscured by floating controls, browser safe areas or enlarged text.

## Keyboard and non-pointer interaction contract

### Travel and map

The visual map canvas may support tap, drag and zoom, but it must not be the only way to move.

Required non-pointer equivalent:

- render the six neighbouring travel options as ordinary focusable buttons when travel is possible;
- each travel button uses the same travel validation and consequence path as a map tap;
- labels identify direction plus destination meaningfully, for example: **Travel northeast to Moorland** or **Travel west to Hearthwick**;
- unavailable travel controls explain the blocking reason in nearby text or an accessible description rather than silently doing nothing;
- the current position is exposed outside the canvas as text, for example **Current position: Hearthwick**;
- map zoom out, centre/reset and zoom in controls remain ordinary buttons and work with Enter/Space;
- panning the visual canvas does not expose any action that is unavailable through semantic controls.

Canvas semantics:

- treat the canvas as a labelled map image, not as a fake grid of invisible buttons;
- its accessible name should identify the region and current position;
- nearby travel controls provide the actionable semantics;
- avoid creating dozens of synthetic screen-reader nodes for every decorative hex unless a later task establishes a real navigable map-grid model.

### Major information tabs

The canonical tabs remain **Context**, **Journal**, **Party**, **Log**.

Implement them as one coherent tab set:

- container uses tab-list semantics;
- each tab exposes selected state;
- Left/Right Arrow moves through tabs;
- Home/End moves to first/last tab;
- Enter/Space activates the focused tab if selection does not follow focus;
- only the active panel is exposed as the current tab panel;
- visible focus must remain obvious in Standard, Large and Extra Large text modes;
- the phone bottom-tab presentation and wider-screen presentation are the same logical tab set, not duplicate separately focusable controls.

### Settlement/site actions

Actions such as **Rest**, **Travel**, **Trade/Visit the market**, **Talk**, **Camp**, item use and site choices must be native buttons or equivalent semantic controls.

- Enter/Space activates the same handler as touch/click.
- Disabled actions must use a real disabled state and, where the reason is not obvious, provide readable explanatory text.
- A blocked/no-op action must not silently mutate state.
- After an action rerenders the current panel, focus should stay on the same logical action when it still exists; otherwise move to the nearest stable heading or next sensible action.

### Shops

Opening a market creates a modal dialog.

Within the shop:

- Buy and Sell controls are ordinary buttons.
- Item name, price, owned quantity and disabled reason are available in the same reading order as the action.
- Repeated purchase/sale rerenders should preserve focus on the same item action where possible.
- If an item becomes unavailable after purchase, focus moves to the item heading or next enabled item rather than disappearing to the document start.
- Escape and the visible **Close** control close the shop and return focus to the original **Visit the market** control.

### Dialogue and site/event choices

- Choice buttons follow the authored visual order.
- Focus enters the dialog at its heading, then proceeds to the choice list.
- Disabled choices remain understandable; requirements such as a missing item must be conveyed in text, not only by disabled styling.
- Enter/Space selects the focused choice once.
- After a choice replaces the dialog contents, focus returns to the new dialog heading so screen-reader users hear the new scene before encountering the next choices.
- Escape may close a dismissible dialogue/event only when closing is a valid game action. It must not bypass a required consequence or combat.

### Compact combat

Combat must be fully completable without pointer targeting.

Turn structure:

- when a party turn begins, announce once: **Garrick's turn, round 2** (using the current member/round);
- action buttons are keyboard reachable in authored order;
- choosing an action that needs a target marks that action as selected semantically and moves focus to the first valid target;
- target buttons include enough context to decide, for example **Target Mire Hound, 7 of 12 HP, Exposed**;
- dead or invalid targets are disabled and skipped by normal Tab navigation;
- after resolving an action, focus moves to the next player decision point, not back to the document start;
- enemy turns announce the acting enemy and the important result once; do not make the entire combat log an always-live region;
- if combat temporarily has no player action, focus remains within the combat dialog and does not move to controls behind it.

Combat state such as **Guarded**, **Blessed**, **Exposed** and **Weakened** must be available as text, not only colour or iconography.

## Modal focus contract

Applies to dialogue, travel/camp events, shops, Settings/Accessibility, load/save selection and combat.

### On open

1. Record the element that opened the modal when one exists.
2. Mark the modal as a labelled dialog.
3. Make the page behind it non-interactive to keyboard and assistive technology.
4. Move focus to the modal heading or a deliberately chosen first decision when immediate action is more appropriate.
5. Do not auto-focus a destructive confirmation button.

### While open

- Tab and Shift+Tab cycle only through focusable controls inside the active modal.
- Hidden/disabled controls are not part of the cycle.
- Background map, tabs and top-bar controls cannot receive focus.
- Nested competing modals are not created; replace or transition the active modal state instead.

### Close/Escape

- Escape closes only dismissible modal states.
- Combat cannot be escaped through the generic modal shortcut.
- Required consequence choices cannot be bypassed through Escape.
- The visible Close button and Escape execute the same close behaviour when both are allowed.

### Focus return

Return focus in this order:

1. the original opener if it still exists and is enabled;
2. the same logical action after rerender;
3. the relevant section heading;
4. a stable top-level control for that surface.

Never drop focus to the browser chrome or document body without a deliberate fallback.

## Screen-reader semantics and announcements

### Static structure

- one page-level heading for **Lantern Road**;
- meaningful section headings for map, current context and modal content;
- canonical labels from `docs/TERMINOLOGY.md`;
- no internal ids, save keys or implementation terms exposed as player-facing labels.

### Map/travel

Expose a compact text summary containing:

- current position;
- current day/time where relevant;
- available neighbouring travel choices;
- known settlement/site name when discovered, otherwise meaningful terrain/direction wording.

The canvas itself should be labelled but not treated as the sole navigation structure.

### Feedback and state changes

Use one polite status channel for short consequential feedback such as:

- **Travelled to Hearthwick. Day 3, 14:00.**
- **Manual save updated.**
- **Not enough gold to rest here.**
- **Mira is now Guarded.**

Rules:

- replace/update the current status message rather than stacking repeated announcements;
- do not place the entire Log tab, combat log or frequently rerendered status strip in a live region;
- use assertive announcement only for a critical blocking/error state that genuinely requires immediate interruption;
- purely decorative animation/sound/haptic feedback has no separate announcement if equivalent text already conveys the outcome.

## Touch and one-handed phone contract

Representative portrait widths:

- 320 px — narrow minimum support case;
- 360 px — common compact phone;
- 390 px — common modern phone;
- 430 px — large phone.

### Targets

- repeated primary touch targets should aim for at least **44 x 44 CSS px**;
- preserve spacing between adjacent high-frequency actions to reduce accidental taps;
- do not rely on tiny canvas hexes when an equivalent large travel button can be presented;
- icon-only controls require an accessible name and a visible tooltip/label where meaning is not obvious.

### Reachability

- the primary information tabs should remain in the lower thumb-reachable region on narrow phones;
- frequent travel/choice/combat actions should appear in the natural content flow without requiring precision at the top corners;
- modal Close must remain reachable when content is long or text is enlarged;
- no floating launcher or external dock may cover an actionable game control;
- account for safe-area insets at the bottom edge.

### Accidental action prevention

- **New Campaign** and other destructive/resetting actions require a confirmation when an existing run/autosave would be replaced;
- confirmation buttons must be separated clearly from cancel/keep-playing controls;
- drag/pan gestures on the map must not accidentally trigger travel unless the gesture resolves as an intentional tap.

## Text-size and reflow contract

Supported in-game settings:

- Standard;
- Large;
- Extra Large.

At all three sizes, and at 320/360/390/430 px portrait widths:

- no horizontal page scroll is introduced by normal player-facing content;
- action labels wrap rather than clip;
- buttons remain large enough to activate;
- modal headings and Close remain visible/reachable;
- tabs remain distinguishable and selected state remains clear;
- combat cards may stack vertically rather than shrink text;
- long dialogue can scroll inside the page/modal without trapping the player away from choices.

Do not disable browser zoom or pinch zoom.

## Contrast and non-colour state

- Normal text should target at least 4.5:1 contrast against its background.
- Large text and meaningful UI boundaries should target at least 3:1 where applicable.
- Focus indicators must remain clearly visible in both default and High Contrast modes.
- Selected/active/disabled/combat status state uses text, shape, border or icon in addition to colour.
- High Contrast mode must not remove hierarchy or make disabled controls indistinguishable from enabled controls.

## Reduced motion and haptics

Respect `prefers-reduced-motion: reduce`.

When reduced motion is active:

- remove or substantially shorten non-essential transitions, pulsing, camera easing and combat flourish;
- state changes still appear immediately through text/border/icon feedback;
- no essential timing or information may depend on animation completing.

Optional haptics:

- are off by default unless a later explicit decision changes that;
- are never the sole feedback channel;
- failures or unsupported vibration APIs are silent and never block play.

## Save/load and Settings interaction

Although deeper save schema work belongs to LR-0011, the interaction contract is:

- **Manual Save** and **Autosave** are named distinctly wherever the player chooses between them;
- loading a slot does not silently overwrite the other slot;
- load/save success or failure is announced once and visible on screen;
- Settings/Accessibility is a labelled modal with the same focus-trap/return rules as other dialogs;
- current text-size, contrast and haptic state is exposed with selected/on/off semantics, not only visual styling;
- a visible version/build identifier remains readable but must not become the initial focus target.

## Implementation handoff to LR-0039

LR-0039 should treat this file as the behavioural contract and may change markup/CSS/runtime structure to satisfy it after LR-0009 and LR-0010 are complete.

Recommended implementation order:

1. modal focus manager and background inertness;
2. semantic travel alternatives to canvas interaction;
3. tab semantics/keyboard behaviour;
4. shop/dialogue/site focus preservation;
5. combat action/target focus and concise announcements;
6. screen-reader map/status semantics;
7. text/contrast/reduced-motion verification against the matrix in `QA/ACCESSIBILITY-MOBILE-MANUAL-MATRIX.md`.

## QA ownership boundary

This contract defines intended behaviour. It does not certify that the game currently satisfies it.

- LR-0039 owns implementation.
- LR-0022 independently black-box exercises every visible action/navigation path.
- LR-0029 independently black-box tests phone one-handed usability.
- Agent 6 records reproducible failures rather than silently editing Wayfinder runtime code.
