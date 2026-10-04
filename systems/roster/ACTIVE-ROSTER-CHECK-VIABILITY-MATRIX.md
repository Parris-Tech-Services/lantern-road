# Lantern Road — Active-Roster Check Viability & Specialist Fallback Matrix

Task: **LR-0106**  
Owner: **Agent 3 — The Mechanist**  
Consumes: **LR-0089 Player-Leader Party Contract**, **LR-0103 Leader Mechanical Role**  
Primary runtime consumer: **LR-0125 Leader actor and active/reserve roster foundation**  
Status: authoring/audit only. No `game.js`, `content.js` or save-state changes in this task.

## 1. Why this audit exists

Lantern Road's current prototype assumes all four authored companions are always active:

- Garrick;
- Mira;
- Oren;
- Brindle.

Canon now requires:

- the **Leader**;
- three active companions;
- one reserve companion.

That means any current check that blindly calls:

```js
rollCheck("mira", "scout", 12)
```

can become fictionally wrong or mechanically unsafe when Mira is reserve.

The reserve companion:

- does not contribute field checks;
- does not contribute field passives;
- does not appear in combat;
- directly witnesses only explicitly camp-wide events;
- keeps persistent state for later rotation.

The purpose of LR-0106 is to identify every current companion-specific check/consequence and define whether it:

1. should use an active specialist;
2. should allow a harder Leader fallback;
3. may legitimately disappear as an optional specialist benefit;
4. is character-specific authored content that should defer rather than be replaced.

## 2. Audit result

Current-main audit found:

- **11 data-driven companion checks** in travel/camp events;
- **8 direct literal companion `rollCheck` calls** in `game.js`;
- **3 dynamic Oren/Mira actor-selection checks** in `game.js`;
- **1 additional direct Brindle check** in the Lantern Road dialogue resolution;
- **6 authored character camp moments** tied to named companions;
- **13 decision-reaction sets** that currently apply memories/reactions to named companions without active/witness filtering.

The core problem is not that companion-specific content exists.

The problem is that current runtime assumes the named companion is physically present.

## 3. Classification vocabulary

### A — Character-specific authored content

The point is specifically that character.

Examples:

- personal camp scene;
- personal arc;
- companion's own authority/history.

If the character is not appropriately present:

- defer;
- hide;
- or use an explicitly authored later debrief.

Do **not** replace with Leader.

### B — Specialist-preferred content

The companion offers a meaningful better route.

If the specialist is reserve:

- use an alternate active specialist if one exists;
- or allow a harder Leader check;
- or accept optional loss if the reward is truly optional.

### C — Optional bonus content

Missing it does not block a core quest or campaign route.

It may simply be unavailable when its specialist is reserve.

This is a legitimate roster trade-off.

### D — Core-progress content

The action advances or unlocks a core quest/site path.

It must retain at least one viable active-roster path without silently using reserve.

Preferred fallback order:

1. explicit tool/resource bypass;
2. active named specialist;
3. alternate active specialist where fiction supports it;
4. harder Leader check;
5. defer-until-safe-rotation only if the content is explicitly non-urgent and this cannot create deadline failure.

## 4. Runtime actor-selection rule

Never call `rollCheck` with a reserve companion.

Conceptual helper:

```text
chooseCheckActor({
  preferredCompanions,
  leaderSkill,
  specialistDc,
  leaderDc,
  allowLeader,
  optional
})
```

Resolution order:

1. first eligible preferred companion who is active;
2. another explicitly authored active specialist;
3. Leader, if allowed;
4. no check route.

Do not select an actor based only on:

- item possession;
- faction standing;
- old hard-coded priority;

without checking active-roster presence.

## 5. Leader fallback baseline

LR-0103 recommends Leader skill **2** across:

- Might;
- Scout;
- Wits;
- Spirit;
- Guile.

A Leader fallback should normally be **1–2 DC harder** than the authored specialist route.

Examples:

- Mira Scout DC 12 → Leader Scout DC 14;
- Oren Wits DC 11 → Leader Wits DC 13;
- Garrick Might DC 12 → Leader Might DC 14;
- Brindle Spirit DC 12 → Leader Spirit DC 14.

This preserves the specialist as meaningfully better without making reserve choice a soft-lock.

