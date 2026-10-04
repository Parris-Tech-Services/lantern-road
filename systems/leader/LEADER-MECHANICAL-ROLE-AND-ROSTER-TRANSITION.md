# Lantern Road — Player Leader Mechanical Role & Four-Person Roster Transition

Task: **LR-0103**  
Owner: **Agent 3 — The Mechanist**  
Governance input: **LR-0089 Player-Leader Party Contract**  
Related design inputs: parked **LR-0006**, **LR-0057**, **LR-0058**, **LR-0092**, **LR-0094**, authored **LR-0102**  
Status: specification only. This task does **not** edit `game.js`, `content.js`, save runtime or parked implementation branches.

## 1. Purpose

Lantern Road's canonical active party is now:

> **the player Leader + three active companions**

The current prototype was built around:

> **Garrick + Mira + Oren + Brindle all active**

That creates a real mechanical gap.

The Leader must become a genuine adventurer who:

- takes a combat turn;
- can make skill checks;
- can be hurt and injured;
- can use equipment;
- can progress;
- can coordinate companions;
- remains mechanically lighter than a full custom RPG class;
- does not erase the stronger authored identities of Garrick, Mira, Oren and Brindle.

The fourth available companion remains in **reserve** with their state preserved.

## 2. Design target

The Leader's mechanical identity is:

> **competent generalist + coordinator**

Not:

- best fighter;
- best scout;
- best scholar;
- best spiritual support;
- best social specialist;
- blank spectator;
- fully custom class;
- clone of whichever companion is in reserve.

The Leader should feel useful in every party composition while the three active companions determine the party's strongest specialist tools.

## 3. Canonical boundaries inherited from LR-0089

The following are not open for Mechanist reinterpretation:

1. active adventuring party is exactly four people total;
2. one is the Player Leader;
3. three are active companions;
4. Garrick, Mira, Oren and Brindle all remain persistent recruitable companions;
5. when all four companions are available, one is reserve;
6. Leader remains final authority over irreversible party-level choices;
7. companions retain bounded personal agency;
8. Leader identity stays light rather than becoming a large character creator.

This specification must fit those rules.

## 4. Leader baseline mechanical profile

Recommended starting profile:

| Stat | Leader |
| --- | ---: |
| Max HP | **14** |
| Might | **2** |
| Scout | **2** |
| Wits | **2** |
| Spirit | **2** |
| Guile | **2** |

### Why 14 HP

Current companion baseline HP:

- Garrick: 18;
- Mira: 12;
- Oren: 11;
- Brindle: 13.

Fourteen puts the Leader:

- sturdier than the fragile specialists;
- clearly below Garrick;
- able to survive ordinary front-line mistakes;
- unlikely to become the automatic tank.

### Why all skills at 2

Current authored specialist peaks:

- Garrick Might 4;
- Mira Scout 4 / Guile 3;
- Oren Wits 4;
- Brindle Spirit 4 / Guile 2.

A flat **2** means:

- the Leader can attempt any ordinary check;
- a specialist remains meaningfully better in their niche;
- the player is not forced to invent a class at character creation;
- optional background tags do not need to carry combat/stat power.

This is a recommended balance baseline for implementation/testing, not immutable canon. LR-0020 may tune numbers after actual play.

## 5. No background-stat package

LR-0102 explicitly defines backgrounds as perspective, not class.

Therefore:

- Road Hand does **not** grant +Scout/+Might;
- Watch-Trained does **not** grant +Attack/Defence;
- Archive-Taught does **not** grant +Wits;
- Pilgrim-Road does **not** grant +Spirit;
- No Stated Background is not mechanically inferior.

Backgrounds may unlock:

- a contextual line;
- a different interpretation;
- recognition of a practical fact;
- an alternate way to frame a check.

They do not modify the Leader's permanent baseline skill values by default.

## 6. Background checks

A background option can still matter mechanically without being a stat bonus.

Preferred patterns:

### Information unlock

> **[Archive-Taught]** You recognise the copyist mark.

This can reveal an option without automatically succeeding a later check.

### Alternate approach

> **[Road Hand]** Inspect the load before lifting the axle.

The action can:

- use the same Leader skill;
- change the consequence on failure;
- reveal useful information before committing.

### Reduced uncertainty, not raw superiority

A background can tell the player:

> This bridge brace is improvised.

It should not silently apply:

> +3 because Road Hand.

Any numeric background bonus would require an explicit later Mechanist/Director decision.

## 7. Leader combat identity

The Leader is a **generalist combatant who improves team execution**.

First implementation kit should stay deliberately small.

### Strike

**Cost:** Action  
**Recharge:** Turn  
**Target:** enemy  
**Attack basis:** Leader Might  
**Recommended damage:** **3–5**

