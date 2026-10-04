# Lantern Road Mobile Audio Controls & Sensory-Accessibility Audit

Owner: Agent 5 — The Wayfinder  
Task: LR-0131  
Runtime foundation: LR-0003  
Production direction: LR-0126  
Lifecycle inputs: LR-0086, LR-0119  
Runtime consumers: LR-0032, LR-0040  
Independent QA consumer: Agent 6

## Verdict

The existing audio-control foundation is conceptually strong and already follows several important phone/browser rules:

- Sound defaults Off.
- Audio starts only after a player gesture.
- Ambience can be disabled while action cues remain available.
- Master volume, Sound and Ambience preferences are locally persisted.
- Unsupported Web Audio disables the master control rather than blocking the game.
- All semantic audio cues are intended to have visual equivalents.
- The game remains playable muted.

However, the current runtime has **mobile lifecycle and control-state gaps** that need to be preserved as explicit downstream requirements before authored audio is integrated.

Audit result:

> **PASS WITH REQUIRED LIFECYCLE / CONTROL-STATE FIXES**

No audio asset or runtime code is changed by this task.

---

# Current implementation audit

## Existing controls

Current markup exposes:

- **Sound: On/Off** toggle
- **Ambience: On/Off** subordinate toggle
- **Vol** range input with accessible label **Sound volume**

Current preference model:

```text
enabled: false
ambience: true
volume: 0.28
```

Storage key:

`lantern-road-audio-v1`

These preferences are correctly separate from campaign save state.

---

# What is already good

## Sound Off by default

This matches the approved audio direction and is appropriate for:

- public phone play;
- autoplay rules;
- hearing/sensory preferences;
- unexpected loudness prevention.

Do not change to autoplay-On merely because authored audio becomes available.

## Explicit user gesture unlock

The runtime creates/resumes `AudioContext` only after player interaction.

This is correct.

## Ambience separation

Ambience can be disabled independently while short action cues remain available.

This is an important reduced-distraction control and should survive authored-audio integration.

## Unsupported Web Audio fallback

When no AudioContext exists:

- Sound becomes unavailable;
- gameplay remains available.

This is correct progressive enhancement.

## Preference storage is non-critical

Storage failures do not break gameplay.

This matches the broader preference contract.

---

# Finding A1 — background/suspend lifecycle is not currently handled

Current runtime contains no explicit:

- `visibilitychange`
- `pagehide`
- `pageshow`
- page lifecycle suspension handling

and does not explicitly suspend/tear down active ambience on background.

## Risk

Depending on browser/OS behaviour:

- ambience may continue unexpectedly while the page is hidden;
- browser may suspend AudioContext automatically;
- runtime may not know that suspension occurred;
- authored loops may later behave differently across Android/browser variants.

## Requirement

LR-0032/LR-0040 must implement best-effort mobile lifecycle handling consistent with LR-0119:

On hidden/background:

- stop or suspend continuous ambience/music;
- do not queue haptics/audio to replay later;
- preserve player preference;
- do not treat backgrounding as a preference change.

On foreground:

- inspect actual AudioContext state;
- resume only when browser policy permits;
- if a gesture is required, leave audio paused until a safe user interaction;
- do not block gameplay.

---

# Finding A2 — `audioUnlocked` can become stale after OS/browser suspension

Current logic uses:

```text
audioUnlocked = audioCtx.state === "running"
```

but there is no state-change listener or resume-path reconciliation after background suspension.

`resumeSavedAudioFromGesture()` only tries to unlock when:

```text
audioPrefs.enabled && !audioUnlocked
```

## Risk

A browser can suspend an existing AudioContext while the JavaScript boolean remains `true`.

On return:

- UI still says Sound On;
- `audioUnlocked` may incorrectly remain true;
- the one-time gesture-resume path may not retry;
- audio may remain silent until another explicit control happens to call `unlockAudio()`.

## Requirement

Runtime must treat the actual `audioCtx.state` as authoritative.

Recommended behaviour:

- listen for AudioContext `statechange` where useful;
- on foreground/user gesture, check `audioCtx.state`, not only cached `audioUnlocked`;
- allow retry if context is suspended/interrupted;
- do not toggle the user's saved Sound preference Off merely because the OS temporarily suspended audio.

---

# Finding A3 — one-time gesture listeners are fragile after transient resume failure

Current runtime installs once-only listeners:

- pointerdown
- keydown

for saved-audio resume.

That is efficient when the first resume succeeds.

If the first resume fails transiently, however:

- the once-only listener has been consumed;
- later ordinary interaction may not automatically retry;
- the player may need to manipulate Sound controls manually.

## Requirement

A resume-on-interaction mechanism should remain available until audio has actually reached a running state, then remove itself.

Do not attach an expensive handler forever; use a small state-aware retry strategy.

---

# Finding A4 — Ambience can say On while disabled by master Sound Off

Current state model intentionally preserves the saved Ambience preference even when master Sound is Off.

That is reasonable.

But the UI can present:

- **Sound: Off**
- **Ambience: On** (disabled)

## Risk

