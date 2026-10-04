# Lantern Road Canonical Map Inspection, Legend & Coordinate UX Contract

Owner: Agent 5 — The Wayfinder  
Task: LR-0120  
Runtime consumer: LR-0074  
QA consumer: LR-0075  
Canon sources: `world/map-canon.json`, `docs/WORLD-MAP-CANON.md`

## Purpose

The Grey March map should be useful as an actual campaign map, not just a background image.

Players need to understand:

- where they are;
- what they can reach;
- what a marker means;
- how to refer to places consistently;
- what has been discovered;
- what changed in the world;

without turning the illustrated atlas into a wall of labels and UI.

This contract consumes Map Canon v1 exactly. It does not add, move, rename or reveal geography.

## Canon rules this UX must preserve

- Grid is 9 × 8, pointy-top odd-r offset.
- Implementation stores `q/r`; player-facing grid refs are derived as A–I / 1–8.
- Natural place names are primary.
- Grid references are navigation support.
- CANON places come only from canonical data.
- PROPOSED concept-art labels never appear as authoritative gameplay labels.
- Hidden places remain hidden until discovery rules expose them.
- Atlas pixels are not game data.
- Multiple canonical places may share a hex.

## Name and grid-reference hierarchy

### Natural place names first

Normal player-facing label:

**Greyfen Market**

Useful map/detail form:

**Greyfen Market · E5**

Natural narrative/dialogue should normally say:

**Greyfen Market**

not:

**E5**

unless characters are explicitly discussing maps or directions.

### Grid references

Grid references are most useful in:

- map inspection detail;
- optional label metadata;
- Journal objective/location references where navigation precision helps;
- support/QA;
- route comparison;
- coordinate-oriented map legend/help.

Do not put grid refs into every piece of prose.

### Terrain-only hexes

When inspecting a hex without a known named place:

- show grid reference;
- show terrain type;
- show reachability/current-selection state where useful.

Example:

**G4 · Moorland**

Do not invent a place name.

---

## Map inspection versus travel

Inspection and travel are separate intentions.

### Inspect/select

A player may:

- tap/click a hex;
- focus it via semantic map/travel controls;
- activate an **Inspect** affordance where needed.

Inspection:

- does not move the party;
- does not consume time;
- does not trigger travel encounters;
- does not reveal hidden canonical places unless normal discovery rules say they are known;
- may show known terrain/place information.

### Travel

Travel requires a clear travel action.

Preferred pattern:

1. select/inspect target;
2. show target detail;
3. **Travel to [name/grid]** when reachable;

or use the existing explicit neighbouring travel controls.

A single-tap direct-travel shortcut may exist only when accidental travel is adequately prevented under LR-0080.

The UI must make inspection possible without forcing movement.

---

## Current party position

Party position is the strongest persistent marker.

Requirements:

- visually distinct from settlement/site markers;
- available as text: **Party — Hearthwick · B6** or **Party — B6**;
- does not obscure the exact hex/marker underneath;
- semantic **Centre on party** control exists;
- screen reader/map summary exposes current position.

If multiple known places share a hex, party-position detail lists the relevant currently entered/selected place separately from raw hex occupancy.

---

## Settlement and site labels

### Settlement priority

Known settlements are high-priority labels.

At ordinary map zoom:

- show settlement symbol;
- show canonical settlement name where space allows;
- grid ref may be secondary.

### Sites

Known sites may use a smaller visual priority than settlements.

At ordinary zoom:

- important/current/reachable sites may show names;
- other site names may appear on selection/inspection;
- do not force every site label simultaneously if it creates collisions.

### Hidden sites

Canonical hidden places currently include:

- Pilgrim Ford — A7
- Smuggler's Cache — E7

Before discovery:

- no name;
- no icon;
- no blank mysterious label at exact hidden coordinate;
- no grid-specific “unknown site” marker that reveals existence;
- no screen-reader node announcing hidden location.

The underlying terrain hex can remain normally inspectable.

After legitimate discovery:

- site becomes eligible for normal known-site presentation.

---

## PROPOSED concept-art labels

Names in `concept_regional_labels` with status PROPOSED are not gameplay canon.

Do not present them as:

- map labels;
- legend entries;
- screen-reader map landmarks;
- route destinations;
- Journal coordinates;
- support-facing canonical location names.

If concept artwork contains such text visually, the production atlas should remove/bury that text per map-canon/atlas rules rather than relying on UI to explain it away.

---

## Legend model

The legend should be available on demand, not permanently consume phone map space.

Recommended legend categories:

### Party

**Party position**
- unique marker.

