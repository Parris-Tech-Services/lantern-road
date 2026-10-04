# Lantern Road art asset production contract

Task: LR-0129 — Author illustration composition, crop and export production contract  
Owner: Agent 4 — The Lamplighter

## Why this exists

Lantern Road already has a consistent illustration style and reusable art slots, but production art needs exact crop/export rules.

The current runtime reaches these small phone cases:

- art-entry slots: approximately **58 px** on narrow phones;
- party/card art: approximately **76–92 px**;
- wide location art: approximately **112–138 px tall**.

Therefore the production test is not “does the full-size painting look good?”

It is:

> **Does the subject remain instantly readable after CSS `background-size: cover` crops it into the smallest real phone slot?**

## General source rules

- Keep an untouched high-resolution master.
- Never generate text, UI, labels, frames or badges into the art.
- Keep the gameplay-relevant subject away from the outer crop zone.
- Use one dominant focal subject/landmark.
- Avoid high-frequency background clutter around faces, silhouettes and item edges.
- Preserve enough contrast to read when reduced to phone size.
- Do not sharpen tiny delivery assets so aggressively that edges halo.
- Do not upscale a weak source merely to meet dimensions.

## Crop safety model

All raster art is assumed to be displayed with responsive `background-size: cover`.

### Universal safe zones

Unless a category below is stricter:

- keep essential subject information inside the central **70% width**;
- keep essential subject information inside the central **72% height**;
- nothing important should depend on the outer 10% of any edge;
- decorative environment may extend to the frame.

The outer area is **bleed**, not information space.

## Party portraits

**Runtime use:** 58–92 px square-ish slots.

**Master**
- aspect: 1:1 preferred;
- minimum master: 1536 × 1536;
- preferred working master: 2048 × 2048 or larger.

**Composition**
- head-and-shoulders / upper torso;
- face centre roughly 42–48% from the top;
- eyes must stay inside the central 45% width;
- head, signature prop and silhouette remain readable without background context;
- keep at least ~12% headroom/side bleed for responsive cover crops.

**Readability test**
- downsample/crop to 58 × 58;
- identity must remain obvious by face/hair/headwear/prop/silhouette;
- no essential hand-held item may disappear at the crop edge.

**Provisional delivery**
- 512 × 512 WebP;
- target <= 80 KB;
- AVIF may be used only when browser support/integration proves worthwhile.

## NPC portraits

Use the party portrait contract unless the NPC is intentionally represented by a wider environmental portrait.

**Master:** 1536 × 1536 minimum.  
**Delivery:** 384–512 px square, target <= 70 KB.

Recurring NPCs should receive stronger silhouette/prop differentiation than incidental NPCs.

## Enemy art

**Runtime use:** small encounter/combat art.

**Master**
- aspect: 1:1 preferred;
- minimum master: 1536 × 1536.

**Composition**
- single archetype;
- silhouette occupies roughly 55–78% of canvas height;
- threatening/readable pose, not a complex action tableau;
- keep weapon/threat-defining anatomy inside central 72% width;
- background low-detail and subordinate.

**Readability test**
- 58 × 58 and 76 × 76;
- archetype must remain distinguishable from the other enemy families.

**Delivery:** 512 × 512 WebP, target <= 90 KB.

## Item art

**Master**
- aspect: 1:1;
- minimum master: 1024 × 1024.

**Composition**
- one object or one tightly grouped kit;
- object occupies ~60–78% of frame;
- quiet neutral/transparent-looking background treatment;
- strongest edges separated from background value;
- no decorative inventory card frame baked into art.

**Readability test:** 48–58 px.

**Delivery:** 320–384 px square WebP, target <= 45 KB.

## Settlements

**Runtime use:** wide location establishing art.

**Master**
- aspect: 16:9 preferred;
- minimum master: 2048 × 1152;
- preferred: 2560 × 1440.

**Composition**
- one dominant landmark/approach;
- landmark centre kept inside central 55% width;
- horizon generally between 35–55% height unless the location brief requires otherwise;
- foreground may be cropped heavily;
- no essential building/sign/person in outer 18% width;
- tiny figures are scale/atmosphere only, never required content.

**Phone crop test**
- evaluate at approximately 300 × 112;
- the settlement identity must still read without labels.

**Delivery:** 1280 × 720 WebP, provisional target <= 180 KB.

## Adventure sites

Use the settlement wide-art geometry, but with a clearer singular point of interest.

**Master:** 2048 × 1152 minimum.  
**Delivery:** 1280 × 720 WebP, provisional target <= 170 KB.

The defining strange/dangerous feature must remain inside the central 50% width and 65% height.

## Scene/event illustrations

When a later scene uses art outside the standard slots:

- default master: 3:2 or 16:9;
- preserve central 65% as semantic safe area;
- do not place critical visual storytelling solely at one edge;
- create a separate crop variant if the narrative composition cannot survive cover cropping.

