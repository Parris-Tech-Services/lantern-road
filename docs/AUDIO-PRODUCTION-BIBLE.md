# Lantern Road bespoke soundscape and score production bible

Task: LR-0126 — Author bespoke soundscape and score production bible  
Owner: Agent 4 — The Lamplighter

## Core sonic identity

Lantern Road should sound **close, weathered and human**.

The player is not listening to a symphonic fantasy film. They are travelling through a damp frontier region with a small party, sleeping under canvas, hearing timber move in the wind, crossing rivers, sitting in inns and entering old places that sound different because the air itself changes.

The guiding rule is:

> **Environment first. Music second. Silence is part of the score.**

The Grey March should feel larger because the audio leaves space around the player.

## What the score is not

Avoid:

- constant orchestral underscore;
- heroic brass;
- large choir except as an extremely rare late-game colour, if ever;
- busy percussion loops under reading;
- bright tavern-folk clichés;
- horror drones on every ruin;
- loud UI confirmation sounds;
- bass-heavy mixes that collapse on phone speakers;
- music that tells the player how to feel before the writing earns it.

## Instrument palette

Primary palette:

- bowed low strings used sparsely;
- viola / fiddle harmonics and soft double-stops;
- wooden flute / breathy whistle used in short fragments;
- plucked gut-string or dulcimer-like textures;
- hand drum / frame drum only for restrained pulse;
- low wood and body percussion;
- harmonium / reed organ colour for rare sacred or settlement moments;
- bowed metal / glass / rubbed texture for uncanny sites;
- environmental found sound: timber creak, rope strain, chain, rain, water, fire, cloth, boots, distant bell.

The score should feel **handmade and imperfect**, not quantised to a cinematic grid.

## Dynamic range and mix hierarchy

Priority order:

1. **semantic action cues** that confirm an important player action;
2. **dialogue/text readability** and silence;
3. **environment ambience**;
4. **music**;
5. decorative one-shot details.

Target relative hierarchy rather than one fixed LUFS number, because implementation may vary by browser and asset codec.

Guidance:

- ambience should usually sit 8–14 dB below short interaction cues;
- music should usually sit slightly below or level with ambience, not over it;
- combat may temporarily raise musical energy, but not overall loudness;
- no cue should rely on sub-bass to communicate meaning;
- peaks should leave comfortable headroom on phone speakers;
- layer changes should use crossfades, not hard cuts.

## Silence rules

Silence is intentional in these cases:

- map inspection;
- long reading passages;
- ordinary inventory management;
- uneventful road travel;
- post-choice consequence text;
- immediately after a major death, refusal or irreversible decision;
- before a revelation cue enters.

When in doubt, remove sound rather than add another layer.

---

# Ambience system

Ambience is built from reusable families plus one optional location signature.

## Weather layer

### Clear

**Mood:** open air, restraint.

- near-silence;
- low distant air;
- occasional grass/leaf movement where appropriate;
- no bird-loop wallpaper.

**Target loop:** 60–120 s.

### Drizzle

**Mood:** close, soft, persistent.

- diffuse rain;
- occasional canvas/leaf/wood impacts;
- minimal low end.

**Target loop:** 60–120 s.

### Wind

**Mood:** exposed road.

- uneven gusts with quiet gaps;
- low timber/grass movement when location supports it;
- avoid constant broadband roar.

**Target loop:** 90–150 s.

### Storm

**Mood:** dangerous weather, not blockbuster spectacle.

- rain and wind as the body;
- rare distant rumble;
- avoid frequent thunder cracks;
- keep transients controlled for headphones.

**Target loop:** 90–180 s.

## Environment families

### Open road / plains

- wind;
- grass;
- cloth;
- distant birds used sparsely;
- wheel/boot detail only as occasional one-shots.

**Signature:** space.

### Forest

- canopy movement;
- branch creak;
- occasional distant animal/insect detail;
- damp footfall texture for travel one-shots.

**Signature:** depth, not constant wildlife chatter.

### Hills / exposed high ground

- stronger air movement;
- stone resonance;
- occasional distant crow-like call;
- less close foliage.

**Signature:** exposure.

### Swamp

- wet insect bed;
- subtle water movement;
- reed rub;
- rare frog-like or unknown biological detail.

**Signature:** air feels occupied.

Avoid cartoon swamp sounds.

### Settlement generic

- low voices;
- timber movement;
- cart wheel / distant hammer / animal detail;
- never a looping wall of marketplace chatter.

**Signature:** people nearby, not crowd noise.

### Inn

- fire;
- crockery;
- bench/chair movement;
- muted conversation;
- weather muffled through walls.

**Signature:** safety through enclosure.

### Sacred site

- reduced noise floor;
- air movement;
- restrained resonant tone;
- occasional soft bell/metal/wood resonance if lore supports it.

**Signature:** quiet focus.

### Ruin

- exposed wind;
- stone cavity resonance;
- loose grit;
- rare unidentified movement.

**Signature:** absence.

### Cave

- air;
- drips;
- distant chamber reflections;
- low resonance with careful bass restraint.

