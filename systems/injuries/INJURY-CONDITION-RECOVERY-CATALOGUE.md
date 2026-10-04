# Lantern Road — Injury, Condition & Recovery Design Catalogue

Task: **LR-0058**  
Owner: **Agent 3 — The Mechanist**  
Primary consumer: **LR-0018 Persistent injuries, conditions and recovery loop**  
Related inputs: parked **LR-0006**, parked **LR-0052**, parked **LR-0057**  
Status: Authoring/design only. This task does **not** edit `game.js`, `content.js`, save state, settlement services, consumables or prices.

## 1. Purpose

Persistent injuries should create stories and adaptation, not a punishment spiral.

The player should sometimes finish a hard fight thinking:

> Mira is still limping. Do I spend time and coin recovering properly, equip around the weakness, or keep moving and accept the risk?

The intended loop is:

```text
readable risk
→ consequence
→ visible mechanical change
→ meaningful recovery/adaptation choice
→ recovery
```

Not:

```text
random penalty
→ more random penalties
→ party becomes unusable
→ restart
```

## 2. Current LR-0006 foundation

Parked LR-0006 establishes:

- one persistent injury entry per hero;
- injury application when a hero is knocked to 0 HP;
- injury penalties that affect skill and/or max HP;
- proper inn rests reducing a recovery counter;
- save/reload persistence;
- legacy string-injury migration;
- current HP clamping when max HP falls;
- visible Party-tab injury state.

Current injury catalogue:

| Injury | Effect | Recovery |
| --- | --- | --- |
| Bruised Ribs | Might -1, max HP -2 | 2 proper rests |
| Sprained Ankle | Scout -1 | 2 proper rests |
| Concussion | Wits -1, max HP -1 | 2 proper rests |
| Shaken | Spirit -1 | 2 proper rests |

That is a strong minimum foundation. LR-0018 should deepen the recovery loop around it rather than replace it with a different state system.

## 3. Core architecture rule — one persistent adverse state per hero

For the first full injury/recovery loop, a hero should have **at most one persistent adverse state** at a time.

That state may be:

- an **injury** caused by physical/combat/adventure harm; or
- a later **condition** caused by disease, exposure or a named authored consequence.

Do not stack:

- Bruised Ribs + Concussion + Sprained Ankle;
- multiple copies of the same injury;
- hidden injury severity counters on top of the visible recovery counter.

### Why one state

It:

- preserves the parked LR-0006 shape;
- makes the current consequence easy to understand;
- prevents one bad encounter from disabling a hero;
- lets equipment/path choices meaningfully adapt around one weakness;
- keeps phone UI compact;
- makes recovery cost predictable enough to balance.

If multiple simultaneous persistent conditions are ever desired, that should be a later explicit system decision, not a silent LR-0018 expansion.

## 4. Injury vs condition vocabulary

### Injury

A persistent harmful state caused by bodily harm or a knockout.

Examples:

- Bruised Ribs;
- Sprained Ankle;
- Concussion;
- Split Lip.

### Condition

A persistent or semi-persistent harmful state caused by exposure, sickness or a named supernatural/environmental consequence.

Examples:

- Feverish;
- Drenched.

A condition should not simply duplicate Fatigue.

**Fatigue** remains the campaign pressure stat. Do not rename ordinary Fatigue into a condition.

## 5. Persistent injury catalogue

### 5.1 Bruised Ribs

**Category:** Injury  
**Current effect:** Might -1, max HP -2.  
**Target recovery:** 2 recovery steps.

**Readable sources:**

- heavy blunt hit;
- fall;
- being knocked out by a heavy enemy;
- explicit failed Might/adventure consequence.

**Player adaptation:**

- Garrick can lean more on Hold Fast than Strike;
- another hero may take Might checks where possible;
- Mail Patch can offset some max-HP loss;
- proper recovery is attractive before another dangerous fight.

**Anti-spiral note:** max HP penalty should remain capped at 2.

### 5.2 Sprained Ankle

**Category:** Injury  
**Current effect:** Scout -1.  
**Target recovery:** 2 recovery steps.

Because Scout contributes to Mira's combat reliability/initiative and travel checks, no separate initiative penalty is needed.

**Readable sources:**

