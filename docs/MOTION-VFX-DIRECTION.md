# Lantern Road motion, transition and atmospheric VFX direction

Task: LR-0127 — Author motion, transition and atmospheric VFX production language  
Owner: Agent 4 — The Lamplighter

## Purpose

Lantern Road is text-rich, map-led and phone-first. Motion exists to:

- acknowledge meaningful state change;
- clarify spatial change;
- reinforce weather/place;
- add tactility;
- create brief emotional emphasis.

It does **not** exist to decorate every tap.

The core rule is:

> **Motion should confirm the journey, not interrupt it.**

## Ownership boundary

Agent 4 owns:
- visual timing language;
- easing character;
- amplitude/style;
- decorative VFX assets;
- atmosphere intensity.

Agent 5 owns:
- when an interaction state exists;
- focus movement;
- accessibility semantics;
- touch/gesture behaviour;
- sheet/modal state;
- reduced-motion preference plumbing.

Agent 1 owns:
- runtime implementation;
- asset loading;
- state wiring;
- performance integration.

Agent 6 independently QA-checks discomfort, repetition, clarity and annoyance.

---

# Global motion grammar

## Timing bands

### Micro
**80–160 ms**

Use for:
- button press acknowledgement;
- tiny icon state change;
- selected/unselected emphasis.

Never use long elastic easing.

### Short
**180–320 ms**

Use for:
- panel reveal;
- map focus ring;
- damage/heal pulse;
- small scene/card entrance.

This is the default Lantern Road transition band.

### Medium
**350–650 ms**

Use for:
- travel result reveal;
- discovery emphasis;
- sheet/modal entrance;
- major scene-state changes.

Use sparingly.

### Long
**700–1400 ms**

Reserved for:
- opening/title atmosphere;
- major chapter/end-state fades;
- deliberate environmental crossfades.

No routine control should use a long transition.

## Easing

Preferred:
- settle: `cubic-bezier(.2,.7,.2,1)`
- enter: `cubic-bezier(.16,.84,.32,1)`
- exit: `cubic-bezier(.4,0,.7,.2)`

Avoid:
- bounce;
- spring overshoot;
- elastic wobble;
- exaggerated back easing.

The visual world is weathered and grounded.

## Travel-distance rule

UI movement should remain small.

Typical transforms:
- micro: 1–2 px;
- panel/card: 4–10 px;
- major sheet: up to 16 px;
- impact nudge: 2–4 px.

Do not slide whole screens large distances unless Wayfinder explicitly requires it for spatial navigation.

---

# Core interaction choreography

## Scene reveal

When authored scene content changes:

- fade from 0.94 → 1 opacity;
- translate Y 4–6 px → 0;
- 220–300 ms settle easing.

Do not animate each paragraph independently.

Reduced motion:
- instant swap plus optional 120 ms opacity-only crossfade.

## Travel

On successful travel:

1. current party/map position receives a brief warm-gold emphasis;
2. route/target focus settles;
3. destination context appears after the movement acknowledgement.

Target total visual event:
**350–550 ms**.

No fake token walking animation is required.

Reduced motion:
- immediate marker update;
- one static gold outline for ~300 ms.

## Map focus

Selecting/focusing a hex:

- 140–220 ms outline/brightness transition;
- no scale larger than 1.03;
- no pulsing loop for ordinary focus.

Current party position may use a very slow, low-amplitude breathing ring only when reduced motion is off.

## Discovery

New site/location discovery:

- single 450–650 ms reveal;
- warm-gold edge/ink bloom;
- optional tiny radial light wash;
- short audio cue only if sound enabled.

Do not fire confetti or particles.

Reduced motion:
- static gold edge + “Discovered” text/state.

## Damage

- 80–140 ms local impact nudge;
- rust-red edge flash up to ~180 ms;
- never flash the entire screen bright red;
- maximum translation 3–4 px.

Repeated hits should not stack into violent shaking.

Reduced motion:
- static rust-red edge/fill accent that fades within 180–240 ms.

## Healing

- 250–450 ms soft green-gold lift;
- slight highlight bloom;
- no upward particle shower.

Reduced motion:
- static green highlight for ~300 ms.

## Positive status

- 220–360 ms warm-gold outline or icon illumination.

## Negative status

- 180–300 ms rust/charcoal emphasis;
- avoid jitter loops.

## Save success

Only after confirmed save success:

- 180–280 ms small icon/label settle;
- optional tiny lantern-gold glow;
- pair with visible save-success state.

Never animate success before persistence completes.

## Blocked/unavailable action

Wayfinder owns the state and message.

Presentation:
- 80–120 ms muted 1–2 px horizontal nudge OR static dim emphasis;
- no harsh red shake;
- visible explanation must carry meaning.

---

# Panels, sheets and overlays

## Phone sheet entrance

Visual recommendation only; Wayfinder owns geometry and state:

- 240–320 ms;
- translate Y 8–16 px → 0;
- opacity 0.96 → 1;
- dark backdrop fades independently around 180–240 ms.

Reduced motion:
- opacity-only 120–180 ms.

## Modal/dialogue focus

- do not zoom the entire page;
- background may darken 100–180 ms;
- focused surface enters 180–260 ms.

## Tab/content switch

- default instant;
- optional 120–180 ms opacity crossfade only if content change would otherwise feel visually abrupt.

Repeated navigation should never feel sluggish.

---

# Atmospheric VFX states

Atmosphere is **subtle and layered**.

## Clear day

Default:
- no continuous foreground VFX;
- restrained warm/neutral environmental grade;
- let terrain/art carry the scene.

