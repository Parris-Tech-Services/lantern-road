# Lantern Road Mobile Back-Navigation & Exit-Safety Contract

Owner: Agent 5 — The Wayfinder  
Task: LR-0110  
Consumers: LR-0040, LR-0096, LR-0039  
Related UX contracts: LR-0051, LR-0077, LR-0078, LR-0108

## Purpose

On Android and mobile browsers, **Back** is a primary navigation input. Lantern Road should use it predictably without trapping the player, inflating browser history, or accidentally abandoning unsaved play.

This contract defines player-facing behaviour. It does not implement History API routing, Android app integration or browser event interception.

## Core rule

When Lantern Road can safely handle Back inside the current game surface:

> Back closes or unwinds the topmost reversible in-game layer first.

When there is no in-game layer left to unwind:

> Lantern Road yields to normal browser/system navigation instead of trapping the player.

Do not claim to intercept Back in environments where the browser does not expose a reliable event.

---

## Inputs covered

### Browser/system Back

Examples:

- Android system Back gesture/button;
- browser toolbar Back;
- browser edge-swipe Back where exposed through normal history behaviour.

These may not all be independently interceptable. Runtime must feature-test actual history/event behaviour rather than assume equivalence.

### Keyboard Escape

Escape is an in-app dismissal command, not browser history.

Use it for:

- dismissible modal;
- FULL_DETAIL overlay;
- MAP_EXPANDED return;
- expanded non-required detail where defined.

Escape does **not** mean “leave the page”.

### Explicit UI Back/Close

Visible controls must exist wherever a layer can reasonably be closed without relying on system Back/Escape.

---

## Back priority stack

When a Back-like in-app action is available, unwind in this order:

1. **Critical dismissible modal / confirmation**
2. **FULL_DETAIL surface**
3. **MAP_EXPANDED**
4. **Expanded detail/subview that has a clear parent**
5. **Contextual mode detail that was explicitly entered from another shell state**
6. **Normal core play**

At normal core play, do not synthesize another in-game level merely to consume Back.

### Important exception: required decision

Back/Escape must not bypass:

- required story consequence;
- active compact-combat decision;
- mandatory destructive confirmation after the destructive action has already begun;
- another state where closing would create an impossible campaign state.

In those cases:

- system/browser Back handling may warn/guard only where platform support allows;
- visible UI should explain the required next action;
- runtime should not rely solely on interception for correctness.

---

## Modal behaviour

### Dismissible modal

Examples:

- Settings;
- non-destructive support details;
- optional help;
- ordinary load chooser before a slot is selected.

Back/Escape:

- close modal;
- restore prior responsive-shell state;
- restore focus to opener/logical fallback;
- announce closure only when needed for accessibility context.

### Destructive confirmation

Example:

- **Start new campaign?**

First Back/Escape:

- cancel the confirmation;
- preserve existing campaign state.

Do not interpret Back as confirming the destructive action.

### Required modal

Examples:

- mandatory story branch;
- combat state that cannot be dismissed.

Back/Escape:

- do not close;
- return a concise player-facing reason if the input can be detected;
- keep focus inside the required surface.

---

## Responsive-shell behaviour

Consumes LR-0108 states.

### FULL_DETAIL

Back/Escape:

- return to the exact prior useful shell state;
- preserve map camera;
- preserve prior mode;
- restore focus.

### MAP_EXPANDED

Back/Escape:

- **Return to context**;
- restore previous PEEK/STANDARD/EXPANDED state;
- restore prior interaction scroll anchor.

### EXPANDED

Do not automatically treat every EXPANDED sheet as a history level.

If EXPANDED was entered because the player opened a deliberate detail surface:

- Back may return to STANDARD.

If EXPANDED is simply the layout required for current dialogue/Journal content:

- Back follows that content's own close/parent rule;
- do not collapse the sheet and hide a required decision.

### PEEK / STANDARD

No generic in-game Back action is required merely to change PEEK↔STANDARD.

Sheet snap state should not become browser history.

---

