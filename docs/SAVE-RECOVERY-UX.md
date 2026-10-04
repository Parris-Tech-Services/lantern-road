# Lantern Road Save & Recovery UX State Model

Owner: Agent 5 — The Wayfinder  
Task: LR-0077  
Runtime consumers: LR-0009, LR-0040  
Validation consumer: LR-0023  
Persistence owner: LR-0011

## Purpose

Lantern Road needs one predictable player-facing model for Manual Save, Autosave, loading and recovery. LR-0011 owns the schema, migrations, validation and compatibility rules. This document does **not** redefine that persistence contract. It defines what the player sees and can safely do when persistence succeeds, fails or needs recovery.

The governing rule is simple:

> Never tell the player data was saved unless the persistence layer confirmed the write, and never destroy a recoverable Manual Save as part of a failed load or new-campaign flow.

## Save slots

### Manual Save

**Manual Save** is the player-controlled checkpoint.

- It changes only when the player deliberately chooses **Save Manual**.
- Starting a new campaign never overwrites Manual Save.
- Loading Autosave never overwrites Manual Save.
- A failed Manual Save leaves the previous Manual Save untouched whenever the persistence layer can preserve it.
- Player-facing copy calls it **Manual Save**, not “slot 1”, a storage key or a schema object.

### Autosave

**Autosave** follows recent play.

- It may update after safe state-changing moments chosen by the runtime.
- Starting a new campaign may replace Autosave after the player confirms the new campaign.
- Autosave failure must not claim the run is saved.
- Autosave failure does not disable play; the UI should recommend Manual Save if that path is still available.
- Player-facing copy calls it **Autosave**.

## Save status model

A compact persistent status surface may show one of:

| State | Player-facing status | Behaviour |
|---|---|---|
| manual-current | **Manual Save updated** | A confirmed Manual Save write succeeded. |
| auto-current | **Autosaved** | A confirmed Autosave write succeeded. |
| auto-pending | **Saving…** | A write is in progress; do not leave this indefinitely. |
| unsaved-session | **Not saved yet** | Current session has no confirmed save. |
| auto-failed | **Autosave unavailable** | Continue play; explain how to try Manual Save. |
| manual-failed | **Manual Save failed** | Do not replace “failed” with success copy; prior Manual Save remains the recovery target when available. |
| storage-unavailable | **Saving unavailable on this browser** | Play may continue, but the user must be told progress may not survive closing the page. |

Do not use “Saved” merely because an in-memory state changed.

## Load chooser

When both slots exist, **Load** opens a chooser rather than silently preferring one.

Recommended presentation:

- **Manual Save** — show the best safe summary available, such as campaign day and location.
- **Autosave** — show the equivalent summary.
- **Keep current campaign** — closes without changing state.

If only one slot exists, the chooser may show only that slot plus **Keep current campaign**.

Loading a slot never writes to either slot as a side effect before the load has been validated and accepted by LR-0011.

## State model

### 1. Save succeeds

Trigger: persistence layer confirms a Manual Save or Autosave write.

Player response:

- update the persistent save-status surface;
- for Manual Save, show a brief visible confirmation;
- do not interrupt play with a large modal for every Autosave;
- screen-reader announcement should be concise: **Manual Save updated** or **Autosaved**.

Focus:

- Manual Save confirmation returns focus to the Save control or logical next action.
- Autosave never steals focus.

### 2. Save write fails

Examples include blocked storage, storage quota, private/incognito restrictions or another persistence error.

Player response:

- show **Manual Save failed** or **Autosave unavailable**, matching the attempted action;
- never say the slot was updated;
- preserve the previous confirmed slot when the persistence layer reports it is still intact;
- explain one recovery action in plain language, for example **Keep this page open and try again, or free browser storage**;
- technical detail may be available in a support/details surface but should not replace the player message.

Focus:

- Manual Save failure should focus the failure dialog/status only when the player explicitly initiated the save.
- Background Autosave failure should not steal focus.

### 3. No save exists

Trigger: player chooses Load when neither slot exists.

Copy:

**No saved campaign**

> There is no Manual Save or Autosave on this device yet.

Actions:

- **Continue current campaign** if a campaign is running;
- **Start new campaign** only where context makes sense.

No storage implementation terms.

### 4. One slot is missing

If Manual Save is absent but Autosave exists, offer Autosave normally. Do not frame missing Manual Save as corruption.