## 6. Data-driven travel-event audit

These are stored in `content.js` through `option.check.actor`.

### Broken Axle

Current specialist routes:

- Garrick Might 11;
- Oren Wits 12.

Existing fallback:

- **Move on**.

Classification:

- **B / C specialist-preferred optional**.

Roster rule:

- show Garrick option only if Garrick active;
- show Oren option only if Oren active;
- always retain Move on.

No Leader fallback required.

### Suspicious Travellers

Current:

- Mira Guile 12.

Existing alternatives:

- offer food;
- confront and fight.

Classification:

- **B specialist-preferred**.

Roster rule:

- hide Mira-specific option if Mira reserve;
- retain both alternatives.

No core progress blocked.

### Roadside Shrine

Current:

- Brindle Spirit 10.

Existing alternatives:

- leave coin;
- ignore shrine.

Classification:

- **B / C optional specialist benefit**.

Roster rule:

- Brindle prayer check only if Brindle active;
- alternate options remain.

Do not auto-use reserve Brindle.

### Signs of a Missing Caravan

Current:

- Mira Scout 13.

Existing fallback:

- mark for Wardens and move on.

Success can discover Pilgrim Ford and grant Cache Map Scrap.

Classification:

- **B / C optional discovery advantage**.

Roster rule:

- Mira check only if active;
- fallback remains valid.

Because the event reward is discovery/bonus rather than sole core progression, Leader fallback is optional rather than mandatory.

### Ash Moths

Current:

- Oren Wits 12.

Existing fallback:

- cover lantern and wait.

Classification:

- **B specialist-preferred**.

Roster rule:

- Oren ward option only if active;
- fallback remains.

### Warden Checkpoint

Current:

- Brindle Guile 11.

Existing alternatives:

- answer plainly;
- guild-seal route.

Classification:

- **B specialist-preferred**.

Roster rule:

- Brindle option only if active;
- retain other routes.

### Wild Howl

Current:

- Mira Scout 12.

Existing alternatives:

- fight;
- spend Ration and retreat.

Classification:

- **B specialist-preferred**.

Roster rule:

- Mira route only if active;
- alternatives remain.

### Unofficial Toll

Current:

- Brindle Guile 13.

Existing alternatives:

- pay;
- challenge/fight.

Classification:

- **B specialist-preferred**.

Roster rule:

- Brindle negotiation route only if active;
- alternatives remain.

### Night Steps camp event

Current options:

- Mira Scout 12;
- Garrick Might 11.

Classification:

- **B specialist-preferred camp event**.

Important roster invariant:

With exactly one reserve companion, at least one of Mira/Garrick is always active.

Roster rule:

- show only active companion options;
- if both active, show both;
- if one reserve, show the other;
- no Leader fallback required under the canonical one-reserve roster.

## 7. Site/runtime audit

### Watcher's Rest — weather ledgers

Current:

```js
rollCheck("oren", "wits", 11)
```

Success:

- tower-path rumour;
- +1 Ration.

Classification:

- **C optional bonus**.

Recommended roster behaviour:

- if Oren active: Oren Wits 11;
- if Oren reserve: allow **Leader Wits 13** or omit the specialist bonus route.

Preferred implementation:

Use Leader Wits 13 because the UI label is generic “Read the old weather ledgers,” not “Ask Oren.”

No quest soft-lock either way.

### Saint Rhel — search hidden chamber

Current:

- Lantern Oil gives automatic success;
- otherwise Brindle Spirit 12.

This opens the chamber for **Pilgrim's Reliquary**.

Classification:

- **D core-progress gate**.

Required fallback:

1. Lantern Oil → guaranteed current route;
2. if Brindle active → Spirit 12;
3. if Brindle reserve → **Leader Spirit 14**.

Do not require rotating Brindle back simply to progress the quest.

Player-facing copy should differ:

- Brindle route: prayer notch / spiritual insight;
- Leader route: patient physical search / draft / soot line.

Do not copy Brindle's religious authority onto the Leader.

### Old Barrow — side chambers

Current:

- Mira Scout 13;
- failure damages Mira;
- success grants Marsh Iron Key.

Audit finding:

Current main has no downstream mechanical consumer of `marsh_key` beyond acquisition.