Do not force a cinematic painting into a tiny art slot.

## Title / key art

LR-0122 owns final production, but sources should follow this contract.

Create two intentional compositions rather than one universal crop:

### Phone portrait
- master: 1800 × 2400 minimum (3:4);
- title/menu safe zone: upper/central region as defined by LR-0122;
- major character/lantern focal subject should survive 9:16 viewport crop.

### Landscape / desktop
- master: 2560 × 1440 minimum;
- preserve clear negative space for title/menu;
- do not rely on a central title baked into raster art.

Provisional delivery targets:
- portrait 1080 × 1440, <= 260 KB;
- landscape 1600 × 900, <= 260 KB.

## Grey March terrain atlas

The canonical atlas is governed by LR-0072 / Map Canon v1, not the generic responsive cover rules.

Do not crop or resize it into a new logical coordinate system during art production.

Its 1200 × 900 logical projection remains authoritative for overlay alignment.

## Lighting and contrast

### Portraits / enemies
- strongest local contrast belongs to the face/head/threat-defining silhouette;
- avoid deep black clothing merging into dark backgrounds;
- lantern warmth may accent but should not blow highlights.

### Locations
- focal landmark should differ from surrounding terrain in value, edge density or warm/cool contrast;
- atmosphere is welcome, but fog/rain cannot erase the location read;
- do not put all important structure into low-contrast mist.

### Items
- clear edge separation;
- avoid elaborate patterned backgrounds.

## Small-size rejection test

Before accepting an asset, produce these previews:

- portrait/enemy: 58 × 58;
- portrait/card: 76 × 76;
- larger card: 92 × 92;
- wide location: 300 × 112;
- item: 48 × 48.

Reject or recrop if:

- face/eyes vanish;
- archetype silhouette becomes ambiguous;
- key prop is cut off;
- landmark becomes unreadable;
- item turns into an indistinct blob;
- background detail dominates the subject;
- image relies on generated text to communicate identity.

## Export pipeline

Preferred sequence:

1. retain source/master;
2. choose approved crop;
3. resize once from master;
4. convert to browser delivery format;
5. visually inspect at target phone size;
6. record file size;
7. retain fallback sigil behaviour;
8. record provenance.

Do not repeatedly resave/recompress already compressed production files.

## Formats

Preferred:
- WebP for normal raster production;
- AVIF may be evaluated where integration/browser support justifies it;
- PNG only for genuine transparency or lossless requirements;
- SVG only for authored vector UI/map/material assets.

No JPEG requirement exists unless testing proves it materially better for a specific asset.

## Provisional size targets

These are **Art Director targets**, not CI enforcement. LR-0065 may ratify/adjust them with measured bundle evidence.

| Category | Delivery target | Provisional target |
| --- | --- | ---: |
| Party portrait | 512 × 512 WebP | <= 80 KB |
| NPC portrait | 384–512 square WebP | <= 70 KB |
| Enemy | 512 × 512 WebP | <= 90 KB |
| Item | 320–384 square WebP | <= 45 KB |
| Settlement | 1280 × 720 WebP | <= 180 KB |
| Site | 1280 × 720 WebP | <= 170 KB |
| Key art portrait | 1080 × 1440 | <= 260 KB |
| Key art landscape | 1600 × 900 | <= 260 KB |

A visually unacceptable image does not become acceptable because it is under budget.

## Naming

Production raster names use canonical content ids:

```text
assets/art/party/garrick.webp
assets/art/npcs/tessa_reed.webp
assets/art/settlements/hearthwick.webp
assets/art/sites/saint_rhel.webp
assets/art/enemies/road_brigand.webp
assets/art/items/lantern_oil.webp
```

Avoid:
- `final2`;
- `new`;
- model-generated random filenames;
- artist/style names in production filenames.

## Provenance

For every accepted authored/generated raster retain:

- canonical asset id;
- source/master reference;
- generation id or source record where applicable;
- crop/export date;
- derivative dimensions;
- codec/file size;
- approval/rejection status;
- notes about regeneration or manual edits.

LR-0042's art manifest may hold generation history; LR-0031 should record the final production derivative.

## Generation rejection criteria

Reject rather than force-crop if:

- essential subject lies in the outer crop zone;
- pose/landmark only works in the uncropped master;
- generated text/signage is prominent;
- costume/world details contradict canon;
- style drifts from the approved house style;
- foreground/background clutter destroys 58 px readability;
- face/prop anatomy cannot survive normal crop;
- lighting makes the subject merge into the UI;
- a location cannot be recognised without its generated label.

## Responsibility boundaries

### LR-0042
Generate/source art against these composition rules.

### LR-0031
Select, crop, compress, export and integrate the final approved production assets.

### LR-0065
Turn measured file-size/integrity requirements into CI checks.

### Agent 5
Own runtime readability/accessibility/layout behaviour.

### Agent 4
Own image composition, crop quality, palette/silhouette consistency and final visual acceptance.
