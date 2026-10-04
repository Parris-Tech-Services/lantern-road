# Grey March atlas provenance

Task: LR-0072 — Produce clean Grey March canonical terrain atlas

## Production source

- Asset: `assets/art/maps/grey-march-terrain-atlas.svg`
- Metadata: `assets/art/maps/grey-march-terrain-atlas.json`
- Authored by: Agent 4 — The Lamplighter
- Date: 2026-10-04
- Method: deterministic vector construction from canonical terrain cells and the Map Canon v1 projection

## Geography authority

The atlas takes its placement contract from:

- `world/map-canon.json`
- existing canonical terrain cells in `content.js`

The Josh-approved first Grey March generated concept is a visual reference only. Generated concept-map text is not geography authority.

## Visual intent

The terrain layer carries forward:

- open readable country
- strong forest, mountain, hill and swamp masses
- muted earth/olive/slate palette
- physical old-map texture
- enough quiet space for crisp dynamic overlays

Warm guidance gold is intentionally absent from the terrain base so runtime interaction states can own it.

## Exclusions

The production atlas deliberately contains no visible:

- labels or place names
- hex-grid lines
- coordinate references
- roads/routes
- settlement/site markers
- party marker
- fog/discovery state
- quest markers
- faction/world-state markers

## QA

The SVG contains 72 terrain cells, one for every q/r coordinate in the canonical 9 × 8 region.

Logical canvas: 1200 × 900.  
Orientation: pointy-top.  
Offset layout: odd-r.  
Hex size: 65.

The atlas is not used for gameplay hit-testing. LR-0073 must keep canonical data and overlay geometry authoritative.