**Signature:** depth and distance.

### River / ferry / ford

- directional water;
- rope strain;
- hull/timber contact;
- bank vegetation;
- splash one-shots tied to action, not loop spam.

**Signature:** movement underfoot.

---

# Named-location signatures

Every major named location may have **one memorable signature element**, not a completely bespoke full soundscape.

## Hearthwick

Base: small settlement + inn warmth.

Signature:
- distant hand bell or hanging iron sign moving softly in the wind.

Do not make it cheerful-festival music. Hearthwick feels safe because it is human.

## Greyfen Market

Base: settlement.

Signature:
- restrained cart/rope/awning movement and a recurring distant vendor murmur cadence.

The market should feel useful and contested, not bustling-comedy fantasy.

## Candlemere

Base: quiet settlement + water.

Signature:
- canal water and one soft archive/interior resonant creak/chime colour.

Avoid magical-library sparkles.

## Alderwatch

Base: exposed timber post.

Signature:
- signal-chain/tower-rope movement in wind.

Functional, tired, vigilant.

## Blacksalt Crossing

Base: river/ferry + rough settlement.

Signature:
- rope tension, pilings and low hull knocks.

No pirate clichés.

## Watcher's Rest

Base: inn.

Signature:
- old stove/fire and wind against shutters.

## Saint Rhel's Shrine

Base: sacred site.

Signature:
- one restrained resonant metal/wood tone with a long natural tail.

## Old Barrow Keep

Base: ruin.

Signature:
- intermittent iron-door/stone settling resonance.

## Broken Span

Base: exposed road + river/ravine.

Signature:
- distant water plus stressed timber/stone tick.

## Weeping Stones

Base: open country.

Signature:
- subtle mineral water drips where there should be no water.

No magical shimmer loop.

## Redwater Ferry

Base: river.

Signature:
- rope ferry strain.

## Moonmere Tower

Base: high exposed ruin/tower.

Signature:
- wind tone through openings, almost flute-like but natural.

## Mosslight Ruins

Base: swamp + ruin.

Signature:
- faint irregular candle/organic crackle or wet resonance.

Avoid neon-magic audio.

## Hollowglass Cavern

Base: cave.

Signature:
- sparse brittle mineral ping/resonance responding to wind.

## Pilgrim Ford

Base: river/ford.

Signature:
- shallow stones and foot-water detail.

## Smuggler's Cache

Base: wet ground / concealed hollow.

Signature:
- very quiet cloth/wood/metal handling detail when entered.

---

# Music state map

Music is **event-driven**, not continuous.

## Title / main menu

Working cue name: `music_title_lantern-road`

Length target: 45–75 s, loopable or with a clean held tail.

Character:
- one small motif;
- low strings / plucked wood;
- distant breathy melody;
- restrained lantern warmth;
- unresolved enough to suggest a road ahead.

No triumphant theme statement.

## Road / reflection

Working cue: `music_road_reflection`

Length: 45–90 s.

Use:
- after meaningful departure;
- long quiet travel after a consequence;
- rare reflective transitions.

Should often fade out before the next interaction.

## Settlement / safety

Working cue: `music_settlement_safety`

Length: 40–75 s.

Use:
- first meaningful arrival;
- emotionally safe inn/camp moments;
- never every time the player opens a settlement panel.

Warm but not cosy-game sugary.

## Discovery

Working cue: `music_discovery_short`

Length: 4–9 s.

Use:
- genuinely new site/location/revelation.

A short motif, not a fanfare.

## Sacred / uncanny revelation

Working cue: `music_revelation_uncanny`

Length: 20–45 s.

Use:
- Saint Rhel;
- Weeping Stones;
- Hollowglass;
- major Ashen Veil or ruin revelations.

Tonal ambiguity, resonance, breath and silence.

## Tension

Working cue: `music_tension_low`

Length: 30–60 s.

Use:
- pre-combat danger;
- pursuit;
- dangerous travel consequence.

Pulse without percussion-heavy urgency.

## Combat

Working cue: `music_combat_road`

Length: 45–90 s with loopable middle.

Use:
- actual combat only.

Character:
- frame drum / low body percussion;
- short repeated string figures;
- no heroic brass;
- limited layers so cues/hit sounds remain audible.

## Victory

Working cue: `music_victory_resolve`

Length: 4–7 s.

Use only after meaningful combat resolution.

## Defeat / collapse

Working cue: `music_defeat_fall`

Length: 5–10 s.

Leave silence after it.

## Companion intimacy

Working cue: `music_companion_intimate`

Length: 30–60 s.

Use rarely:
- personal arc breakthroughs;
- grief;
- reconciliation;
- confession;
- quiet camp vulnerability.

May be only one or two instruments.

## Late-campaign pressure

Working cue: `music_late_pressure`

Length: 45–90 s.

Use:
- day/campaign pressure when escalation is real;
- not as a constant timer soundtrack.

## Endings

Ending states should reuse and transform established motifs rather than introduce a completely new musical language.

