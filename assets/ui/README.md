# Lantern Road UI iconography

Task: LR-0121 — Produce final UI iconography and map symbol asset set

Production sprite: `assets/ui/icons.svg`

## Visual language

The icon set belongs to the same visual identity as the rest of Lantern Road:

- simple ink-like geometry
- rounded line caps and joins
- restrained detail
- readable silhouette before ornament
- no glossy game-icon gradients
- no dependency on an external icon font/library
- inherits `currentColor` so runtime context controls contrast

Most symbols use a 24 × 24 viewBox and should remain legible around 16–32 CSS px.

## Accessibility rule

**Icons never replace critical text.**

Runtime consumers should pair icons with visible text or an accessible label unless the surrounding control already has an unambiguous accessible name.

Examples:

```html
<button aria-label="Save game">
  <svg aria-hidden="true"><use href="assets/ui/icons.svg#icon-save"></use></svg>
  <span>Save</span>
</button>
```

For a purely decorative icon, set the SVG to `aria-hidden="true"`.

Agent 4 owns the drawn symbol. Agent 5 owns whether/where a control needs text, accessible naming, touch sizing or interaction-state treatment.

## Resource icons

| ID | Meaning |
| --- | --- |
| `icon-gold` | gold / money |
| `icon-rations` | trail rations / food supply |
| `icon-fatigue` | party fatigue |
| `icon-renown` | renown / reputation progress |
| `icon-health` | HP / health |
| `icon-time` | campaign time / day-hour |

## Map and place icons

| ID | Meaning |
| --- | --- |
| `icon-settlement` | generic settlement |
| `icon-site` | discovered/interesting site |
| `icon-party` | current party position |
| `icon-camp` | camp/rest point |
| `icon-inn` | inn / wayhouse |
| `icon-shrine` | shrine / sacred site |
| `icon-ruin` | ruin / old structure |
| `icon-bridge` | bridge / span |
| `icon-tower` | tower / lookout |
| `icon-cave` | cavern / cave |
| `icon-ford` | shallow crossing |
| `icon-ferry` | ferry / river crossing |
| `icon-market` | market / trade focus |
| `icon-warden` | warden post / protection authority |
| `icon-archive` | archive / scholarly location |

These icons do **not** make a location canonical. Map identity and placement come from `world/map-canon.json`.

## Common action icons

| ID | Meaning |
| --- | --- |
| `icon-travel` | travel / move |
| `icon-rest` | rest / sleep |
| `icon-talk` | conversation |
| `icon-trade` | buy/sell/exchange |
| `icon-search` | inspect/search/scavenge |
| `icon-journal` | journal / context record |
| `icon-inventory` | inventory/equipment |
| `icon-save` | save |
| `icon-load` | load |
| `icon-sound` | sound/audio |

## Combat and status icons

| ID | Meaning |
| --- | --- |
| `icon-attack` | attack / strike |
| `icon-defend` | defend / guard action |
| `icon-heal` | healing |
| `icon-aim` | aimed/ranged precision |
| `icon-guarded` | guarded status |
| `icon-blessed` | blessed/positive sacred status |
| `icon-exposed` | exposed/vulnerable status |
| `icon-weakened` | weakened status |
| `icon-injury` | injury / lasting harm |

## Colour discipline

The sprite itself is monochrome and inherits colour.

Recommended runtime colour semantics remain:

- neutral/default: normal text/ink colour
- warm gold: guidance, discovery, current party emphasis
- green: recovery/beneficial state
- rust-red: danger/damage/negative status
- environmental blue/grey: map/environmental context

Do not permanently colour individual SVG symbols in the sprite.

## Usage restrictions

- Do not use different icons to silently change established terminology.
- Do not use icons as substitute for touch target size.
- Do not make an icon the only indicator of a status if colour/shape could be missed.
- Do not put gameplay coordinates or place identity into these art assets.
- Do not duplicate the sprite into multiple bespoke files unless the integration has a measurable performance reason.

## Integration ownership

- **Agent 4:** visual form, consistency, art additions.
- **Agent 5:** interaction semantics, accessibility, control labelling, touch behaviour.
- **Agent 1:** runtime loading, caching, markup/component integration.
- **Agent 6:** independent legibility and player-experience QA.