- fall;
- bad crossing;
- pursuit;
- beast knockdown;
- failed mobility/travel choice that explicitly names injury risk.

**Player adaptation:**

- Trail Charms can offset the Scout loss;
- Mira may shift toward Guile choices;
- the party may avoid risky off-road routes until recovery.

### 5.3 Concussion

**Category:** Injury  
**Current effect:** Wits -1, max HP -1.  
**Target recovery:** 2 recovery steps.

**Readable sources:**

- knockout from heavy impact;
- ruin collapse;
- failed dangerous exploration;
- spirit/force impact only when the narrative clearly supports it.

**Player adaptation:**

- Oren's Keen Lens can offset Wits loss;
- Oren can use more defensive/support decisions if accuracy suffers;
- another party member may handle Wits checks.

**Constraint:** do not add extra random-control effects such as missed turns. The visible -1 Wits is enough.

### 5.4 Shaken

**Category:** Injury/trauma state  
**Current effect:** Spirit -1.  
**Target recovery:** 2 recovery steps.

**Readable sources:**

- being knocked out in a frightening encounter;
- supernatural confrontation;
- authored consequence that explicitly affects nerve.

**Player adaptation:**

- Lamp Censer can offset Spirit loss;
- Brindle can lean on fixed-value support actions;
- rest/camp narrative can acknowledge the state.

**Constraint:** do not add random panic or player-input cancellation. “Shaken” is a readable penalty, not loss of agency.

### 5.5 Split Lip

**Category:** Injury  
**Candidate effect:** Guile -1.  
**Target recovery:** 1 recovery step.

This fills the current Guile gap without adding a new mechanical axis.

**Readable sources:**

- close-quarters humanoid fight;
- failed confrontation;
- explicit social consequence involving visible injury.

**Player adaptation:**

- Mira/Brindle may rely on other skills;
- future Smuggler's Mantle-style equipment can offset Guile loss;
- because it is mild, one proper rest should usually clear it.

**Constraint:** do not attach max-HP loss. This is the lighter injury in the catalogue.

## 6. Optional expedition conditions

These are second-slice candidates for LR-0018, not mandatory first implementation.

They should use a separate **single party-condition slot** only if LR-0018 can add that cleanly without disrupting the one-injury-per-hero rule.

### 6.1 Drenched

**Category:** Expedition condition  
**Effect concept:** next normal camp heals 1 less HP and clears 1 less Fatigue, then Drenched clears.

**Readable source:**

- choosing to push through severe rain/storm;
- failed river/crossing choice.

**Recovery:**

- any proper inn rest clears it immediately;
- one normal camp resolves it after applying the reduced benefit.

**Why it exists:** makes weather pressure concrete without permanently damaging a hero.

**Constraint:** do not stack Drenched with itself.

### 6.2 Feverish

**Category:** Expedition/hero condition  
**Effect concept:** healing received is reduced by 1, minimum 1.

**Readable source:**

- explicit disease/tainted-water event;
- fever-related quest consequence;
- named swamp exposure.

**Recovery:**

- proper rest;
- healer service;
- condition-specific medicine/ward treatment if LR-0018 adds it.

**Why it exists:** creates a recovery problem different from a skill penalty.

**Constraint:** do not combine Feverish with daily automatic HP damage; starvation already owns that pressure loop.

## 7. Risk trigger rules

### 7.1 Knockout injury trigger

The existing “positive HP → 0 HP” transition is a good understandable trigger.

Recommended rule:

- first knockout while uninjured may apply one persistent injury;
- if already injured, do **not** add a second injury.

The player can understand:

> Garrick was knocked out. He suffered Bruised Ribs.

### 7.2 No double punishment on combat defeat

If knockouts already applied injuries during the fight, generic combat defeat should not roll another injury layer afterward.

Defeat already costs:

- gold;
- Fatigue;
- position/time;
- HP/recovery;
- encounter-specific consequences.

Do not add a hidden extra injury lottery on top.

### 7.3 Adventure injury trigger

An authored scene may apply a named injury on failure only when the risk is legible before the choice.

Good:

> Climb the rotten tower frame. **Risk: injury on failure.**

Bad:

> Search the room.  
> *Failure silently gives Concussion.*

