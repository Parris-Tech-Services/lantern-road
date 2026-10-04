# Lantern Road — Storyteller Pack-to-Runtime Map

## Why this exists

Large amounts of Storyteller work are now merged on `main`, but a markdown file being present in the repository is not the same as a player being able to experience it.

This document answers five questions for every merged narrative pack:

1. **Where is the authored source?**
2. **Which existing task owns putting it into runtime?**
3. **What state/trigger inputs does it need?**
4. **What is the smallest useful player-visible slice?**
5. **How do we prove the content is actually reachable?**

The goal is acceleration without ownership confusion.

---

# 1. Critical path first

The fastest route to substantial narrative content in the live game is not “write more story.”

The high-fan-out path is:

1. **LR-0011 — Save format versioning and migration hardening**
   - implementation already merged;
   - task closure still needs the live foundation-gate evidence/policy path.
2. **LR-0013 — Automated gameplay regression harness**
   - current browser harness is complete and green;
   - exact-head Director review/closure is still required.
3. Once LR-0011 and LR-0013 are DONE, close/reconcile the already-built specialist foundations in parallel:
   - **LR-0005** visible world/faction consequences — Agent 2;
   - **LR-0006** progression/builds — Agent 3;
   - **LR-0009** phone-native UX — Agent 5.
4. Those allow **LR-0132** core state/effect seams.
5. LR-0132 then unlocks the staged architecture seams, especially:
   - **LR-0134** party/relationship/dialogue runtime seam;
   - **LR-0138** authored content / narrative / quest data seam.
6. After those seams exist, the narrative runtime tasks can land cleanly:
   - **LR-0090** stateful dialogue graph and conversation memory;
   - **LR-0048** enriched core quest scenes;
   - **LR-0038** living NPC dialogue;
   - **LR-0008** 18-day campaign/endings;
   - **LR-0037** hero personal quests;
   - **LR-0007** conditional authored events.
7. **LR-0093** companion autonomy then consumes LR-0091 plus Mechanist roster/willingness foundations.

Do not bypass the save/browser gates by creating parallel state systems.

---

# 2. Shared narrative state vocabulary

These are **content inputs**, not a new schema.

Runtime owners should map them to the shared state model created by the Steward.

Common inputs across packs:

- day / campaign phase;
- current settlement/site;
- quest status and named quest outcome;
- faction standing;
- Renown / legitimacy where relevant;
- world consequence flags;
- Trust per companion;
- companion active/reserve presence;
- companion condition: HP/injury/fatigue where available;
- personal-arc status/outcome;
- conversation topic memory;
- Leader promise/lie/refusal/consultation memories;
- Leader optional background tag;
- prior settlement/NPC conversation history.

Never create pack-specific save stores when shared state already represents the same fact.

---

# 3. Campaign spine and ending matrix

## Authored source

- `story/campaign/18-DAY-CAMPAIGN-BEAT-SHEET.md`
- `story/campaign/ENDING-MATRIX.md`

## Primary runtime consumer

**LR-0008 — Strengthen the 18-day campaign arc and endings**  
Owner: Agent 2

## Shared dependencies

- LR-0005 consequences;
- LR-0011 save persistence;
- LR-0013 browser regression;
- LR-0138 narrative data seam.

## Required inputs

- campaign day/phase;
- major quest outcomes;
- faction posture;
- named consequence flags;
- Renown/legitimacy;
- final political choice.

## Smallest player-visible integration slice

Inside LR-0008 implementation, prove the campaign spine with:

1. one early pressure beat;
2. the mid-campaign revelation;
3. one late faction-pressure beat;
4. the hard final decision;
5. one ending family selected from named decisions rather than totals alone.

Then fill the remaining authored beat matrix through the same seam.

## Reachability proof

A real-browser run must show:

- a campaign beat appears only in its valid day/state window;
- the revelation cannot replay as first-time information;
- the final choice is reachable without forcing every local quest;
- changing a named earlier outcome changes at least one later line or ending block.

---

# 4. Modular ending prose

## Authored source