### Settlements

**Settlement**
- village/town/post/port distinctions may be decorative/secondary;
- one canonical settlement category must remain understandable.

### Adventure sites

**Site**
- shrine, ruin, bridge, wild site, crossing, tower, cave, inn/cache etc. may use distinct icons only if legend remains understandable;
- avoid requiring memorisation of many tiny glyphs.

### Reachability

**Reachable now**
- outlined/highlighted adjacent/eligible hex;
- state not colour-only.

### Route/road

**Known road/route**
- drawn dynamically;
- visual style should not imply a gameplay route where canonical/system data does not provide one.

### Party-selected target

**Selected**
- clear outline or focus marker.

### Quest/location affordance

**Quest-related location**
- only for information the player has legitimately learned;
- must not reveal hidden/unlearned destinations.

### World-state change

**Changed/affected place**
- optional dynamic marker for meaningful visible consequence;
- must link to a known/canonical place or legitimate known hex state;
- avoid generic icon clutter.

### Discovery/fog

**Unknown / unexplored**
- presentation may obscure terrain/details according to final discovery system;
- hidden canonical sites still receive no special existence hint before discovery.

---

## Marker semantics

Every gameplay-critical marker should have:

- visual shape/icon;
- accessible text label;
- selected/focused state;
- state that does not depend only on colour.

Example accessible labels:

- **Hearthwick, settlement, B6**
- **Old Barrow Keep, site, F4**
- **Reachable hex G5, Weeping Stones**
- **Party at B6, Hearthwick**

Avoid labels containing internal ids like `old_barrow`.

---

## Inspection card / sheet

On phone, selecting a known map target should update a compact map-inspection area in the responsive interaction sheet.

Recommended content order:

1. canonical natural name or terrain/grid title;
2. grid reference;
3. place type/terrain;
4. known contextual status;
5. reachability/travel cost/time where mechanically available;
6. **Travel** action if eligible;
7. optional current quest/world-state note.

Do not replace the whole Context result permanently just because the player inspected a distant hex.

Provide an obvious path back to current location/context.

---

## Desktop inspection

On desktop split-pane:

- map selection updates an inspection section in the interaction pane or lightweight anchored detail;
- no page-level scroll to a distant map-detail section;
- keyboard focus can move between map controls/semantic target list and inspection detail.

---

## Grid reference display

### Map edges / grid overlay

A–I and 1–8 may appear along map edges or in a toggleable coordinate overlay.

Requirements:

- do not cover settlement/site labels;
- remain legible at useful zoom;
- coordinate overlay may simplify/hide at far zoom if the inspection card still reports exact grid ref;
- no coordinate is manually authored independently of q/r.

### Selected target

Always show grid ref in inspection detail.

### Current location

Settings/Context/map detail may show:

**Hearthwick · B6**

where useful.

### Journal

For known objectives:

**Greyfen Market (E5)**

is appropriate when navigation precision helps.

Do not expose a hidden destination's coordinate before the story legitimately reveals it.

---

## Zoom-level decluttering

Conceptual zoom bands:

- **overview**
- **normal**
- **detail**

Implementation may choose exact scale thresholds.

### Overview

Always prioritise:

1. party;
2. major known settlements;
3. selected/current objective;
4. critical world-state marker.

Sites may collapse to symbols or selection-only labels.

### Normal

Show:

- settlements;
- important/reachable known sites;
- party;
- selected target;
- known roads/routes;
- relevant quest/world overlays.

### Detail

May show:

- more site names;
- grid refs;
- terrain details;
- local route detail;
- inspection affordances.

Do not expose additional *knowledge* merely because zoom increased. Zoom changes presentation, not discovery state.

---

## Label collision rules

When labels collide, preserve in this order:

1. current party location;
2. selected/inspected target;
3. active known quest destination;
4. settlement names;
5. reachable/local known sites;
6. other known site names;
7. grid edge labels / secondary metadata.

Allowed responses:

- offset label with leader line where visually appropriate;
- hide lower-priority label until selection/zoom;
- shorten secondary metadata, not canonical natural name;
- use symbol plus inspection detail.

Forbidden:

- move canonical marker to another hex to make room;
- rename place;
- show hidden site because its label would fit;
- bake UI label into atlas.

---

## Reachable target presentation

Reachable hex state should be understandable through:

- outline/shape;
- semantic neighbouring travel buttons;
- optional travel affordance in inspection detail.

Unreachable/invalid target inspection can still be allowed.

If travel is blocked:

- explain why in player language;
- no silent failure.

---

## Roads and routes

Roads are dynamic overlays.

