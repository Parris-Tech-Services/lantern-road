# Lantern Road Mobile Suspend, Resume & Interruption Contract

Owner: Agent 5 — The Wayfinder  
Task: LR-0119  
Consumers: LR-0040, LR-0009  
QA consumer: LR-0023  
Related contracts: LR-0077, LR-0078, LR-0110

## Purpose

Phone browsers and installed PWAs can be backgrounded, frozen, screen-locked, process-evicted or restored without a conventional page close.

Lantern Road must treat these as normal mobile lifecycle events, not as gameplay time and not as proof that a save succeeded.

This contract defines player-facing behaviour only. It does not implement browser lifecycle handlers or persistence.

## Core rules

1. **Real-world time passing while Lantern Road is backgrounded does not advance campaign time.**
2. **Backgrounding is not the same as saving.**
3. **Autosave attempts near suspension are best-effort only.**
4. **Same-session resume should restore the exact in-memory interaction state where safe.**
5. **Cold restart after process eviction resumes only from confirmed persisted data.**
6. **Audio/haptics stop while hidden and resume only through safe user/browser rules.**
7. **Returning to the game must not interrupt a required dialogue/combat decision with an update prompt.**

---

## Lifecycle states

Conceptual states:

- **FOREGROUND_ACTIVE**
- **BACKGROUND_HIDDEN**
- **SUSPENDED/UNKNOWN**
- **RESUMED_SAME_SESSION**
- **COLD_RESTART**
- **RESUME_WITH_UPDATE_PENDING**

These are runtime lifecycle states, not campaign-save fields.

## Foreground → background

Examples:

- app switch;
- browser tab loses visibility;
- phone screen locks;
- PWA moves behind another app.

On transition:

### Gameplay

- freeze player input naturally because the page is no longer active;
- do not advance campaign hour/day;
- do not resolve timers merely because wall-clock seconds pass;
- keep required dialogue/combat choice exactly unresolved.

### Autosave

If the current state is eligible for autosave:

- runtime may request a best-effort autosave before/while visibility changes;
- success is recorded only if persistence confirms the write;
- failure remains a real save failure under LR-0077;
- do not block backgrounding waiting for an asynchronous write that the browser may cancel.

Do not rely on:

- unload;
- pagehide;
- visibilitychange;

as guaranteed persistence completion points.

They may trigger an attempt, not a guarantee.

### Audio

- pause or mute ongoing ambience/music as the page becomes hidden where browser support allows;
- do not continue loud ambience indefinitely in background;
- preserve the player's audio preference;
- on resume, follow browser autoplay/user-gesture restrictions rather than forcing playback.

### Haptics

- no haptic feedback while backgrounded;
- queued haptics are discarded rather than replayed later.

---

## Background duration

No gameplay consequence is based on real elapsed duration.

Whether backgrounded for:

- 5 seconds;
- 10 minutes;
- several hours;

the campaign remains at the same in-game time unless the player performed a game action that advanced time before suspension.

No:

- passive healing;
- fatigue gain;
- encounter rolls;
- quest deadline changes;
- enemy turns;
- shop refreshes;
- relationship ticks;

occur from wall-clock background time unless a future explicit gameplay task introduces such a system.

---

## Same-session resume

Definition:

The browser restores the same live JavaScript/session state without full reload/process loss.

Expected behaviour:

- campaign state remains exactly as it was;
- map camera remains;
- active Context/Journal/Party/Log mode remains;
- responsive-shell state remains;
- dialogue/shop/combat/settings remains open if it was open;
- interaction scroll/focus context is restored safely.

### Focus

Mobile browsers may not preserve DOM focus meaningfully.

On resume:

- do not forcibly move focus for touch-only users;
- for keyboard/screen-reader contexts, restore the logical control/heading if the previous focused element is still valid;
- if not, use LR-0051 fallback rules.

### Status

Do not show a modal merely saying **Welcome back**.

A small transient status is acceptable only when something materially changed, such as:

- connection restored;
- update became available;
- autosave failed;
- audio needs user interaction to resume.

---

## Cold restart after process eviction

Definition:

The browser/PWA was killed/evicted and later starts a fresh page/runtime.

Examples:

- Android reclaims memory;
- browser process is killed;
- installed PWA is swiped away;
- phone restarts.

This is not a same-session resume.

Expected flow:

1. load current app shell/build;
2. inspect confirmed persistence through LR-0011/LR-0077;
3. offer/load Manual Save/Autosave according to normal recovery policy;
4. never pretend unsaved in-memory state survived if it did not.

If Autosave was confirmed before eviction:

- resume may use the normal Autosave path.

If the last background autosave attempt never confirmed:

- do not label the resulting older save as latest;
- any lost in-memory progress is simply unavailable after process death;
- support copy should remain truthful if this situation is detected.

---

## Interrupted required dialogue/event

If backgrounded during a required choice:

### Same-session resume

- return to the same required choice;
- no default choice is selected;
- no timer resolves it.

### Cold restart

- behaviour depends on persisted campaign state;
- if the required scene was safely persisted, restore it;
- if not, resume from last confirmed persisted state;
- do not invent a new resolution.

Persistence structure remains LR-0011/runtime ownership.

---

## Interrupted combat

### Same-session resume

- return to exact combat turn and pending action/target state where safe;
- no enemy turns run in background;
- no cooldown/timer advances from wall-clock time;
- audio may remain paused until allowed to resume.

### Cold restart

Resume only from whatever combat/campaign state LR-0011 safely persisted.

If combat is deliberately excluded from persistent state by another system decision, recovery must follow that decision explicitly. Wayfinder must not silently fake a mid-combat continuation.

---

