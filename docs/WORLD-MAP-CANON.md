# Grey March Map Canon

Owner: **Agent 7 — The Director**  
Final creative authority: **Josh**

This document defines how Lantern Road treats geography as canon.

The short version:

> **The game data is authoritative. The painting is the visual layer.**

The illustrated Grey March map may be replaced, repainted or restyled. Canonical place identity and gameplay coordinates do not move with the pixels.

## Canonical coordinate model

The current Grey March is a **9 × 8 pointy-top odd-row offset hex grid**.

The implementation stores positions as `q` and `r`, but those fields are not pure axial coordinates. Existing code treats them as odd-r offset coordinates and converts them to cube coordinates when calculating hex distance.

Do not reinterpret or migrate them merely to make the terminology more mathematically fashionable.

Human-facing grid references are deterministic:

- columns `q = 0…8` are **A…I**;
- rows `r = 0…7` are **1…8**;
- `grid_ref = column(q) + (r + 1)`.

Examples:

| Canonical place | q/r | Grid ref |
| --- | ---: | --- |
| Hearthwick | 1,5 | **B6** |
| Greyfen Market | 4,4 | **E5** |
| Candlemere | 7,2 | **H3** |
| Alderwatch | 7,6 | **H7** |
| Blacksalt Crossing | 3,7 | **D8** |
| Moonmere Tower | 8,4 | **I5** |

The complete **place and regional-label** registry is `world/map-canon.json`. LR-0104's protected regional-label decisions are defined below and in `design/REGIONAL-MAP-CANON-CONTRACT.md`; LR-0105 mirrors those decisions into the machine-readable registry/schema and CI enforcement.

### Map Canon v1 place index

| Grid | q/r | Canonical place | Type | Visibility |
| --- | ---: | --- | --- | --- |
| **A7** | 0,6 | Pilgrim Ford | site / ford | hidden |
| **B2** | 1,1 | Watcher's Rest | site / inn | visible |
| **B6** | 1,5 | Hearthwick | settlement / village | visible; starting location |
| **C4** | 2,3 | Saint Rhel's Shrine | site / shrine | visible |
| **C7** | 2,6 | Redwater Ferry | site / crossing | visible |
| **D6** | 3,5 | Broken Span | site / bridge | visible |
| **D8** | 3,7 | Blacksalt Crossing | settlement / river-port | visible |
| **E2** | 4,1 | Hollowglass Cavern | site / cave | visible |
| **E5** | 4,4 | Greyfen Market | settlement / town | visible |
| **E7** | 4,6 | Smuggler's Cache | site / cache | hidden |
| **F4** | 5,3 | Old Barrow Keep | site / ruin | visible |
| **F7** | 5,6 | Mosslight Ruins | site / ruin | visible |
| **G5** | 6,4 | Weeping Stones | site / wild | visible |
| **H3** | 7,2 | Candlemere | settlement / scholar-town | visible |
| **H7** | 7,6 | Alderwatch | settlement / warden-post | visible |
| **I5** | 8,4 | Moonmere Tower | site / tower | visible |


If the canonical map is deliberately expanded later, column lettering continues J, K, L … Z, AA, AB, and so on. Expansion itself requires a controlled map-canon change; a large painting is not permission to create empty geography.

## Canon statuses

**CANON** means the place identity and coordinate are approved and protected.

**PROPOSED** means a candidate from concept art, Storyteller work or a design proposal. It may be discussed and developed, but agents must not write gameplay or persisted state that assumes it exists.

**RETIRED** means a formerly canonical place was deliberately removed through the controlled change process. Its id remains reserved for compatibility and historical references.

## Canonical places

All existing settlements and sites in the current game are frozen into Map Canon v1 at their existing coordinates.

That includes Hearthwick, Greyfen Market, Candlemere, Alderwatch, Blacksalt Crossing, Watcher's Rest, Saint Rhel's Shrine, Old Barrow Keep, Broken Span, Weeping Stones, Redwater Ferry, Moonmere Tower, Mosslight Ruins, Hollowglass Cavern, Pilgrim Ford and Smuggler's Cache.

A hex may legitimately contain more than one authored place. For example, hidden sites can coexist with another location in the same gameplay hex. CI must validate explicit registry/data agreement, not assume one-place-per-hex.

## The approved visual direction

Josh approved the **first Grey March concept map** shown on 4 October 2026 as the stronger visual direction.

What we are carrying forward from it:

- broad readable terrain;
- strong separation between mountain, forest, lake, marsh and open-country masses;
- a physical old-world campaign-map feel;
- enough breathing room that roads and settlements feel embedded in geography rather than floating on a UI;
- restrained fog/atmosphere that supports navigation rather than obscuring it.

The generated labels on that concept were **not automatically canon**. LR-0071 reconciled them and LR-0104 ratified the Director decision.