UX rules:

- road visual may improve route readability;
- road line does not itself become a click target unless the travel system explicitly supports route selection;
- known route state should not reveal hidden sites along it;
- if world consequence changes a route, presentation updates from game state rather than repainting atlas.

---

## Discovery and fog

### Unknown terrain/hex

Final fog rules belong to runtime/world design, but UX must:

- not leak hidden markers through accessibility tree;
- not reveal hidden label collision boxes;
- not display hidden location count.

### Newly discovered place

When a place becomes known:

- map marker/label may appear;
- feedback should identify it once;
- map camera may highlight it without forcibly resetting player zoom/pan for long;
- screen reader announcement can say:
  **Discovered: Pilgrim Ford, A7.**

Discovery should be a visible mark of player action/knowledge.

---

## Mutable world-state overlays

Examples may include:

- dangerous route;
- faction consequence;
- blocked crossing;
- changed settlement service;
- quest impact.

Rules:

- overlay attaches to canonical place/hex/route data;
- status has text equivalent in inspection detail;
- icon is not the only explanation;
- old state is removed/replaced cleanly;
- do not create unbounded icon stacks.

At overview zoom, multiple low-priority changes may collapse into one known **changed** indicator whose inspection detail lists specifics.

---

## Quest/location affordances

Quest markers should represent player knowledge, not hidden quest engine state.

Requirements:

- no marker for destination not yet learned;
- multiple quests at same known place may collapse into one marker/badge;
- inspection detail can list relevant known objectives;
- natural place name remains primary;
- quest icon does not cover party/selected state.

---

## Multiple places sharing one hex

Map Canon allows shared occupancy.

UX must support:

- one hex containing more than one known place;
- inspection detail listing multiple known places;
- choosing the intended place/action when relevant;
- no assumption that one marker equals one q/r.

Hidden co-located place remains absent until discovered.

---

## Screen-reader map summary

Provide a concise non-canvas summary.

Recommended structure:

- current position;
- selected target;
- known neighbouring/reachable choices;
- currently relevant known destination;
- optional map-help/legend link.

Do not read every known map label on every rerender.

Example:

**Map. Party at Hearthwick, B6. Reachable: A6 moorland, B5 road, C6 Broken Span… Selected Greyfen Market, E5.**

Actual neighbouring naming depends on canonical/runtime data.

---

## Phone inspection flow

Recommended:

1. map visible;
2. player taps/focuses known hex/site;
3. inspection card appears/updates in STANDARD sheet;
4. map remains visible;
5. player chooses **Travel** or dismisses/inspects another target.

Do not auto-travel merely because inspection detail opened.

---

## Legend access

Phone:

- small **Map legend** text/button in map controls or sheet;
- opens a lightweight detail/FULL_DETAIL surface;
- closes back to exact map camera/inspection state.

Desktop:

- optional collapsible legend near map or interaction pane.

Legend is not permanently overlaid on the atlas.

---

## QA edge cases

- hidden Pilgrim Ford before discovery;
- hidden Smuggler's Cache before discovery;
- two known places sharing a hex;
- selected target under colliding labels;
- Extra Large text;
- High Contrast;
- overview/detail zoom;
- current quest destination;
- changed world-state marker;
- screen reader;
- keyboard-only selection;
- pan/zoom then inspect;
- inspect unreachable target;
- return to party/context.

---

## LR-0074 implementation handoff

Implement:

- inspection separate from travel;
- natural-name/grid-ref hierarchy;
- legend;
- zoom decluttering;
- hidden-site protection;
- shared-hex detail;
- semantic map summary;
- phone inspection card;
- world/quest overlay priority.

Consume LR-0080 gesture rules, LR-0081 safe areas, LR-0082 typography and LR-0108 shell states.

## LR-0075 Warden handoff

Independently verify:

- every visible known place name/ref matches map canon;
- hidden sites do not leak before discovery;
- PROPOSED labels are absent from gameplay;
- inspection cannot accidentally travel;
- grid references match q/r;
- labels remain understandable on phone;
- dynamic overlays do not obscure canonical position.

## Non-goals

This task does not:

- mutate geography;
- approve regional labels;
- move markers to suit art;
- define story discovery triggers;
- define travel cost/mechanics;
- implement map rendering.

## Acceptance summary

- grid reference usage defined;
- inspection/travel separation defined;
- legend/symbol semantics defined;
- zoom/label decluttering defined;
- hidden/proposed geography leakage prohibited;
- shared-hex behaviour defined;
- accessibility and phone inspection flow defined;
- runtime/canon unchanged.