- `story/endings/README.md`
- `story/endings/REGIONAL-ENDINGS.md`
- `story/endings/QUEST-CALLBACKS.md`
- `story/endings/PARTY-EPILOGUES.md`
- `story/endings/ASSEMBLY-NOTES.md`

## Primary runtime consumer

**LR-0008 — campaign arc/endings**

## Required inputs

- ending family;
- high/low legitimacy;
- six core quest outcomes including unresolved/partial states;
- faction posture;
- Garrick/Mira/Oren/Brindle Trust/personal outcomes;
- named campaign decisions.

## Smallest player-visible integration slice

Assemble one complete end screen from:

- one regional ending block;
- one quest callback;
- one party epilogue block.

The assembly mechanism should then expand by data, not hard-coded special cases.

## Reachability proof

QA should complete two materially different campaigns and confirm:

- different regional ending family;
- at least one named quest callback differs;
- at least one companion epilogue differs;
- Common Road never reads as a consequence-free “golden ending”;
- Fractured March still acknowledges local successes.

---

# 5. Hero personal quests

## Authored source

- `story/personal-quests/README.md`
- `story/personal-quests/GARRICK-THE-WALL-THAT-WALKS.md`
- `story/personal-quests/MIRA-THE-NAME-BEFORE-THE-ROAD.md`
- `story/personal-quests/OREN-THE-UNFINISHED-PAGE.md`
- `story/personal-quests/BRINDLE-WHAT-THE-LAMP-ASKS.md`

## Primary runtime consumer

**LR-0037 — Hero-specific personal questlines**  
Owner: Agent 2

## Shared consumers

- LR-0090 for dialogue/topic memory;
- LR-0005 for visible consequence callbacks;
- LR-0008 for ending references.

## Required inputs

- companion Trust;
- prerequisite companion memory;
- active/reserve state where direct witnessing matters;
- personal-arc status;
- personal-arc outcome;
- named later callback flags.

## Smallest player-visible integration slice

Implement **one complete arc end-to-end** through the final shared architecture:

- unlock;
- three beats;
- meaningful final choice;
- stored outcome;
- later callback outside the immediate scene.

Garrick is a practical first integration candidate because his arc directly exercises Trust, shared burden and party memory without requiring new geography.

After that, the other three should be data/content additions through the same seam.

## Reachability proof

For each hero:

- satisfy unlock condition;
- trigger the arc;
- make two different final choices in separate runs;
- reload after the choice;
- verify the outcome persists;
- verify one later callback changes;
- for Mira specifically, confirm the choice surfaces outside the immediate personal scene.

---

# 6. Recurring NPC relationships

## Authored source

- `story/npcs/README.md`
- `story/npcs/HEARTHWICK.md`
- `story/npcs/GREYFEN.md`
- `story/npcs/CANDLEMERE.md`
- `story/npcs/ALDERWATCH.md`
- `story/npcs/BLACKSALT.md`

## Primary runtime consumer

**LR-0038 — Living NPC dialogue and recurring relationship depth**  
Owner: Agent 2

## Runtime foundation

**LR-0090 — stateful dialogue graph / conversation-memory runtime**  
Owner: Agent 1

## Required inputs

- first/repeat/changed topic state;
- quest outcome;
- faction state;
- settlement consequence state;
- prior promises/lies where relevant;
- campaign phase.

## Smallest player-visible integration slice

Choose one high-frequency NPC such as **Tessa Reed or Rowan Pike** and ship:

1. first meeting;
2. repeat greeting;
3. one changed-world-state greeting after a named quest outcome;
4. one remembered prior conversation topic.

Then expand the same node contract across the 15 authored NPCs.

## Reachability proof

Talk to the same NPC:

- before the relevant quest;
- immediately after first conversation;
- after named quest resolution;
- after save/reload.

The NPC must not replay first-meeting exposition in any later state.

---

# 7. Evolving rumours and settlement gossip

## Authored source

- `story/rumours/README.md`
- `story/rumours/HEARTHWICK.md`
- `story/rumours/GREYFEN.md`
- `story/rumours/CANDLEMERE.md`
- `story/rumours/ALDERWATCH.md`
- `story/rumours/BLACKSALT.md`
- `story/rumours/ROAD-AND-INN-FALLBACKS.md`