Recommended family:
- `music_ending_hope`
- `music_ending_cost`
- `music_ending_failure`
- `music_ending_ambiguous`

Each may be 45–90 s and should have a clear final cadence rather than looping indefinitely.

---

# Semantic cue map

These cues communicate feedback but never exclusive information.

## UI

`cue_ui_confirm`
- 80–160 ms
- soft dry wooden/metallic click
- used for meaningful confirmation, not every tap

`cue_ui_blocked`
- 120–220 ms
- muted double knock / low dry tick
- must pair with visible explanation

`cue_ui_save`
- 200–350 ms
- restrained two-note settle
- must never imply success unless save actually succeeded

## Travel

`cue_travel_step`
- 250–500 ms
- cloth/boot/lantern hardware gesture with light tonal rise

`cue_arrival`
- 350–800 ms
- location arrival confirmation, subtle

## Combat

`cue_combat_start`
- 400–800 ms
- low warning pulse

`cue_hit_light`
`cue_hit_heavy`
- short physical impacts
- no exaggerated gore

`cue_heal`
- 350–700 ms
- breath/wood/chime rise

`cue_status_positive`
- 250–600 ms
- warm restrained tone

`cue_status_negative`
- 250–600 ms
- dry tension/low metallic resonance

`cue_victory`
- 1.5–3 s

`cue_defeat`
- 1.5–4 s

---

# Transition rules

## Location change

- ambience crossfade: 1.5–4 s;
- weather may persist continuously across the location transition;
- named signature layer enters after base ambience is stable.

## Weather change

- crossfade: 3–8 s;
- avoid abrupt restart of the whole ambience bed.

## Music entry

- fade in: 1.5–4 s;
- allow music to enter from silence rather than forcing synchronisation to an obvious bar.

## Music exit

- fade out: 2–6 s;
- major emotional cue may instead play to a natural tail.

## Combat transition

- tension may crossfade into combat;
- do not stack full tension and full combat tracks simultaneously.

---

# Source asset contract

Preferred directory:

```text
assets/audio/
  ambience/
    weather/
    wilderness/
    settlements/
    sites/
  cues/
    ui/
    travel/
    combat/
    status/
  music/
```

Preferred first-choice codec:

- Opus in `.webm` or `.ogg` where supported by the final integration path.

Fallback:

- only add AAC/MP4 or another broadly compatible fallback when Agent 1's browser matrix shows it is required.

Do **not** ship uncompressed WAV as production web assets unless the file is tiny and profiling justifies it.

## Loop targets

- ambience: 60–180 s;
- music beds: 45–90 s;
- short discovery/reveal music: 4–20 s;
- cues: generally under 1 s, except victory/defeat tails.

Avoid tiny 5–10 s ambience loops. Repetition becomes obvious very quickly.

## Filename convention

```text
amb_weather_drizzle_01
amb_weather_wind_01
amb_road_open_01
amb_forest_01
amb_swamp_01
amb_settlement_hearthwick_01
amb_site_saint-rhel_01
cue_ui_confirm_01
cue_travel_step_01
cue_hit_light_01
music_title_lantern-road_01
music_combat_road_01
```

Use lowercase kebab/snake consistently within each final implementation. Do not encode version numbers into gameplay ids; versioning belongs to asset manifests/build metadata.

---

# Initial production manifest

## P0 ambience

1. drizzle weather bed
2. wind weather bed
3. storm weather bed
4. open road/plains bed
5. forest bed
6. swamp bed
7. settlement bed
8. inn interior bed
9. ruin bed
10. sacred-site bed
11. cave bed
12. river/ferry bed

## P0 cues

1. UI confirm
2. UI blocked
3. save success
4. travel step
5. arrival
6. combat start
7. light hit
8. heavy hit
9. heal
10. positive status
11. negative status
12. victory
13. defeat

## P0 music

1. title
2. road/reflection
3. settlement/safety
4. discovery short
5. uncanny revelation
6. low tension
7. combat
8. companion intimacy
9. late-campaign pressure
10. four ending variants built from shared motif material

---

# Accessibility and sound-off contract

Lantern Road remains fully playable with all audio disabled.

Rules:

- every semantic cue has visible feedback;
- no enemy warning exists only in sound;
- no dialogue/content exists only in audio;
- save cue never substitutes for visible save state;
- ambience-off must preserve short cues if the player wants them;
- full sound-off must be respected globally;
- future cue-volume and ambience-volume separation may be added, but the master mute remains authoritative.

Audio must never punish a player for playing in public, muted, hearing-impaired, using mono playback or using poor phone speakers.

---

# LR-0032 handoff

LR-0032 should treat this document as the authored source contract.

LR-0032 owns:

- obtaining/creating the final encoded assets;
- final browser compatibility decisions;
- runtime loading;
- looping/crossfade implementation;
- adaptive state wiring;
- cache/bundle behaviour;
- integration with player sound preferences;
- final phone/headphone mix testing.

LR-0032 should not silently rewrite the sonic identity while integrating it. Any material change to the instrumentation, cue semantics or continuous-music policy should return to Agent 4/Director review.
