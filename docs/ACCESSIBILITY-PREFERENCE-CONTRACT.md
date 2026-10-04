# Lantern Road Accessibility Preference Precedence & Persistence Contract

Owner: Agent 5 — The Wayfinder  
Task: LR-0084  
Consumers: LR-0039, LR-0040  
Interaction contract: LR-0051

## Purpose

Lantern Road accessibility preferences should behave predictably across campaigns and browser/platform settings without becoming part of campaign save data.

This document defines precedence, defaults and failure behaviour. It does not implement storage.

## Preference classes

Current player-facing preferences:

- Text size: Standard / Large / Extra Large
- High Contrast: Off / On
- Reduced motion: platform signal and any future in-game override
- Optional haptics: Off / On where supported

Future settings must define the same precedence explicitly before implementation.

## Persistence boundary

Accessibility/UI preferences are device/browser-local interface preferences.

They:

- persist across campaigns when storage is available;
- are not embedded in Manual Save or Autosave;
- do not migrate as campaign schema fields;
- may be cleared independently from campaign data;
- never alter canonical game rules or world state.

LR-0011 must not be required to understand these preferences.

## Safe defaults

When no preference is stored:

- Text size: Standard
- High Contrast: Off
- Haptics: Off
- Reduced motion: follow the platform/browser preference

Defaults must still produce a fully usable interface.

## Precedence model

### Text size

1. explicit Lantern Road text-size choice;
2. normal browser zoom/font scaling continues to apply on top;
3. no in-game choice means Standard.

Lantern Road must not disable browser zoom merely because it provides text-size controls.

### High Contrast

1. explicit Lantern Road High Contrast setting controls the in-game high-contrast mode;
2. platform/browser forced-colour/high-contrast behaviour must still be respected rather than overridden destructively;
3. when no in-game choice exists, use normal theme while allowing platform rendering adjustments.

A future automatic “follow system contrast” mode may be added by a separate deliberate decision; do not silently reinterpret the existing Off/On control.

### Reduced motion

Until an explicit in-game motion setting exists:

1. `prefers-reduced-motion: reduce` means reduce non-essential motion;
2. absence of that signal allows normal restrained motion.

If an in-game setting is later added, preferred model:

- **Follow device** (default)
- **Reduce motion**
- **Standard motion**

An explicit player request to reduce motion always wins over a platform signal allowing motion.

Do not let an in-game “standard motion” override an OS-level forced accessibility mode where the browser itself prevents/changes animation.

### Haptics

1. explicit Lantern Road Haptics On is required;
2. device/browser vibration capability must also exist;
3. unsupported capability behaves as unavailable even if a stale stored value says On;
4. default is Off.

Haptics never replace visual/text feedback.

## Applying changes

Preference changes should apply immediately where practical.

Required behaviour:

- no page reload for text size/contrast/haptics;
- changing a setting does not move focus unexpectedly;
- current selected/on/off state updates in place;
- screen-reader announcement is concise when needed;
- modal Close remains reachable after reflow;
- settings changes must not create a toast that obscures Settings controls.

## Storage unavailable

If preference storage cannot be read:

- use safe defaults;
- do not block game launch;
- Settings remains usable for the current session.

If a player changes a preference but storage write fails:

- apply it for the current session where possible;
- explain briefly: **Preference not saved — this setting may reset when you close Lantern Road.**
- do not imply the preference was persisted;
- do not expose storage implementation jargon.

## Invalid/stale stored values

Runtime implementation should normalise invalid preference values safely.

Examples:

- unknown text-size token → Standard;
- non-boolean contrast/haptics → safe default;
- haptics stored On on unsupported browser → present unavailable/off behaviour without errors.

Do not treat corrupted UI preferences as campaign corruption.

## Clearing app/cache data

PWA/cache recovery must distinguish app files from preferences and campaign saves.

If an action intentionally clears preferences:

- say so before the destructive action;
- do not bundle preference clearing into an app-file refresh without necessity;
- campaign saves remain separately described.

## Multi-campaign behaviour

Starting New Campaign:

- preserves accessibility preferences;
- does not reset text size/contrast/haptics;
- does not copy preferences into the new campaign state.

Loading Manual Save/Autosave:

- leaves current device accessibility preferences unchanged.

A save created on another device in any future export/import design must not silently overwrite device accessibility preferences unless a future explicit import choice is designed.

## Settings semantics

Each preference control exposes current state:

- text-size options use selected/pressed semantics;
- contrast/haptics use on/off/pressed semantics;
- unavailable features are disabled with explanatory text;
- labels are full words, not colour/icon-only.

A visible build/version row is informational, not part of accessibility preference state.

## Reduced-motion behaviour

With reduced motion:

- disable/reduce decorative movement, pulsing and camera easing;
- preserve immediate state-change feedback;
- do not remove focus indicators;
- do not slow interactions with long fades;
- audio and haptic preferences remain independent.

## High-contrast behaviour

High Contrast should strengthen:

- text/background separation;
- focus indicators;
- selected states;
- meaningful borders/status distinctions.

It must not:

- hide disabled state;
- convert all status colours into indistinguishable blocks;
- remove imagery needed to understand a control without an equivalent label.

## Text-size behaviour

Large/Extra Large:

- changes UI and story text consistently;
- allows buttons/cards/tabs to reflow according to LR-0082;
- does not shrink another class of critical text to compensate;
- persists across reload/campaign changes when storage works.

## Test matrix

For each preference:

1. change it during active campaign;
2. verify immediate visual/behavioural result;
3. navigate tabs/open modal;
4. reload;
5. start New Campaign;
6. load another save;
7. simulate unavailable preference storage;
8. simulate invalid stored value.

Pass:

- preference remains independent from campaign state;
- reload persistence is accurate;
- failure copy is truthful;
- focus remains stable;
- unsupported capability degrades safely.

## LR-0039 handoff

Implement preference semantics and accessibility effects from this contract plus LR-0051.

## LR-0040 handoff

Preserve preference/campaign-data separation through install/update/cache lifecycle and offline recovery.

## Acceptance summary

- [x] precedence defined for text size, contrast, reduced motion and haptics;
- [x] safe defaults/storage-failure behaviour defined;
- [x] preferences separated from campaign saves;
- [x] immediate application/focus rules defined;
- [x] no runtime preference implementation included.