## Drizzle

Source asset:
`assets/ui/effects/rain-lines.svg`

Use:
- very low opacity;
- slow vertical/diagonal drift;
- never enough density to obscure text/map labels.

Recommended:
- opacity 0.05–0.12;
- movement cycle 8–16 s.

Reduced motion:
- static low-opacity rain texture OR no overlay.

## Wind

No continuous particle asset required.

Use:
- occasional low-amplitude environmental movement where supported;
- optional slow cloud/light shift;
- avoid swaying every decorative element.

Reduced motion:
- static lighting only.

## Storm

Layer:
- slightly denser rain;
- darker vignette/wash;
- rare, soft luminance swell for distant lightning.

Rules:
- no white full-screen lightning flash;
- no rapid repeating flash;
- no camera shake for thunder.

Reduced motion:
- darker static grade plus weather icon/text.

## Fog / marsh / early morning

Source asset:
`assets/ui/effects/fog-wash.svg`

Use:
- soft low-frequency drift;
- preserve label contrast;
- never use fog to hide actionable UI.

Reduced motion:
- static translucent fog wash.

## Night / camp

- dark slate/blue environmental grade;
- local warm lantern/fire light;
- avoid crushing blacks;
- retain text contrast and map readability.

Warm light should feel local, not like an orange filter over the whole screen.

## Safe interior / inn

Source asset:
`assets/ui/effects/lantern-bloom.svg`

- very restrained local warm wash;
- stable, not flickering constantly;
- optional 1–2% luminance drift over 6–10 s if motion enabled.

Reduced motion:
- static warm wash.

## Sacred / uncanny

Source asset:
`assets/ui/effects/sacred-halo.svg`

- subtle desaturated pale-gold/blue-grey bloom;
- slow appearance/disappearance;
- no neon glow;
- no pulsing runes.

Reduced motion:
- static halo.

## Ember/fire detail

Source asset:
`assets/ui/effects/ember-specks.svg`

Use only at:
- camp;
- hearth;
- selected warm-safe scenes.

Do not run embers across ordinary UI.

Reduced motion:
- static tiny warm specks or omit.

---

# Emotional scene choreography

## Companion intimacy

- reduce environmental motion;
- lower visual contrast around peripheral chrome;
- favour a still portrait/scene;
- optional 300–500 ms slow reveal.

The emotional writing should carry the moment.

## Grief / irreversible loss

- remove decorative motion;
- allow 250–500 ms fade into stillness;
- avoid red flashes or dramatic shake.

## Revelation

- 400–700 ms restrained light/contrast change;
- one clean discovery emphasis;
- return to stillness.

## Ending

- up to 1000–1400 ms scene fade;
- no looping celebratory particles;
- final composition should settle into a still image/text state.

---

# Continuous-motion budget

On a normal gameplay screen:

- ideally zero continuous animated decorative layers;
- maximum one environmental continuous layer plus one tiny local accent;
- never run rain + fog + embers + pulsing markers simultaneously.

On low-power/mobile conditions:
- decorative continuous VFX should be easy to disable or omit;
- gameplay must remain visually complete without them.

---

# Reduced-motion contract

Every effect family must have a non-motion equivalent.

| Effect | Normal | Reduced motion |
| --- | --- | --- |
| Scene reveal | short fade + 4–6 px settle | instant or opacity-only |
| Travel | marker emphasis + settle | immediate position + static outline |
| Focus | brief outline transition | immediate outline |
| Discovery | gold bloom | static gold edge/state |
| Damage | tiny nudge + rust flash | static rust accent |
| Healing | soft bloom | static green accent |
| Sheet/modal | short slide/fade | opacity-only |
| Rain | slow drift | static texture or none |
| Fog | slow drift | static wash |
| Ember | sparse drift | static/none |
| Lantern bloom | tiny luminance drift | static |
| Sacred halo | slow fade/breath | static |

No critical state depends on animation.

---

# Flash and discomfort limits

- never use rapid strobing;
- never use repeated high-contrast white flashes;
- no camera shake loops;
- no continuous jitter;
- avoid large scale zooms;
- avoid motion behind long reading surfaces;
- cap decorative opacity so labels and text remain dominant.

If an effect feels impressive in isolation but distracting during 20 minutes of reading, it fails.

---

# Runtime implementation guidance

Prefer:
- opacity;
- transform;
- lightweight filter changes;
- single pseudo-elements;
- CSS background layers;
- SVG source assets.

Avoid:
- canvas particle systems for purely decorative VFX;
- video backgrounds;
- large animated GIF/WebP;
- layout-thrashing positional animation;
- continuous JS timers where CSS can do the job.

Use `prefers-reduced-motion` plus any Wayfinder-owned in-game accessibility setting.

---

# Asset usage contract

Source VFX assets live in `assets/ui/effects/`.

They are intentionally:
- decorative;
- semantic-free;
- scalable;
- text-free;
- dependency-free.

They may be recoloured/tinted at runtime only within the approved environmental palette.

Do not:
- use them for hit-testing;
- encode quest/location truth into them;
- bake UI labels into them;
- make game state depend on whether they loaded.

---

# Handoff

Later runtime work should preserve these principles:

1. **meaning first** — visual feedback follows real state;
2. **brief motion** — most events settle under 320 ms;
3. **quiet screens** — long reading/map inspection is largely still;
4. **local atmosphere** — warm light, weather and uncanny effects stay contextual;
5. **reduced motion is complete** — not a degraded experience;
6. **phone performance wins** — decorative motion is always expendable.