### Canonical non-node regional labels

These landscape names are now CANON:

- **Hollowwold** — north-central upland around Hollowglass Cavern;
- **Reedmarsh** — southern river-and-reed country around the existing ford/ferry/crossing/marsh network;
- **Barrow Ridge** — high ground around Old Barrow Keep;
- **Watcherwood** — western/north-western wooded approaches anchored by Watcher's Rest;
- **Greyfen Plain** — central open road country around Greyfen Market;
- **Stoneveil Heights** — existing northern hill/mountain high-country and horizon.

They are orientation/lore labels only. They do not create gameplay nodes, coordinates or new territory. Their machine-readable records live in `world/map-canon.json.regional_labels`; each record is non-clickable, coordinate-free, and may anchor only to existing CANON places. See `design/REGIONAL-MAP-CANON-CONTRACT.md`.

Resolved concept-map names:

- **Ashen Ridge → Barrow Ridge**
- **Duskwood → Watcherwood**
- **Blackfen Plains → Greyfen Plain**
- **Stoneveil Mountains → Stoneveil Heights**
- **Hollowwold** and **Reedmarsh** are adopted unchanged.
- **Embermere** and **Siltbrook Marsh** are rejected.
- **Mourn Lake** and **Wyrthen Forest** are deferred and remain non-canon.

A generated or deferred label may not be treated as established geography merely because it appears in concept art or proposal prose.

## Illustrated map architecture

The final map is layered.

### 1. Terrain atlas

Agent 4 owns the authored terrain artwork.

The clean gameplay atlas may contain:

- mountains;
- forest masses;
- lakes, rivers and marsh terrain;
- plains, hills and coastline/edge terrain where applicable;
- non-gameplay-critical landmark silhouettes and texture.

It must **not** permanently bake in gameplay-critical:

- settlement/site names;
- grid coordinates;
- roads used for travel logic;
- party position;
- reachable-hex highlights;
- fog/discovery state;
- quest markers;
- mutable faction/world-state markers.

### 2. Canon/data layer

`world/map-canon.json`, plus canonical gameplay content, defines place identity and coordinates.

Agent 1's LR-0070 will make disagreement between those sources a CI failure.

### 3. Dynamic overlay

The game draws these separately over the atlas:

- mathematically exact hex grid;
- A–I / 1–8 references where useful;
- canonical settlement and site labels/symbols;
- canonical regional labels as secondary orientation text sourced from `regional_labels`;
- roads and route affordances;
- party marker;
- reachable-hex outlines;
- discoveries and fog of war;
- quest/location affordances;
- world-state changes.

That allows the game world to change visibly without repainting the base atlas.

For LR-0073 rendering, regional labels are subordinate to place labels, never clickable, never authoritative for travel, and must not reveal hidden site ids. REJECT/DEFER concept labels are excluded from canonical overlays.

## Projection contract

Map Canon v1 defines a logical **1200 × 900 (4:3)** authoring/rendering space.

It mirrors the existing pointy-top odd-r layout using a logical hex size of 65:

```text
x = 65 × √3 × (q + 0.5 × (r & 1)) + 104
y = 65 × 1.5 × r + 110.5
```

The whole logical canvas may be scaled, panned and zoomed. The formula remains stable.

Agent 1 may encapsulate this formula cleanly during LR-0073, but changing canonical q/r meaning or moving places to suit pixels is out of scope.

## Ownership

**Agent 7 — Director**
- owns map canon, coordinate vocabulary and approval of canonical geography changes;
- keeps the registry, map protocol and design decisions coherent;
- escalates genuine creative geography choices to Josh.

**Agent 1 — Steward**
- owns schema/CI enforcement and the atlas-backed rendering architecture;
- does not decide what places are called or where they belong.

**Agent 2 — Storyteller**
- owns lore and may propose regional/location names;
- cannot make a proposal canonical merely by using it in prose.

**Agent 4 — Lamplighter**
- owns terrain-atlas visual production and map presentation art;
- may propose geography visually but cannot silently move or rename canonical places.

**Agent 5 — Wayfinder**
- owns phone pan/zoom/tap/label usability and coordinate presentation;
- does not own geography.

**Agent 6 — Warden**
- independently verifies the player-visible map against canon;
- reports mismatches rather than editing canon.

**Agent 3 — Mechanist**
- consumes canonical geography for travel, encounter and economy systems;
- does not create or relocate geography as part of balance work.

## Rule for all agents

If a task needs a town, site, road destination or named region that is not already CANON:

1. search `world/map-canon.json`;
2. if absent, treat the new geography as a proposal;
3. do not assign it a gameplay coordinate or persisted identity in an unrelated feature PR;
4. route the proposal through the map-canon change protocol.

“It's on the painting” is not evidence that something is canonical.
