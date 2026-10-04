# Lantern Road Final UI Icon Semantics & Phone Legibility Audit

Owner: Agent 5 — The Wayfinder  
Task: LR-0130  
Source asset: `assets/ui/icons.svg`  
Asset owner: Agent 4 — The Lamplighter  
Runtime consumers: Agents 1 and 5  
Independent QA consumer: Agent 6

## Verdict

The production sprite is structurally suitable for phone/browser integration.

The main remaining risk is **not the SVG artwork itself**. It is runtime misuse: treating small glyphs as self-explanatory controls, using visually similar symbols without text, shrinking a 24×24 glyph into a tiny touch target, or allowing map/status icons to leak hidden or non-canonical meaning.

The correct integration pattern is:

> **Icon = reinforcement. Text/state/context = meaning. Touch target = larger than the glyph.**

## Source audit

Direct inspection of `assets/ui/icons.svg` found:

- **40 symbols**
- **40 unique ids**
- every symbol uses `viewBox="0 0 24 24"`
- no hard-coded per-symbol fill/stroke colour attributes
- colour is inherited via `currentColor`
- only the documented stroke families are present:
  - `1.8` main line
  - `1.35` thin detail
- no external icon library dependency
- symbol ids are grouped coherently into resources, map/places, common actions, and combat/status

### Structural result

**PASS**

No asset-file change is required by this audit.

## Phone-size finding

The 24×24 source geometry is a good runtime basis, but not every icon should be rendered at 16 CSS px.

At 16 CSS px:

- the 1.8 source stroke scales to about 1.2 CSS px;
- the 1.35 thin-detail stroke scales to about 0.9 CSS px.

That means the outer silhouette generally survives, but thin internal detail can become fragile on lower-density screens or under browser scaling.

### Display-size rule

Use these defaults unless a later real-device test proves a specific exception:

| Use | Recommended visible glyph size |
| --- | ---: |
| Primary action control | 20–24 px |
| Map marker / selected target | 20–24 px |
| Status chip with adjacent text | 18–20 px |
| Resource row with visible label/value | 18–20 px |
| Passive redundant decoration | 16 px allowed |
| Anything where thin internal detail carries important meaning | Prefer 20 px+ |

A 16 px icon is acceptable only when the icon is **redundant** with nearby text/state.

## Touch-target rule

The glyph size is not the control size.

For phone interaction:

- target approximately **44×44 CSS px or larger** for repeated/important controls;
- keep at least a comfortable gap between adjacent high-frequency actions;
- centre an 18–24 px glyph inside the target;
- do not make a 20 px SVG itself the only tappable area;
- map markers may be visually smaller than 44 px, but selection/hit regions should be forgiving and a semantic alternative must exist.

## Accessible naming patterns

### Icon inside a visible-text control

Preferred:

```html
<button>
  <svg aria-hidden="true"><use ...></use></svg>
  <span>Save Manual</span>
</button>
```

The visible label is the accessible name.

### Icon-only control permitted by context

Only use when the control is genuinely conventional/space-constrained and the meaning remains unambiguous.

Requirements:

- parent control has an explicit accessible name;
- icon SVG is `aria-hidden="true"`;
- pressed/selected/on/off state is exposed separately;
- tooltip/help text is available where meaning is not universal.

For this production set, icon-only controls should be the exception.

### Status chip

Preferred:

```html
<span class="status-chip">
  <svg aria-hidden="true">...</svg>
  <span>Guarded</span>
</span>
```

The icon reinforces the status. It does not replace the word.

### Semantic map marker

The SVG itself remains hidden from assistive technology. The marker/control carries the semantic name.

Example accessible name:

**Hearthwick, settlement, B6**

not:

**icon-settlement**

## Canonical terminology finding

### Renown

`icon-renown` must be labelled **Renown** in player-facing UI.

Do **not** use it as a generic "reputation" or faction-standing symbol.

The current asset README describes it as "renown / reputation progress"; runtime integration must use the canonical distinction in `docs/TERMINOLOGY.md` and the Director's LR-0121 review:

- **Renown** = canonical player-facing progression term
- **Faction standing** = separate concept

If faction standing later needs iconography, it needs a distinct semantic treatment rather than silently reusing `icon-renown`.

### Warden

