# AED Code Hotspot and Cross-Agent Collision Map

**Task:** LR-0116  
**Agent:** 8 — AED (Agent Efficiency Department)  
**Snapshot:** 4 October 2026, ~19:16 AEDT

## Executive finding

Lantern Road's largest merge-risk surface is not theoretical. The queue currently points **32 unfinished tasks across Agents 1–5 at `game.js`** and **20 unfinished tasks across four agents at `content.js`**.

This validates LR-0099's existing modularisation blueprint and the LR-0010 architecture gate. AED does **not** propose a second architecture. It supplies measured collision evidence so LR-0010 can extract the highest-value seams first.

## Current file concentration

| File/surface | Unfinished tasks | Distinct agents | READY | BLOCKED | Parked READY/useful |
|---|---:|---:|---:|---:|---:|
| `game.js` | **32** | **5** | 5 | 27 | 4 |
| `QA/` | 23 | 3 | 9 | 14 | 8 |
| `content.js` | **20** | **4** | 2 | 18 | 1 |
| `.agent-coordination/WORK-QUEUE.json` | 15 | 3 | 2 | 13 | 1 |
| `tests/` | 14 | 4 | 1 | 13 | 1 |
| `docs/` | 14 | 4 | 7 | 7 | 7 |
| `style.css` | 9 | 3 | 1 | 8 | 1 |
| `index.html` | 8 | 2 | 1 | 7 | 1 |
| `README.md` | 8 | 2 | 3 | 5 | 3 |
| `.github/workflows/` | 6 | 1 | 1 | 5 | 1 |

Current main sizes:
- `game.js`: **3,494 lines / ~135 KB**
- `content.js`: **3,261 lines / ~79 KB**
- `style.css`: **663 lines / ~13 KB**
- `index.html`: **74 lines / ~3 KB**

File size itself is not the problem. The collision count and cross-role ownership are.

## Highest-risk collision clusters

### 1. Shared runtime controller — `game.js`

The queue routes work here from:
- Steward: architecture, saves, testing, integration, diagnostics, map runtime;
- Storyteller: consequences, campaign/dialogue integration;
- Mechanist: progression/combat/economy/equipment/injuries/Leader systems;
- Lamplighter: audio/presentation integration;
- Wayfinder: mobile/accessibility/map/responsive interaction.

This is the critical collision surface.

**AED recommendation:** LR-0010 should prioritise seams that relocate *future ownership* out of `game.js`, not merely move equal-sized chunks around.

### 2. Authored data monolith — `content.js`

Story, systems, world geography and runtime metadata share one data object.

LR-0099 already proposes:
- `content/world.js`
- `content/actors.js`
- `content/systems.js`
- `content/narrative.js`
- `content/assemble.js`

This split is valuable because it maps directly to specialist ownership while retaining `window.CONTENT` compatibility.

**Timing:** do it after stable runtime lookup contracts, as LR-0099 recommends. Splitting content too early would create extra conflict during runtime extraction.

### 3. Presentation shell — `style.css` + `index.html`

Wayfinder, Lamplighter and Steward integrations converge here.

The highest-value separation is not arbitrary CSS files. It is to establish a persistent-shell/layout contract so LR-0096 and accessibility work can change composition without editing mechanics.

### 4. Test/evidence surfaces

`tests/` has 14 unfinished consumers across four agents. This is healthy if tests are additive and module-scoped, but a single giant end-to-end suite can become another shared monolith.

**Recommendation:** keep one small critical browser baseline plus subsystem contract/unit tests near extracted modules.

### 5. Queue metadata

`WORK-QUEUE.json` is intentionally a shared coordination surface. It should **not** be modularised. Its collision risk is controlled by fetch/reconcile/retry, not file splitting.

LR-0118 should reduce how often humans need to edit/read it by generating an advisory view, while leaving the queue authoritative.

## Extraction priorities: collision-weighted

LR-0099 already defines the target architecture. Based on queue collision, AED recommends this emphasis order inside LR-0010:

### Priority A — state/persistence/effect boundary
Why:
- save, dialogue, quests, repeatability, progression and economy all mutate shared state;
- `applyEffects` is a cross-system choke point;
- clear state/effect boundaries reduce both collision and save-regression risk.

Consume LR-0011 rather than redesigning it.

### Priority B — world/map model separate from renderer
Why:
- LR-0073 and LR-0096 need different parts of map behaviour;
- Wayfinder should be able to alter map interaction/layout without touching travel rules;
- canonical map data must remain distinct from illustrated presentation.

### Priority C — party/relationship/Leader model
Why:
- LR-0006, LR-0093 and LR-0125 converge here;
- Leader + active/reserve companion work currently risks spreading actor assumptions through `game.js`.

### Priority D — dialogue runtime
Why:
- LR-0090 needs memory/graph state;
- Storyteller-authored prose should stop sharing a change surface with map/combat code.

### Priority E — combat/actions
Why:
- LR-0015, LR-0098 and later encounter work need a stable mechanical home;
- Agent 3 should not need to edit general UI/travel code for action costs.

### Priority F — economy/services
Why:
- LR-0016/17/18 form a coherent Mechanist integration cluster;
- settlement rendering should not remain the owner of price/resource mutation.

### Priority G — UI render/controller decomposition
Why:
- LR-0096, LR-0039 and map presentation can then target UI modules;
- this reduces Agent 5/4 collision with gameplay systems.

This is consistent with LR-0099 rather than replacing its staged plan.

## Ownership-oriented target map

| Concern | Primary future edit lane |
|---|---|
| save/persistence contract | Steward |
| world/map model | Steward, consumed by Wayfinder/Lamplighter |
| narrative authored data | Storyteller |
| dialogue runtime state | Steward integration consuming Storyteller content |
| party/relationships/Leader mechanics | Mechanist |
| combat/actions | Mechanist |
| economy/equipment/recovery | Mechanist |
| map/UI rendering | Wayfinder + Lamplighter under explicit scopes |
| visual/audio assets | Lamplighter |
| black-box regression evidence | Warden / Steward harness |
| operational queue reporting | AED |

The goal is not exclusive file ownership forever. It is to make the common case align with role ownership.

## Safe parallel work before LR-0010

Can continue with low collision:
- Storyteller content in dedicated `story/` paths;
- Mechanist specifications/catalogues in dedicated `systems/` paths;
- Lamplighter source assets/provenance in dedicated `assets/` + art docs;
- Wayfinder interaction/accessibility contracts in dedicated docs/QA matrices;
- Warden independent QA reports;
- AED audits/coordination tooling.

Should wait:
- new cross-system runtime integration into `game.js`;
- opportunistic content.js reorganisation;
- broad script-order/index changes;
- layout rewrites that collide with parked LR-0009/LR-0096 assumptions.

## Merge-risk rules

1. Do not let a specialist "clean up nearby code" while touching a hotspot.
2. One task/scope per PR remains important until extraction is complete.
3. When LR-0010 actively extracts a hotspot, freeze unrelated structural edits to that hotspot.
4. Hotfixes land/reconcile first; extraction resumes from updated main.
5. After extraction, route new tasks to module-level `likely_files` so AED can measure whether collision actually falls.

## Success metrics for LR-0010

Do **not** use line-count reduction as the success metric.

Prefer:
- fewer unfinished tasks naming `game.js` as a likely file;
- fewer distinct specialist agents needing the same runtime file;
- new second-wave tasks confined mostly to their intended module;
- browser/save/content checks remain green after every extraction stage;
- `game.js` becomes bootstrap/controller glue rather than a universal ownership surface.

A useful post-LR-0010 target is for no single runtime source file to be the expected edit surface for most Storyteller + Mechanist + Wayfinder work simultaneously.

## Conclusion

The queue validates the existing architecture plan: Lantern Road has outgrown the shared two-file runtime/content surface.

The correct efficiency move is a **controlled responsibility extraction after foundations/first-wave reconciliation**, with state/effects, map, party, dialogue, combat, economy and UI seams prioritised by their downstream specialist collision. This should materially reduce merge churn without a framework rewrite or architecture detour.
