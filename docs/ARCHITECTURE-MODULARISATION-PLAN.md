# Lantern Road — Modularisation Blueprint

Task: **LR-0099**  
Owner: **Agent 1 — The Steward**  
Purpose: prepare LR-0010 without editing the live runtime during the grandfathered feature wave.

## Why this split is needed

The current browser game is still deliberately simple to deploy, but the implementation has outgrown the original two-file shape.

Current main measured on 4 October 2026:

- `game.js`: **3,494 lines**, **161 named functions**, about **135 KB**
- `content.js`: **3,261 lines**, about **79 KB**
- runtime scripts: `content.js` → `game.js` → portal adapter

The file size itself is not the main problem. The problem is that unrelated systems share the same edit surface.

The highest-collision areas are already visible:

- `handleSiteAction`: ~293 lines
- `buildNpcDialogue`: ~347 lines
- `handleDialogueChoice`: ~99 lines
- `resolveTurnIn`: ~116 lines
- combat state, AI, actions and resolution live in one contiguous block
- map model, map drawing, pointer handling and general rendering share the same runtime closure
- inventory, factions, services, quest mutation, party relationships and effect application all mutate the same `state` directly

Upcoming work makes this worse if no boundary is created first:

- LR-0090 stateful dialogue and NPC memory
- LR-0093 companion autonomy
- LR-0098 action-cost/repeat-use rules
- LR-0015 combat depth and enemy intent
- LR-0016 economy pressure
- LR-0017 equipment
- LR-0018 injuries/recovery
- LR-0073 canonical atlas-backed map rendering
- LR-0096 persistent-map responsive UI

LR-0010 should therefore be a **controlled extraction**, not a rewrite.

## Architectural constraints

These constraints are intentional.

1. **Keep the static-browser deployment model.** Lantern Road must still run as ordinary files on GitHub Pages.
2. **No framework migration.** LR-0010 must not become a React/Vue/Svelte rewrite or introduce a build pipeline solely to modularise.
3. **Preserve `window.CONTENT` compatibility during the transition.** Existing runtime and tests should keep working while content is split.
4. **Preserve the shared save contract.** LR-0011 remains authoritative for save schema/version/migration.
5. **Preserve visible behaviour while extracting.** New gameplay belongs to later specialist tasks.
6. **Extract by responsibility, not by arbitrary file size.**
7. **Prefer pure functions and explicit dependencies over more globals.**
8. **Every extraction step must be independently reversible.**

## Target shape

The end of LR-0010 does not need a perfect final architecture. It needs enough stable seams that the second wave stops editing the same monolith.

Recommended target:

```text
index.html
content/
  world.js
  actors.js
  systems.js
  narrative.js
  assemble.js
src/
  core/
    rng.js
    state.js
    effects.js
  save/
    persistence.js
  world/
    map-model.js
    travel.js
  party/
    party.js
    relationships.js
  quests/
    quests.js
  economy/
    inventory.js
    services.js
  dialogue/
    dialogue.js
  combat/
    combat.js
  ui/
    feedback.js
    tabs.js
    modals.js
    map-renderer.js
  audio/
    audio.js
game.js
```

This is a **direction**, not a requirement to extract every proposed file during LR-0010. LR-0010 should prioritise the seams that unblock the queued second wave.

## Compatibility pattern

Avoid converting the whole app to ES modules in one step.

For the first extraction wave, use the same lightweight browser-compatible pattern already proven by the save work:

```js
(function (root, factory) {
  const api = factory();
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (root) root.LanternRoad = root.LanternRoad || {};
  if (root) root.LanternRoad.SomeModule = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";
  // pure or explicitly injected implementation
  return { ...publicApi };
});
```

Benefits:

- plain `<script>` loading still works;
- Node-based unit tests can require pure modules;
- GitHub Pages needs no bundler;
- extraction can occur one module at a time;
- `game.js` can become a bootstrap/orchestration layer gradually.