Purpose:

- reliable at-will option;
- Leader is never left with “nothing useful”;
- weaker raw ceiling than Garrick's specialist Strike/Breaker identity;
- comparable to a modest non-specialist attack.

### Direct

**Cost:** Quick Action  
**Recharge:** **2 uses per encounter**  
**Target:** one active companion  
**Effect:** the target companion's next Attack roll before the Leader's next turn gains **+1 Attack**.

Rules:

- Direct does not make the companion act immediately;
- Direct does not choose the companion's later action;
- Direct does not grant an extra Action;
- Direct does not spend the companion's resource;
- Direct expires if unused before the Leader's next turn;
- Direct cannot target the Leader in the first implementation.

Purpose:

- expresses leadership mechanically;
- helps a specialist land something important;
- creates Action + Quick Action sequencing;
- does not replace Bless because it is smaller, Leader-limited and does not carry Brindle's support identity.

### Reaction

The Leader has the standard LR-0094 Reaction resource when the system is implemented, but needs **no universal baseline Reaction ability**.

A Leader Reaction can later come from:

- progression;
- equipment;
- encounter context.

This avoids adding a third ability solely because the resource exists.

## 8. Why Direct does not violate companion autonomy

In immediate combat, tactical direction is legitimate Leader authority under LR-0089/LR-0092.

Direct means:

> “Mira, that one.”

It provides a small opportunity.

It does not mean:

> “Mira, use Pin Shot now whether you want to or not.”

The player still chooses the companion's ordinary combat Action on their turn.

If a future combat action involves:

- a hard personal boundary;
- rare-resource use;
- an exceptional authored refusal;

LR-0092 still governs that decision.

## 9. Direct should not become a free-turn engine

Forbidden interpretations:

- target companion acts immediately;
- target companion gains another Action;
- target companion refreshes a spent encounter charge;
- target companion repeats a signature ability for free.

Direct only modifies the next eligible Attack roll.

This keeps initiative/turn order meaningful.

## 10. Interaction with Bless

Brindle's Bless and Leader Direct should remain distinct.

Recommended first behaviour:

- both may exist on the same companion;
- both modify the next eligible Attack;
- LR-0020 tests whether stacking makes burst turns too reliable.

If stacking proves dominant, prefer:

- non-stacking “use highest modifier”; or
- one consumes first;

rather than deleting one identity.

Do not make Direct literally apply the Bless status, because that erases Brindle's language/identity.

## 11. Leader progression identity

The Leader should get **one small permanent leadership choice**, not a class tree.

Recommended unlock:

> **Renown 2**, aligned with the parked LR-0006 companion path timing.

Working design names are provisional.

### Focus A — Lead From the Front

- Leader Strike deals **+1 offensive damage**.
- Direct remains 2 uses per encounter.

Identity:

> I contribute more directly.

### Focus B — Coordinator

- Direct gains **+1 encounter use** (3 total).
- Leader Strike remains baseline.

Identity:

> I make specialists more reliable.

### Why this is enough

It creates a meaningful permanent choice:

- personal output;
- team coordination.

It does not create:

- subclasses;
- ten-node skill tree;
- spell lists;
- stat allocation;
- background-as-class.

### Approval note

The existence of one small mechanical Leader focus is a Mechanist recommendation.

Final player-facing focus names should receive Director review.

If Josh wants the Leader to have **no permanent combat focus at all**, this is the easiest part to remove without breaking the rest of the design.

## 12. Anti-dominance target

The Leader must not be best at a companion's defining role.

### Against Garrick

Leader must not:

- tank better;
- Guard better;
- intercept better.

14 HP and no baseline Guard ability preserve Garrick's identity.

### Against Mira

Leader must not:

- have Scout 4;
- expose enemies as efficiently;
- dominate initiative and Guile together.

### Against Oren

Leader must not:

- have Wits 4;
- provide stronger repeated control than Bind.

### Against Brindle

Leader must not:

- heal efficiently;
- Bless better;
- become the default Spirit specialist.

### General rule

If a party composition without a particular companion loses nothing mechanically because the Leader duplicates that companion's niche, the Leader kit is too broad.

## 13. Party-composition value

Because only three companions are active, composition should matter.

Examples:

### Garrick + Mira + Oren

The party gains:

- protection;
- scouting/setup;
- control/knowledge.

It gives up Brindle's strongest recovery/support.

Leader does not replace that loss.

### Garrick + Mira + Brindle

The party gains:

- protection;
- scouting;
- recovery.

It gives up Oren's best Wits/control.

Leader Wits 2 can attempt ordinary checks but does not erase the absence.

### Mira + Oren + Brindle

The party gains:

- speed/setup;
- knowledge/control;
- recovery.

