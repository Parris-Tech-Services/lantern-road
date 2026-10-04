# Lantern Road audio and atmosphere direction

Task: LR-0003 — Audio and atmosphere foundation

## Identity

Lantern Road should sound intimate, weathered and close to the traveller: wind in grass, rain on canvas, low room tone, distant timber and water, restrained combat impacts, and occasional tonal colour rather than constant cinematic music.

Silence remains a valid way to play. Audio is enhancement, never required information.

## Current runtime foundation

The browser runtime uses the Web Audio API to provide a zero-download fallback layer:

- weather ambience for drizzle, wind and storms
- environmental beds for settlements, forest, hills/mountains, swamps, sacred places and ruins
- a darker combat bed
- restrained UI, travel, hit, heal, status, combat-start, victory and defeat cues

These sounds are intentionally simple procedural layers. They establish the mixing, preference and interaction contract so authored audio can replace or augment them later.

## Player control

Audio follows four rules:

1. Sound is off by default.
2. Enabling sound requires a player gesture and therefore respects browser autoplay restrictions.
3. Sound enabled/disabled, ambience enabled/disabled and master volume persist locally.
4. Ambience can be disabled while retaining short action cues for reduced-distraction play.

No gameplay outcome may depend on hearing a sound.

## Future authored assets

Recommended structure:

```text
assets/audio/
  ambience/
    weather/
    settlements/
    wilderness/
    sites/
  cues/
    ui/
    combat/
    travel/
  music/
```

Prefer compressed browser-friendly formats such as Opus in WebM/Ogg with a broadly compatible fallback only where necessary.

Authored loops should enter through the existing audio preference/master-volume system and fall back to procedural sound if a file is missing or fails.

## Ambience design

Atmosphere should be layered rather than one giant loop.

### Weather

Weather is a shared layer that can continue across location changes:

- clear: near-silence; let location carry the scene
- drizzle: soft broadband rain texture
- wind: low-mid gusting with space between stronger movements
- storm: heavier wind/rain and occasional distant low-frequency movement

Avoid frequent thunder stingers. Repetition becomes obvious quickly.

### Location families

- settlements: timber room tone, distant voices, cart/forge/animal detail used sparingly
- forest: leaves, branches, insects/birds appropriate to the setting
- swamp: wet air, water movement, insects/frogs, uneasy low bed
- ruins: exposed wind, stone resonance, subtle distant movement
- sacred sites: quieter noise floor with restrained tonal resonance
- road/plains: open air and weather, deliberately sparse

Named major locations can later receive one distinctive signature element rather than an entirely separate soundscape.

## Cue language

Cues should be short and functional:

- UI: quiet confirmation, never arcade-like
- travel: light upward motion
- hit: short low impact
- heal: soft rising tone
- positive/status: warm restrained chime
- combat start: low warning
- victory: brief resolving interval
- defeat: descending low interval

Avoid cue spam. Ordinary reading, scrolling and map inspection should remain quiet.

## Music direction

A future score should be restrained and adaptive, not a continuous soundtrack.

Useful states:

- road / reflective
- settlement / safety
- danger / combat
- revelation / sacred or uncanny
- late-campaign pressure

Short motifs or stems that can enter and leave cleanly are preferable to long tracks that fight the text-heavy play experience.

## Mixing and mobile rules

- Preserve strong headroom; phone speakers distort easily.
- Ambience should sit well below interaction cues.
- Keep low-frequency energy restrained.
- Test with phone speakers as well as headphones.
- Avoid sudden large loudness changes.
- Loops must have clean boundaries with no clicks.
- Pause/tear down unused nodes rather than stacking sound indefinitely.
- Do not start audio until a user gesture unlocks the AudioContext.
- Keep the master volume and mute path authoritative for all future assets.

## Accessibility and reduced distraction

Visual reduced-motion and audio are independent. A player may prefer reduced motion but still want sound.

The dedicated Ambience control is the reduced-distraction audio path: continuous beds off, short meaningful cues still available.

Future accessibility work may add separate cue and ambience volume sliders, but this task intentionally keeps the first control surface compact.


## Authored production contract

The detailed authored soundscape/score specification now lives in `docs/AUDIO-PRODUCTION-BIBLE.md`.

That document defines:

- environment and named-location ambience briefs;
- restrained instrumentation and silence rules;
- music-state/cue map;
- semantic feedback cues;
- transition/crossfade rules;
- source-asset directory/codec/duration targets;
- accessibility and sound-off requirements.

LR-0032 should consume that production bible rather than inventing a second audio language during runtime integration.