Classification:

- **C optional reward**.

Roster rule:

- if Mira active: retain current check;
- if Mira reserve: this specialist search may be unavailable **or** Leader Scout 15 may be offered later if the item receives a real use.

Do not create a core fallback solely to preserve a currently unused reward.

Important failure fix:

If actor selection becomes dynamic, failure damage must hit the **actual checking actor**, never hard-coded Mira.

### Broken Span — chalk marks

Current dynamic selection:

```js
actor = hasItem("keen_lens") ? "oren" : "mira"
```

Success:

- reveals/accepts **Missing Ledger**;
- sets `found_clue`;
- reveals Smuggler Cache;
- grants Cache Map Scrap.

Classification:

- **D core-progress gate**.

Current bug under reserve canon:

The item rule can choose Oren even when Oren is reserve, or Mira when Mira is reserve.

Canonical roster advantage:

Exactly one companion is reserve, so **at least one of Mira/Oren is always active**.

Required actor rule:

1. if Oren active and Keen Lens route is applicable → Oren Wits 12;
2. else if Mira active → Mira Scout 12;
3. else if Oren active → Oren Wits 12;
4. Leader fallback only as future-proofing, not required by current one-reserve invariant.

Do not let Keen Lens summon reserve Oren into the scene.

### Weeping Stones — track false lantern crew

Current:

- Mira Scout 12.

Success is required before **Deal with the false lantern crew** becomes enabled.

Classification:

- **D core-progress gate for Lanterns on the Old Road**.

Required fallback:

- if Mira active → Mira Scout 12;
- if Mira reserve → **Leader Scout 14**.

Success through Leader:

- sets same quest/world state;
- different log copy;
- no Mira-specific memory/reaction unless later debrief content owns it.

Without this fallback, reserving Mira can block the peaceful/fight resolution step entirely.

### Weeping Stones — mineral seep

Current:

- Oren Wits 11;
- success grants Bog Amber.

Classification:

- **C optional reward**.

Roster rule:

- Oren route only if active;
- no mandatory Leader fallback.

This is a useful example where roster composition should matter.

### Redwater Ferry — inspect tally marks

Current:

- Oren Wits 12.

Success:

- reveals Smuggler Cache;
- discovers rumour.

Classification:

- **B / C optional clue shortcut**.

Roster rule:

- Oren route only if active;
- optional Leader Wits 14 is acceptable;
- no core soft-lock because Broken Span owns the actual Missing Ledger clue-stage route.

### Moonmere — find tower path

Current:

- Rope → guaranteed success;
- otherwise Oren Wits 12 if Archive standing >= 1;
- otherwise Mira Scout 12.

Success opens **Silent Tower** route.

Classification:

- **D core-progress gate**.

Current reserve bug:

Faction standing may choose reserve Oren even if Mira is active.

Required route:

1. Rope → guaranteed;
2. preferred active specialist:
   - active Oren Wits 12 where Archive logic applies;
   - otherwise active Mira Scout 12;
3. if preferred specialist reserve, use the other active Oren/Mira route;
4. if future roster rules ever allow both absent, Leader Wits/Scout 14.

Under current one-reserve canon one of Oren/Mira is always active.

### Hollowglass — search mineral shelves

Current dynamic actor:

- before Keen Lens: Oren Wits 12;
- after Lens: Mira Scout 12.

Rewards:

- Keen Lens;
- later Bog Amber.

Classification:

- **C optional equipment/valuable reward**.

Roster rule:

- prefer relevant active Oren/Mira;
- if preferred actor reserve, use the other active specialist at the appropriate skill only if fiction still makes sense;
- otherwise allow optional loss.

No core quest fallback required.

### Smuggler Cache — open

Current:

- Lockpicks → guaranteed;
- otherwise Garrick Might 12.

Success recovers **Guild Ledger**, required to finish Missing Ledger.

Classification:

- **D core-progress gate**.

Required fallback:

1. Lockpicks → guaranteed;
2. Garrick active → Might 12;
3. Garrick reserve → **Leader Might 14**.

Failure consequence can still start Brigand Pair combat.

Do not make Garrick mandatory for a core quest after the player has legitimately chosen him as reserve.

## 8. Dialogue-resolution audit

