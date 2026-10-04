# Grey March terrain atlas

Task: LR-0072 — Produce clean Grey March canonical terrain atlas

## Production asset

`grey-march-terrain-atlas.svg` is the canonical terrain-only source for Map Canon v1.

It is authored in the exact 1200 × 900 logical space defined by `world/map-canon.json` and uses the same pointy-top odd-r coordinate projection.

The terrain placement comes from the existing canonical terrain cells in `content.js`; the SVG does not invent new gameplay geography.

## What is baked into this asset

- terrain masses for plains, hills, mountains, forest and swamp
- topographic illustration marks only
- parchment/grain/atmospheric texture

## What must remain dynamic

Do **not** bake any of these into the terrain source:

- hex-grid lines
- A–I / 1–8 grid references
- settlement/site names or symbols
- roads or route affordances
- party marker
- reachable-hex highlight
- discovery/fog state
- quest markers
- faction/world-state changes

LR-0073 should draw those from canonical/game state on top of this image.

## Projection

Logical canvas: **1200 × 900**.

```text
x = 65 × √3 × (q + 0.5 × (r & 1)) + 104
y = 65 × 1.5 × r + 110.5
```

The atlas may scale with the viewport, but overlays must use the same logical coordinate system before scaling.

## Visual intent

This source is deliberately calmer than the Josh-approved concept art because it is the gameplay terrain layer underneath interaction UI.

The premium direction remains:

- broad readable open land
- strong mountain/forest/swamp masses
- old physical campaign-map character
- muted earth/olive/slate palette
- enough visual breathing room for dynamic labels and interaction states
- warm-gold reserved for game guidance/party emphasis in the overlay layer

Do not add decorative detail that competes with labels at phone zoom.

## Future refinement

A later non-geography-changing texture pass may improve painterly richness, but it must preserve:

1. the same logical canvas,
2. terrain identity around each canonical hex centre,
3. phone readability,
4. the rule that gameplay truth lives in data/overlays, not painted pixels.