## Primary runtime consumers

- **LR-0038** for settlement/NPC social integration;
- **LR-0090** for heard-topic memory;
- **LR-0005** for changed-world-state selection.

## Required inputs

- settlement;
- quest stage/outcome;
- campaign phase;
- faction posture;
- heard/not-heard state;
- superseded rumour/topic state.

## Smallest player-visible integration slice

Start with **Hearthwick**:

- one pre-resolution Lantern Road rumour;
- one post-bargain variant;
- one post-fight variant;
- one “nothing new” fallback.

This directly upgrades the existing **Hear rumours** button from visible feedback to meaningful changing content.

## Reachability proof

At Hearthwick:

1. hear the pre-resolution rumour;
2. press Hear rumours again and confirm it does not pretend to be new;
3. resolve Lanterns on the Old Road one way;
4. return and hear the matching changed-state rumour;
5. reload and confirm heard-state remains.

---

# 8. Conditional travel and camp events

## Authored source

- `story/events/README.md`
- `story/events/TRAVEL-EVENTS.md`
- `story/events/CAMP-EVENTS.md`

## Primary runtime consumer

**LR-0007 — Conditional authored event expansion**  
Owner: Agent 2

## Required inputs

- active companion;
- Trust/relationship;
- injury/condition;
- weather;
- faction standing;
- item possession;
- quest outcome;
- earlier choice;
- time/campaign phase.

## Smallest player-visible integration slice

Use three events to prove the condition framework:

1. one companion/Trust-sensitive camp event;
2. one weather/location-sensitive travel event;
3. one prior-choice callback event.

Do not start by importing generic resource-only events.

## Reachability proof

For each proof event:

- demonstrate eligible state triggers it;
- demonstrate one changed input makes it unavailable or changes branch;
- verify save/reload preserves any remembered outcome;
- ensure repeated travel cannot farm the same reward unintentionally.

---

# 9. Premium core quest scene packs

## Authored source

- `story/quests/README.md`
- `story/quests/LANTERNS-ON-THE-OLD-ROAD.md`
- `story/quests/THE-MISSING-LEDGER.md`
- `story/quests/THE-PILGRIMS-RELIQUARY.md`
- `story/quests/FEVER-ON-THE-SOUTH-ROAD.md`
- `story/quests/THE-SILENT-TOWER.md`
- `story/quests/ASH-IN-THE-MARSH.md`

## Primary runtime consumer

**LR-0048 — Integrate enriched core quest scenes and outcome branches**  
Owner: Agent 2

## Required inputs

- existing canonical quest identity/stage;
- dialogue topic memory;
- world consequence hooks;
- companion presence/interjections;
- delay/refusal/partial-success state where authored;
- shared save state.

## Smallest player-visible integration slice

Integrate **Lanterns on the Old Road** first:

- authored offer;
- investigative/complication beat;
- bargain/fight decision conversation;
- aftermath;
- later visible consequence.

It already sits early in the campaign and is ideal for proving the richer quest contract.

Then move the remaining five quests through the same scene/outcome seam.

## Reachability proof

For Lantern Road:

- complete bargain path;
- complete fight path;
- revisit Hearthwick/road;
- verify different aftermath text/consequence;
- reload both saves;
- confirm no stage becomes impossible or duplicated.

Repeat equivalent branch checks for all six before LR-0048 closes.

---

# 10. Player-Leader dialogue framework

## Authored source

- `story/dialogue/README.md`
- `story/dialogue/PLAYER-LEADER-ROLE.md`
- `story/dialogue/DIALOGUE-CHOICE-GRAMMAR.md`
- `story/dialogue/COMPANION-AUTONOMY-AND-MEMORY.md`
- `story/dialogue/REPRESENTATIVE-CONVERSATIONS.md`

## Primary runtime consumer

**LR-0090 — stateful dialogue graph and conversation-memory runtime**  
Owner: Agent 1