### 7.4 Enemy special trigger

If LR-0015/LR-0019 adds an enemy action that can cause an injury/condition, it must be telegraphed.

Example:

> Bog Lurker intent: **Crushing Lunge — injury risk if this knocks a hero out.**

Do not roll persistent injuries from ordinary low-damage hits.

## 8. Injury selection rules

### Preferred selection hierarchy

1. use a named authored injury if the scene specifies one;
2. use source tags if the final combat system exposes a clear physical cause;
3. otherwise choose from the compact injury pool.

### Random fallback constraint

Random selection is acceptable only **after the player understands why an injury happened**.

The randomness chooses the flavour of consequence, not whether an invisible punishment occurred.

### Do not target the hero's primary skill on purpose

The system should not secretly choose “the worst possible injury” for each hero.

A Sprained Ankle on Garrick may be inconvenient but mild. A Sprained Ankle on Mira matters more.

That variation creates stories.

## 9. Anti-snowball rules

These are mandatory LR-0018 guardrails.

### Rule 1 — one persistent injury per hero

No stacking injury pile.

### Rule 2 — skill penalty cap

A single injury should normally reduce **one skill by 1**.

Do not introduce -2 primary-skill injuries in the first loop.

### Rule 3 — max HP penalty cap

A single injury should normally reduce max HP by **0–2**.

### Rule 4 — no disabled core actions

An injury may make an action less effective. It should not disable:

- Strike;
- Hold Fast;
- Slip Knife;
- Pin Shot;
- Sigil Bolt;
- Bind;
- Lantern Grace;
- Bless.

### Rule 5 — no random lost turns

Persistent injury should not make a hero randomly skip actions.

### Rule 6 — no worsening because the player cannot afford treatment

If the player keeps moving injured, the injury can persist. It should not automatically escalate into a harsher tier simply because coin is low.

## 10. Recovery-step model

Use a small integer recovery counter.

Conceptual state:

```text
{
  id: "bruised_ribs",
  restRemaining: 2
}
```

LR-0006 already uses this shape.

### Recovery step

One recovery step means:

- decrement `restRemaining` by 1;
- when it reaches 0, clear the injury;
- show visible feedback.

Do not hide fractional or probabilistic recovery.

## 11. Recovery choices

LR-0018 should create at least three different ways to respond.

### 11.1 Proper Rest

**Cost:**

- settlement room price;
- time until morning;
- usually one ration tick.

**Benefit:**

- full party HP;
- Fatigue cleared;
- one injury recovery step.

**Identity:** best all-round recovery, but costs location/time/coin.

This preserves the LR-0006 foundation.

### 11.2 Field Treatment

**Candidate cost:**

- 1 Bandage;
- approximately 4 hours;
- usable once per injury.

**Benefit:**

- one recovery step;
- no full-party heal;
- no full Fatigue reset.

**Identity:** spend a portable resource and time to keep moving.

This gives Bandages a second strategic use without making them mandatory.

#### Physical-injury eligibility

Field Treatment should work on:

- Bruised Ribs;
- Sprained Ankle;
- Split Lip.

For Concussion/Shaken, a Bandage should not magically cure the problem.

Those states need proper rest or specialist care.

### 11.3 Healer / Specialist Service

**Target price band input:** roughly **8–12g** before faction/local modifiers.

Final price belongs to LR-0016.

**Time cost:** approximately 4 hours.

**Benefit concept:**

- clear the remaining recovery steps for one injury;
- no free full-party heal;
- no automatic Fatigue reset.

**Identity:** pay coin to save campaign time.

A healer service should compete with two proper rests, not dominate them on every axis.

## 12. Recovery economics

LR-0052 target inputs:

- ration: 2–4g;
- inn: 3–7g before food;
- Bandage: 6–10g;
- ordinary quest payout: 18–30g.

### Target recovery pressure

For a common 2-step injury:

**Proper-rest route**

Approximate effective cost across two rests:

- room coin;
- 1–2 ration ticks;
- significant campaign time.

Rough expected economic pressure: **12–18g equivalent** depending on settlement/timing.

**Field-treatment + rest route**

- one Bandage (~8g current);
- 4h treatment;
- one later proper rest.