ES modules can be reconsidered later through a deliberate architecture decision. They are not required for LR-0010.

## Content split

The single `content.js` object should be split by **authorship ownership** while retaining a final `window.CONTENT` aggregate.

### `content/world.js`

Owns:

- region dimensions and tiles
- terrain definitions
- weather definitions
- settlements
- sites
- canonical geographic metadata

Primary consumers/owners:

- Director for canon decisions
- Steward for schema/rendering integration
- Wayfinder for map UX
- Storyteller for approved place lore only

### `content/actors.js`

Owns:

- factions
- party/companion templates
- NPC identity metadata

Primary consumers:

- Storyteller
- Mechanist
- dialogue/party modules

### `content/systems.js`

Owns:

- items
- enemy archetypes
- encounters
- other primarily mechanical catalogues

Primary consumer:

- Mechanist

### `content/narrative.js`

Owns:

- rumours
- quest metadata
- travel/camp event data
- character camp moments
- decision reactions
- later stateful dialogue content once its schema is approved

Primary consumer:

- Storyteller

### `content/assemble.js`

Creates the backwards-compatible aggregate:

```js
window.CONTENT = {
  ...window.LanternRoadContent.world,
  ...window.LanternRoadContent.actors,
  ...window.LanternRoadContent.systems,
  ...window.LanternRoadContent.narrative
};
```

The aggregate remains read-only configuration from the runtime's perspective.

## Runtime module contracts

### 1. Core RNG/state

Move first because many later modules need them but they do not need DOM access.

Public contract should cover:

- deterministic RNG
- safe state reads/helpers
- controlled state mutation helpers where a dedicated subsystem does not own the mutation
- log append
- invariant-friendly helpers

Do **not** create an abstract Redux-like store. Keep it small.

### 2. Save/persistence adapter

LR-0011 remains authoritative.

The runtime should call a small persistence adapter:

```text
save(state)
load(defaultState) -> { state, migrationInfo, warnings }
hasSave()
```

No specialist module may write directly to localStorage for campaign state.

Audio/accessibility preferences may retain their separate preference storage contracts.

### 3. Effect executor

Current `applyEffects` is a major cross-system coupling point.

Extract a single explicit command/effect dispatcher before the new action/dialogue systems arrive.

Target contract:

```text
applyEffects(state, effects, context) -> result
```

Effects can route to subsystem-owned operations, but authored content should not directly mutate arbitrary state.

This gives dialogue, sites, events and combat a shared way to request consequences.

### 4. World/map model

Own:

- tile lookup
- location lookup
- odd-r geometry conversion/distance
- neighbourhood/reveal logic
- travel eligibility and travel-state mutation

Do not include canvas drawing here.

This is the stable model consumed by LR-0073 and LR-0096.

### 5. Party/relationship model

Own:

- party member lookup
- HP/status helpers
- loyalty/trust
- memories
- inter-party relationships
- later player-leader/companion state

This becomes the home for LR-0093.

It must not own authored dialogue prose.

### 6. Quest/narrative state

Own:

- reveal/accept/stage/complete/fail
- rumour discovery
- named consequence/world-state markers used by narrative

Storyteller-authored content remains data; this module owns state transitions.

### 7. Economy/services

Own:

- inventory quantity/change
- buy/sell
- settlement service costs
- rest/resource spending
- faction-aware price modifiers once LR-0005/LR-0016 land

This becomes the technical home for LR-0016/LR-0017/LR-0018 integrations rather than adding more conditionals to settlement rendering.

### 8. Dialogue runtime

Extract current dialogue lifecycle and choice resolution after the generic effect/state seams exist.

Initial public contract should be deliberately small:

```text
openConversation(actorId, context)
getConversationView(state, actorId, context)
chooseConversationOption(optionId)
closeConversation()
```

LR-0090 can then replace/extend the implementation with conversation memory and graph traversal without editing unrelated map/combat code.