## Mode navigation: Context, Journal, Party, Log

Routine tab switches should **not** create a new browser-history entry each time.

Recommended behaviour:

- tabs are sibling modes;
- Back does not cycle through every tab visited;
- if the player opened a secondary detail *inside* Journal/Party/Log, Back may close that detail to the parent mode;
- returning to Context is an explicit tab action, not a browser-history obligation.

This avoids a long Back chain such as:

Log → Party → Journal → Context → expanded sheet → page exit.

---

## Browser history policy

### Do not push history for

- PEEK/STANDARD/EXPANDED snap changes;
- map pan/zoom;
- Context/Journal/Party/Log tab changes;
- transient feedback;
- ordinary modal focus changes;
- combat turns;
- travel outcomes.

### Potentially eligible history states

A later implementation may choose to represent a small number of major UI layers in history when this materially improves Android Back behaviour, for example:

- a top-level FULL_DETAIL layer;
- map expansion;
- another explicitly navigable detail with a stable parent.

If used:

- history state must be shallow;
- repeated opening/closing must not grow unbounded entries;
- reload/direct URL entry must not require impossible reconstruction;
- state must remain presentation-only unless separately designed.

LR-0110 does not require History API use.

---

## Leaving the game

### Confirmed save state

At normal core play with no in-game layer left:

- allow normal browser/system Back/close behaviour;
- do not trap the user with unnecessary confirmation.

### Unconfirmed progress

Consume LR-0077 save status.

Possible states:

- Manual Save confirmed but newer progress not confirmed;
- Autosave unavailable;
- storage unavailable;
- save in progress;
- no confirmed save.

Goal:

- warn only when there is a real risk of losing meaningful unconfirmed progress;
- do not claim browser close/back can always be blocked;
- use reliable in-app status before the player reaches an exit situation;
- avoid repeated nuisance prompts.

### beforeunload / unload warnings

If runtime later uses a browser unload guard:

- use only when progress loss risk is real;
- remove/disable the guard once progress is confirmed saved;
- do not show custom text that browsers ignore;
- do not depend on it as the only protection;
- do not trigger it for harmless navigation inside the game.

---

## Reload/update actions

Explicit **Reload now** from LR-0078:

- evaluate save status first;
- if progress is unconfirmed, show LR-0077 warning;
- Back from that warning cancels reload;
- only explicit **Reload anyway** proceeds unsafely.

Browser-initiated refresh may not be interceptable beyond standard unload protection. Save state must therefore remain truthful before refresh occurs.

---

## Installed/PWA mode

Installed standalone mode may make Back feel app-like, but implementation must remain browser-capability-driven.

Desired behaviour when the platform exposes navigable history:

1. close topmost reversible Lantern Road layer;
2. return through shallow explicit app history where implemented;
3. once at root/core play, allow the platform to leave/minimise/exit according to normal behaviour.

Do not create fake looping history entries just to keep the app open.

---

## Focus restoration

After Back closes an in-game layer:

1. original opener if still present and enabled;
2. equivalent logical control after rerender;
3. relevant parent heading;
4. stable shell control.

Never intentionally send focus to:

- document body;
- hidden map control;
- browser chrome;
- control under an inert/closed layer.

---

## Accessibility announcements

Back-driven closure should usually be quiet if focus restoration makes the transition obvious.

Announce only when context would otherwise be ambiguous, for example:

- **Returned to Context**
- **Map view closed**
- **Settings closed**

Do not announce every sheet snap.

---

## Map interaction

Back never:

- undoes travel;
- rewinds canonical position;
- changes map pan/zoom as an "undo";
- cancels already-resolved game consequences.

Back only changes presentation unless a specific gameplay surface defines a reversible cancel before the action resolves.

---

## Dialogue/event behaviour

### Optional/dismissible dialogue

Back follows the same close rule as visible Close.

### Required dialogue/event choice

Back cannot dismiss the required choice.

If a branch has already resolved:

- Back does not restore the previous choice screen as though it were an undo.

This preserves story consequence.

---