### Lantern Road — talk down the crew

Current:

```js
rollCheck("brindle", "guile", 13)
```

Success:

- resolves road safely without combat;
- applies faction changes;
- records bargained outcome.

Failure:

- Toll Cutters combat.

Classification:

- **B specialist-preferred quest resolution**, not the sole core route.

A fight route exists, so there is no hard soft-lock.

However, making peaceful resolution impossible whenever Brindle is reserve would make her disproportionately mandatory for players who prefer non-violent resolution.

Recommended fallback:

- Brindle active → Brindle Guile 13;
- Brindle reserve → **Leader Guile 15**.

Leader copy must be their own negotiation, not Brindle's moral/faith voice.

This preserves:

- Brindle as better negotiator in this moment;
- peaceful possibility without mandatory roster composition;
- meaningful penalty for leaving Brindle in reserve.

## 9. Camp-moment audit

Current main has six named camp moments:

- Garrick — First Watch;
- Mira — The Edge of Mira's Map;
- Oren — The Folded Page;
- Brindle — A Prayer Without an Ending;
- Garrick/Mira — Two Ways Through Trouble;
- Oren/Brindle — What Truth Is For.

Current runtime eligibility checks:

- day;
- Trust/legacy loyalty;
- memories;
- prior decisions;

but **not active/reserve presence**.

Classification:

- **A character-specific authored content**.

Required rule:

A personal camp moment may fire only when every companion whose direct presence the scene requires is fictionally present.

Because LR-0103 establishes a safe camp/support reserve, reserve presence is possible at established safe camp transitions, but it must be explicit.

Recommended content/runtime contract:

```text
presence:
  active_required: [...]
  camp_present_allowed: [...]
  camp_wide: true|false
```

Until such metadata exists:

- single-character personal moments should normally require that character active **or** explicitly camp-present;
- multi-character scenes should require all speaking participants present;
- never award memories/Trust from a scene to a companion who was not present.

Do not replace personal scenes with Leader skill checks.

## 10. Decision-reaction audit

Current main has 13 decision reaction groups involving:

- Garrick;
- Mira;
- Oren;
- Brindle.

Current `reactToDecision()`:

- applies Trust/loyalty changes to all listed members;
- adds memories to all listed members;
- changes companion bonds;
- renders reaction lines;

without checking whether the companion was active or witnessed the event.

Classification:

- **A character reaction / witness-state correctness**.

Required LR-0125/LR-0093 rule:

For a field decision:

- direct reaction lines only from active companions;
- direct witness memories only to active companions;
- direct Trust reaction only to companions who witnessed or were explicitly told in the same authored flow.

Reserve companion may learn later via:

- camp-wide event;
- Leader debrief;
- companion telling them;
- public party-news/gossip.

That later knowledge must be a distinct memory source.

Do not silently give reserve companions omniscient witness memories.

## 11. Item/passive actor assumptions

Current main also contains hard-coded item benefits:

- Mail Patch affects Garrick max HP;
- Keen Lens affects Oren Wits;
- Trail Charms affect Mira Scout.

These are **not check soft-locks**.

They remain valid character-owned effects.

LR-0125/LR-0017 must ensure:

- reserve companion keeps equipment state;
- reserve equipment does not benefit active field checks;
- active actor's bonuses are derived from that actor;
- no gear causes runtime to select a reserve owner for a check.

The Broken Span Keen Lens selection bug is the key example.

## 12. General implementation contract

For every field check:

### Step 1 — determine legal presence

```text
active actors = Leader + active companions
```

Reserve is excluded.

### Step 2 — build authored approaches

Each approach declares:

- actor requirement;
- skill;
- DC;
- whether it is core or optional;
- optional tool bypass.

### Step 3 — render only legal approaches

Do not render:

> Mira, read the tracks.

if Mira is reserve.

### Step 4 — preserve core progress

If all specialist approaches disappear and the action is classification D:

- show Leader fallback;
- tool route;
- or other active route.

### Step 5 — resolve against actual actor

Logs, damage, memories and resource consequences must reference the actor who actually acted.

Never:

- Leader makes check;
- Mira takes failure damage.

## 13. Suggested content shape

Conceptual only:

