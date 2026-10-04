# Grey March Regional Map Canon Contract

Task: **LR-0104**  
Owner: **Agent 7 — The Director**

This contract ratifies the first protected **non-node regional labels** for the Grey March.

Regional labels help the player learn existing country. They do **not** create destinations, travel nodes, coordinates, settlements, sites, roads, factions or new playable territory.

## Canonical regional labels

| Stable id | Canonical name | Existing-world relationship |
| --- | --- | --- |
| `hollowwold` | **Hollowwold** | The rough north-central upland and wind-cut country around **Hollowglass Cavern (E2)**. Watcher's Rest sits on the western approaches; this label creates no new node. |
| `reedmarsh` | **Reedmarsh** | The low southern river-and-reed country linking the existing network around **Pilgrim Ford (A7)**, **Redwater Ferry (C7)**, **Blacksalt Crossing (D8)**, **Smuggler's Cache (E7)** and **Mosslight Ruins (F7)**. |
| `barrow_ridge` | **Barrow Ridge** | The stony rise/high ground around **Old Barrow Keep (F4)**. It replaces the generated “Ashen Ridge” label and does not imply Ashen Veil ownership. |
| `watcherwood` | **Watcherwood** | The western/north-western wooded approaches associated with **Watcher's Rest (B2)**. The name is a travel-landscape anchor, not a new people, settlement or political territory. |
| `greyfen_plain` | **Greyfen Plain** | The central open road country around **Greyfen Market (E5)**, with **Broken Span (D6)** on the wider route pressure. It replaces the generated “Blackfen Plains” label. |
| `stoneveil_heights` | **Stoneveil Heights** | The existing northern mountain/hill high-country and horizon. It replaces “Stoneveil Mountains” specifically to avoid implying a second large explorable mountain campaign. |

These six names are **CANON** landscape vocabulary.

They are subordinate to settlements/sites in map hierarchy and are never clickable gameplay nodes merely because they have names.

## Resolved concept-map labels

| Generated label | Canon decision | Canon result |
| --- | --- | --- |
| Ashen Ridge | **RENAME** | Barrow Ridge |
| Duskwood | **RENAME** | Watcherwood |
| Hollowwold | **ADOPT** | Hollowwold |
| Reedmarsh | **ADOPT** | Reedmarsh |
| Blackfen Plains | **RENAME** | Greyfen Plain |
| Stoneveil Mountains | **RENAME** | Stoneveil Heights |
| Embermere | **REJECT** | No canonical replacement |
| Siltbrook Marsh | **REJECT** | No canonical replacement |
| Mourn Lake | **DEFER** | Non-canon; no lake geography is implied |
| Wyrthen Forest | **DEFER** | Non-canon until an existing coherent forest mass is deliberately identified |

**REJECT** means agents must not reintroduce the generated name as Grey March geography without a new map-canon proposal.

**DEFER** means the name remains non-canon and may not be used as established geography. A later task may reconsider it with new evidence; no approval is implied here.

## No geography mutation

LR-0104 changes **zero** canonical place records and **zero** coordinate semantics.

It does not:

- move any of the 16 CANON settlements/sites;
- alter q/r or A–I / 1–8 mapping;
- add lake terrain;
- join separated forest tiles;
- add a route, road or crossing;
- expand the 9 × 8 playable grid;
- create new saved gameplay ids.

## Machine-readable shape for LR-0105

LR-0105 should extend `world/map-canon.json` with a protected collection shaped like:

```json
{
  "regional_labels": [
    {
      "id": "hollowwold",
      "name": "Hollowwold",
      "status": "CANON",
      "place_type": "region-label",
      "gameplay_node": false,
      "anchor_place_ids": ["hollowglass"],
      "description": "Rough north-central upland and wind-cut country around Hollowglass Cavern.",
      "source_task": "LR-0104"
    }
  ]
}
```

Rules:

- `id` is stable lowercase `snake_case`.
- `name` is the exact canonical display label.
- `status` is `CANON` for the six ratified labels.
- `place_type` is exactly `region-label`; it must not validate as a settlement/site.
- `gameplay_node` is always `false` unless a separate future canon/product decision deliberately creates a node.
- `anchor_place_ids` references existing CANON place ids only; anchors describe relationship and do not confer ownership or coordinates.
- `description` is concise geographic scope language, not a second lore bible.
- `source_task` records the ratification source.

The existing `concept_regional_labels` collection should also record a **disposition** without turning rejected/deferred names into gameplay canon:

```json
{
  "name": "Duskwood",
  "status": "PROPOSED",
  "disposition": "RENAME",
  "canonical_region_id": "watcherwood"
}
```

Allowed LR-0104 dispositions are:

- `ADOPT`
- `RENAME`
- `REJECT`
- `DEFER`

`canonical_region_id` is required only for ADOPT/RENAME.

For DEFER, the generated label remains non-canon. For REJECT, it must not appear in canonical overlays.

## Overlay hierarchy

When LR-0073/LR-0105 are integrated:

1. canonical settlement/site labels remain primary;
2. regional labels are secondary orientation text;
3. regional labels never imply clickability;
4. regional labels must not reveal hidden sites;
5. PROPOSED/DEFERRED/REJECTED concept names never appear as canonical overlays.

This preserves the rule that the painting supports the game data, not the reverse.