Rough pressure: **14–17g equivalent** plus less lost overnight time.

**Specialist service route**

- roughly 8–12g;
- ~4h;
- no full heal/Fatigue reset.

This is the “pay for speed” option.

### Recovery-cost guardrail

Recovering one ordinary injury should not normally cost more than **one ordinary quest payout**.

An injury should create a decision, not erase the reward from multiple quests.

## 13. Camp behaviour

A normal camp should:

- heal its normal HP amount;
- reduce Fatigue normally;
- **not automatically advance persistent injury recovery**.

Why:

- free camps would erase the settlement/recovery choice;
- proper rest should retain special value;
- the player can still choose Field Treatment at camp if implemented.

### Narrative camp hook

Camp conversations may react to injuries without changing mechanics.

Examples:

- Mira complains about the ankle.
- Garrick adjusts his breathing around bruised ribs.
- Brindle checks Oren after a concussion.

Storyteller owns the prose. Mechanist owns the effect/recovery state.

## 14. Hero viability under injury

### Garrick

Primary strengths:

- Might;
- durability;
- Hold Fast.

**Bruised Ribs** reduces Strike/defence effectiveness and HP, but Hold Fast remains a meaningful role.

**Sprained Ankle** has low direct combat impact on Garrick, making it a milder story.

### Mira

Primary strengths:

- Scout;
- Guile;
- initiative/precision.

**Sprained Ankle** matters strongly, but:

- Guile remains;
- Quickstep Blade/Duelist damage can remain useful;
- Trail Charms can offset Scout loss.

Do not further penalise initiative separately.

### Oren

Primary strengths:

- Wits;
- Bind/Sigil Bolt.

**Concussion** matters strongly, but:

- Keen Lens can offset Wits loss;
- Warder Chalk/defence gives an alternate emphasis;
- no action is disabled.

### Brindle

Primary strengths:

- Spirit;
- healing/Bless.

**Shaken** lowers Spirit reliability but should not reduce fixed Lantern Grace healing unless the final ability explicitly scales with Spirit.

Brindle remains able to heal and support.

## 15. Equipment adaptation

Injury should sometimes make equipment swaps interesting.

Examples:

- Sprained Ankle (-1 Scout) makes Trail Charms attractive.
- Concussion (-1 Wits) makes Keen Lens attractive.
- Shaken (-1 Spirit) makes Lamp Censer attractive.
- Bruised Ribs max-HP loss makes Mail Patch attractive.

This is healthy because:

- the injury creates a temporary reason to adapt;
- the player gives up another equipment choice;
- recovery later reopens the old choice.

### Constraint

Do not make the matching stat item mandatory.

A player should also be able to adapt tactically or recover instead.

## 16. Build interaction

### Bastion Garrick

Bruised Ribs partially counteracts Bastion max-HP strength but does not erase Hold Fast.

### Breaker Garrick

Bruised Ribs makes pure offence less reliable, encouraging temporary defensive play.

### Ghost Mira

Sprained Ankle reduces Scout but Ghost bonuses can soften the loss.

### Duelist Mira

Sprained Ankle hurts attack reliability through Scout, but damage bonus remains.

### Seer Oren

Concussion reduces Wits but Seer/Keen Lens can buffer it.

### Warder Oren

Concussion makes Bind less reliable, but Warder defensive identity remains.

### Beacon Brindle

Shaken may reduce Spirit checks but should not erase the direct healing identity.

### Zealot Brindle

Shaken lowers Spirit-based offence while +damage still exists.

No injury should invalidate a permanent path choice.

## 17. Fatigue interaction

Fatigue already applies skill penalties:

- Fatigue 3–4: -1;
- Fatigue 5+: -2.

An injury can add another -1 to one skill.

That means a hero may temporarily reach a substantial negative modifier.

### Guardrail

LR-0018/LR-0020 should test:

- injured + Fatigue 3;
- injured + Fatigue 5;
- injured + relevant gear;
- injured + permanent path.

The result may be hard, but the hero must still have meaningful actions.

### Do not add hidden injury/Fatigue multipliers

Avoid rules such as:

> Injured heroes gain double Fatigue.

That creates runaway pressure and is difficult to read.

## 18. Starvation interaction