It gives up Garrick's dedicated protection.

Leader's 14 HP helps but does not become Hold Fast.

This is the desired reserve trade-off.

## 14. Skill-check participation

The Leader should be selectable for ordinary checks where it makes fictional sense.

Current prototype often hard-codes:

> Mira checks Scout.

Future authoring can instead offer:

> “Mira, read the tracks.”

or:

> “I’ll look myself.”

If Mira is active:

- Mira Scout 4 is the specialist route;
- Leader Scout 2 is a viable but weaker personal route.

If Mira is reserve:

- Leader can still attempt the check;
- another active companion may have a different authored approach;
- content must not become unwinnable because one specialist is not active.

## 15. Specialist-gated content rule

Do not hard-lock core campaign progress because one companion is reserve.

A specialist may provide:

- easier DC;
- safer consequence;
- extra information;
- unique interpretation;
- better reward;
- relationship content.

But core progression should normally retain at least one alternative:

- Leader attempt;
- another companion approach;
- tool/resource route;
- extra time;
- different quest path.

This makes reserve rotation a choice rather than a trap.

## 16. Checks that should remain companion-specific

Not every action needs a Leader substitute.

Keep a check/action companion-specific when the point is:

- that character's personal authority;
- their personal arc;
- their faith/identity;
- a relationship callback;
- specialised authored knowledge only they possess.

Example:

Oren interpreting his own Archive history is not a generic Leader Wits check.

## 17. Leader participation in travel systems

The Leader contributes through:

- ordinary skill checks;
- Direct/leadership choices in authored travel events;
- route decisions;
- resource allocation;
- contextual background options.

Do not create a separate “Leadership skill” for every expedition roll.

The five established skills remain sufficient.

## 18. Leader equipment slot

The Leader should use the same simple equipment architecture as LR-0006:

> **one meaningful equipment slot**

Conceptual state:

```text
progression.equipment.leader = itemId | null
```

Do not introduce:

- weapon + armour + trinket slots just for the Leader;
- a separate inventory;
- class-restricted loot tiers.

## 19. Equipment compatibility

Existing companion-signature equipment remains companion-specific unless LR-0017 explicitly says otherwise.

Examples:

- Mail Patch remains Garrick equipment;
- Trail Charms remain Mira equipment;
- Keen Lens remains Oren equipment;
- Healer's Satchel remains Brindle equipment.

The Leader may equip:

- future items explicitly marked Leader-compatible;
- future genuinely generic items if LR-0017 creates them.

Do not let the Leader take every companion's signature gear and become the best all-rounder.

## 20. Leader equipment design target

LR-0017 should eventually provide at least **two genuine Leader sidegrades** before equipment choice is considered complete.

Recommended role contrast:

### Coordination item

Improves Direct in a bounded way.

Example concept:

- one Direct use gains an additional small effect;
- not an unconditional extra Action.

### Self-reliance item

Improves Leader survival or Strike modestly.

Example concept:

- +1 Defence;
- or a conditional Strike bonus.

Price belongs to LR-0016.

Final item names/content belong to LR-0017 and Storyteller/Lamplighter as appropriate.

## 21. Reserve companion equipment

When a companion moves to reserve:

- their equipped item remains assigned to them;
- it is not silently returned to the common pack;
- it is not auto-equipped by the incoming companion;
- it does not benefit the active party while that companion is reserve.

At a safe rotation interface, the player may deliberately:

- unequip;
- reassign compatible generic gear;
- equip the incoming companion.

No automatic gear stripping.

## 22. Leader injury model

The Leader should use the same LR-0058 first-wave injury rules:

- at most one persistent injury;
- understandable trigger;
- normally -1 to one skill and/or 0–2 max HP;
- no random lost turns;
- proper recovery choices;
- save/load persistence.

The Leader is not injury-immune because they are the player avatar.

## 23. Leader injury compatibility

The existing/candidate injury vocabulary can apply naturally:

- Bruised Ribs → Might;
- Sprained Ankle → Scout;
- Concussion → Wits;
- Shaken → Spirit;
- Split Lip candidate → Guile.

With baseline skills of 2, a -1 injury leaves the Leader competent enough to act while making specialist support more valuable.

## 24. Leader recovery

The Leader uses the same recovery systems as companions:

- proper rest;
- eligible Field Treatment;
- specialist service if implemented.

No free “player character heals faster” rule.

Ordinary shared healing items may be spent on the Leader directly because the Leader is the player's own body.

Companion willingness rules apply when asking a companion to consume treatment themselves.

## 25. Leader knockout — unresolved creative/system decision

This requires explicit Josh/Director confirmation before runtime integration.

Two plausible approaches exist.

### Option A — ordinary party-member knockout

Leader reaches 0 HP:

- Leader loses their turns;
- combat continues while at least one active companion stands;
- defeat occurs only when all four active members are down.

**Pros**

- mechanically consistent;
- avoids making Leader the single failure point;
- avoids Garrick/protection becoming mandatory.

**Concern**

The player would still be choosing ordinary companion combat actions while the fictional Leader is unconscious, which slightly reintroduces the “external controller” feeling Josh explicitly disliked.

### Option B — Leader knockout forces Retreat

Leader reaches 0 HP:

- party automatically retreats/loses the fight.

**Pros**

- preserves the fiction that the player's embodied perspective is down;
- makes protecting the Leader matter.

**Concerns**

- makes Leader uniquely fragile/important;
- may create frustrating loss spikes;
- risks making defensive compositions mandatory.

### Mechanist recommendation

Prefer **Option A** unless player testing shows the fiction feels wrong.

The game already separates player input from literal spoken commands during compact combat. Making the Leader a unique instant-loss condition is likely to create more systemic harm than immersion benefit.

But because this touches Josh's central “I am in the party” direction, do not settle it silently.

## 26. Companion reserve model

Persistent roster consists of:

- Garrick;
- Mira;
- Oren;
- Brindle.

Roster state is independent from active-party selection.

Conceptually:

```text
roster = {
  activeCompanionIds: [three ids],
  reserveCompanionIds: [one id]
}
```

Do not encode “reserve” by deleting a companion from character state.

## 27. Rotation locations

Rotation is allowed only at believable safe transitions.

Minimum:

- settlement;
- camp when the reserve companion is fictionally available.

Not allowed:

- mid-combat;
- during a blocking dialogue;
- during an unresolved travel event;
- halfway through a site consequence.

If the reserve companion is not plausibly present at a specific camp, rotation must not magically summon them.

## 28. Reserve-preserved state

A reserve companion keeps:

- Trust;
- relationship values;
- memories they actually possess;
- personal-arc state;
- HP;
- injury/condition;
- equipment;
- progression path;
- any character-owned persistent state.

Reserve status pauses participation; it does not reset the character.

## 29. No reserve healing exploit

Moving to reserve does not:

- heal HP;
- clear Fatigue-related character state;
- clear injury;
- restore spent character-owned campaign resources;
- duplicate equipment.

Rotating a hurt companion out is allowed as a tactical campaign choice.

They remain hurt until an owning recovery rule heals them.

## 30. Reserve and Rations

Do **not** increase the current one-ration-per-day campaign cost merely because four authored companions exist in the roster.

The active adventuring party remains four total:

- Leader;
- three companions.

The reserve system should not silently impose a 25% food-economy increase.

If later fiction establishes that reserve characters travel physically with a larger caravan/camp and should consume supplies, LR-0016 must explicitly rebalance that.

## 31. Reserve and direct memories

A reserve companion does not receive a direct memory for an event they did not witness.

They may later receive:

- public party-news summary;
- a companion telling them;
- a Leader debrief;
- settlement gossip.

Those are different memory sources.

This preserves LR-0089.

## 32. Reserve and quest availability

Do not make a core quest permanently missable because the relevant companion happened to be reserve at first contact.

Possible patterns:

- quest proceeds with different dialogue;
- companion-specific insight is unavailable now;
- player can defer a non-urgent personal branch;
- later debrief unlocks a follow-up;
- rotation at the next safe point enables personal continuation.

Personal-arc content can legitimately require that companion active.

## 33. Rotation UI contract

At a valid safe transition, show:

### Active

- Leader — always active / cannot reserve
- Companion A
- Companion B
- Companion C

### Reserve

- Companion D

Player selects one active companion to swap with reserve.

Before confirmation show:

- HP;
- injury;
- equipment;
- role;
- short “what changes” summary.

Example:

> **Bring Oren in for Mira?**  
> Gain stronger Wits / Bind access.  
> Lose Mira's Scout / Pin Shot access.  
> Mira keeps her injury and equipment while in reserve.

Do not require the player to calculate the trade-off from raw JSON-like stats.

## 34. Leader cannot be reserved

The player is the Leader.

The roster screen must not present:

> Put Leader in reserve.

If a future authored event separates the Leader from the party, that is a dedicated story/system state, not ordinary roster rotation.

## 35. New-game transition

The current prototype starts all four companions active.

Under the new model, a new campaign should not silently pick which beloved companion is excluded.

Recommended first-departure flow:

1. establish the Leader;
2. all currently available companions are introduced/present;
3. before first meaningful departure/combat with the full roster, ask the player to choose three active companions;
4. explain that the fourth remains available in reserve;
5. make rotation possible later at safe transitions.

Do not make the first reserve choice irreversible.

## 36. Existing-save migration goals