```json
{
  "approaches": [
    {
      "actor": "mira",
      "requires": "active",
      "skill": "scout",
      "dc": 12
    },
    {
      "actor": "leader",
      "skill": "scout",
      "dc": 14,
      "fallback": true
    }
  ]
}
```

For multiple specialists:

```json
{
  "approaches": [
    { "actor": "oren", "requires": "active", "skill": "wits", "dc": 12 },
    { "actor": "mira", "requires": "active", "skill": "scout", "dc": 12 },
    { "actor": "leader", "skill": "wits", "dc": 14, "fallback": true }
  ]
}
```

Exact schema belongs to LR-0125 / architecture owners.

## 14. Reserve permutation matrix

Canonical roster always has exactly one reserve companion when all four are available.

### Reserve Garrick

Active:

- Leader;
- Mira;
- Oren;
- Brindle.

Core-risk checks:

- Smuggler Cache cannot use Garrick Might.
- Required fallback: Lockpicks or Leader Might 14.

Other effects:

- Night Steps still has Mira.
- Garrick camp/reaction content requires presence/witness rules.
- no core quest should fail solely because Garrick is reserve.

### Reserve Mira

Active:

- Leader;
- Garrick;
- Oren;
- Brindle.

Core-risk checks:

- Weeping Stones tracking loses Mira Scout.
- Required fallback: Leader Scout 14.
- Broken Span uses active Oren rather than reserve Mira.
- Moonmere uses active Oren if no Rope.
- Hollowglass may use active Oren or lose optional Mira-specific reward route.

Other effects:

- Night Steps still has Garrick.
- Mira-specific travel advantages disappear legitimately.

### Reserve Oren

Active:

- Leader;
- Garrick;
- Mira;
- Brindle.

Core-risk checks:

- Broken Span must use active Mira instead of reserve Oren even if Keen Lens exists.
- Moonmere must use active Mira instead of reserve Oren despite Archive standing.

Other effects:

- Watcher's Rest ledgers may use Leader fallback or be optional.
- Weeping Stones mineral reward may be unavailable.
- Redwater inspection clue may be unavailable/Leader fallback.
- no core quest is blocked.

### Reserve Brindle

Active:

- Leader;
- Garrick;
- Mira;
- Oren.

Core-risk checks:

- Saint Rhel chamber search requires Lantern Oil or Leader Spirit 14.
- peaceful Lantern Road negotiation uses Leader Guile 15 if offered.

Other effects:

- shrine/travel Brindle bonuses are unavailable;
- combat/fight paths remain;
- Brindle reaction/camp content must respect witness/presence.

## 15. Core quest regression matrix

### Lanterns on the Old Road

Required current chain:

1. Weeping Stones tracking;
2. Deal with crew;
3. fight or bargain.

Test with Mira reserve:

- Leader Scout fallback can find tracks;
- Deal action unlocks;
- if Brindle active, Brindle bargain works;
- if Brindle reserve, Leader bargain fallback exists or fight remains;
- quest can complete.

Test with Brindle reserve:

- tracking via active Mira;
- peaceful route remains harder through Leader, not impossible;
- fight route remains.

### Missing Ledger

Required current chain:

1. Broken Span clue;
2. Smuggler Cache;
3. recover ledger.

Test with Oren reserve:

- active Mira resolves Broken Span regardless of Keen Lens ownership;
- cache opens by Lockpicks / active Garrick / Leader fallback.

Test with Mira reserve:

- active Oren resolves Broken Span;
- cache recovery remains viable.

Test with Garrick reserve:

- clue unaffected;
- cache uses Lockpicks or Leader Might fallback.

### Pilgrim's Reliquary

Required current chain:

1. Saint Rhel search;
2. open hidden chamber;
3. recover reliquary.

Test with Brindle reserve:

- Lantern Oil guaranteed route works;
- without oil, Leader Spirit fallback works;
- no forced rotation required.

### Silent Tower

Required current chain:

1. Moonmere path;
2. upper archive;
3. recover Moon Chart.

Test with Oren reserve:

- Rope works;
- otherwise active Mira Scout route works.

Test with Mira reserve:

- Rope works;
- otherwise active Oren Wits route works.

Faction standing must not force selection of reserve Oren.

### Ash in the Marsh

Current Mosslight core choices are not skill-gated by a named companion.