`icon-warden` means Warden post / protection authority in map/place context.

It must not be treated as:

- generic Defend action;
- Guarded status;
- faction-standing value.

## Confusable-pair audit

The following pairs/families are visually or conceptually close enough that they should **not** be relied on as standalone phone meaning.

### Warden / Defend / Guarded

- `icon-warden`
- `icon-defend`
- `icon-guarded`

All use shield language.

Required disambiguation:

- map place: **Warden post**
- action: **Defend**
- status: **Guarded**

At 16–20 px, context/text is mandatory.

### Health / Heal

- `icon-health`
- `icon-heal`

Both contain medical/cross language.

Required:

- resource/value label: **HP** / **Health**
- action label: **Heal**

Do not show a plus/cross glyph alone to mean both.

### Settlement / Inn

- `icon-settlement`
- `icon-inn`

Both are building silhouettes.

Required on map inspection:

- **Settlement**
- **Inn** / canonical place name

At overview zoom the settlement category may remain as a marker, but an inn-specific action/location must be named on inspection.

### Site / Renown

- `icon-site`
- `icon-renown`

Both use star-like geometry.

Required:

- map context + accessible label for Site
- text **Renown** for the resource/progression value

Never use icon shape alone to distinguish them.

### Save / Load

- `icon-save`
- `icon-load`

Both are disk-like symbols.

Required visible text in the save/load UI:

- **Save Manual**
- **Load**
- **Manual Save**
- **Autosave**

This is especially important because save/load mistakes can be destructive.

### Bridge / Ford / Ferry

- `icon-bridge`
- `icon-ford`
- `icon-ferry`

These are a crossing family and may be visually compressed at small scale.

Required:

- canonical natural place/type text in inspection;
- grid/name context;
- no standalone crossing glyph as the only travel decision label.

### Shrine / Blessed

- `icon-shrine`
- `icon-blessed`

Both use sacred/cross-like visual language.

Required:

- place context: **Shrine**
- status context: **Blessed**

### Travel / Trade

- `icon-travel`
- `icon-trade`

Both include directional arrow language.

Required:

- action text remains visible on phone primary controls.

## Family-by-family integration contract

## Resource icons

Symbols:

- `icon-gold`
- `icon-rations`
- `icon-fatigue`
- `icon-renown`
- `icon-health`
- `icon-time`

### Rule

These are **secondary visual reinforcement**.

Always expose:

- label or well-established nearby heading;
- current numeric/value state;
- state change in text when consequential.

Good:

**[gold icon] Gold 24**

Bad:

**[coin glyph] 24** with no accessible/context label.

## Map/place icons

Symbols:

- `icon-settlement`
- `icon-site`
- `icon-party`
- `icon-camp`
- `icon-inn`
- `icon-shrine`
- `icon-ruin`
- `icon-bridge`
- `icon-tower`
- `icon-cave`
- `icon-ford`
- `icon-ferry`
- `icon-market`
- `icon-warden`
- `icon-archive`

### Rule

Visible text does not need to be permanently printed beside every marker at every zoom level.

However:

- every interactive marker has a semantic accessible name;
- selected/inspected target shows natural name/type/grid ref;
- legend explains symbol classes;
- hidden places create **no marker and no accessibility node** before discovery;
- PROPOSED map labels never gain authority from icon presence;
- party marker is not colour-only;
- marker category does not replace canonical place name.

`icon-site` must not be used as a mysterious "something is here" hint for hidden sites.

## Common action icons

Symbols:

- `icon-travel`
- `icon-rest`
- `icon-talk`
- `icon-trade`
- `icon-search`
- `icon-journal`
- `icon-inventory`
- `icon-save`
- `icon-load`
- `icon-sound`

### Visible-text requirement

Visible text is required for:

- Travel
- Rest
- Talk
- Trade
- Search/Inspect
- Save
- Load

Strongly preferred for:

- Journal
- Inventory

Sound may use a conventional icon-only compact control only when:

- explicit accessible name says **Mute sound**, **Unmute sound**, or equivalent;
- current on/off state is exposed;
- Settings includes a visible text-labelled sound control.

## Combat/action icons

Action symbols:

- `icon-attack`
- `icon-defend`
- `icon-heal`
- `icon-aim`

Visible action text is required.

