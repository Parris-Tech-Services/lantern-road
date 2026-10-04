# Lantern Road PWA Lifecycle & Offline UX Contract

Owner: Agent 5 — The Wayfinder  
Task: LR-0078  
Runtime consumer: LR-0040  
Related foundations: LR-0050 service-worker freshness, LR-0063 build provenance, LR-0068 release recovery

## Purpose

Lantern Road should behave like a dependable phone game when installed or used from a browser, without pretending that browser/PWA support is identical everywhere.

This contract defines what the player sees when the game is installable, installed, updating, offline, reconnecting, or recovering from a stale cached build. It does not implement the service worker, install API, release rollback, or persistence schema.

## Principles

1. **Do not confuse connectivity with save safety.** Being offline does not automatically mean the campaign is unsaved, and being online does not guarantee a save write succeeded.
2. **Never interrupt a consequential choice or compact-combat turn just to apply an update.**
3. **Prefer clear status over browser jargon.** Say **Offline** or **Update ready**, not “service worker waiting”.
4. **Updates must not silently discard in-memory progress.**
5. **Installability is enhancement, not a requirement to play.**
6. **A stale build should be diagnosable through the visible version/build surface without making support details dominate normal play.**
7. **Failure must degrade to a playable browser experience wherever technically possible.**

## Lifecycle states

### Browser session, not installed

Default state when Lantern Road is opened normally in a supported browser.

Player experience:

- game launches normally;
- no persistent “install” nag is required;
- when a trustworthy install opportunity exists, a small optional **Install Lantern Road** action may be shown in Settings/About or another unobtrusive surface;
- dismissing install should not repeatedly interrupt the player in the same session.

If the browser provides no install prompt API, the game remains fully playable without showing a broken install button.

### Install available

Show a clear optional action only when the platform/browser has actually indicated installability or when documented manual-install instructions are valid.

Recommended copy:

**Install Lantern Road**

> Add Lantern Road to your device for easier launch and offline reopening.

Actions:

- **Install**
- **Not now**

Do not promise all assets or campaign progress are permanently available offline merely because installation succeeds.

### Already installed / standalone mode

Installed state should not materially change gameplay rules.

Settings/About may display:

- **Installed app**
- current version/build identity;
- current connectivity state when relevant.

Do not duplicate normal browser controls unnecessarily.

## Connectivity states

### Online

Normal state. No persistent “Online” badge is necessary unless recovering from a recent outage.

Save status remains independently owned by the save/recovery UX.

### Connection lost during play

Recommended non-blocking feedback:

**Offline**

> You can keep playing. Lantern Road will use available cached files until you reconnect.

Rules:

- do not claim saves are safe or unsafe solely from connectivity;
- preserve focus;
- do not open a modal automatically;
- if a later resource/action genuinely requires the network, explain that specific limitation then.

### Offline start

If a usable cached shell exists:

**Playing offline**

> Lantern Road opened from this device's cached files.

The player may continue using whatever local gameplay/save capabilities remain available.

If critical app-shell files are unavailable and the game cannot start, show the simplest recoverable browser-level failure possible once LR-0040 has a controlled fallback surface. Do not create a fake partially loaded game.

### Reconnected

Show a short transient status:

**Back online**

> Connection restored.

Do not force a reload merely because connectivity returned.

If a newer build is detected after reconnecting, transition to **Update ready**, not immediate reload.

## Update states

### No update

No player-visible update UI is required.

### Update downloading/checking

Normally silent.

If an explicit player action initiated the check, brief feedback may say **Checking for updates…**.

Do not leave an indefinite spinner/status if the browser does not provide reliable progress events.

### Update ready while game is idle/safe

Recommended notice:

**Update ready**

> A newer Lantern Road build is ready. Reload when convenient.

Actions:

- **Reload now**
- **Later**

Before **Reload now**:

- if current in-memory progress is not confirmed saved, warn using the LR-0077 save/recovery model;
- do not imply a successful save unless persistence confirmed it.

### Update ready during combat, dialogue choice, event resolution, shop transaction or other consequential modal

Do not interrupt the active decision.

Rules:

- mark update as pending;
- show at most a small non-modal status;
- offer **Reload now** only after the player exits the consequential flow or explicitly opens Settings/About;
- never replace the active modal with an update modal.

### Update ready with unconfirmed progress

Recommended wording:

**Update ready — current progress is not confirmed saved**

> Save your campaign before reloading if possible.

Actions depend on available persistence state:

- **Save Manual**
- **Reload anyway**
- **Later**

**Reload anyway** must be an explicit destructive decision, not the default focus target.

### Update applied after reload

Briefly show:

**Lantern Road updated**

Include build/version only in Settings/About or support detail unless the update itself needs diagnosis.

Do not display a celebratory modal on every normal cache refresh.

## Stale-build recovery

A stale build may be suspected when:

- support identifies an old visible build;
- a newer-version save refuses to load;
- deployed build identity and loaded shell identity differ;
- a known cache-recovery condition is detected by later implementation.