Test:

- any reserve permutation can reach Mosslight choices;
- reaction/witness memories apply only to present companions.

### Sealed Medicine

No current core hard-coded companion skill gate found in this audit.

Test:

- all four reserve permutations remain completable;
- companion reactions respect witness rules.

## 16. Travel/camp regression set

For every data-driven event with `check.actor`:

1. named actor active → specialist option shown and works;
2. named actor reserve → specialist option hidden or clearly unavailable;
3. at least one valid alternative remains;
4. no reserve character receives damage/reward/memory from the field event.

Specific Night Steps test:

- reserve Mira → Garrick option remains;
- reserve Garrick → Mira option remains;
- reserve Oren/Brindle → both options remain.

## 17. Camp/reaction regression set

### Personal camp moment

- primary companion active/present → can appear;
- primary companion absent from that safe camp context → cannot appear;
- multi-character moment requires all necessary participants;
- result changes only intended present-character memories/Trust/bonds.

### Decision reaction

Field decision with one referenced companion reserve:

- reserve companion does not interject;
- reserve companion does not receive direct witness memory;
- active referenced companion may react;
- later debrief can create separate knowledge state.

## 18. What must not happen

Do not solve roster compatibility by:

- keeping all four companions mechanically active while calling one “reserve”;
- letting reserve companion roll checks off-screen;
- applying reserve equipment bonuses to field checks;
- auto-rotating a specialist into the party for one check;
- summoning reserve to a site;
- replacing every named companion check with Leader;
- making the Leader equal to specialists at the same DC;
- hiding a core-progress action with no fallback;
- awarding direct memories to companions who did not witness the event.

## 19. What may legitimately be lost when a companion is reserve

Roster choice needs real trade-offs.

It is acceptable to lose or delay:

- optional valuable-item searches;
- specialist bonus Gold;
- specialist rumour shortcuts;
- particular travel-event solutions;
- character-specific dialogue;
- personal-arc scenes until the character is present.

It is not acceptable to lose:

- the ability to finish a core campaign quest;
- all peaceful or all non-combat resolution styles because one companion is reserve, unless intentionally authored and reviewed;
- save integrity;
- persistent character history.

## 20. Implementation priority for LR-0125

When roster runtime work begins:

### Priority 1 — presence primitive

Add one authoritative way to ask:

```text
isActivePartyActor(id)
isActiveCompanion(id)
isReserveCompanion(id)
```

Do not scatter raw array checks everywhere.

### Priority 2 — check selection

Make data-driven and hard-coded check flows reject reserve actors.

### Priority 3 — core gate fallbacks

Implement:

- Saint Rhel Leader Spirit fallback;
- Weeping Stones Leader Scout fallback;
- Broken Span active Oren/Mira selection;
- Moonmere active Oren/Mira selection;
- Smuggler Cache Leader Might fallback;
- Brindle-reserve Lantern Talk Leader Guile fallback.

### Priority 4 — witness filtering

Filter:

- camp moments;
- decision reactions;
- Trust/memory writes;
- interjection copy.

### Priority 5 — optional specialist routes

Then reconcile optional reward/rumour checks.

## 21. Acceptance mapping

### Inventory companion dependencies

Sections 6–11 cover:

- travel events;
- camp event;
- sites;
- quest gates;
- dialogue resolution;
- camp moments;
- decision reactions;
- equipment/check interaction.

### Classification

Every audited dependency is assigned:

- A character-specific;
- B specialist-preferred;
- C optional;
- D core-progress.

### Four reserve permutations

Section 14 covers Garrick, Mira, Oren and Brindle each being reserve.

### Core fallbacks

Sections 7–8 and 15 define Leader/tool/alternate-specialist routes.

### Preserve companion identity

Sections 9–10 and 18–19 explicitly prevent “replace all companions with Leader.”

### Regression matrix

Sections 15–17 define representative core-quest, travel/camp and witness tests.

## 22. Handoff

LR-0125 should consume this audit alongside LR-0103.

The governing rule is:

> **Reserve changes which strengths are available, not whether the campaign still works.**

The player should feel the absence of the reserved specialist.

They should never discover that the game secretly used that specialist anyway, or that one legitimate roster choice has broken a core quest.