Migration must preserve **all four companions**.

Never solve the roster transition by deleting whichever fourth companion is not active.

Preserve:

- character state;
- Trust;
- relationship history;
- memories;
- HP;
- injuries;
- equipment;
- progression;
- quest/personal-arc state.

Then add:

- Leader state;
- active-companion roster state;
- reserve state.

## 37. Existing-save Leader defaults

For a migrated save where the player has never configured a Leader:

- name fallback: **Leader**;
- background: **No Stated Background**;
- baseline mechanical profile from this document;
- no invented biography;
- no retroactive fake memories claiming the Leader personally said things they never chose.

Past party-level decisions may be attributed to:

> the party / your leadership before explicit identity setup

rather than fabricating exact old dialogue.

## 38. Existing-save roster selection

Do not arbitrarily reserve Brindle, Oren, Mira or Garrick.

Recommended migration state:

```text
rosterSelectionPending = true
```

At the next safe interactive point:

- require the player to choose three active companions;
- all four companion states are visible and preserved.

Until selection is complete:

- do not begin a new combat;
- do not begin a companion-sensitive departure that would require active-roster identity.

This makes the migration deterministic without privileging one companion.

## 39. If an old save resumes inside combat

This must follow the final LR-0011/LR-0013 combat-save contract.

If in-combat saves exist and are supported:

Recommended compatibility approach:

1. finish/resume the existing legacy combat snapshot with its original participants;
2. do **not** inject the Leader halfway through;
3. after the combat/Retreat resolves, set roster selection pending;
4. require Leader + three active companions before the next combat.

Do not rewrite turn order underneath an in-progress saved fight.

If combat saves are not supported by the final foundation, this migration branch is unnecessary.

## 40. New persisted Leader state

Conceptual, not final schema:

```text
leader = {
  name,
  backgroundTag,
  hp,
  progression: {
    focus,
    equipment,
    injury
  }
}
```

Do not persist derived Attack/Defence/skill totals if they can be calculated from canonical definitions.

LR-0011 owns final schema/version/migration implementation.

## 41. Shared vs distinct state

### Shared system concepts

Leader and companions share:

- HP;
- five skills;
- combat Action economy;
- injury;
- equipment slot;
- general combat targeting;
- basic save/load expectations.

### Distinct Leader concepts

Only Leader has:

- player-entered name;
- optional background tag;
- final irreversible party-choice authority;
- Leader-specific coordination ability;
- Leader progression focus.

### Distinct companion concepts

Companions have:

- Trust toward Leader;
- companion-to-companion relationships;
- authored personal arcs;
- willingness/autonomy;
- reserve status.

Do not force Leader into a fake Trust-to-self record.

## 42. Leader in character relationships

The Leader's relationship with each companion is represented by that companion's Trust toward the Leader plus memories.

Do not add:

```text
leader.loyalty
```

The Leader does not have a numeric approval score for themselves.

## 43. Leader progression storage

LR-0006 currently conceptualises companion paths under progression.

Later reconciliation may use:

```text
progression.leaderFocus
```

or a consistent actor-keyed equivalent.

Do not modify the parked LR-0006 branch now.

The migration task must preserve current companion progression exactly.

## 44. Leader equipment storage

Prefer using the same actor-keyed equipment lookup as companions:

```text
progression.equipment.leader
```

rather than creating:

```text
leaderEquipmentSomewhereElse
```

This keeps equipment infrastructure reusable.

## 45. Leader injury storage

Likewise, prefer the shared actor-keyed injury model:

```text
progression.injuries.leader
```

unless LR-0010 modularisation establishes a different canonical character-state API.

Do not create a second injury subsystem.

## 46. Leader combat turn

The Leader enters initiative exactly once.

Conceptually:

```text
turnOrder =
  Leader
+ 3 active companions
+ enemies
```

Never:

- Leader + four companions;
- three companions without Leader during ordinary combat;
- reserve companion receiving hidden turns.

## 47. Leader initiative

With baseline Scout 2, the Leader can use the same initiative rule as other party actors.

Do not grant special “Leader always goes first” initiative.

That would:

- reduce value of Mira/Ghost initiative;
- make Direct timing too reliable;
- turn leadership into free tempo dominance.

## 48. Leader Defence

With current prototype formula:

```text
Defence = 10 + floor(Might / 2)
```

Leader Might 2 implies:

> **Defence 11**

This is a reasonable baseline:

- less physically specialised than Garrick;
- not unusually fragile.

If LR-0015 later changes defence rules, consume that shared contract instead of preserving a magic 11.

## 49. Leader Strike tuning envelope

Recommended starting damage:

> **3–5**

Current prototype reference:

- Garrick Strike: 4–7;
- Mira Slip Knife: 3–6;
- Oren Sigil Bolt: 3–6;
- Brindle Mace: 2–5.

This places Leader:

- above pure support-floor damage;
- below dedicated direct attackers;
- useful when Direct is not the right Quick Action.

The progression Focus A +1 would make it 4–6, still below Breaker Garrick's intended specialist ceiling.

## 50. Direct tuning envelope

Recommended:

- Quick Action;
- 2 uses per encounter;
- +1 Attack to one active companion's next Attack before Leader's next turn.

Do not initially add:

- damage bonus;
- extra action;
- defence;
- charge refund;
- healing;
- status cleanse.

One small effect makes balance readable.

## 51. Direct and reserve rotation

Direct can target only:

- a currently active living companion.

Never:

- reserve companion;
- downed companion;
- NPC outside combat;
- the Leader themself in first wave.

## 52. Direct and companion refusal

Ordinary Direct is tactical coordination, not a personal-autonomy request.

It should not trigger a willingness calculation by itself.

A later special order that asks a companion to:

- use the last rare item;
- cross a personal boundary;
- perform a suicidal role;

does use LR-0092.

This distinction prevents combat friction.

## 53. Leader and scarce resources

The Leader may spend ordinary party resources on themselves directly.

When the Leader proposes spending a scarce resource **on a companion**:

- LR-0092 resolves that companion's personal willingness where appropriate;
- final resource spend remains explicit.

The Leader may not use Direct to bypass a companion's treatment refusal.

## 54. Leader and companion progression

The Leader's one small focus does not replace companion paths.

A party contains:

- one Leader focus;
- three active companion paths;
- one reserve companion path preserved off-field.

The reserve companion's chosen path stays theirs.

Rotation does not allow re-choosing paths.

## 55. Progression unlock timing

Recommended:

- Leader focus unlocks at Renown 2;
- companion paths remain at their own final LR-0006 timing.

If LR-0006 changes final unlock timing during reconciliation, Leader focus should normally track the same campaign milestone to avoid a second progression tutorial.

## 56. Leader progression UI

The Leader card should make the permanent choice explicit:

> **Leadership Focus**  
> Choose one. This cannot be changed later.

Option preview:

> **Lead From the Front**  
> Strike deals +1 damage.

> **Coordinator**  
> Direct gains one additional use per fight.

Do not call this a “class”.

Do not show a talent-tree screen.

## 57. Roster and progression UI

Party screen should distinguish:

### Leader

- name;
- HP;
- skills;
- focus;
- equipment;
- injury.

### Active companions

- same current companion information;
- Trust;
- progression;
- equipment;
- injury.

### Reserve companion

- clearly labelled **Reserve**;
- persistent state visible;
- swap action only at valid safe transition.

Do not make reserve feel deleted.

## 58. Phone-first roster rule

On phone, avoid showing five full character sheets at once.

Recommended:

- Leader summary;
- three active companion compact cards;
- one Reserve card;
- tap to inspect one character;
- one clear **Change party** action at valid safe locations.

The full swap should not require dragging cards precisely.

## 59. Rotation confirmation

Before swap:

> **Bring Oren in for Mira?**

Show mechanical delta:

- Gain: stronger Wits and Bind.
- Lose while Mira is reserve: stronger Scout/Pin Shot.
- Persistent note: Mira keeps her current injury/equipment.

Confirm:

- **Swap**
- **Cancel**

Visible result:

> Oren joins the active party. Mira moves to reserve.

## 60. No free resource refresh through rotation

Rotation must not refresh:

- encounter resources in an active encounter because rotation is impossible there;
- rest-recharge abilities;
- injury recovery;
- equipment charges;
- daily limits.

At a settlement/camp where actual rest separately occurs, the rest system owns any refresh.

The swap itself is not a rest.

## 61. No equipment duplication through rotation

The inventory/equipment system must ensure:

- one item instance is equipped by at most one actor;
- reserve state retains ownership assignment;
- a swap cannot clone items;
- shared generic gear must be explicitly moved, not copied.

## 62. Reserve skill contribution

Reserve companions do not contribute to:

- combat;
- travel checks;
- active site checks;
- immediate dialogue interjections;
- active party passive bonuses.

If Storyteller authors remote advice/knowledge from a reserve companion after debrief, that is an explicit narrative interaction, not passive mechanical presence.

## 63. Reserve relationship continuity

Trust toward Leader continues to exist while reserve.

But absence matters:

- no direct witness memory;
- no immediate reaction to an unseen decision;
- no Trust change merely because another companion reacted.

Later debrief can produce a new memory/response if authored.

## 64. Personal-arc continuity

Putting a companion in reserve must not:

- reset their arc;
- erase unlock state;
- remove memories.

But some personal-arc scenes may require:

> companion active/present

If the player repeatedly keeps that companion reserve, their personal arc may progress later.

That is a real roster trade-off, but should be clearly signposted.

## 65. Leader equipment and economy boundary

Leader gear will add new purchase/reward competition.

LR-0016 must therefore re-check:

- gear affordability;
- campaign recovery reserve;
- whether adding a fifth persistent equipment owner creates pressure.

Important:

The active party still has only four equipped actors at a time, but **five persistent characters** may own equipment.

Do not assume players need five premium gear pieces.

The economy target should remain:

> one or a few meaningful investments, not fully equipping everyone as a mandatory checklist.

## 66. Leader injury and economy boundary

A Leader injury uses the same recovery economy.

Do not add:

- more expensive Leader treatment;
- special protagonist tax;
- free protagonist cure.

If Leader knockout becomes an immediate Retreat after Josh/Director decision, LR-0016/LR-0020 must specifically retest defeat economy because the defeat frequency may change.

## 67. Leader and Warden QA

Warden should later verify:

- player feels embodied, not like a fifth menu cursor;
- reserve choice feels meaningful rather than punitive;
- Leader is useful but does not erase companions;
- missing specialist creates different options rather than dead content;
- rotation does not heal/reset/duplicate;
- reserve companion does not remember unwitnessed events;
- Leader actions remain phone-readable.

Mechanist does not self-certify those subjective results.

## 68. Migration from current party array

Current prototype roughly treats:

```text
state.party = [garrick, mira, oren, brindle]
```

Future architecture should avoid treating that array as the complete persistent character roster.

Preferred conceptual separation:

```text
characters = {
  leader,
  companions: {
    garrick,
    mira,
    oren,
    brindle
  }
}

roster = {
  active: ["leader", companionA, companionB, companionC],
  reserve: [companionD]
}
```

Exact schema belongs to Agent 1/LR-0011/LR-0010 integration.

## 69. Migration invariant

After migration:

```text
all old companion persistent state before migration
==
all corresponding companion persistent state after migration
```

except for deliberate, documented schema transformation.

No character state may be discarded because they move to reserve.

## 70. Migration selection invariant

The migration must never decide:

> Brindle is reserve

or:

> Oren is reserve

without the player's choice.

A deterministic migration may set:

> roster selection required

It should not make the creative party-composition choice for the player.

## 71. Old hard-coded actor checks

Current content frequently assumes specific actors.

Migration/integration should audit every hard-coded check and classify it:

### Specialist suggestion

May gain Leader/other-active alternative.

### Character-specific authored action

Keep specific.

### Core-progress dependency

Must have viable path even if specialist reserve.

### Personal-arc content

May require character active.

This audit should become part of the implementation task rather than blindly replacing every `"mira"` with `"leader"`.

## 72. New-game onboarding

Do not explain all five persistent character systems at once.

Recommended sequence:

1. enter Leader name/background lightly;
2. learn core travel/dialogue;
3. meet/understand companions;
4. choose three active companions before the first full-roster departure;
5. explain reserve in one sentence;
6. teach rotation later when returning to a safe transition.

Avoid:

> Choose class, five stats, leadership style, four companions, gear and background before seeing the road.

That violates compact premium-indie scope.

## 73. Save compatibility

LR-0103 does not own save implementation.

Runtime integration must consume:

- LR-0011 versioned save API;
- final LR-0010 module boundaries;
- browser regression from LR-0013.

Required migration fixtures should include at least:

1. old new-game save with all four companions;
2. mid-campaign save with Trust/memories;
3. save with LR-0006 paths/equipment/injury if that state exists in migration fixtures;
4. save with one companion at low HP/injured;
5. save at settlement ready for roster choice;
6. supported in-combat legacy save if combat saves exist.

## 74. Real-browser test handoff

Later implementation should cover:

### Roster

- choose any three of four companions;
- swap at settlement;
- swap at allowed camp;
- cannot swap during combat;
- cannot swap during unresolved scene;
- active party always exactly Leader + three companions.

### Persistence

- save/reload active/reserve selection;
- reserve keeps Trust;
- reserve keeps injury;
- reserve keeps equipment;
- reserve keeps progression;
- no duplicate gear.

### Combat

- Leader appears once in initiative;
- reserve never appears;
- Leader Strike works;
- Direct consumes Quick Action/charge under LR-0094;
- Direct does not grant an extra companion turn;
- Direct expires correctly;
- active party defeat logic handles Leader according to approved knockout rule.

### Checks

- Leader can attempt ordinary suitable check;
- active specialist retains stronger niche;
- reserve specialist is not silently used;
- core quest retains viable alternative.

## 75. Balance test handoff

LR-0020 should add roster permutations.

At minimum test:

### Composition A

Leader + Garrick + Mira + Oren  
No Brindle.

Question:

> Can lack of strongest healer be managed without Leader turning into healer?

### Composition B

Leader + Garrick + Mira + Brindle  
No Oren.

Question:

> Can ordinary Wits progress through Leader/tools/alternate routes while Oren still feels meaningfully missed?

### Composition C

Leader + Garrick + Oren + Brindle  
No Mira.

Question:

> Do Scout/Guile routes remain viable but meaningfully harder/different?

### Composition D

Leader + Mira + Oren + Brindle  
No Garrick.

Question:

> Can the party survive without dedicated protector while Leader does not become substitute tank?

Run each under both Leader focus options if retained.

## 76. Direct dominance test

Direct is suspect if:

- it is always spent on the same companion;
- it makes Bless/Pin Shot/control setup obsolete;
- +1 Attack is so valuable that Leader's own Strike almost never matters;
- Coordinator focus is universally better than Lead From the Front.

Direct is too weak if:

- players never spend it before encounter ends;
- +1 Attack rarely changes a decision;
- Leader feels like a weaker companion plus decorative button.

Tune charges/effect before adding more Leader abilities.

## 77. Generalist dominance test

All-skills-2 is suspect if:

- player stops bringing specialists because Leader is “good enough” at everything with no meaningful loss;
- background/context options plus skill 2 effectively outperform skill 4 specialists.

It is too weak if:

- the Leader is almost never a credible check choice;
- “I’ll do it myself” is always obviously wrong.

The target is:

> viable second-best, not universal best.

## 78. Decisions requiring Director/Josh confirmation

### Decision A — Leader knockout consequence

Must be settled before runtime implementation.

Mechanist recommends ordinary knockout/continued combat, but the embodiment trade-off belongs to Josh/Director.

### Decision B — reserve companion fiction at camp

The contract permits rotation at a believable camp or settlement.

Story/Director should clarify whether the reserve companion:

- physically travels nearby with the expedition but is not one of the four active adventurers;
- or is only available at particular safe hubs.

This changes where rotation is fictionally legal.

Mechanist requirement:

> no magical mid-danger summoning.

### Decision C — final Leader focus names

The two-effect structure is Mechanist design.

Player-facing names/tone should receive Director review.

### Decision D — whether Leader focus is permanent

Mechanist recommends one permanent Renown-2 choice to mirror meaningful progression.

If Josh prefers the Leader to remain mechanically fixed and let only companions specialise, remove the focus rather than expanding it into a tree.

## 79. Decisions that do not need creative escalation

These are ordinary system recommendations unless review identifies a conflict:

- Leader baseline skills 2 across;
- starting HP 14;
- Strike 3–5;
- Direct Quick Action 2/encounter +1 next companion Attack;
- one equipment slot;
- same injury/recovery rules;
- reserve state preserves all persistent character data;
- no auto-heal/reset on rotation;
- no background stat bonuses;
- no reserve contribution to combat/checks.

These numbers can be balance-tuned later without changing product identity.

## 80. Acceptance mapping for LR-0103

### Leader mechanical participation

Sections 4–17, 46–53 define combat, checks, damage and travel contribution.

### Compact progression identity

Sections 11 and 54–56 define one small two-way leadership focus rather than a class system.

### LR-0094 / LR-0006 compatibility

Sections 7–11, 43–50 and 54–56 consume their design contracts without editing parked branches.

### Equipment / injury / scarce resources

Sections 18–24 and 53, 65–66.

### Reserve / rotation

Sections 26–34 and 57–64.

### Migration from four active companions

Sections 35–45 and 68–73 preserve all old companion data and avoid arbitrary reserve choice.

### Creative approvals

Section 78 explicitly identifies the remaining Josh/Director decisions.

### Authoring-only scope

No runtime or parked feature branch is changed.

## 81. Handoff to runtime integration

Do not implement this by bolting `leader` into every existing four-companion loop before LR-0010.

The safe sequence is:

1. finalise LR-0011 save contract;
2. finalise LR-0013 browser harness;
3. reconcile/merge LR-0006 progression;
4. complete LR-0010 modularisation;
5. introduce persistent Leader + roster model;
6. migrate old saves without companion-state loss;
7. make active-party consumers use Leader + active companions;
8. integrate LR-0094 action resources;
9. integrate Leader Strike/Direct;
10. audit hard-coded companion checks;
11. add roster UI via Wayfinder-owned UX contracts;
12. run real-browser migration/combat/rotation tests;
13. Warden black-box test embodiment/party-composition feel.

The final player-facing promise is:

> **You are not outside the party choosing what four pieces do. You are one of the four people on the road, and the three people beside you matter because they can do things you cannot.**
