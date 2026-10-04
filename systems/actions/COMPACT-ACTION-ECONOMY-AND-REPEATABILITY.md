# Lantern Road — Compact Action Economy & Repeatability Specification

Task: **LR-0094**  
Owner: **Agent 3 — The Mechanist**  
Primary consumer: **LR-0098 Implement action costs, recharge and repeat-use guardrails**  
Related inputs: **LR-0053** compact-combat intent design, **LR-0052** economy model, parked **LR-0006** progression foundation  
Status: authoring/design only. This task does **not** edit `game.js`, `content.js`, save state, UI runtime or rewards.

## 1. Purpose

Josh's playtest identified two related problems:

1. combat actions do not have the kind of explicit cost/recharge identity that makes Baldur's Gate 3 actions interesting to plan around; and
2. some world actions can simply be clicked again, including actions that currently grant healing, Fatigue reduction, loot or other value.

Lantern Road should adopt the **principle** behind BG3's action economy without importing D&D wholesale.

The desired player experience is:

> I can see what this action costs, when I get it back, what I give up by using it, and whether this world action can be repeated.

The system should be small enough to understand on a phone in seconds.

## 2. Research basis — what is useful from Baldur's Gate 3

BG3 commonly gives a creature:

- one **Action** per turn;
- one **Bonus Action** per turn;
- one **Reaction** that can be spent when a trigger occurs;
- special resources that recharge on different rhythms such as a turn, short rest or long rest.

The useful design principles are:

1. **Actions spend visible resources.**
2. **Different classes/abilities compete for different resource slots.**
3. **Reactions happen because a trigger occurs, not because the player spams another permanent button.**
4. **Powerful abilities can have a separate recharge rhythm.**
5. **The recharge rule is visible before the player commits.**
6. **Extra actions are exceptional, not the default.**

Lantern Road should translate those principles into a smaller browser-RPG system.

It should **not** add:

- D&D spell slots;
- movement points;
- hundreds of actions;
- class-level action taxonomies;
- complex reactions for every possible trigger;
- rules that require a tabletop manual to understand.

## 3. Active-party compatibility

The canonical active adventuring party is now:

- the player **Leader**;
- three **active companions**;
- any fourth available authored companion remains in **reserve**.

The action-economy engine must therefore be **actor-agnostic**.

Every active combatant controlled through the party combat UI uses the same resource contract:

- Action;
- Quick Action;
- Reaction;
- any ability-specific encounter/rest/consumable charges.

A reserve companion receives no combat turn/resources while in reserve.

The current prototype ability table below covers Garrick, Mira, Oren and Brindle because those are the abilities that exist today. It must **not** be interpreted as a future four-companion active-party requirement.

The Leader's final combat identity/ability kit is not yet canonical. LR-0094 deliberately does not invent a large player class here. A dedicated Mechanist follow-up should define a compact Leader kit; whatever abilities it authors must use this same cost/recharge contract.

## 4. Lantern Road combat economy

Use three clear resources:

### Action

**1 per party-member turn.**

The main substantial thing the hero does.

Examples:

- Strike;
- Slip Knife;
- Pin Shot;
- Sigil Bolt;
- Bind;
- Mace;
- Lantern Grace;
- Hold Fast.

Player-facing label: **Action**.

### Quick Action

**1 per party-member turn.**

A smaller tactical action that can complement an Action.

Quick Actions should be uncommon enough that the player is not expected to fill both slots every turn.

Possible users:

- Bless;
- a path/equipment active;
- a future combat consumable if explicitly enabled;
- a situational interaction created by an encounter.

Player-facing label: **Quick Action**.

Do not call it “Bonus Action”; Lantern Road should use its own simpler language.

### Reaction

**1 available reaction, refreshed at the start of that hero's next turn.**

A Reaction is spent only when its trigger occurs.

Examples:

- Garrick intercepting a hit after using Hold Fast;
- a future equipment effect responding to an enemy intent;
- a companion-specific protective response.

Player-facing label: **Reaction**.