## Settings / FULL_DETAIL / MAP_EXPANDED interruption

Same-session resume preserves presentation state where practical.

Examples:

- Settings remains Settings;
- MAP_EXPANDED remains expanded;
- load chooser remains open if no destructive action was committed.

Cold restart:

- presentation-only overlays normally reset to a safe default;
- campaign state loads independently;
- do not persist a stale destructive confirmation across process death unless a later task explicitly requires it.

---

## Save truthfulness around suspension

### Best-effort background autosave succeeds

Status on same-session resume may remain:

**Autosaved**

No extra modal needed.

### Attempt fails

On resume:

**Autosave unavailable**

> Your current run is still open, but recent progress has not been autosaved.

Do not repeatedly interrupt if the failure has already been acknowledged.

### Browser killed before result known

Do not infer success.

On cold restart, only confirmed persisted data counts.

---

## Update/stale-build behaviour on resume

Consumes LR-0078.

On foreground return:

- runtime may check whether an update is ready;
- do not interrupt an active required dialogue/combat choice;
- mark update pending and surface it when safe;
- do not reload automatically.

If the page was backgrounded long enough that the deployed build changed:

- current same-session game can continue until a safe update point unless a proven compatibility/safety rule requires otherwise;
- build identity remains available for support.

---

## Connectivity changes while backgrounded

Possible sequence:

1. online foreground;
2. background;
3. connection lost/restored;
4. foreground.

On resume:

- report current connectivity state, not every missed transition;
- do not replay a backlog of Offline/Back online toasts;
- save status remains separate.

---

## Audio resume

When returning foreground:

- if browser permits continued/resumed audio, restore according to saved audio preference;
- if a user gesture is required, keep audio paused and expose a normal interaction path to resume;
- never block gameplay waiting for audio;
- do not restart the same ambience in overlapping duplicate instances.

---

## Screen lock

Treat screen lock like background visibility.

No campaign-time progression.

On unlock:

- same-session restoration rules apply if process survived;
- cold-restart rules apply if browser was evicted.

Do not interpret device lock duration as sleeping/resting in-game.

---

## Orientation / viewport changes during interruption

If device orientation changes while backgrounded:

On resume:

- responsive shell reflows under LR-0108;
- logical map camera, mode and active interaction state remain;
- no forced map reset solely because viewport changed while hidden.

---

## Notification / external interruption

Incoming call, notification shade, permission dialog or other temporary interruption:

- if page remains same session, preserve state;
- no implicit cancel/confirm of current action;
- pointer/touch gestures interrupted mid-stream are cancelled under LR-0080;
- require a fresh gesture after return.

---

## Player-visible interruption policy

Most suspend/resume events should be invisible to the player.

Show UI only for meaningful consequences:

- save failed;
- connectivity changed and matters now;
- update ready;
- audio needs user action;
- cold restart means the game is loading persisted state rather than live memory.

Do not spam lifecycle messages.

---

## Implementation guidance for LR-0040/LR-0009

Use lifecycle APIs defensively:

- visibility/page lifecycle events are hints;
- persistence confirmation is authoritative;
- no handler should perform long blocking work;
- do not couple campaign time to Date.now elapsed background duration;
- separate app-shell update logic from campaign save logic.

---

## Acceptance scenarios

### R01 — app switch during map exploration

1. pan map;
2. switch apps for 30 seconds;
3. return.

Pass:

- same game state;
- same campaign time;
- map camera preserved;
- no duplicate input/action.

### R02 — screen lock during dialogue

1. open required dialogue;
2. lock phone;
3. unlock.

Pass:

- same required choice;
- no auto-selection;
- no time advancement.

### R03 — background during combat

1. reach player's turn;
2. choose action but not target;
3. background/return.

Pass:

- pending target state remains;
- no enemy turn occurred.

### R04 — successful background autosave

1. create state change;
2. background;
3. verify autosave confirmation where observable;
4. return.

Pass:

- save status truthful;
- no disruptive modal.

### R05 — failed background autosave

1. block storage;
2. background/return.

Pass:

- current session continues;
- failure shown truthfully;
- no false Autosaved state.

### R06 — process eviction

1. make progress after last confirmed save;
2. simulate/perform process kill;
3. reopen.

Pass:

- game resumes only from confirmed persisted state;
- no claim that unsaved in-memory progress survived.

### R07 — long background duration

1. note day/hour/fatigue;
2. background for several minutes;
3. return.

Pass:

- no game-time/resource changes from wall clock.

### R08 — update becomes available while hidden

1. active required choice/combat;
2. background;
3. make update available;
4. return.

Pass:

- current decision remains primary;
- update does not force reload.

### R09 — audio

1. ambience active;
2. background;
3. return.

Pass:

- no overlapping/continued unwanted audio;
- resume follows browser rules.

### R10 — orientation change while hidden

1. note map/sheet state;
2. background;
3. rotate device;
4. return.

Pass:

- responsive reflow;
- logical state preserved.

---

## Ownership boundaries

LR-0011 owns persistence semantics and schema.  
LR-0009 owns save/autosave interaction.  
LR-0040 owns PWA/browser lifecycle implementation.  
LR-0077 owns save/recovery wording/state.  
LR-0078 owns offline/update/install UX.  
LR-0119 owns suspend/resume/interruption UX contract only.  
LR-0023 independently black-box tests save/resume destruction.

## Acceptance summary

- foreground/background behaviour defined;
- autosave is best-effort and never inferred from lifecycle event;
- same-session versus cold-restart recovery defined;
- no wall-clock campaign advancement;
- update/audio/interruption behaviour defined;
- Android/PWA acceptance scenarios provided;
- no runtime implementation included.