If Autosave is absent but Manual Save exists, offer Manual Save normally. Do not create an Autosave simply by opening Load.

### 5. Valid current-version load succeeds

Trigger: LR-0011 validates and decodes the selected slot successfully.

Response:

- replace in-memory campaign state only after decode/validation succeeds;
- clear transient modal/UI state that cannot safely resume;
- show **Manual Save loaded** or **Autosave loaded** with campaign day/location where useful;
- loading one slot does not alter the other slot.

Focus:

- move to the primary game surface or current Context heading after load;
- do not return focus to stale controls from the pre-load campaign.

### 6. Older save migrates successfully

Trigger: LR-0011 reports successful migration from an older supported format.

Response:

**Campaign upgraded**

> This older save was updated for the current Lantern Road version. Your campaign is ready to continue.

Rules:

- if LR-0011 preserves a legacy backup, that is implementation/recovery detail and need not be foregrounded unless later recovery is required;
- do not expose internal schema numbers in normal player copy;
- a support/details section may include source/current schema and build identity.

The upgraded slot should be rewritten only according to LR-0011 policy. Wayfinder must not invent an independent migration write path.

### 7. Partial save is repaired safely

Trigger: LR-0011 validates the save, restores safe defaults for missing/invalid fields and reports warnings.

Response:

**Campaign repaired**

> Some saved details were restored safely so you can keep playing.

If the persistence layer can identify meaningful lost detail, summarise it in player terms. Do not dump internal field names.

A repaired load must never be described as fully intact if LR-0011 reports meaningful loss.

### 8. Save is unreadable or unsafe to repair

Examples: invalid JSON, invalid top-level structure, missing required campaign state or unsupported corruption.

Response:

**Save could not be loaded**

> This save was left unchanged because Lantern Road could not recover it safely.

Actions:

- **Try the other save** when the other slot exists;
- **Keep current campaign** if a current run is active;
- **Start new campaign** only as an explicit separate action;
- **Copy support details** when the diagnostic/support surface exists.

Rules:

- do not overwrite the failing slot merely because load failed;
- do not automatically fall back to another slot without telling the player which campaign is being loaded.

### 9. Save comes from a newer unsupported version

Trigger: LR-0011 reports the stored save is newer than the current compatible format.

Response:

**Save from a newer version**

> This campaign was created by a newer Lantern Road build. It has not been changed. Update the game before trying again.

Actions:

- **Check current build** / show Settings/About where build identity exists;
- **Try the other save** if available;
- **Keep current campaign**.

Rules:

- never migrate downward;
- never overwrite the newer save;
- include visible game/build identity in the support/details surface.

### 10. Stale code/build is suspected

Signals may include a newer-save rejection, known stale service-worker state, or support diagnosis.

Player response should not guess that cache staleness is definitely the cause.

Recommended wording:

**Build information**

> Lantern Road version: [version]  
> Build: [build identity]

If an update/reload action is available through LR-0040, offer it there. LR-0063 owns machine-readable provenance; LR-0009 owns the visible Settings/About surface.

### 11. Storage is unavailable from session start

If storage access is blocked before the first save:

- play remains available unless a separate technical requirement makes that impossible;
- show a persistent but non-modal warning: **Saving unavailable on this browser**;
- explain that closing/reloading may lose progress;
- do not repeatedly interrupt the player after every state change;
- Manual Save may remain enabled only if retrying can genuinely succeed; otherwise disable it with an explanation.

### 12. Storage becomes unavailable mid-session

If earlier saves exist but new writes fail:

- preserve and continue to offer the last confirmed Manual Save/Autosave;
- status changes to **Autosave unavailable** or **Manual Save failed** after the relevant failure;
- do not relabel the old slot as current;
- if the player tries to leave/reload while progress is unconfirmed, later LR-0040 work may provide a warning, but browser-native unload prompts must not be abused.

## Destructive flows

### New Campaign

When an existing campaign or Autosave exists:

**Start new campaign?**

> A new campaign will replace the current Autosave. Your Manual Save will stay unchanged.

Actions:

- **Start new campaign**
- **Keep current campaign**

Rules:

- do not overwrite Manual Save;
- create/replace Autosave only after the new campaign becomes active and a confirmed autosave succeeds;
- if that autosave fails, say so. The new in-memory campaign may continue, but it is not “saved”.

### Replacing Manual Save

Pressing **Save Manual** is the explicit consent to replace the Manual Save.