## Combat behaviour

During active combat:

- Back/Escape does not close combat;
- Back does not undo the last turn;
- if Mechanist later adds explicit Retreat, it remains a deliberate combat action, not generic Back behaviour.

After combat resolves and result surface is shown:

- Back behaves according to responsive shell/result presentation, not combat history.

---

## Shop behaviour

Before a transaction resolves:

- Back may close shop if shop is dismissible.

After purchase/sale:

- Back closes shop but does not undo the transaction.

Focus returns to **Visit the market** or equivalent Context action.

---

## Error/recovery surfaces

For save/update/storage errors:

- Back closes informational details where safe;
- Back does not suppress a required destructive choice without returning to a safe state;
- raw technical/support details should always have a clear parent surface.

---

## Failure modes to avoid

### Back trap

Symptoms:

- Back repeatedly leaves player on same screen;
- implementation immediately pushes another identical history entry;
- player cannot leave Lantern Road without force-closing browser/app.

Forbidden.

### Back avalanche

Symptoms:

- every sheet snap/tab/modal creates history;
- player presses Back ten times to leave one play session.

Forbidden.

### Accidental exit

Symptoms:

- Back from Settings/expanded map leaves the site entirely.

Defect when browser/runtime had a reliable way to close the in-game layer first.

### Fake undo

Symptoms:

- Back appears to reverse resolved travel, purchase, combat or story consequence.

Forbidden.

---

## Real-device/browser acceptance matrix

Minimum cases:

### B01 — normal browser core play

- start in core Context;
- press Android/browser Back.

Expected:
- normal browser navigation may occur;
- game does not create a trap.

### B02 — Settings

- open Settings;
- Back.

Expected:
- Settings closes first where app history/event implementation supports it;
- focus returns;
- second Back at root may leave normally.

### B03 — MAP_EXPANDED

- expand map;
- Back.

Expected:
- returns to prior shell state;
- map camera preserved.

### B04 — FULL_DETAIL save/load

- open load chooser;
- Back.

Expected:
- closes chooser without loading/writing anything.

### B05 — destructive New Campaign confirmation

- open confirmation;
- Back.

Expected:
- cancel;
- existing campaign remains.

### B06 — required dialogue

- enter required choice;
- Back/Escape.

Expected:
- choice is not bypassed;
- game remains in valid state.

### B07 — combat

- active player combat turn;
- Back/Escape.

Expected:
- combat remains active;
- no turn undo/exit.

### B08 — repeated tabs

- Context → Journal → Party → Log several times;
- Back.

Expected:
- no long tab-history chain.

### B09 — sheet snapping

- PEEK/STANDARD/EXPANDED repeatedly;
- Back.

Expected:
- no history inflation from snap states.

### B10 — unconfirmed progress

- force Autosave failure;
- attempt explicit reload/leave path.

Expected:
- truthful progress-risk messaging where supported;
- no false save success.

### B11 — PWA/standalone

- repeat modal/map-expanded/core-root Back sequence.

Expected:
- in-game layers unwind first where platform/history allows;
- root does not become an artificial trap.

### B12 — keyboard Escape

- desktop/keyboard, repeat modal/map-expanded/required dialogue/combat cases.

Expected:
- Escape dismisses only allowed presentation layers;
- does not trigger browser navigation.

---

## Consumer handoff

### LR-0096

Implement responsive-shell Back behaviour without making every sheet/tab state history.

### LR-0040

Apply exit/update/reload safety to PWA lifecycle and standalone mode.

### LR-0039

Implement focus/keyboard Escape semantics and announcements.

### LR-0023 / LR-0097

Warden should independently test progress safety and player-observable Back behaviour in real browsers.

---

## Acceptance summary

- Back/Escape priority defined.
- Browser/system Back distinguished from Escape.
- History inflation explicitly forbidden.
- Unconfirmed-progress exit safety defined without relying on abusive unload prompts.
- Focus and announcement restoration defined.
- Browser/PWA acceptance cases provided.
- No runtime/history implementation included.
