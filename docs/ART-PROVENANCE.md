# Lantern Road AI art provenance

Task: LR-0042 — Generate and style-lock the Lantern Road AI art set

## Style-lock batch

Generated in ChatGPT with OpenAI image generation on 2026-10-04.

The accepted direction is an original premium-indie fantasy illustration language: worn field-journal mood, lantern-lit frontier atmosphere, muted parchment and earth palette, weathered greens, smoky blues, practical travel gear, restrained warm-gold highlights, semi-realistic figures, strong silhouettes, and subtle ink/gouache texture.

This direction is intentionally original. Do not prompt for imitation of a named living artist, existing game franchise, copyrighted character, or logo.

## Accepted hero images

| Asset | Subject | Generation ID | Notes |
| --- | --- | --- | --- |
| `assets/art/source/style-lock-lineup.webp` | Garrick, Mira, Oren, Brindle lineup | `12af3b57-04de-43a2-ab3c-95754257caa5` | Primary style anchor |
| `assets/art/source/garrick.webp` | Garrick | `d321adb8-a730-457d-bede-0dabd457c111` | Lantern-bearing veteran protector |
| `assets/art/source/mira.webp` | Mira | `ac93354b-f679-4aeb-9ff9-bc9c6733eb42` | Hooded scout and archer |
| `assets/art/source/oren.webp` | Oren | `e22e5039-7fe7-4c5e-9b45-f7dd97edd8da` | Healer-scholar / shrine adept |
| `assets/art/source/brindle.webp` | Brindle | `859251de-24c8-4eba-b700-bc7f55469c09` | Scrapper-tinker |

The repository copies in this branch are lightweight WebP review previews derived from the accepted generated PNGs so the art can be reviewed directly in GitHub without adding multi-megabyte source files during the style-lock pass. Full-resolution generated originals remain the source for the downstream LR-0031 crop/compression/integration pass.

## Master style specification

Use this as the visual baseline for subsequent LR-0042 generations:

- polished 2D painted fantasy illustration
- subtle ink-and-gouache / field-journal texture
- muted parchment, earth brown, weathered olive, smoky slate-blue palette
- warm lantern gold used as a focal accent rather than a global wash
- practical frontier clothing and equipment with visible wear
- believable low-fantasy silhouettes rather than ornate high-fantasy costume
- atmospheric Grey March ruins, roads, pines, shrines, wagons and distant lights
- semi-realistic faces and anatomy
- strong readable silhouette at phone portrait sizes
- expressive but restrained character acting
- no text, UI, logos or decorative frame in production portraits
- no direct imitation of existing games, films or named artists

## Character anchors

**Garrick:** broad-shouldered veteran roadwarden/protector, rugged dark beard, worn layered armour and green-brown travelling cloak, lantern and shield, steady and dependable.

**Mira:** lean sharp-eyed scout/archer, hooded olive cloak, dark braid and loose windswept hair, bow/quiver, watchful and economical in movement.

**Oren:** thoughtful healer-scholar/shrine-trained adept, dark wavy hair and beard, round spectacles, cream and deep-blue layered robes, book, satchel, charms and herbs.

**Brindle:** compact quick-fingered scrapper-tinker, messy auburn/red curls, freckles, goggles, patched rust-and-brown clothing, tools, small blades and lantern hardware, mischievous but capable.

## Drift rejection rules

Regenerate an image rather than accepting it when:

- a hero no longer resembles the accepted anchor
- costume becomes ornate court/high-fantasy instead of practical road gear
- palette becomes saturated/neon
- rendering becomes glossy 3D, anime, photorealistic photography, or flat vector art
- backgrounds overpower the subject at small size
- generated symbols resemble a recognisable real-world/copyrighted logo
- hands, weapons or faces are visibly malformed enough to distract in the intended crop
- the image cannot remain readable at approximately 80–120 px wide

## Next production targets

After the hero style lock: major settlements and adventure sites, then enemy archetypes, priority recurring NPCs and priority items. LR-0031 owns final selection, crop, compression and integration into the existing art-slot system.


## Grey March map direction locked with Josh

Josh approved the first generated Grey March map concept as the stronger direction: broad visible landmass, clearer terrain separation, lakes, forests, rivers, villages, marshes and mountain boundaries, with a restrained old-atlas/hex-campaign feel.

The player should receive an old physical map early in the tutorial, plausibly from a tavern owner. The broad geography can therefore be visible from the start without magical fog-of-war. Exploration should enrich, correct and annotate the map rather than create the geography from nothing.

For the production gameplay atlas:

- the canonical game data remains authoritative;
- the painted terrain base must align to the real hex topology;
- do not bake gameplay-critical roads, labels, settlement/site markers, party position, discovery state, fog, quest markers or mutable world state into the raster;
- dynamic overlays own the actual hex grid, labels, roads, markers and interaction affordances;
- the physical-map feeling should survive zooming and phone use;
- minor old-map inaccuracies or handwritten annotations may be used as authored flavour only when they do not misrepresent interaction-critical geography.

This direction is now represented by LR-0069 (Director map canon), LR-0072 (Lamplighter canonical terrain atlas) and downstream integration work. Do not create a duplicate map architecture task.


## Grey March map concept provenance

Accepted concept reference:

- `assets/art/source/grey-march-approved-concept.webp`
- OpenAI image-generation id: `b3410a9d-8e18-43fb-8399-5108304d1045`
- Status: **approved visual direction, non-canonical geography**
- Josh preferred this first concept over the darker second alternative because it offers more open land and clearer terrain separation.

Important: generated labels, roads, settlement placements and terrain geometry in this concept are **not canon**. LR-0069 owns canonical geography and LR-0072 will produce the clean gameplay-aligned atlas from that registry. This file is retained only as a visual-direction reference.