Zero rations already causes:

- 2 HP damage to everyone;
- +1 Fatigue per day.

Do not also roll random injuries from starvation damage unless an authored event explicitly creates one.

Otherwise foodlessness becomes:

```text
HP loss
+ Fatigue
+ injury
+ higher event risk
```

which is too much compounding punishment.

## 19. Defeat interaction

Combat defeat already has meaningful economy/time pressure.

Target rule:

- injuries caused by knockouts during the fight persist;
- defeat does not add another generic injury;
- recovery fallback restores HP enough to continue but does not erase injury.

This preserves “we survived, but Garrick is hurt” without turning defeat into a run-ending state.

## 20. Narrative-facing hooks

The mechanical system should expose clean, stable facts for Storyteller use.

Possible declarative queries:

- hero has injury id;
- hero injury category;
- recovery steps remaining;
- injury newly acquired this day;
- injury just healed.

Narrative content can then respond:

- camp conversation;
- settlement healer dialogue;
- companion reaction;
- quest-specific callback.

Do not make narrative text responsible for changing the mechanical penalty unless the quest explicitly owns a recovery outcome.

## 21. Player-facing copy contract

When an injury occurs, show:

1. hero;
2. injury name;
3. exact effect;
4. recovery expectation.

Example:

> **Mira suffers Sprained Ankle**  
> Scout -1. Two proper recovery steps remain.

When recovery advances:

> **Sprained Ankle improving**  
> One proper recovery step remains.

When healed:

> **Mira's Sprained Ankle has healed.**

Avoid internal language:

- `skillPenalty`;
- `restRemaining`;
- `progression.injuries`.

## 22. Party-tab presentation

Each injured hero should show one compact injury block:

**Sprained Ankle**  
Scout -1  
Recovery: 1 step remaining

Actions may include, when available:

- **Treat with Bandage**
- **Find proper rest**

Do not show every possible treatment button when unavailable.

## 23. Treatment confirmation

A treatment that consumes a scarce item or coin should state the cost before confirmation.

Example:

> Treat Sprained Ankle with 1 Bandage and spend 4 hours?

After treatment:

> Mira's ankle is steadier. One recovery step remains.

Visible feedback is required.

## 24. Save and migration rules

LR-0018 must reconcile with final LR-0011/LR-0006.

Expected persistent shape should remain small:

```text
progression.injuries[heroId] = {
  id,
  restRemaining
}
```

Optional future fields should be added only when necessary.

### Stable ids

Keep current ids stable:

- `bruised_ribs`
- `sprained_ankle`
- `concussion`
- `shaken`

Do not rename them for cosmetic reasons after they are persisted.

### New injury ids

Adding `split_lip` requires no migration for old saves.

### Malformed-state handling

If an injury id is unknown:

- do not crash;
- clear it safely or show a neutral recoverable fallback according to LR-0011 policy;
- never leave a permanent invisible stat penalty.

### Counter validation

Clamp malformed recovery counters to sensible values.

Do not allow:

- negative recovery;
- NaN;
- enormous arbitrary values.

## 25. One-injury state and future condition state

If LR-0018 implements only hero injuries first, keep the current shape.

If it later adds expedition conditions such as Drenched:

- use a clearly separate party-level condition field;
- cap it at one active expedition condition;
- document migration;
- do not overload hero injury ids with party-weather state.

This keeps the first slice safe and lets conditions be added only if they genuinely improve play.

## 26. First LR-0018 implementation slice

Recommended smallest useful expansion:

1. preserve the four LR-0006 injuries;
2. add Split Lip as the Guile injury;
3. preserve one injury per hero;
4. add explicit source/effect feedback;
5. add Field Treatment using one Bandage + time for eligible physical injuries;
6. keep proper rest as the universal recovery-step method;
7. add healer service only after the first slice tests well;
8. defer Drenched/Feverish unless real play shows a need.

This makes recovery a decision without exploding system complexity.

## 27. Risk-source matrix

