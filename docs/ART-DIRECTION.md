# Lantern Road visual identity foundation

Task: LR-0002 — Coherent visual identity foundation

## Direction

Lantern Road should feel like a worn field journal lit by a travelling lantern: dark timber and ink around the frame, parchment in focused scenes, muted frontier terrain, and warm gold reserved for guidance, discovery and the party's presence.

The game remains a lightweight phone-first browser RPG. Art should reinforce authored atmosphere without requiring a 3D renderer or large asset bundle.

## Reusable art slots

The runtime now renders a shared `artSlot(kind, id, label)` component for:

- party members
- NPCs
- settlements
- sites
- enemies
- items

Each slot exposes:

- `data-art-kind="<kind>"`
- `data-art-id="<content-id>"`
- a readable text label
- a built-in sigil/monogram fallback

That means missing artwork is intentional rather than broken.

### Supplying final artwork

Artwork can be introduced progressively with CSS rather than changing render code. Example:

```css
.art-slot[data-art-id="garrick"] {
  --art-image: url("assets/art/party/garrick.webp");
}
```

Recommended paths:

```text
assets/art/party/<id>.webp
assets/art/npcs/<id>.webp
assets/art/settlements/<id>.webp
assets/art/sites/<id>.webp
assets/art/enemies/<id>.webp
assets/art/items/<id>.webp
```

Prefer WebP/AVIF where practical and keep mobile download cost low. Art slots must continue to work when an image is absent or fails to load.

## Composition guidance

### Portraits

Party and NPC portraits should be readable at roughly 60–100 px on phones. Prefer bold silhouette, strong face lighting and one memorable prop over detailed backgrounds.

### Settlements and sites

Use landscape crops with a clear focal landmark. Settlement art should feel inhabited; site art should feel uncertain, ruined, sacred, dangerous or strange.

### Enemies

Enemy art should favour silhouette and threat recognition over anatomical detail. A player should distinguish an archetype instantly.

### Items

Use simple icon-like illustrations on quiet backgrounds. Items must remain understandable beside quantity and description text.

## Map language

- gold-edged hex: one legal travel step away
- ◆: settlement
- ✦: discovered site
- dashed lantern ring: current party position
- road/river remain environmental overlays

The map should communicate travel possibility before decorative detail.

## Motion language

Motion is restrained and functional:

- travel: brief map brightness pulse
- damage: short impact nudge
- healing: soft green glow
- status application: warm-gold glow

All motion respects `prefers-reduced-motion`.

## Colour discipline

Warm gold is the primary guidance/accent colour. Green indicates recovery/positive state. Rust-red indicates danger/damage. Blue/grey should stay environmental rather than compete with action states.

Avoid turning every card into a unique colour. Cohesion matters more than spectacle.

## Performance rules

- no mandatory remote image requests
- no image is required for interaction
- avoid animated GIFs/video backgrounds
- prefer a small number of compressed static assets
- retain CSS/sigil fallbacks
- keep effects transform/filter/box-shadow based and short-lived
- mobile browser performance takes priority over decorative animation


## Iconography language

Production UI/map symbols live in `assets/ui/icons.svg`.

The icon language uses simple ink-like geometry, rounded strokes and readable silhouettes rather than glossy fantasy-game badges. Symbols inherit `currentColor` so context can supply accessible contrast and state colour.

Icons are an art layer, not interaction semantics:

- pair critical icons with visible/accessibly named controls;
- do not rely on icon shape alone for important status;
- keep guidance gold, positive green and danger/rust-red as contextual runtime colours rather than permanently painting individual symbols;
- Agent 5 owns control semantics and accessibility; Agent 4 owns the drawn icon family.


## Motion and atmospheric VFX

The production choreography and weather/atmosphere rules live in `docs/MOTION-VFX-DIRECTION.md`, with decorative source layers in `assets/ui/effects/`.

The motion language is deliberately restrained:

- most feedback settles within 80–320 ms;
- continuous decorative animation is exceptional, not default;
- reading and map-inspection surfaces remain mostly still;
- weather/light effects stay low-opacity and contextual;
- every effect has a reduced-motion/static equivalent;
- no visual effect owns gameplay meaning or interaction semantics.

Agent 4 owns visual choreography and decorative VFX; Agent 5 owns interaction/focus/accessibility semantics; Agent 1 owns runtime integration.