The current `buildNpcDialogue` 347-line switch/conditional hotspot should **not** simply be moved whole into a new file and declared modular. The extraction must separate:

- authored conversation data
- condition evaluation
- conversation state/memory
- view-model construction
- effect execution

### 9. Combat/actions

Own:

- combat lifecycle
- turn order
- enemy decisions
- hero action availability
- action costs/recharge
- attack resolution
- victory/defeat/loot

LR-0094/LR-0098 and LR-0015 should target this module.

Combat rendering stays in UI.

### 10. UI renderers

Separate rendering from game-state mutation.

At minimum create boundaries for:

- feedback
- tabs/context
- modal view construction
- map renderer
- event binding/controller bridge

The persistent responsive play shell in LR-0096 should be able to replace layout/render composition without rewriting travel/dialogue/combat mechanics.

### 11. Audio

Audio is already conceptually self-contained at the top of `game.js`.

It is a low-risk extraction candidate after the core test harness is stable, but it is **not** a prerequisite for the new gameplay work.

## Proposed LR-0010 extraction order

### Stage 0 — establish baseline

Required before extraction:

- final LR-0011 save implementation merged
- final LR-0013 browser regression harness merged
- LR-0005/LR-0006/LR-0009 grandfathered branches reconciled and merged
- run content integrity validation once LR-0059 merges
- capture current browser-regression results

If the baseline is not green, LR-0010 should not start moving code.

### Stage 1 — pure helpers and lookups

Extract:

- RNG
- odd-r map geometry
- content lookup/index construction
- simple inventory/faction/party lookup helpers

Risk: low.

Verification:

- Node unit checks for pure helpers
- full browser smoke/regression

### Stage 2 — persistence and state operations

Adopt LR-0011's final save adapter.

Extract:

- campaign-default creation
- persistence orchestration
- quest/rumour transitions
- relationship/memory transitions
- inventory/faction mutation helpers

Risk: medium because many features touch state.

Verification:

- legacy save fixture suite
- current save round-trip
- browser regression

### Stage 3 — effect executor

Extract the shared effect-command interpretation currently concentrated in `applyEffects`.

Risk: medium/high.

Rollback boundary:

- retain the old dispatcher until parity tests pass;
- switch callers only after the new dispatcher passes equivalent scenario tests.

This stage is critical before stateful dialogue and repeat-use action work.

### Stage 4 — map/travel model

Extract map geometry/model and travel/time behaviour from map drawing.

Keep canvas renderer in `game.js` temporarily if needed.

Risk: medium.

Required before:

- LR-0073 canonical atlas-backed rendering
- LR-0096 persistent-map play shell

### Stage 5 — party, dialogue and combat seams

Extract **contracts first**, then move implementation:

1. party/relationship model
2. dialogue lifecycle and view model
3. combat lifecycle/actions

Do not combine all three into one PR-sized change if smaller sequential commits/PRs are possible inside LR-0010's single scope.

Risk: high.

This stage is the main unblocker for:

- LR-0090
- LR-0093
- LR-0098
- LR-0015

### Stage 6 — service/economy seam

Extract inventory/service/shop/rest calculations and operations.

Risk: medium.

Main unblockers:

- LR-0016
- LR-0017
- LR-0018

### Stage 7 — rendering decomposition

Extract feedback, tabs/modals and map rendering from state-changing handlers.

Keep `game.js` as bootstrap/controller glue.

Risk: medium/high because DOM wiring is broad.

Main unblockers:

- LR-0073
- LR-0096
- later accessibility work

### Stage 8 — split authored content

Only after runtime consumers have stable lookup contracts.

Split `content.js` into world/actors/systems/narrative files and assemble `window.CONTENT`.

Risk: medium.

Do this late enough that the content split does not create extra conflict while runtime extraction is still moving references.

## Queue-to-module ownership map

