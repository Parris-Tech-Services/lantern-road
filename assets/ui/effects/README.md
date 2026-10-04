# Lantern Road atmospheric VFX source assets

Task: LR-0127

These files are lightweight decorative source layers for later runtime integration.

They contain no gameplay state, text, labels, markers or interaction semantics.

## Files

- `rain-lines.svg` — sparse transparent rain-line texture.
- `fog-wash.svg` — broad low-contrast fog/mist layer.
- `ember-specks.svg` — sparse warm ember dots for camp/hearth scenes.
- `lantern-bloom.svg` — transparent warm local-light bloom.
- `sacred-halo.svg` — subtle pale sacred/uncanny radial atmosphere.

## Rules

- Keep opacity low.
- Never place decorative VFX above readable text unless contrast remains demonstrably safe.
- Do not run multiple continuous layers simply because they exist.
- Reduced-motion mode should use static versions or omit the layer.
- Runtime state/accessibility semantics remain Agent 5/Agent 1 responsibilities.
