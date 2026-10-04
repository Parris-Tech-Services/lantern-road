# Lantern Road UI materials

Task: LR-0124 — Produce UI material, divider and ornament asset pack

These assets are decorative presentation layers. They do not define layout, interaction behaviour, accessibility semantics or content hierarchy.

## Assets

### `parchment-light.svg`

Quiet light parchment for focused reading surfaces, journal-like panels and authored scene cards.

Use sparingly behind longer text. It is designed to tolerate cropping/tiling without exposing a fixed decorative frame.

### `parchment-dark.svg`

Dark ink/leather-adjacent surface for secondary chrome or dark modal framing.

Do not put low-contrast brown text directly over it. Runtime styling owns readable foreground colour.

### `timber-dark.svg`

Low-contrast horizontal timber texture for outer shell/chrome, not body-copy panels.

Avoid stacking timber behind dense controls or long text.

### `divider-lantern.svg`

A scalable horizontal divider with a small lantern/diamond centre motif.

Use between major authored sections, not between every row or list item.

### `corner-flourish.svg`

A restrained 96×96 corner ornament.

Use at most on major panels/title surfaces. It should never become a repeated tile.

The asset may be rotated/mirrored by runtime CSS to create the other corners.

### `lantern-wash.svg`

Transparent radial warm-light wash.

Use as a low-opacity atmosphere layer behind moments of safety, guidance, discovery or title art. Do not use it as a replacement for focus indication or status colour.

## Art-direction rules

The material language should feel like:

- worn field journal;
- practical road gear;
- dark timber;
- ink;
- restrained lantern warmth.

It should **not** feel like:

- faux-medieval theme-park UI;
- heavy carved fantasy frames on every panel;
- noisy parchment behind every control;
- glowing magical UI;
- decorative detail that reduces text contrast.

## Accessibility and UX boundary

Agent 4 owns these decorative assets.

Agent 5 owns:
- whether a surface is readable;
- text/control contrast;
- touch sizing;
- focus indication;
- motion/reduced-distraction behaviour;
- whether decorative layers should be suppressed for accessibility.

Agent 1 owns runtime integration and loading.

A failed decorative asset must never make a control disappear or become unusable.

## Performance

All assets are small inline-friendly SVGs with no external fonts, scripts, remote images or third-party dependencies.

Prefer CSS background-image or ordinary `<img aria-hidden="true">` use. Do not inline dozens of duplicate SVG copies into the DOM unless profiling justifies it.

## Scaling

- parchment/timber: may cover/scale to the target surface;
- divider: preserve its horizontal aspect ratio;
- corner flourish: preserve aspect ratio and rotate/mirror as needed;
- lantern wash: scale freely as a decorative overlay.

## Integration note

This task intentionally does not edit `style.css`, shared runtime code or layouts. Runtime adoption should happen only when the owning integration/UX tasks are ready.