Reaction controls should appear only when relevant. Do not permanently add a row of unavailable reaction buttons.

## 5. Per-turn resource contract

At the start of a living party member's turn:

```text
Action:       1
Quick Action: 1
Reaction:     refresh to 1
```

The player may:

1. spend Action first;
2. spend Quick Action first;
3. use only one of them;
4. choose **End Turn** while a resource remains.

The turn ends automatically when:

- all usable turn resources are spent and no target/confirmation is pending; or
- the player presses **End Turn**.

### Why End Turn is needed

If Quick Actions exist, spending the main Action should not automatically advance the turn.

The current runtime advances immediately after any hero action. LR-0098 must change that only after the architecture gate allows it.

## 6. No movement resource

Lantern Road is not a tactical-grid game.

Do **not** add:

- movement metres;
- squares;
- movement action points;
- Dash/Disengage as generic D&D imports.

Positioning is represented through:

- target choice;
- Guard;
- enemy intent;
- statuses;
- encounter-specific actions.

This preserves compact combat.

## 7. Recharge vocabulary

Every combat ability must declare both:

1. **resource cost**; and
2. **recharge rhythm**.

Use this compact set.

### Turn

Available every turn if the required Action/Quick Action resource is available.

Example:

> Strike — Action — every turn.

### Encounter

A fixed number of uses for the current fight.

Example:

> Bind — Action — 2 uses per encounter.

The UI should show:

> Bind **2/2**

then:

> Bind **1/2**

then disabled:

> Bind **Spent this encounter**

### Rest

A scarce signature use recovered through the final shared recovery contract.

LR-0094 does not decide whether every Rest recharge returns at camp, proper inn rest or another specific recovery point. LR-0098 must consume the final recovery rules from LR-0018 rather than creating a parallel rest system.

### Consumable

Use is limited by the physical item count.

Example if combat consumables are later allowed:

> Healing Tonic — Quick Action — consumes 1 tonic.

Combat consumables are **not required** by LR-0094.

## 8. Ability cost table — current companion prototype kit

This is the recommended first mapping. Final numeric charge counts are balance inputs for LR-0098/LR-0020, but the cost/recharge identities should remain.

### Garrick

| Ability | Cost | Recharge | Reason |
| --- | --- | --- | --- |
| Strike | Action | Turn | basic reliable offence |
| Hold Fast | Action | Turn | defence must compete directly with attacking |
| Intercept | Reaction | Triggered while guarding | makes Guard a readable reactive commitment |

### Hold Fast / Intercept contract

Using **Hold Fast**:

- spends Garrick's Action;
- chooses one living ally;
- places Guard on that ally;
- arms Garrick's **Intercept** Reaction.

When a valid enemy attack would hit the guarded ally:

- if Garrick has a Reaction, the interception/protection effect resolves;
- Garrick's Reaction is spent;
- the Guard protection for that attack is consumed according to the final combat contract.

This makes protection:

- deliberate;
- visible;
- limited;
- responsive to enemy intent.

Do not let one Hold Fast silently protect unlimited attacks in the same round.

### Mira

| Ability | Cost | Recharge | Reason |
| --- | --- | --- | --- |
| Slip Knife | Action | Turn | basic offence |
| Pin Shot | Action | **2 uses / encounter** | strong setup should be timed rather than spammed |

Pin Shot still competes with direct damage because it consumes the Action.

Its limited encounter uses prevent “always apply Exposed every round” from becoming the solved rotation.

### Oren

| Ability | Cost | Recharge | Reason |
| --- | --- | --- | --- |
| Sigil Bolt | Action | Turn | reliable basic attack |
| Bind | Action | **2 uses / encounter** | Weakened should answer specific danger, not lock one enemy forever |

If later balance evidence shows 2 uses is too restrictive or too generous, adjust the charge count, not the identity.

### Brindle

| Ability | Cost | Recharge | Reason |
| --- | --- | --- | --- |
| Mace | Action | Turn | basic offence |
| Lantern Grace | Action | **2 uses / encounter** | combat healing becomes a meaningful reserve |
| Bless | Quick Action | **2 uses / encounter** | creates Action + Quick combinations without becoming an every-turn tax |