| Queue work | Intended module |
|---|---|
| LR-0005 world/faction consequence integration | quests/narrative state + economy modifier hook |
| LR-0006 progression | party + systems content |
| LR-0007 events | narrative content + effect executor |
| LR-0008 campaign/endings | narrative content + quest/narrative state |
| LR-0015 combat depth | combat/actions |
| LR-0016 economy | economy/services |
| LR-0017 equipment | party/equipment + economy/services |
| LR-0018 injuries/recovery | party/conditions + economy/services |
| LR-0073 canonical map renderer | world/map model + UI map renderer |
| LR-0090 stateful dialogue | dialogue |
| LR-0093 companion autonomy | party/relationships/companions |
| LR-0096 persistent-map responsive shell | UI composition only |
| LR-0098 action costs/repeat rules | combat/actions + effect/repeat-policy contract |

If one of these tasks needs to edit unrelated modules, it should justify that in its PR rather than silently broadening scope.

## Temporary compatibility shims

LR-0010 may use these temporarily:

- `window.CONTENT` aggregate even after content files split
- `window.LanternRoad.<Module>` browser namespaces
- small forwarding functions left in `game.js` while callers migrate
- legacy event/effect shapes translated at the module boundary

Temporary shims must be:

- named/documented;
- covered by tests;
- scheduled for removal in LR-0010 or a specific follow-up task.

Do not leave generic “TODO remove later” glue with no owner.

## Testing contract for every extraction step

Each extraction step must run the relevant subset plus the full critical baseline:

1. `node scripts/validate-agent-coordination.mjs`
2. content integrity validator when content contracts are touched
3. save migration/round-trip tests when state shape/persistence is touched
4. real-browser regression harness
5. task-specific unit/contract tests for the extracted module
6. phone-size smoke when rendering/input code changes

A moved function is not “safe” merely because its text is unchanged. Integration behaviour must be exercised after wiring changes.

## Collision rules during LR-0010

While LR-0010 is actively extracting a module:

- second-wave runtime tasks that depend on LR-0010 remain blocked;
- pure Storyteller/Mechanist/Lamplighter/Wayfinder authoring may continue in their dedicated docs/assets;
- no other task should opportunistically reorganise `game.js`, `content.js`, script ordering or module namespaces;
- if a critical hotfix is required, pause the affected extraction, land/reconcile the hotfix, then continue from current main.

## Risk and rollback plan

### Main risks

**Save regression**  
Mitigation: LR-0011 fixtures and round-trip suite before/after state extraction.

**Behaviour drift while “only moving code”**  
Mitigation: browser regression after every stage, not only at the end.

**Circular dependencies**  
Mitigation: pure models depend inward; UI/controllers may depend on models, models never depend on DOM renderers.

**Over-abstraction**  
Mitigation: extract existing responsibility seams; do not invent generic frameworks.

**Temporary dual implementations diverge**  
Mitigation: keep shim periods short and test both sides until cutover.

**Content split causes authoring conflicts**  
Mitigation: split only after consumers use stable lookup contracts; map files to role ownership.

### Rollback rule

Each extraction stage should end in a green commit before the next starts.

If a stage cannot reach green without changing player behaviour or unrelated systems:

1. revert that stage;
2. record the hidden coupling found;
3. create a narrowly scoped follow-up;
4. do not stack another extraction on top of a red intermediate state.

## Explicit LR-0010 non-goals

LR-0010 does **not**:

- add player-leader gameplay;
- deepen dialogue content;
- implement companion autonomy;
- redesign combat;
- rebalance economy;
- change canonical geography;
- redesign the phone UI;
- introduce new art/audio;
- convert the project to a framework;
- redesign the save schema beyond consuming LR-0011;
- split files merely to hit a line-count target.

Its success condition is simpler:

> the next specialist wave can add dialogue, companion agency, action economy, economy/progression, canonical map rendering and responsive UI mostly inside stable owned modules instead of all editing the same two monolithic files.