| Source | Allowed persistent consequence |
| --- | --- |
| Hero reaches 0 HP from ordinary physical combat | one injury if currently uninjured |
| Hero reaches 0 HP from supernatural combat | one injury/trauma state if uninjured |
| Explicit dangerous adventure failure | named injury if warned |
| Normal missed skill check | no injury by default |
| Starvation daily damage | no injury roll |
| Generic combat defeat | no extra injury beyond knockouts |
| Ordinary travel event with no warning | no hidden injury |
| Future telegraphed signature attack | injury risk only if clearly stated |

## 28. Recovery-option comparison

| Option | Coin/resource | Time | Full heal | Fatigue clear | Injury progress |
| --- | --- | --- | --- | --- | --- |
| Normal camp | none direct | 8h | no | partial | none |
| Proper inn rest | room + ration | until morning | yes | yes | +1 step |
| Field Treatment | 1 Bandage | ~4h | no | no | +1 eligible step |
| Specialist service | ~8–12g target | ~4h | no | no | clear/major progress |

No option dominates all columns.

## 29. Economy anti-spiral check

A common 2-step injury should be recoverable through:

- two proper rests;
- one Field Treatment + one proper rest;
- one paid specialist service;

without requiring random combat farming.

### Red flag

If a player with:

- one injury;
- 2 rations;
- about 10g;

has no plausible path to recovery except repeatedly triggering combat, the recovery economy is too harsh.

## 30. QA scenarios for LR-0018

### Scenario A — first knockout

- healthy hero reaches 0;
- one injury appears;
- effect is visible;
- save/reload preserves it.

### Scenario B — repeat knockout while injured

- same hero reaches 0 again;
- no second persistent injury stacks;
- player receives clear feedback.

### Scenario C — injury + equipment offset

- apply Sprained Ankle to Mira;
- equip Trail Charms;
- verify displayed Scout result reflects both.

### Scenario D — injury + high Fatigue

- apply primary-skill injury;
- set Fatigue 5;
- verify hero remains actionable and UI explains modifiers.

### Scenario E — Field Treatment

- treat eligible injury;
- consume exactly one Bandage;
- advance intended time;
- reduce recovery exactly one step;
- prevent repeated free treatment if once-per-injury rule is used.

### Scenario F — proper rest

- rest in settlement;
- full heal/Fatigue behaviour remains correct;
- reduce injury one step;
- ration/time transition remains correct.

### Scenario G — max-HP interaction

- Bruised Ribs lowers max HP;
- equip/unequip Mail Patch;
- heal/rest;
- current HP never exceeds final max HP and never becomes invalid.

### Scenario H — old save

- migrate legacy string injury;
- migrate missing injury fields;
- load unknown/malformed entry safely.

### Scenario I — defeat

- multiple heroes knocked out;
- existing injuries persist;
- no extra post-defeat injury lottery.

### Scenario J — recovery economy

- begin with limited gold/rations;
- verify at least one credible non-grind recovery plan.

## 31. What LR-0018 should not add

Avoid in the first full recovery loop:

- injury rarity tiers;
- permanent maiming;
- limb-specific equipment restrictions;
- random skipped turns;
- stacking five simultaneous injuries;
- hidden chance for injuries to worsen each day;
- surgery minigames;
- long crafting chains for medicine;
- arbitrary death chance;
- “critical injury” loot boxes/random tables;
- injuries that permanently remove a hero from the party.

Lantern Road wants persistent consequences, not campaign invalidation.

## 32. Acceptance mapping for LR-0058

- **Audit LR-0006 and define compact catalogue:** Sections 2–6.
- **Readable sources/triggers:** Sections 7–9 and 27.
- **Recovery choices/cost bands/anti-spiral:** Sections 10–13, 28–29.
- **Hero viability/build/equipment interaction:** Sections 14–18.
- **Persistence/migration/narrative hooks:** Sections 20–25.
- **No runtime edits:** this authoring task changes no shared runtime or persisted state.

## 33. Handoff to LR-0018

LR-0018 should preserve these promises:

- injury risk is tied to understandable danger;
- one hero carries at most one persistent injury in the first loop;
- recovery offers time/coin/resource choices;
- a hero remains useful while hurt;
- equipment and path choices can adapt around injury without becoming mandatory;
- one bad fight creates a story, not an unrecoverable snowball;
- recovery prices consume LR-0016 targets rather than inventing a parallel economy;
- persistent ids and save migration remain stable.