## Shared consumer

**LR-0093 — companion autonomy** for request/refusal/counter-offer consequences.

## Required inputs

- topic memory;
- Leader intent/choice;
- promise/lie/refusal memory;
- Trust;
- NPC attitude;
- quest/world/faction state;
- campaign timing;
- active companion presence.

## Smallest player-visible integration slice

The dialogue engine should first prove:

1. one NPC first/repeat/changed conversation;
2. one companion conversation;
3. one remembered Leader choice;
4. one closed topic;
5. save/reload persistence.

Do not wait for every authored conversation before proving the runtime contract.

## Reachability proof

Automated/browser tests must cover exactly the LR-0090 acceptance paths:

- first talk;
- repeat talk;
- remembered choice;
- closed topic;
- changed-world-state talk.

---

# 11. Minimal Leader identity/background pack

## Authored source

- `story/leader/README.md`
- `story/leader/BACKGROUND-TAGS.md`
- `story/leader/BACKGROUND-REACTIONS.md`
- `story/leader/LEADERSHIP-BEHAVIOUR-CALLBACKS.md`
- `story/leader/RESERVE-CONTINUITY-AND-HANDOFF.md`

## Primary consumers

- **LR-0090** for dialogue conditions/reactions;
- **LR-0125** for the canonical Leader actor / active-reserve roster persistence boundary;
- the already-ratified LR-0103 mechanics define what the Leader is mechanically.

## Required inputs

- Leader chosen name;
- zero or one background tag;
- remembered leadership-behaviour markers;
- companion active/reserve state.

## Smallest player-visible integration slice

Do not invent a giant creator.

When the supporting runtime/UI path exists, expose:

1. Leader name;
2. one background choice or **No Stated Background**;
3. one companion or NPC line that reacts to the selected background;
4. one later behaviour callback that comes from play rather than the background.

If the UI/storage work for selection is not yet owned by a dedicated implementation task, do **not** smuggle it into LR-0090. Route the gap deliberately.

## Reachability proof

- create two new campaigns with different background selections;
- trigger the same conversation;
- verify only the relevant reaction differs;
- verify no automatic faction allegiance/stat advantage appears;
- verify reserve companions do not know private events they missed.

---

# 12. Grey March regional lore

## Authored source

- `story/world/REGIONAL-LABEL-RECONCILIATION.md`
- `story/world/REGIONAL-LORE-PROPOSALS.md`

## Canon consumer

The Storyteller proposal has already been ratified through **LR-0104**.

## Runtime chain

- **LR-0105** adds machine-enforced canonical regional-label records;
- **LR-0073** renders canonical region labels dynamically on the map.

## Canon outcome

Promote:

- Hollowwold;
- Reedmarsh;
- Barrow Ridge;
- Watcherwood;
- Greyfen Plain;
- Stoneveil Heights.

Reject:

- Embermere;
- Siltbrook Marsh.

Defer:

- Mourn Lake;
- Wyrthen Forest.

## Smallest player-visible integration slice

Once LR-0105 is merged and LR-0073 lands, render the six ratified regional labels as non-clickable dynamic map overlays.

Do not create new gameplay nodes to justify them.

## Reachability proof

- all six canonical region labels appear only from protected canonical data;
- rejected/deferred labels do not appear as canon;
- no settlement/site coordinates move;
- labels do not become clickable destinations;
- atlas replacement does not alter gameplay coordinates.

---

# 13. Direct companion conversation pack — pending merge

## Current source

PR #96 / LR-0091 currently contains:

- `story/companions/README.md`
- `story/companions/GARRICK.md`
- `story/companions/MIRA.md`
- `story/companions/OREN.md`
- `story/companions/BRINDLE.md`
- `story/companions/INTEGRATION-HANDOFF.md`

This content is **not counted as merged LR-0147 input until LR-0091 reaches DONE**.

## Intended consumers after approval/merge

- LR-0090 — direct companion conversation runtime;
- LR-0093 — treatment/rest/risky-plan willingness responses.

## Intended first visible slice

From the LR-0091 handoff:

1. Talk button on an active companion;
2. condition/Trust greeting;
3. three recurring topics;
4. one recent-choice callback;
5. treatment/rest request with authored acceptance/refusal/counter-offer;
6. repeat-safe memory.

---

# 14. Integration order by player-visible value

Once the foundation/architecture gates permit work, prioritise narrative runtime in this order.

## A. Visible consequences first

**LR-0005**

Why:

- already implemented and parked;
- many later packs need its named consequence state;
- makes existing choices feel less fake immediately.

## B. Dialogue memory foundation

**LR-0090**

Why:

- unlocks recurring NPCs;
- rumours;
- direct companions;
- Leader background reactions;
- quest conversation richness.

Start with one NPC + one companion + persistence tests.

## C. Enriched first core quest

**LR-0048 — Lanterns on the Old Road first**

Why:

- early player exposure;
- existing quest identity;
- immediate proof that premium authored scenes are not repository-only.

## D. Evolving rumours / recurring NPCs

**LR-0038**

Why:

- directly improves frequently pressed settlement interactions;
- makes the world acknowledge what the player did.

## E. Campaign spine and endings

**LR-0008**

Why:

- gives the 18-day structure escalation and payoff;
- uses already-authored ending blocks.

## F. Personal quests

**LR-0037**

Why:

- major personality/emotional-weight gain;
- depends on campaign/dialogue/consequence foundations.

## G. Conditional event expansion

**LR-0007**

Why:

- broadens repeat play;
- requires progression/consequence/content seams to avoid filler.

## H. Companion autonomy

**LR-0093**

Why:

- high player-facing value;
- but it should consume the settled Leader roster, Mechanist willingness model, LR-0091 prose and party/dialogue architecture rather than landing as a parallel control system.

---

# 15. Ownership boundaries

## Agent 2 may own

- authored scene selection;
- prose;
- narrative trigger intent;
- named outcome semantics;
- narrative acceptance/reachability checks;
- integration tasks already assigned to Storyteller.

## Agent 2 must not redefine

### LR-0138 — Agent 1

- JS/content module architecture;
- backwards-compatible CONTENT aggregation;
- technical content loading seam.

### LR-0090 — Agent 1

- reusable dialogue graph engine;
- conversation-memory persistence;
- migration implementation.

### LR-0093 — Agent 3

- willingness resolution mechanics;
- treatment/rest/tactical request mechanics;
- bounded proactive companion behaviour.

### Mechanist systems

- base economy;
- item balance;
- combat numbers;
- progression tuning;
- injury thresholds.

### Wayfinder

- phone interaction layout;
- accessibility interaction;
- map/touch UX.

### Director

- canon/governance approvals.

This index is deliberately descriptive so runtime specialists can integrate without ownership collision.

---

# 16. QA reachability checklist

A content pack is **not integrated** merely because its files are on `main`.

Before calling a runtime integration complete, verify:

- there is a normal player action that reaches the content;
- the content appears under the intended conditions;
- at least one alternative state produces different authored output;
- repeat interactions do not replay first-time exposition incorrectly;
- relevant state survives save/reload;
- companion/NPC witness rules respect active/reserve presence;
- the player receives visible feedback for success, refusal, blocked state or no-new-content state;
- old saves migrate through LR-0011;
- the LR-0013 real-browser harness covers the new branch;
- no critical route/quest can soft-lock because a reserve companion is absent;
- no authored choice silently collapses to the same consequence when the writing promises otherwise;
- content can be discovered without reading developer logs.

For each major integration, Agent 6 should be able to answer:

> **What exact sequence of player actions proves this content exists?**

If there is no answer, the content is still repository-only.

---

# 17. Definition of “in the game”

For Storyteller work, “in the game” means all of the following:

1. authored source is merged;
2. runtime has a supported data/state path for it;
3. ordinary player interaction can reach it;
4. state-dependent variants select correctly;
5. save/load preserves the relevant memory;
6. phone UI exposes the interaction clearly;
7. automated and black-box QA can reproduce it.

Anything less should be described as authored, merged or integrated-in-progress, not playable.