A touch/screen-reader user may interpret **Ambience: On** as audible output rather than a stored subordinate preference.

## Requirement

Keep the preference, but expose the dependency clearly.

Acceptable patterns:

- **Ambience: On (Sound is Off)**
- disabled Ambience control with accessible description:
  **Turn Sound on to use ambience**
- in Settings, show the preference as nested beneath master Sound.

Do not silently reset Ambience Off when master Sound turns Off; the current remembered preference is useful.

---

# Finding A5 — Volume control needs stronger phone semantics

Current visible label:

**Vol**

Accessible label:

**Sound volume**

The range uses:

- min 0
- max 1
- step 0.05

## Strength

Native range input gives baseline keyboard/accessibility support.

## Risks

- visible **Vol** is terse;
- 0–1 numeric range may be announced as decimals rather than intuitive percentages;
- narrow top-bar placement can make range manipulation cramped;
- slider thumb/track hit area may be too small after responsive compression.

## Requirement

For final phone UI:

- visible label should preferably say **Volume** in Settings/detail surface;
- accessible value should be understandable as percent, e.g. **28 percent**;
- range track/thumb needs a generous touch region;
- keyboard arrows must work;
- focus indicator must be visible;
- Extra Large text must not shrink the slider below usable width.

A compact header may show only a Sound control; detailed Volume/Ambience can live in Settings under the responsive-shell design.

---

# Finding A6 — Volume 0 is not the same state as Sound Off

Current slider allows 0 while Sound remains enabled.

This is technically valid.

## Requirement

Do not automatically rewrite Sound Off when volume becomes 0 unless a deliberate product decision says so.

But the UI should make the state understandable:

- **Sound: On**
- **Volume: 0%**

If space permits, a mute affordance may remain master Sound, while Volume remains a remembered level.

Turning Sound back On should restore the remembered volume, including 0 if that is what the player deliberately stored.

---

# Finding A7 — preference-storage failure is currently silent

`saveAudioPrefs()` catches storage failure and intentionally continues.

This is safe for gameplay.

But if the user explicitly changes Sound/Volume and persistence fails, the feedback may currently imply:

**Your setting is saved.**

For example, Sound Off feedback says:

> Lantern Road is quiet. Your setting is saved.

That statement is not guaranteed if local storage failed.

## Requirement

Player-facing persistence language must be truthful.

Options:

- stop claiming **saved** unless preference storage confirms success;
- or return a persistence success/failure result from preference write;
- on failure:
  **Sound is off for this session. This setting may reset when you close Lantern Road.**

This consumes the same principle as LR-0084: session application may succeed even if persistence fails.

---

# Finding A8 — generic button cue fires before action outcome

Current runtime globally plays a short UI cue for most button clicks in capture phase.

That means the sound can happen before the underlying action:

- succeeds;
- fails;
- is blocked;
- shows an error.

This is not necessarily wrong if the cue is understood as **button press**, not success.

## Requirement

Maintain a semantic distinction:

### Press cue

Means:

> Your input was received.

It must not sound like a success reward.

### Outcome cue

Only plays after confirmed outcome.

Examples:

- save success;
- healing success;
- discovery;
- blocked action.

For save/load specifically, never let a generic cue become the only or apparent success signal.

The approved audio bible already requires save audio to follow confirmed save success.

---

# Finding A9 — Sound/Ambience feedback is good but must not obscure controls

Current toggles call visible `showFeedback()`.

This is good for semantic parity.

Under final mobile layout:

- feedback must not cover Sound/Ambience/Volume controls;
- Settings modal should show state in-flow;
- repeatedly moving a slider should not produce toast spam;
- changing volume does not need an announcement on every tiny input step.

---

# Finding A10 — reduced motion and reduced sound are independent

Current code correctly treats `prefers-reduced-motion` only as a visual-motion setting.

Do not tie it automatically to Sound Off.

A player may want:

- reduced motion + full audio;
- standard motion + no audio;
- cues only + no ambience.

The control model must preserve those independent choices.

---

# Player-facing audio hierarchy

Recommended preference structure:

## Sound

Master output switch.

**Off**

- no ambience;
- no music;
- no semantic/action cues;
- game fully playable.

**On**

- subordinate settings become available.

## Ambience

Controls continuous environmental beds.

Off:

- continuous ambience/music atmosphere suppressed according to production design;
- short semantic/action cues remain available.

On:

- ambience follows weather/location when Sound is On.

## Volume

Master level for all sound.

Future optional refinement may add:

- Cues volume
- Ambience/music volume

but master Sound and master Volume remain authoritative.

Do not add a large mixer UI unless actual user need justifies it.

---

# Phone placement

Current header has:

- New Campaign
- Save
- Load
- Fullscreen
- Sound
- Ambience
- Volume

That is too many persistent controls to treat as equal-priority phone chrome in the eventual persistent-map shell.

## Recommended phone hierarchy

Persistent/easy access:

- Settings entry
- possibly a compact Sound state control if testing shows frequent use

Inside Settings / Audio:

- Sound
- Ambience
- Volume
- short explanation of sound-off play

