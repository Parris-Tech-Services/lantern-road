# Lantern Road System-State Feedback & Recovery Microcopy

Owner: Agent 5 — The Wayfinder  
Task: LR-0083  
Consumers: LR-0009, LR-0039, LR-0040  
Narrative/dialogue ownership remains Agent 2.

## Purpose

Technical failures should read like Lantern Road UI, not browser/debug output. This catalogue standardises short player-facing wording for save, offline, storage, update and unsupported-feature states.

Use implementation details only in an explicit support/details surface.

## Copy rules

- Lead with what happened.
- Say what the player can do next.
- Never imply success when the operation failed.
- Avoid terms such as `localStorage`, `service worker`, cache key, schema key or JavaScript error in normal player copy.
- Prefer **campaign**, **Manual Save**, **Autosave**, **build**, **offline**, **update**.
- Keep titles short enough for phone modals.
- Technical detail may be copied separately for support.

## Catalogue

| State | Severity | Title/status | Player copy | Recovery action |
|---|---|---|---|---|
| Manual Save succeeded | success | Manual Save updated | Your Manual Save is stored on this device. | Continue |
| Autosave succeeded | quiet success | Autosaved | Latest progress saved. | None |
| Manual Save failed | error | Manual Save failed | Lantern Road could not update your Manual Save. | Try again / keep page open |
| Autosave failed | warning | Autosave unavailable | Your current run is still open, but recent progress has not been autosaved. | Save Manual if available |
| No save exists | info | No saved campaign | There is no Manual Save or Autosave on this device yet. | Continue / start campaign |
| Save upgraded | success/info | Campaign upgraded | This older save was updated for the current Lantern Road version. | Continue |
| Save repaired | warning/success | Campaign repaired | Some saved details were restored safely so you can keep playing. | Continue / view details |
| Save unreadable | error | Save could not be loaded | This save was left unchanged because Lantern Road could not recover it safely. | Try other save |
| Newer save | warning | Save from a newer version | This campaign was created by a newer Lantern Road build. It has not been changed. | Update/check build |
| Storage blocked | warning | Saving unavailable on this browser | You can keep playing, but closing or reloading may lose progress. | Keep open / adjust browser storage |
| Storage becomes unavailable | warning | Recent progress is not saved | Your earlier confirmed save is still available, but newer progress has not been stored. | Try Manual Save |
| Offline | quiet warning | Offline | You can keep playing with available cached files until you reconnect. | None |
| Offline start | info | Playing offline | Lantern Road opened from this device's cached files. | Continue |
| Reconnected | quiet success | Back online | Connection restored. | None |
| Update ready | info | Update ready | A newer Lantern Road build is ready. Reload when convenient. | Reload now / later |
| Update + unsaved progress | warning | Update ready — progress not confirmed saved | Save your campaign before reloading if possible. | Save Manual / reload anyway / later |
| Stale build suspected | warning | Your build may be out of date | Reload while online to check for the latest Lantern Road version. | Reload/check build |
| Install unavailable | info only when needed | Install unavailable | This browser does not offer app installation here. You can keep playing normally. | Close |
| Fullscreen unavailable | info | Fullscreen unavailable | This browser does not allow Lantern Road to enter fullscreen here. | Continue |
| Haptics unavailable | passive setting text | Haptics unavailable | This browser does not provide vibration controls. | None |
| Generic unsupported optional feature | info | Feature unavailable | This optional feature is not available in this browser. The game can continue normally. | Continue |
| Action blocked: not enough gold | gameplay warning | Not enough gold | You need {cost} gold for this. | Close / choose another action |
| Action blocked: missing item | gameplay warning | Item required | You need {item} before you can do that. | Close / choose another action |
| Action unavailable due state | gameplay warning | Not available right now | {Plain-language reason}. | Close / choose another action |
| App files refreshed | success | Lantern Road refreshed | The game's app files were refreshed. Your campaign saves were not intentionally deleted. | Continue |
| Refresh failed | error | Refresh failed | Lantern Road could not refresh its app files. Your campaign saves were not intentionally changed. | Retry / view build details |

## Interrupt level

### Quiet status

Use for:

- Autosaved;
- Offline;
- Back online;
- update ready while player is busy;
- passive unsupported settings.

Must not steal focus.

### Modal/dialog

Use when:

- the player explicitly initiated Manual Save/Load and it failed;
- a selected save cannot load;
- a destructive reload/update needs confirmation;
- progress may be lost by the action the player is about to take.

### Critical interruption

Reserve for a state where continuing would be misleading or unsafe. Do not use assertive alerts for routine Autosave or connectivity changes.

## Support details

An optional support/details surface may include:

- version/build identity;
- slot type;
- saved-at timestamp;
- safe compatibility/error category;
- current connectivity state.

It must not expose:

- raw save JSON;
- internal storage keys;
- stack traces;
- unrelated browser/device/account data.

## Accessibility

- status messages must be concise enough for live announcement;
- do not announce both the same toast and the same log entry if one is sufficient;
- error dialogs receive focus under LR-0051;
- quiet status never steals focus;
- actions such as **Reload anyway** must not be default-focused when destructive.

## Tone boundary

This file covers system/interface language only.

It must not:

- write character dialogue;
- add lore flavour to technical errors;
- use quippy humour when the player may have lost progress;
- rename canonical game/world terms.

## Implementation handoff

LR-0009 consumes save/load and support/build wording.  
LR-0040 consumes offline/install/update/cache-recovery wording.  
LR-0039 consumes announcement/interruption rules.

Runtime implementations may tighten wording to fit the screen, but must preserve:

- the truthfulness of success/failure;
- the recovery action;
- Manual Save versus Autosave distinction;
- lack of browser jargon;
- non-destructive wording guarantees.