If a future design adds multiple Manual Save slots or a destructive import, that needs a separate decision/task; do not infer it here.

## Support/details surface

Normal play uses plain-language messages. A support/details surface may expose:

- game version;
- build identity from LR-0063 when available;
- slot type: Manual Save or Autosave;
- safe saved-at timestamp;
- schema/source compatibility detail supplied by LR-0011;
- non-sensitive error category.

It must not expose raw local storage, full save JSON, arbitrary browser storage or unrelated device/account data.

## Focus and accessibility behaviour

- Explicit Save/Load actions may open a modal; focus enters the modal heading or first safe choice.
- Autosave status never steals focus.
- Load chooser is a labelled dialog and traps focus under the LR-0051 contract.
- After successful load, focus moves into the loaded game state, not back to an obsolete pre-load control.
- Failure dialogs return focus to the initiating control or a stable fallback.
- Status announcements are concise and not duplicated by both an alert and a noisy live log.
- Slot names and outcomes are text, not colour-only state.

## Copy catalogue

| Situation | Title/status | Recommended player copy |
|---|---|---|
| Manual save success | Manual Save updated | Your Manual Save is stored on this device. |
| Autosave success | Autosaved | Latest progress saved. |
| Manual write failure | Manual Save failed | Lantern Road could not update your Manual Save. The previous confirmed save was not intentionally replaced. |
| Autosave failure | Autosave unavailable | Your current run is still open, but recent progress has not been autosaved. |
| No slots | No saved campaign | There is no Manual Save or Autosave on this device yet. |
| Migration success | Campaign upgraded | This older save was updated for the current Lantern Road version. |
| Safe repair | Campaign repaired | Some saved details were restored safely so you can keep playing. |
| Unrecoverable | Save could not be loaded | This save was left unchanged because Lantern Road could not recover it safely. |
| Newer version | Save from a newer version | This campaign was created by a newer Lantern Road build. It has not been changed. |
| Storage blocked | Saving unavailable on this browser | You can keep playing, but closing or reloading may lose progress. |

Exact runtime wording may be tightened for layout, but the meaning and safety promises above must remain intact.

## Ownership boundaries

### LR-0011 owns

- schema/version identifiers;
- migrations;
- validation/normalisation;
- compatibility policy;
- malformed/partial-save categorisation;
- persistence API and safe rewrite/backup rules.

### LR-0009 owns

- Manual Save/Autosave interaction;
- load chooser;
- player-facing save status;
- focus/phone presentation;
- calling the shared LR-0011 persistence API.

### LR-0040 owns

- offline/update/lifecycle presentation around persistence;
- reconnect/update flows;
- PWA-specific recovery presentation.

### LR-0063 owns

- machine-readable build provenance.

### LR-0023 owns

- independent destructive black-box save/load/resume testing.

## LR-0009 implementation checklist

Before LR-0009 can merge after LR-0011 is available:

- [ ] Manual Save and Autosave both encode/decode through the LR-0011 shared API.
- [ ] No parallel JSON parser/migration/validation path remains in Wayfinder code.
- [ ] Manual Save is never overwritten by New Campaign or loading Autosave.
- [ ] A write is called successful only after persistence confirms it.
- [ ] Load chooser identifies Manual Save versus Autosave.
- [ ] A failed selected slot remains unchanged.
- [ ] Other valid slot remains available after one slot fails.
- [ ] Newer-version save is left untouched and gives update/build guidance.
- [ ] Repair/migration success is distinguishable from an ordinary intact load.
- [ ] Autosave failures do not steal focus.
- [ ] Save/load dialogs satisfy the LR-0051 modal/focus contract.
- [ ] Build identity shown for support comes from the canonical provenance source when LR-0063 exists.

## LR-0023 destructive test handoff

Warden should independently try, in a real browser:

1. Manual Save, play onward, Autosave, load each slot and verify different state.
2. Start New Campaign and verify Manual Save remains recoverable.
3. Force/fixture a malformed Manual Save while Autosave is valid; verify failure does not destroy either slot and Autosave remains loadable.
4. Force/fixture a newer-version save; verify it is not overwritten.
5. Block storage writes after an earlier confirmed save; verify the UI reports failure rather than falsely advancing save status.
6. Reload after an Autosave and verify expected recent state.
7. Exercise migration/repair fixtures supplied by LR-0011 and verify the player-facing distinction between upgraded, repaired and failed load.
8. Verify save/load status remains readable and operable on phone widths and with enlarged text.