Examples:

- **Attack**
- **Defend**
- **Heal**
- **Aim**

Do not replace combat verbs with an icon row on phone.

## Combat/status icons

Status symbols:

- `icon-guarded`
- `icon-blessed`
- `icon-exposed`
- `icon-weakened`
- `icon-injury`

Status text remains visible or otherwise directly available in the current decision surface.

At minimum:

- unit card/status chip exposes the word;
- target accessible name includes consequential status when needed;
- colour is supplementary;
- status icon may disappear in an extremely compact view only if the text state remains.

## High Contrast

Because the sprite inherits `currentColor`, it is well suited to High Contrast integration.

Runtime requirements:

- choose contextual foreground colours that meet the surrounding contrast target;
- do not hard-code semantic colours inside SVG;
- selected/focused/disabled state must alter more than icon colour alone;
- focus belongs on the control/container, not drawn into the glyph;
- platform forced-colour modes must not make all status meaning disappear.

## Disabled state

Do not reduce disabled icons to such low opacity that the label becomes unreadable.

Disabled controls need:

- semantic disabled state;
- readable text;
- reason when not obvious.

The icon may fade, but text/state must remain understandable.

## Pressed / selected state

Examples:

- selected combat action;
- selected map target;
- active sound toggle.

Use a combination of:

- container border/background;
- text;
- `aria-pressed` / selected semantics where applicable;
- icon colour as supplementary cue.

Do not swap icon alone and expect the player to infer state.

## Discovery rules

Map icon integration consumes `docs/CANONICAL-MAP-INSPECTION-UX.md`.

Before discovery of a hidden place:

- no icon;
- no name;
- no hidden accessible node;
- no legend count implying a hidden marker at that coordinate.

After discovery:

- normal canonical icon/name/inspection behaviour becomes available.

## Current party marker

`icon-party` is critical but may appear without a visible nearby word on the map itself.

Required compensating context:

- legend identifies Party;
- current-position text exists in map/context UI;
- screen-reader summary announces party location;
- selected/current marker has a non-colour-only visual treatment.

## Legend use

A map legend should use:

- 20–24 px representative glyphs where practical;
- visible text next to every legend symbol;
- canonical category wording;
- no hidden/proposed place leakage.

## Do not encode gameplay data into the asset

Never modify the SVG sprite to contain:

- coordinate;
- place name;
- quest state;
- discovery state;
- faction value;
- save state.

The sprite is a visual vocabulary. Runtime/canonical data supplies meaning.

## Runtime integration checklist

Before the production sprite is considered integrated:

- [ ] shared sprite referenced once rather than duplicated into bespoke variants without reason;
- [ ] action/status/resource/map uses match this semantic classification;
- [ ] icon SVGs inside labelled controls are `aria-hidden`;
- [ ] no raw icon id becomes player-facing text;
- [ ] no critical action uses glyph-only meaning;
- [ ] interactive glyphs sit inside phone-sized targets;
- [ ] Renown remains distinct from faction standing;
- [ ] Warden/Defend/Guarded remain distinct;
- [ ] Health/Heal remain distinct;
- [ ] Save/Load remain explicitly labelled;
- [ ] hidden canonical places have no pre-discovery icon/node;
- [ ] High Contrast and disabled states remain understandable without colour alone;
- [ ] Extra Large text does not shrink glyph/control targets to compensate;
- [ ] map markers remain readable/inspectable at phone zoom levels;
- [ ] status text remains available in compact combat;
- [ ] icon loading failure does not remove the text/action meaning.

## Findings to route

### No artwork defect requiring Agent 4 rework

The source set passes the structural audit.

### Runtime integration requirements

Agent 1/5 integration should enforce:

1. shared accessible icon component/helper where architecture supports it;
2. icon + text patterns for critical controls;
3. standard glyph-size classes distinct from touch-target size;
4. map marker semantic labels;
5. status/action state on the surrounding control, not the glyph;
6. canonical terminology mapping.

### Independent QA

Agent 6 should validate on real devices/browsers rather than accepting source geometry alone.

## Acceptance result

LR-0130 audit conclusion:

**PASS WITH INTEGRATION CONSTRAINTS**

The sprite is ready to consume. The constraints above are required to keep it phone-readable and semantically safe.
