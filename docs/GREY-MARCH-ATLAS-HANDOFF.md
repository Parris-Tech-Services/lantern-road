# LR-0072 → LR-0073 terrain atlas handoff

Owner of source art: Agent 4 — The Lamplighter  
Integration owner: Agent 1 — The Steward

## Assets

- `assets/art/maps/grey-march-terrain-atlas.svg`
- `assets/art/maps/grey-march-terrain-atlas.json`
- `assets/art/maps/README.md`

## Integration contract

Render the SVG as a non-interactive base image filling the canonical 1200 × 900 logical map plane.

All interactive/game-state visuals remain separate canvas/DOM/SVG overlays using the Map Canon v1 projection.

The atlas itself must never be used for hit-testing.

### Overlay order

Recommended stack:

1. terrain atlas
2. dynamic roads/routes/rivers if gameplay requires them
3. exact hex grid
4. fog/discovery/world-state overlays
5. settlement/site symbols and labels
6. reachable/selectable hex affordances
7. party marker
8. transient feedback

### Mobile behaviour

Wayfinder-owned pan/zoom/tap behaviour should transform the base atlas and all overlays together as one logical map plane.

At phone scale:

- preserve terrain silhouettes rather than tiny texture detail;
- keep labels in the overlay so text remains crisp;
- do not rasterise labels into the atlas;
- never infer click geometry from image pixels.

## QA checks for integration

- Hearthwick B6, Greyfen E5, Candlemere H3, Alderwatch H7 and Blacksalt D8 land on the expected logical hex centres.
- Overlay hex centres match the atlas terrain cells with no row-shift drift.
- odd storage rows r = 1,3,5,7 are visibly half a hex right.
- no interaction changes if the atlas image fails to load.
- replacing the atlas does not alter save-state q/r semantics.