Normal player copy should avoid certainty unless detection is definitive.

Recommended surface:

**Your Lantern Road build may be out of date**

> Reload while online to check for the latest version.

Actions:

- **Reload and check**
- **Later**
- **View build details**

If recovery requires more than reload, LR-0040 may expose a controlled **Refresh app files** action only if it is proven not to delete campaign save data.

Never label a cache-clearing action **Reset game** if it does not intentionally reset campaign data.

## Cache recovery safety

Any future cache-recovery action must distinguish:

- app-shell/cache files;
- campaign save data;
- UI/accessibility preferences.

A player-facing recovery action that clears app cache must explicitly preserve campaign saves unless the persistence owner has documented otherwise.

Recommended confirmation when needed:

**Refresh Lantern Road files?**

> This refreshes the game's cached app files. Your Manual Save and Autosave will not be intentionally deleted.

If the implementation cannot guarantee that promise, the action must not use that wording.

## Install/update API unavailable

When an API is missing:

- hide or disable only the feature that depends on it;
- explain unavailable optional features where necessary;
- keep the core game playable;
- never show a dead **Install** or **Update** button;
- never tell the player their browser is “unsupported” when only one optional PWA capability is unavailable.

## Offline asset behaviour

LR-0050 owns the network/cache strategy. From the UX perspective:

- previously available same-origin shell/assets should reopen where cached;
- missing optional assets should degrade gracefully where possible;
- the game should not substitute stale gameplay logic silently if a mixed-version shell would be unsafe;
- build provenance from LR-0063 should eventually allow support/tests to identify the loaded build accurately.

## Save and connectivity separation

Examples:

### Offline + Autosaved

Valid message combination:

- connectivity: **Offline**
- save: **Autosaved**

Do not combine into **Offline — not saved** unless a write actually failed.

### Online + save write failed

Valid message combination:

- no connectivity warning;
- save: **Manual Save failed** or **Autosave unavailable**.

Do not hide persistence failure merely because the network is available.

### Reconnected + unsaved progress

Valid message combination:

- transient **Back online**
- persistent save state remains **Not saved yet** / **Autosave unavailable** until a write succeeds.

## Focus and accessibility

- connection/update status must not steal focus;
- install/update modals, when explicitly opened, follow the LR-0051 modal focus contract;
- no automatic reload occurs while assistive-technology focus is inside a consequential modal;
- update/recovery actions have text labels, not icon-only affordances;
- status announcements are concise and de-duplicated.

## Phone placement

Preferred hierarchy:

1. transient connectivity/update-ready indicator in a non-obscuring status area;
2. detailed controls in Settings/About;
3. destructive recovery/reload confirmation only when the player initiates it or immediate action is genuinely required.

Do not cover:

- bottom thumb tabs;
- modal Close;
- travel controls;
- combat actions;
- save/load buttons.

Safe-area and floating-control details are further specified by LR-0081.

## Update timing decision table

| Situation | Auto reload? | Show prompt now? | Recommended action |
|---|---:|---:|---|
| Title/idle surface, save confirmed | No | Yes | Offer Reload now / Later |
| Exploring map, no modal, save confirmed | No | Yes, non-blocking | Offer reload at player choice |
| Dialogue/event choice active | No | No modal | Mark update pending |
| Compact combat active | No | No modal | Mark update pending |
| Shop transaction flow active | No | No modal | Mark update pending |
| Unsaved/unconfirmed progress | No | Yes only from safe surface | Encourage save first |
| Offline | No | No update claim unless already known | Wait for reconnect |
| Reconnected with update detected | No | Yes when safe | Offer reload |
| Stale-build recovery initiated by player | No | Yes | Explain effect, then reload/refresh |

## LR-0040 implementation checklist

- [ ] Browser play works even if install APIs are absent.
- [ ] Install action only appears when usable.
- [ ] Offline/online state is separate from save state.
- [ ] Connection loss/reconnect does not steal focus.
- [ ] Update-ready state never auto-reloads during dialogue/event/combat/shop decisions.
- [ ] Reload warning accounts for unconfirmed progress using LR-0077.
- [ ] App-file/cache recovery does not silently delete campaign saves.
- [ ] Stale-build recovery exposes visible version/build information.
- [ ] Optional unsupported PWA features fail gracefully.
- [ ] Installed and browser modes share gameplay behaviour.
- [ ] Phone status/recovery UI respects LR-0051 accessibility and LR-0081 safe-area rules.
- [ ] LR-0050 freshness behaviour is preserved rather than replaced by a new cache-first strategy.

## LR-0068 boundary

LR-0068 owns operator/release rollback validation, not this task.

This UX contract only requires that if a rollback/recovery affects the player:

- mixed-build states are not silently presented as normal;
- save data is protected;
- version/build identity remains diagnosable;
- player recovery copy says what action will happen without exposing deployment jargon.