This reduces top-bar crowding and protects one-handed gameplay space.

Do not bury emergency mute behind several deep screens; Settings should remain quickly reachable.

---

# Touch requirements

Sound and Ambience buttons:

- approximately 44×44 CSS px or larger touch target;
- full text label remains visible in Settings;
- pressed state visible without colour only.

Volume:

- track/thumb touch area large enough for one-thumb use;
- slider does not require pixel-precise dragging;
- keyboard arrows supported;
- tapping the track should work where browser/native range supports it.

---

# Screen-reader semantics

## Sound

Use toggle-button semantics:

- **Sound, on**
- **Sound, off**
- **Sound unavailable**

Do not announce both button text and an extra duplicate hidden label.

## Ambience

Use toggle-button semantics.

When disabled by master Sound Off, accessible description should explain why.

Example:

**Ambience, on, unavailable while Sound is off.**

## Volume

Label:

**Sound volume**

Expose an intuitive value:

**28 percent**

Avoid forcing users to interpret **0.28**.

---

# Autoplay / unlock states

Recommended conceptual states:

- SOUND_OFF
- SOUND_ON_LOCKED
- SOUND_ON_RUNNING
- SOUND_ON_INTERRUPTED
- SOUND_UNAVAILABLE

### SOUND_OFF

Preference is Off.

No unlock attempts needed.

### SOUND_ON_LOCKED

Preference says On, but browser has not granted/resumed AudioContext.

UI may say:

**Sound On — tap to resume audio**

only when necessary.

Do not describe output as active if it is not actually running.

### SOUND_ON_RUNNING

Normal.

### SOUND_ON_INTERRUPTED

OS/browser temporarily suspended/interrupted audio.

Preference remains On.

Retry safely on foreground/user gesture.

### SOUND_UNAVAILABLE

Web Audio absent or irrecoverably unavailable in current environment.

Gameplay remains available.

---

# Background/suspend/resume

Consume LR-0119.

On background:

- continuous ambience/music should stop or suspend;
- no cue backlog;
- do not change preference.

On return:

- inspect actual context state;
- resume only if browser allows;
- otherwise wait for next safe gesture;
- no modal is required just because audio is paused;
- current campaign state remains primary.

If authored buffers are unloaded/reloaded later, failure must fall back gracefully and not block the game.

---

# Mono / poor speakers / hearing accessibility

No gameplay distinction may rely on:

- stereo position;
- low-frequency impact;
- subtle pitch difference alone;
- sound presence alone.

Every meaningful cue has visible equivalent.

Particularly:

- enemy/combat warning;
- blocked action;
- save success/failure;
- discovery;
- heal/status;
- defeat/victory.

Phone-speaker testing remains required because the production bible intentionally uses restrained low-frequency content.

---

# Save audio

A save cue may play only after persistence confirms success.

On failure:

- visible error is mandatory;
- failure sound may be used, but not required;
- no success cue.

Autosave should avoid noisy cue spam.

Recommended:

- Manual Save may have a restrained confirmed-success cue.
- Autosave remains primarily visual/quiet unless user testing proves sound useful.

---

# Combat audio

Combat remains fully playable muted.

Rules:

- selected action is visible;
- target state is visible;
- enemy turn/result is visible;
- Guarded/Blessed/Exposed/Weakened are text/state;
- hit/heal/status sounds reinforce but never substitute.

Do not use stereo or sound timing as the only enemy-intent cue.

---

# Failure / unsupported audio

If Web Audio is unsupported:

- master Sound control indicates unavailable;
- Ambience/Volume subordinate controls are disabled or hidden appropriately;
- game does not show repeated errors;
- no gameplay feature appears incomplete.

If authored audio asset loading fails:

- LR-0032 should fall back to procedural audio where available;
- if no fallback exists, silence is valid;
- do not block scene/action completion.

---

# Runtime implementation checklist

For LR-0032 / LR-0040:

- [ ] Sound remains Off by default.
- [ ] Audio starts only after permitted player gesture.
- [ ] Actual `AudioContext.state` is authoritative after resume/interruption.
- [ ] Resume retry remains possible after transient failure.
- [ ] Backgrounding suspends/stops continuous audio without changing preference.
- [ ] Foreground return does not auto-play against browser policy.
- [ ] Ambience subordinate state is understandable when master Sound Off.
- [ ] Volume exposes understandable percent semantics.
- [ ] Touch controls remain large enough on phone.
- [ ] Audio preference persistence failure does not falsely claim "saved".
- [ ] Generic button press cue is not confused with action success.
- [ ] Save success cue only follows confirmed save success.
- [ ] Semantic cues always have visual equivalents.
- [ ] Mono/muted/poor-speaker play remains complete.
- [ ] Settings layout avoids top-bar crowding.
- [ ] No audio control overlaps responsive-shell/map controls.
- [ ] Authored audio failures degrade to procedural fallback or silence.

## Audit conclusion

The current foundation is **good enough to build on**, but authored-audio integration must address lifecycle-state reconciliation and truthful control semantics before it is considered premium phone-ready.