### Player Leader

The Leader receives the same per-turn **Action / Quick Action / Reaction** resources, but their actual ability list is deliberately **TBD by a dedicated Mechanist Leader-combat task**.

Until that task is ratified:

- do not clone Garrick/Mira/Oren/Brindle abilities onto the Leader;
- do not create a hidden “class” choice;
- do not assume the Leader replaces whichever companion is in reserve mechanically;
- do not make the Leader a passive non-combat observer.

The Leader must ultimately have at least one reliable at-will Action so they can always participate in combat.

Examples of Brindle turns:

- Mace + Bless;
- Lantern Grace + Bless;
- Mace only, preserving Bless charges;
- Lantern Grace only, preserving Quick Action.

This gives the player something BG3 does well: **resource sequencing**, without turning each turn into a menu puzzle.

## 9. Basic actions vs signature actions

Every hero should have at least one **at-will Action**.

A hero must never reach a normal turn where all meaningful actions are exhausted.

Signature actions may be limited.

### At-will baseline

- Garrick: Strike / Hold Fast;
- Mira: Slip Knife;
- Oren: Sigil Bolt;
- Brindle: Mace.

### Limited signatures

- Mira: Pin Shot;
- Oren: Bind;
- Brindle: Lantern Grace / Bless.

This avoids a failure state where limited charges turn the hero into a spectator.

## 10. Extra Action rule

Extra Actions should be exceptional.

If a path, rare item or authored encounter grants an extra Action:

- the source must say so explicitly;
- the UI must visibly add the resource;
- it should normally be temporary or limited;
- it must not quietly become the new baseline.

Do not add an Extra Attack system by default.

## 11. Conditional actions

Situational actions should appear only while legal.

Examples:

- **Interrupt the Rite** appears only while an Acolyte is preparing a rite and the hero can respond.
- **Brace for Impact** appears only during a telegraphed environmental threat.
- **Cut the Rope** appears only in the encounter that exposes that object/opportunity.

Do not permanently show greyed-out buttons for every hypothetical action in the game.

### Player-facing rule

If the condition is false:

- hide the action if it is context-specific; or
- disable it with a short reason if knowing about the action matters.

## 12. Action availability states

Every visible combat action should have one of four states.

### Available

Can be selected now.

### Needs target

Resource is available; player has chosen the action and must choose a legal target.

### Spent

Its required Action/Quick Action/Reaction or encounter charge is gone.

Show why:

> **Bind — no uses left this encounter**

not merely a grey button.

### Condition unmet

The action exists but its trigger/condition is not true.

Example:

> **Intercept — waiting for an attack on the guarded ally**

For pure reactions, prefer contextual appearance over permanent disabled display.

## 13. Target selection safety

Selecting an action must not spend the resource yet.

Spend the resource only when:

- a legal target is chosen; and
- the action resolves or deliberately attempts to resolve.

Cancelling target selection returns to the action choice without cost.

This prevents phone mis-taps from consuming scarce resources.

## 14. Misses still spend the action

If an attack/check is attempted and misses:

- the Action/Quick Action is spent;
- an encounter charge is spent if that ability uses one.

The player paid for the attempt.

Do not refund a charge because the random roll failed unless the ability explicitly says it is refunded.

## 15. Reaction timing

A Reaction:

- can occur outside the hero's own turn;
- requires a valid trigger;
- spends the Reaction only if the player accepts/uses it;
- refreshes at the start of that hero's next turn.

If the same hero has multiple possible reactions:

- only one can be spent before refresh;
- choosing one closes the others until refresh.

That is the trade-off.

## 16. Reaction prompting

Phone-first rule:

Do not interrupt combat with unnecessary prompts.

Recommended behaviour:

### Ask

Use a compact reaction prompt when:

- the reaction is scarce;
- accepting it has a meaningful opportunity cost;
- the player can reasonably want to decline.

### Automatic

Automatic resolution is acceptable when:

- the player explicitly armed the reaction on the immediately preceding decision;
- there is no plausible reason to conserve it.

Example:

Hold Fast can arm Intercept and clearly state:

> **Intercept the first valid hit before Garrick's next turn.**

If LR-0098 chooses automatic Intercept, that exact rule must be visible before Hold Fast is confirmed.

## 17. Phone combat presentation

At the top of the active hero's action card:

```text
Action ●   Quick ●   Reaction ●
```

Spent resource:

```text
Action ○   Quick ●   Reaction ●
```

Do not use colour alone.

Each action button should include cost/recharge in compact secondary text where needed.

Example:

```text
Bind
Action • 2/2 this fight
```

For basic actions:

```text
Sigil Bolt
Action
```

## 18. Combat log feedback

After an action:

> Oren uses **Bind** on the Bog Lurker.  
> Bind remaining: **1/2**.

After Quick Action:

> Brindle uses **Bless** on Mira.  
> Quick Action spent. Bless remaining: **1/2**.

After reaction:

> Garrick **Intercepts** the strike meant for Brindle.  
> Reaction spent.

Do not make the player inspect a hidden state object to understand why the button changed.

## 19. Relationship with LR-0053 enemy intent

The action economy and enemy-intent system should reinforce each other.

Example:

1. Brigand Archer declares **Take Aim at Brindle**.
2. Garrick can spend his Action on Hold Fast instead of Strike.
3. Oren can spend one of limited Bind uses.
4. Brindle can preserve Lantern Grace or spend it now.
5. Mira can decide whether this is worth one of her Pin Shot charges.

Without visible intent, limited resources feel arbitrary.

Without limited resources, visible intent can collapse into repeating the same counter every round.

Both systems are needed.

## 20. Relationship with LR-0006 paths/equipment

Progression may alter:

- charge count;
- resource cost;
- reaction strength;
- conditional availability.

But upgrades must remain trade-offs.

Good examples:

- Warder Oren: first Bind each encounter gets +1 effectiveness, not infinite free Bind.
- Beacon Brindle: Lantern Grace heals more, not unlimited charges.
- an item grants one extra Pin Shot per encounter but gives up direct-damage gear.

Bad examples:

- Breaker Garrick gets a second free Action every turn;
- Beacon makes Lantern Grace cost no Action;
- equipment removes all recharge limits.

These erase the economy.

## 21. Non-combat repeatability principle

Every consequential non-combat action must declare its repeat policy.

No reward-bearing action should rely on “hopefully the player will not click it again.”

Recommended policy vocabulary:

### Once per scene

The option can be selected once in the current authored scene.

Typical use:

- dialogue/scene choices;
- one-off travel-event options.

### Once per site state

The action can resolve once until the site changes to a new explicit state.

Typical use:

- recover a unique relic;
- clear a ruin;
- salvage a finite cache;
- discover a route.

### Once per day

The action can be used again after the campaign day changes.

Typical use:

- a shrine blessing;
- a local service with a daily limit;
- a repeatable environmental benefit.

### Costed repeatable

The action may be repeated because every use visibly consumes enough time/gold/resource to make repetition a real trade-off.

Typical use:

- inn rest;
- market purchase;
- camp;
- paid transport.

### Stateful repeat

The interaction may be revisited, but its content/effect changes based on memory/state.

Typical use:

- NPC conversation;
- companion conversation;
- investigation after new evidence.

### Unlimited, no mechanical reward

Flavour inspection may be repeated freely if it cannot farm:

- Gold;
- Rations;
- items;
- HP;
- Fatigue reduction;
- Renown;
- faction standing;
- quest progress;
- new random reward rolls.

## 22. Failed-check retry policy

A failed consequential check must not be instantly rerolled by clicking the same button again.

Use one of:

- failure changes the scene/site state;
- retry costs meaningful time;
- retry costs an item/resource;
- retry is available next day;
- retry requires new information/tool;
- no retry.

The chosen retry rule should be visible.

Bad:

> Search again.  
> Search again.  
> Search again.  
> until the d20 succeeds.

Good:

> **Search the chamber again — 2 hours**

or:

> **Nothing else can be learned here today.**

## 23. Current live site-action repeatability audit

The live runtime currently exposes several accidental loops.

### Watcher's Rest — Rest

Current:

- 4g;
- heal 3 all;
- Fatigue -1;
- 6 hours.

Policy:

**Costed repeatable.**

This is legitimate because every use pays coin and time.

### Watcher's Rest — Weather Ledgers

Current success:

- discovers information;
- grants 1 Ration.

Current risk:

- the Ration reward can be attempted again because no “reward exhausted” state is recorded.

Policy:

**Once per site state.**

After the useful ledger/stash result is found:

- reward is exhausted;
- revisit may show flavour/reference text only.

Failure retry should cost time or wait until the next day.

### Saint Rhel — Pray

Current:

- heals whole party 2 HP;
- Fatigue -1;
- no Gold cost;
- no time cost;
- no daily limit.

This is an **infinite free recovery loop**.

Policy:

**Once per day**, with a visible time cost recommended.

Suggested first target:

- 2 hours;
- once per day;
- same current recovery effect.

Final balance belongs to LR-0016/LR-0020.

### Saint Rhel — Search

Current:

- can be clicked repeatedly until the check succeeds.

Policy:

**Stateful retry with time cost.**

On failure:

- spend meaningful time;
- either permit another attempt after that cost or limit to one attempt per day.

On success:

- evolve to the chamber-open state;
- do not keep presenting the original search.

### Saint Rhel — Reliquary

Current unique-item guard is already mostly stateful.

Policy:

**Once per site state.**

After recovery, remove/replace the action.

### Old Barrow — Enter / Search Cleared Hall

Current:

- first use starts Barrow Defenders and marks the hall cleared;
- later use grants **2 Ancient Coins**;
- the later reward can currently repeat.

This is an **infinite valuable-item loop**.

Policy:

- combat: **once per site state**;
- post-clear coin search: **once per site state**;
- then show exhausted exploration/flavour.

### Old Barrow — Side Chambers

Current:

- repeated Scout check;
- on success can award Marsh Key;
- after the key exists the check can still be repeated.

Policy:

**Once per useful state.**

Once the key/result is found, mark the side chambers searched.

Failure retry requires time/day cost.

### Broken Span — Chalk Search

Current:

- clue/progress is finite;
- failed roll can be instantly repeated.

Policy:

**Stateful retry with time cost** until clue found.

After clue found, convert to flavour/reference.

### Broken Span — Scavenge

Current:

- already uses `brokenSpanSalvaged`;
- action disables after reward.

Policy:

**Once per site state.**

This is the model to copy.

### Weeping Stones — Tracks

Current:

- failed Scout check can be clicked repeatedly.

Policy:

**Stateful retry with time cost** until tracks found.

After success, evolve/remove.

### Weeping Stones — Deal with crew

Policy:

**Once per quest/site state.**

Once road outcome is resolved, the action must disappear.

### Weeping Stones — Mineral Seep

Current:

- can award Bog Amber;
- no exhaustion state is evident.

Risk:

**repeatable valuable farming.**

Policy:

**Once per site state** for the saleable sample.

A later revisit may inspect the seep but must not roll another item reward.

### Redwater Ferry — Crossing

Current:

- costs 4g;
- advances 2 hours;
- reduces Fatigue.

Policy:

If this is actual route traversal, **costed repeatable** is acceptable.

If the player can press it repeatedly without meaningfully changing route/location, the Fatigue reduction becomes a paid recovery exploit.

LR-0098 should require:

- actual route state change; or
- once-per-day service semantics.

### Redwater Ferry — Inspect

Current:

- reveals information/cache state.

Policy:

**Once per site state** for the discovery.

Repeat becomes flavour/reference only.

### Moonmere — Find Path

Current:

- can be retried until success;
- success unlocks tower access.

Policy:

**Stateful retry with time/resource cost.**

After success, replace with:

> Safe ascent established.

No further roll.

### Moonmere — Upper Archive

Current:

- first entry can start Tower Wisps;
- then Moon Chart recovery is stateful.

Policy:

**Once per site state.**

The signature combat cannot be replayed for full reward.

### Mosslight — Follow Green Lights

Current:

- opens the Veil interaction/dialogue;
- quest stage is changed.

Policy:

**Stateful repeat.**

Revisits should enter the current conversation/world state, not replay first-contact effects.

This should later consume LR-0090 conversation memory.

### Mosslight — Break Circle

Current:

- starts `marsh_cult` combat;
- action can remain available based on current simple site action rendering.

Risk:

**signature combat/reward farming.**

Policy:

**Once per resolved site/quest state.**

After combat/outcome, the old action disappears.

### Hollowglass — Search

Current:

- first successful search may grant Keen Lens;
- after the Lens is owned, later successful searches grant **2 Bog Amber**;
- no exhaustion flag limits that branch.

This is an **infinite valuable-item loop**.

Policy:

**Finite staged site state.**

Recommended stages:

1. unexplored;
2. Lens found **or** first mineral cache found;
3. one finite follow-up salvage if authored;
4. exhausted.

No infinite Amber generation.

### Pilgrim Ford — Cross

Current:

- 2 hours;
- Fatigue -1;
- no Gold cost;
- can repeat.

Risk:

**time-for-Fatigue farming.**

Policy:

- if crossing changes route position, **costed repeatable**;
- if it is only a recovery benefit, **once per day**.

Do not let the player stand at the ford clicking away all Fatigue with no journey consequence.

### Smuggler Cache — Open

Current:

- uses `cacheOpened` guard;
- repeated open correctly produces an exhausted response.

Policy:

**Once per site state.**

This is another good current model.

## 24. Settlement/service policy

### Inn rest

**Costed repeatable.**

Each use already:

- spends Gold;
- advances substantial time;
- may consume Rations.

Good.

### Camp

**Costed repeatable through time/food/opportunity.**

No arbitrary click cooldown is needed.

### Market buy/sell

**Costed repeatable.**

Every transaction changes:

- Gold;
- item quantity.

No farming exists unless another system creates free items.

### Hear Rumours

**Stateful repeat.**

Current behaviour is good:

- new rumours are learned;
- once exhausted, the game says there is nothing new.

Do not invent new random rumours purely because the button was clicked again.

### NPC talk

**Stateful repeat.**

Talking may be unlimited, but:

- first-contact rewards/quest acceptance occur once;
- exhausted topics do not replay as if new;
- changed world state unlocks changed dialogue.

LR-0090 owns the deep conversation-memory runtime.

## 25. Travel-event recurrence policy

Scene choice buttons are naturally once per opened scene because the scene closes after resolution.

The remaining issue is **event recurrence**.

Each travel event should eventually declare one of:

- **repeatable** — generic hazard/colour can occur again;
- **cooldown** — can recur after N campaign days;
- **unique** — once per campaign;
- **stateful** — recurrence uses a changed version after first resolution.

### Reward rule

A repeatable random event should not repeatedly hand out full:

- Gold;
- Renown;
- rare items;
- faction standing;

without a balancing time/resource/risk cost.

This connects directly to the farming concern documented in LR-0052.

## 26. Combat reward repeatability

Signature/site combats:

- Barrow Defenders;
- Mosslight Circle;
- Tower Wisps;
- quest-specific Toll Cutters resolution;

should normally be **stateful/unique**.

Random travel combats may repeat, but LR-0016/LR-0020 must ensure their reward rate does not beat authored questing.

### Renown rule

Do not allow an obviously repeatable random encounter to become an unlimited Renown source.

If an encounter can recur indefinitely, repeated victories should not automatically imply repeated full campaign-progress reward.

## 27. Declarative repeatability contract

LR-0098 should prefer a declarative content rule rather than one-off `if (worldFlag)` patches everywhere.

Conceptual example:

```text
repeatPolicy: {
  kind: "once_per_site_state",
  stateKey: "old_barrow_coin_cache",
  afterUse: "exhausted"
}
```

Other conceptual forms:

```text
repeatPolicy: {
  kind: "once_per_day",
  stateKey: "saint_rhel_prayer"
}
```

```text
repeatPolicy: {
  kind: "costed_repeatable",
  cost: { gold: 4, hours: 6 }
}
```

```text
repeatPolicy: {
  kind: "retry_after_cost",
  cost: { hours: 2 }
}
```

The exact schema belongs to LR-0098 after LR-0010 modularisation. The design contract is that the policy is explicit and testable.

## 28. Declarative combat-action contract

Likewise, ability definitions should eventually expose cost/recharge declaratively.

Conceptual example:

```text
{
  id: "bind",
  label: "Bind",
  target: "enemy",
  cost: { action: 1 },
  recharge: { kind: "encounter", charges: 2 }
}
```

Bless:

```text
{
  id: "bless",
  label: "Bless",
  target: "ally",
  cost: { quick: 1 },
  recharge: { kind: "encounter", charges: 2 }
}
```

Do not hard-code the UI's button availability separately from the same cost/recharge contract.

## 29. Save-state rules

Persist only what must survive save/reload.

### Combat-scoped resources

If saving during combat is supported:

persist:

- current Action/Quick/Reaction availability;
- encounter charges remaining;
- armed reactions;
- pending intent/action state as required by the combat save contract.

If combat saves are not supported, no global campaign persistence is needed for per-fight charges.

### Daily/world repeatability

Persist:

- once-per-campaign/site-state flags;
- last-used day for once-per-day actions;
- event cooldown state where needed.

These must use the LR-0011 versioned save/migration contract.

### Do not persist derived UI state unnecessarily

A disabled button is derived from:

- resource availability;
- action definition;
- state/repeat policy.

Persist the underlying state, not a redundant `buttonDisabled` flag.

## 30. Migration rule

Adding repeatability metadata must not silently replay old one-time rewards when loading older saves.

For existing campaigns where historical use cannot be reconstructed perfectly:

- infer exhausted state from existing quest/world/item state when safe;
- prefer denying a duplicate reward over granting an obvious farm loop;
- do not erase legitimately unclaimed unique content without evidence.

Specific migrations belong to LR-0098/LR-0011 reconciliation.

## 31. Feedback requirements

Every unavailable action must explain why.

Examples:

> **Saint Rhel's blessing has already been received today.**

> **The useful salvage is gone.**

> **Bind is spent for this fight.**

> **Quick Action already used.**

> **Search again — requires 2 hours.**

Never silently ignore a click.

## 32. UI clutter rule

Do not solve action economy by placing ten resource counters and twenty buttons on screen.

Phone-first priority:

1. current hero;
2. available Action;
3. available Quick Action if relevant;
4. visible enemy intent;
5. legal targets;
6. reactions only when triggered.

Long explanations belong in inspect/help affordances, not every button.

## 33. Anti-dominance checks

LR-0098/LR-0020 should test these specifically.

### Garrick Guard loop

If Hold Fast + Intercept is correct every turn:

- enemy pressure is too uniform;
- Guard may be too cheap/effective;
- other actions may be underpowered.

Do not fix by making Guard randomly fail.

### Mira Pin Shot loop

If Pin Shot is always used first:

- 2/encounter charges should force timing;
- encounter Armor/priority variety should create cases where direct damage is better.

### Oren Bind loop

If Bind permanently suppresses the only dangerous enemy:

- encounter charges + multiple threats should break the loop.

### Brindle Bless loop

If Bless is used every turn automatically:

- encounter charges should make timing matter;
- some turns must make healing or preserving the charge preferable.

### Healing loop

If Lantern Grace can erase all attrition every round:

- limited encounter charges preserve tactical healing without infinite sustain.

## 34. Repeatability exploit tests

LR-0098 must add automated coverage for at least:

1. Saint Rhel prayer cannot be repeated infinitely in the same day.
2. Old Barrow post-clear coin reward cannot repeat.
3. Hollowglass Amber reward cannot repeat indefinitely.
4. a failed search retry obeys its time/day policy.
5. Broken Span salvage remains one-time.
6. Smuggler Cache remains exhausted after opening.
7. inn rest remains legitimately repeatable and pays cost every time.
8. shop buy/sell remains legitimately repeatable and pays/returns currency correctly.
9. a signature combat cannot be restarted for full reward after resolution.
10. a repeatable random encounter does not create unlimited campaign progress solely through re-triggering.

## 35. Combat resource tests

Automated coverage should include:

1. Action starts at 1.
2. Quick Action starts at 1.
3. spending Action does not automatically spend Quick Action.
4. selecting then cancelling an action spends nothing.
5. resolving/missing an Action spends Action.
6. spending Quick Action leaves Action available.
7. End Turn works with unused resources.
8. Action/Quick refresh next turn.
9. Reaction can trigger outside the hero's turn.
10. Reaction spends once and refreshes at next turn.
11. encounter charges decrement correctly.
12. spent encounter ability is visibly unavailable with reason.
13. save/reload preserves resources if combat saving is supported.
14. no action can be double-fired through rapid taps.

## 36. Rapid-tap/idempotency guard

Phone users can double-tap.

LR-0098 must ensure one accepted input produces one resolved action.

When an action enters resolution:

- lock that action instance;
- ignore duplicate click/tap events until state advances;
- render the new resource state immediately.

This is both a correctness and economy rule.

## 37. What this system deliberately does not add

Do not add in LR-0098 unless a later explicit task owns it:

- movement points;
- spell-slot levels;
- mana;
- stamina;
- universal cooldown timers;
- dozens of generic D&D actions;
- complex opportunity attacks;
- attacks of opportunity around a nonexistent tactical grid;
- action-speed percentages;
- animation-cancel mechanics;
- per-frame combat timing.

## 38. Recommended LR-0098 implementation order

### Slice 1 — explicit turn resources

- Action;
- Quick Action;
- End Turn;
- current action buttons use declarative cost.

### Slice 2 — limited signatures

- Pin Shot encounter charges;
- Bind encounter charges;
- Lantern Grace encounter charges;
- Bless as Quick Action with encounter charges.

### Slice 3 — reaction proof

- Hold Fast arms Garrick Intercept;
- one visible reaction resource;
- triggered resolution.

### Slice 4 — site repeat policies

Fix the confirmed live exploits first:

- Saint Rhel prayer;
- Old Barrow coin cache;
- Hollowglass Amber;
- repeat-until-success site checks;
- repeatable signature fights.

### Slice 5 — general declarative repeat policy

Move remaining consequential site/service actions onto the reusable rule.

### Slice 6 — regression

Run real-browser combat and world-action cases, including rapid-tap attempts.

## 39. Acceptance mapping for LR-0094

### Compact primary/secondary/reactive economy

Sections 3–6 define active-party compatibility plus **Action**, **Quick Action**, **Reaction** without movement-grid complexity.

### Every existing combat ability declares cost/recharge

Sections 7–9 provide the recharge vocabulary and the current companion-prototype ability table. Section 3 explicitly requires the future Leader kit to use the same contract rather than inventing a parallel system.

### Visible resource consumption / no unlimited same-turn repeat

Sections 5, 12–18 and 35 define resource spend, refresh and feedback.

### Situational actions do not clutter UI

Sections 11, 16–17 and 32.

### Non-combat repeatability policy

Sections 21–27 define explicit repeat categories and audit current actions.

### Fast and phone-readable

Sections 17, 32 and 37 constrain UI/rules complexity.

## 40. Handoff to LR-0098

LR-0098 should reconcile this design against the final post-LR-0010 architecture and save contract, then implement it in small slices.

The final player-facing promise is:

> **Every action has a cost. Every special ability tells you when it comes back. Every consequential world interaction tells you whether it can happen again.**

The game should reward choosing the right action at the right moment, not discovering which button can be clicked forever.
