# Lantern Road — Equipment Ecosystem & Item Trade-off Catalogue

Task: **LR-0057**  
Owner: **Agent 3 — The Mechanist**  
Primary consumer: **LR-0017 Equipment ecosystem and meaningful itemisation**  
Related inputs: parked **LR-0006 Meaningful progression and builds**, parked **LR-0052 Economy baseline model**  
Status: Authoring/design only. This task does **not** edit `game.js`, `content.js`, save state, shops, quest outcomes or prices.

## 1. Purpose

Lantern Road should not become a loot treadmill.

The equipment system should remain small enough that the player can remember what each item means, but deep enough that choosing one item changes how a hero is used.

The target is:

- **one meaningful equipment slot per hero** as established by parked LR-0006;
- a curated set of sidegrades, not vertical item tiers;
- equipment that reinforces or bends a hero role without replacing the permanent path choice;
- shop, quest and rare-reward availability that creates opportunity cost;
- price bands that respect the economy model without using price as a substitute for design.

## 2. Current foundation audit

### Live-main gear

Current live main carries four hero-flavoured gear items:

| Item | Live-main role | Base price |
| --- | --- | ---: |
| Trail Charms | Mira Scout bonus while carried | 36g |
| Mail Patch | Garrick max-HP bonus while carried | 40g |
| Keen Lens | Oren Wits bonus while carried | 42g |
| Healer's Satchel | Brindle healing bonus while carried | 44g |

Live main treats these as passive carried gear.

### Parked LR-0006 equipment model

LR-0006 changes the model from passive possession to **explicit one-slot hero equipment**.

Parked item choices:

| Hero | Item | Effect identity |
| --- | --- | --- |
| Garrick | Mail Patch | +2 max HP |
| Garrick | Iron Vambrace | +1 defence |
| Mira | Trail Charms | +1 Scout |
| Mira | Quickstep Blade | +1 offensive damage |
| Oren | Keen Lens | +1 Wits |
| Oren | Warder Chalk | +1 defence and stronger Bind |
| Brindle | Healer's Satchel | stronger Lantern Grace and bandages |
| Brindle | Lamp Censer | +1 Spirit and stronger Bless |

This is the correct base architecture for LR-0017.

### Parked LR-0006 permanent paths

Equipment must remain secondary to the permanent path decision.

- Garrick: **Bastion** vs **Breaker**
- Mira: **Ghost** vs **Duelist**
- Oren: **Seer** vs **Warder**
- Brindle: **Beacon** vs **Zealot**

A good item may support a path, cross-support the opposite path, or create a hybrid. It should not make one permanent path objectively mandatory.

## 3. Equipment architecture rule

### Keep one slot per hero for the first ecosystem expansion

LR-0017 should not quietly introduce helmet/chest/weapon/accessory slots.

Reasons:

- one slot keeps comparisons legible on a phone;
- one slot makes every acquisition a real choice;
- it avoids inventory-management overhead;
- it preserves LR-0006 save/state assumptions;
- it prevents four heroes × multiple slots from becoming a loot-volume treadmill.

If multiple slots are ever desired, that is a separate product/architecture decision and should not be smuggled into LR-0017.

### Stable persisted representation

Expected foundation:

```text
progression.equipment[heroId] = itemId | null
```

LR-0017 should extend item definitions and effect hooks around this shape rather than create a parallel loadout object.

## 4. Equipment role vocabulary

Each item should have one primary design role.

### Endurance

Changes how safely a hero survives pressure.

Examples:

- max HP;
- defence;
- improved Guard interaction.

### Offence

Changes damage or finishing power.

Examples:

- +1 offensive damage;
- conditional bonus against Exposed enemies.

### Reliability

Improves a skill/check/attack that can otherwise fail.

Examples:

- +1 Scout;
- +1 Wits;
- narrower conditional attack bonus.

### Control

Improves the hero's ability to reduce or redirect enemy pressure.

Examples:

- stronger Bind;
- Guard interaction;
- status setup.

### Support

Improves recovery or setup for allies.

Examples:

- Lantern Grace;
- Bless;
- consumable-healing interaction.

### Tempo

Changes when or how quickly a hero can answer pressure.

Examples:

- initiative;
- first-use-per-combat effect;
- action setup payoff.

An item can touch two roles, but should have one clear headline identity.

## 5. Anti-upgrade-ladder rules

These are mandatory design guardrails for LR-0017.

### Rule 1 — no strict numeric successor

Do not add:

- Mail Patch +2 HP, then “Fine Mail Patch” +4 HP;
- Quickstep Blade +1 damage, then “Masterwork Quickstep Blade” +2 damage;
- Keen Lens +1 Wits, then “Perfect Lens” +2 Wits.

A later item may be *different*, not simply bigger.

### Rule 2 — rare does not mean universally stronger

A rare item may have:

- a stronger conditional effect;
- a narrower use case;
- a meaningful downside;
- an availability opportunity cost;
- a unique interaction.

It should not simply dominate every shop item.

### Rule 3 — one-slot competition must remain real

If an item is optimal in nearly every situation for its hero, it is a failed design even if its numbers look “balanced”.

### Rule 4 — build synergy needs a cross-build answer

If one item strongly supports Bastion, Warder, Ghost or Beacon, another item should offer a plausible reason for the opposite path or a hybrid to exist.

### Rule 5 — equipment bonuses stay compact

First-wave target magnitude:

- primary skill: generally **+1 maximum from equipment**;
- defence: generally **+1**;
- unconditional offensive damage: generally **+1**;
- max HP: generally **+2**;
- named-ability improvement: roughly equivalent to one of the above;
- initiative: modest enough that it does not guarantee first turn.

More powerful effects should be conditional or carry opportunity cost.

## 6. Garrick equipment catalogue

Garrick's item choices should answer:

> Do I want Garrick to absorb pressure, avoid pressure, protect others, or convert defence into offence?

### Existing foundation — Mail Patch

**Role:** Endurance  
**Effect identity:** +2 max HP.

**Best when:**

- Garrick is taking frequent hits;
- Bastion wants a larger safety buffer;
- the party expects sustained damage.

**Opportunity cost:**

- no accuracy, damage or Guard-specific improvement.

**Anti-dominance note:** raw HP is broadly useful, so other Garrick items need sharper situational value.

### Existing foundation — Iron Vambrace

**Role:** Endurance / avoidance  
**Effect identity:** +1 defence.

**Best when:**

- enemy attacks are frequent but not extremely accurate;
- avoiding hits matters more than absorbing them.

**Opportunity cost:**

- defence can do nothing against a hit that still lands;
- does not improve Garrick's own offence or Hold Fast directly.

### Candidate — Warden's Hook

**Role:** Control / protection

**Conceptual effect:**

When Garrick uses **Hold Fast** on an ally, the first attack redirected/intercepted through Guard receives an additional small reduction or reliability benefit.

Do **not** stack this into a giant permanent defence number.

**Best when:**

- enemy intent is readable;
- the player deliberately protects a named target;
- Bastion or a hybrid protection style is active.

**Opportunity cost:**

- no benefit on turns Garrick simply Strikes;
- weaker when enemies spread pressure.

### Candidate — Split-Maul Pommel

**Role:** Offence / payoff

**Conceptual effect:**

Garrick's offensive Strike gains a modest conditional payoff against an **Exposed** enemy.

Preferred envelope:

- +1 additional damage against Exposed; or
- a small attack-roll bonus against Exposed.

Not both.

**Best when:**

- Mira is using Pin Shot;
- Breaker Garrick is part of a setup/finish chain.

**Opportunity cost:**

- no value without setup;
- does not protect Garrick or the party.

### Garrick catalogue outcome

The four-item question becomes:

- Mail Patch — absorb;
- Vambrace — avoid;
- Warden's Hook — protect;
- Split-Maul — finish.

No item is “Garrick gear tier 4”.

## 7. Mira equipment catalogue

Mira's item choices should answer:

> Do I want route/check reliability, direct damage, status setup, or risky speed/Guile?

### Existing foundation — Trail Charms

**Role:** Reliability / exploration  
**Effect identity:** +1 Scout.

**Best when:**

- travel checks matter;
- initiative derived from Scout remains relevant;
- Ghost Mira leans into route control.

**Opportunity cost:**

- no direct damage bonus.

### Existing foundation — Quickstep Blade

**Role:** Offence  
**Effect identity:** +1 offensive damage.

**Best when:**

- Mira is expected to attack frequently;
- Duelist wants consistent finishing pressure.

**Opportunity cost:**

- no help on failed checks;
- no direct status/setup improvement.

### Candidate — Glass-Fletched Bolts

**Role:** Control / setup

**Conceptual effect:**

**Pin Shot** becomes more reliable at creating an Exposed window without raising its direct damage.

Preferred envelope:

- +1 attack roll on Pin Shot; or
- Exposed grants one additional small accuracy benefit to the next ally attack.

Do not increase Pin Shot damage and setup strength together.

**Best when:**

- the party has Exposed payoffs;
- Garrick/Oren need help landing a key follow-up.

**Opportunity cost:**

- weaker when Mira should simply finish a low-HP enemy.

### Candidate — Smuggler's Mantle

**Role:** Tempo / Guile

**Conceptual effect:**

A compact bonus to Guile plus a modest initiative benefit, balanced by reduced direct combat durability.

Possible envelope:

- +1 Guile;
- +1 initiative;
- -1 defence while equipped.

Final numbers belong to LR-0017/LR-0020.

**Best when:**

- avoiding/solving encounters through Guile matters;
- Ghost or hybrid Mira wants to act early.

**Opportunity cost:**

- makes incoming pressure more dangerous;
- does not increase damage.

### Mira catalogue outcome

- Trail Charms — Scout/reliability;
- Quickstep Blade — damage;
- Glass-Fletched Bolts — setup;
- Smuggler's Mantle — speed/Guile at risk.

## 8. Oren equipment catalogue

Oren's item choices should answer:

> Do I want general Wits reliability, defensive control, offensive spell payoff, or tempo against dangerous intent?

### Existing foundation — Keen Lens

**Role:** Reliability  
**Effect identity:** +1 Wits.

**Best when:**

- Oren makes many Wits checks;
- Seer wants broad reliability.

**Opportunity cost:**

- general bonus lacks a specialised combat payoff.

### Existing foundation — Warder Chalk

**Role:** Control / defence  
**Effect identity:** +1 defence and stronger Bind.

**Best when:**

- enemy intent makes mitigation valuable;
- Warder wants to blunt high-risk attacks.

**Opportunity cost:**

- no direct Sigil Bolt damage.

### Candidate — Stormglass Prism

**Role:** Offence / setup payoff

**Conceptual effect:**

Sigil Bolt gains a modest conditional payoff against **Exposed** enemies.

Preferred envelope:

- +1 damage against Exposed; or
- +1 attack roll against Exposed.

Not both.

**Best when:**

- Mira or encounter mechanics create Exposed windows;
- Seer wants a combat-specialised alternative to Keen Lens.

**Opportunity cost:**

- no Bind improvement;
- no benefit on unprepared targets.

### Candidate — Archive Coil

**Role:** Tempo / control

**Conceptual effect:**

The **first successful Bind per combat** receives a modest improvement.

Examples:

- +1 additional Weakened magnitude for that one use; or
- +1 attack roll on the first Bind.

Do not grant a permanent stronger Bind every turn; Warder Chalk already owns that identity.

**Best when:**

- a fight opens with one dangerous telegraphed enemy intent.

**Opportunity cost:**

- sharply reduced value after the first use;
- no general skill bonus.

### Oren catalogue outcome

- Keen Lens — broad Wits;
- Warder Chalk — sustained control;
- Stormglass — offensive payoff;
- Archive Coil — opening tempo/control.

## 9. Brindle equipment catalogue

Brindle's item choices should answer:

> Do I want stronger recovery, stronger setup, a combat-control hybrid, or a clutch emergency tool?

### Existing foundation — Healer's Satchel

**Role:** Support / recovery  
**Effect identity:** stronger Lantern Grace and bandages.

**Best when:**

- the party expects sustained HP pressure;
- Beacon leans hard into recovery.

**Opportunity cost:**

- no direct offensive or Bless reliability gain.

### Existing foundation — Lamp Censer

**Role:** Support / reliability  
**Effect identity:** +1 Spirit and stronger Bless.

**Best when:**

- Bless setup is frequent;
- Spirit checks matter;
- Beacon or Zealot wants offensive support.

**Opportunity cost:**

- weaker direct healing than Satchel.

### Candidate — Penitent Chain

**Role:** Control / offence

**Conceptual effect:**

Brindle's **Mace** gains a small conditional control payoff.

Preferred envelope:

- on a successful Mace hit against an already Exposed enemy, apply a small one-action Weakened effect; or
- Mace gets +1 attack roll against Weakened enemies.

Avoid creating a free status on every basic hit.

**Best when:**

- Zealot wants to participate in control rather than pure damage.

**Opportunity cost:**

- no healing bonus;
- requires setup/condition.

### Candidate — Pilgrim Bell

**Role:** Emergency support / tempo

**Conceptual effect:**

Once per combat, the first Lantern Grace used on a badly wounded ally gains a small emergency benefit.

Possible envelope:

- +2 extra healing only when the target is below 50% HP.

**Best when:**

- the player saves Brindle's support turn for a crisis.

**Opportunity cost:**

- no benefit in easy fights;
- no general Spirit bonus;
- cannot trigger repeatedly.

### Brindle catalogue outcome

- Satchel — sustained healing;
- Censer — Bless/Spirit;
- Penitent Chain — control/offence hybrid;
- Pilgrim Bell — emergency recovery.

## 10. Catalogue summary

Recommended first LR-0017 target: **four meaningful choices per hero** including the two parked LR-0006 items.

| Hero | Choice 1 | Choice 2 | Choice 3 | Choice 4 |
| --- | --- | --- | --- | --- |
| Garrick | Mail Patch — HP | Iron Vambrace — defence | Warden's Hook — Guard | Split-Maul — Exposed payoff |
| Mira | Trail Charms — Scout | Quickstep Blade — damage | Glass-Fletched Bolts — Pin Shot | Smuggler's Mantle — Guile/tempo |
| Oren | Keen Lens — Wits | Warder Chalk — Bind/defence | Stormglass Prism — Exposed payoff | Archive Coil — first-Bind tempo |
| Brindle | Healer's Satchel — healing | Lamp Censer — Bless/Spirit | Penitent Chain — control hybrid | Pilgrim Bell — emergency heal |

This is a catalogue target, not a mandate to implement all eight new candidates in one PR if LR-0017 proves too broad.

## 11. Build interaction matrix

### Garrick

| Path | Natural item synergy | Cross-build alternative |
| --- | --- | --- |
| Bastion | Mail Patch, Warden's Hook | Split-Maul creates a more aggressive Bastion |
| Breaker | Split-Maul | Iron Vambrace offsets Breaker's lower protection focus |

### Mira

| Path | Natural item synergy | Cross-build alternative |
| --- | --- | --- |
| Ghost | Trail Charms, Smuggler's Mantle | Quickstep Blade lets Ghost convert initiative into damage |
| Duelist | Quickstep Blade | Glass-Fletched Bolts gives Duelist setup utility |

### Oren

| Path | Natural item synergy | Cross-build alternative |
| --- | --- | --- |
| Seer | Keen Lens, Stormglass Prism | Archive Coil gives Seer early control |
| Warder | Warder Chalk, Archive Coil | Stormglass gives Warder offensive payoff |

### Brindle

| Path | Natural item synergy | Cross-build alternative |
| --- | --- | --- |
| Beacon | Healer's Satchel, Pilgrim Bell | Penitent Chain gives Beacon a control outlet |
| Zealot | Lamp Censer, Penitent Chain | Satchel lets Zealot cover emergency sustain |

No path should have one obvious “correct item”.

## 12. Availability principles

Equipment should feel placed in the world rather than generated from a universal catalogue.

### Shop availability

Rules:

- each settlement should carry at most a small number of hero gear options;
- not every settlement should serve every hero equally;
- a shop item may reflect local identity;
- the player should sometimes travel or delay a purchase to reach a preferred item.

Do not put all 16 items in one universal market.

### Suggested availability shape

**Common/specialist shop items:**

- the eight LR-0006 foundation items;
- possibly one new candidate per region after LR-0017 proves the system.

**Quest/rare items:**

- Warden's Hook;
- Glass-Fletched Bolts;
- Archive Coil;
- Pilgrim Bell;

or equivalent signature pieces.

These names are mechanical design candidates, not Storyteller-owned quest rewards. The Storyteller decides which narrative outcome, NPC or quest can credibly deliver them.

### Rare reward rule

A rare item should be obtained through at least one opportunity cost:

- choosing it instead of more gold;
- choosing one reward from two;
- accepting a route/outcome consequence;
- investing time or risk;
- giving up a different rare item.

Do not hand out a best-in-slot item on top of the full normal reward.

## 13. Economy boundary

LR-0052 target band for meaningful early/mid gear:

- **35–50g** base-price equivalent;
- roughly 9–14 ration-days;
- roughly 1.5–2.5 ordinary quest turn-ins.

LR-0057 does **not** set final prices.

LR-0016 owns:

- global base price targets;
- income;
- upkeep;
- resource-pressure balance.

LR-0017 owns:

- item effects;
- item identity;
- item availability;
- equip/reward plumbing.

LR-0020 owns final whole-system tuning.

### Price-design rule

Price may influence timing, but should not be used to “balance” an item that is mechanically dominant.

If Item A is strictly better than Item B, making A cost 20g more does not fix the long-term choice once the player can afford it.

## 14. Shop vs quest reward balance

A shop item has:

- reliable availability;
- direct gold opportunity cost.

A quest item has:

- limited availability;
- route/outcome opportunity cost;
- stronger narrative identity.

Therefore a quest item can be more specialised or unusual without being strictly stronger.

Example:

- shop: Mail Patch, stable +2 HP;
- rare reward: Warden's Hook, strong only when Guard is deliberately used.

The rare item is more distinctive, not universally better.

## 15. Tool and equipment boundary

Current tools such as:

- Rope;
- Lantern Oil;
- Iron Spikes;
- Lockpicks;

should remain **inventory tools**, not silently become hero equipment.

Why:

- they gate authored choices and exploration;
- they are party resources, not identity loadout;
- moving them into the hero slot would make utility compete with combat gear in a confusing way.

If LR-0017 wants equippable utility gear later, it should author purpose-built items rather than reclassify current quest tools without migration review.

## 16. Consumable and equipment boundary

Bandages, Healing Tonic and Ward Salve remain consumables.

An equipment item may modify consumable effectiveness, as the Healer's Satchel does, but should not:

- make consumables infinite;
- remove their inventory cost;
- auto-consume without player choice;
- create a second hidden consumable pool.

## 17. Save and migration assumptions

LR-0017 must reconcile with the final merged LR-0006/LR-0011 contracts.

Expected requirements:

1. keep existing persisted item ids stable;
2. never rename `mail_patch`, `trail_charms`, `keen_lens`, `healer_satchel`, or the LR-0006 new ids as cosmetic cleanup;
3. old saves without equipment state migrate through LR-0011/LR-0006;
4. a saved equipped item that no longer exists in inventory resolves safely to null;
5. a new item introduced by LR-0017 requires no migration merely because it exists;
6. removing/renaming an already persisted item would require an explicit migration;
7. equipment effects must be derived from the equipped item definition rather than copied as permanent numeric state where practical.

## 18. Selling and ownership assumptions

Parked LR-0006 establishes:

- selling an equipped item clears the equipment slot;
- max-HP loss clamps current HP if necessary;
- player feedback states what became unequipped.

LR-0017 should preserve that behaviour for every new item.

A non-stackable hero gear item should normally have one owned copy maximum unless a later explicit design says duplicates matter.

## 19. Phone-first UI contract

The Party screen should let the player answer:

1. what is equipped?
2. what does it do?
3. what other compatible item do I own?
4. what will change if I swap?

### Recommended comparison presentation

For each hero:

**Equipped**  
Mail Patch  
+2 max HP

**Available**  
Iron Vambrace  
+1 defence  
[Equip]

When an item has a conditional effect:

**Warden's Hook**  
Hold Fast improves the first intercepted hit.

Avoid raw implementation keys like `guardReduction` or `bindBonus`.

### Swap feedback

After a swap, show a concise visible result:

> Garrick equips Iron Vambrace. Mail Patch returns to the pack.

### Sale warning

If a future shop can sell hero gear, selling the equipped item should clearly state that it will be unequipped before confirmation or in the resulting feedback.

## 20. Rare item readability

Conditional rare items need the condition in the first sentence.

Good:

> **Split-Maul Pommel** — Garrick deals +1 damage to Exposed enemies.

Bad:

> **Split-Maul Pommel** — An old iron fitting with a violent history.

Flavour can follow the mechanical sentence, not replace it.

## 21. LR-0017 implementation sequencing

Recommended order:

### Slice 1 — foundation expansion

- reconcile final LR-0006 one-slot state;
- ensure all eight LR-0006 items use the same explicit equipment model;
- verify buy/own/equip/swap/sell/save/load.

### Slice 2 — one new sidegrade per hero

Implement four new items chosen from this catalogue.

Goal:

- prove conditional effects;
- prove shop/quest availability rules;
- prove no item is a strict upgrade.

### Slice 3 — rare/signature set

Only after the first expansion tests well, add the remaining candidate items or replacements.

Avoid landing eight new complex effect hooks at once.

## 22. Balance tests for LR-0017

For each hero, test:

- each item with each permanent path;
- at least one injury state;
- early and mid campaign affordability;
- one combat where its effect matters;
- one combat where its effect does not matter;
- one non-combat check if the item affects a skill;
- save/reload while equipped;
- sale/removal while equipped.

### Dominance test

Ask:

> If the player owns all four items and knows the upcoming encounter, is there at least one plausible situation for each item?

If the answer is no, revise or remove the dead item.

### Trap test

Ask:

> Can the player understand the opportunity cost before equipping/buying it?

If not, improve player-facing copy rather than hiding the downside.

## 23. Candidate-effect constraints

Avoid in the first LR-0017 wave:

- percentage modifiers that are hard to read;
- proc chances below 100% unless central to the item identity;
- hidden cooldowns;
- random item breakage;
- item durability;
- gear rarity tiers;
- affix rolls;
- procedural stat ranges;
- set bonuses;
- multi-item crafting trees.

Those systems add inventory volume, not the kind of deliberate choice Lantern Road needs.

## 24. Acceptance mapping for LR-0057

- **Audit current + LR-0006 foundation:** Sections 2–3.
- **Curated distinct catalogue:** Sections 6–10 define four meaningful choices per hero and anti-ladder constraints.
- **Availability/reward principles:** Sections 12 and 14.
- **Economy separation:** Section 13 records LR-0052 bands as input while reserving global tuning for LR-0016/LR-0020.
- **Migration/save/UI assumptions:** Sections 17–20.
- **No blocked runtime integration:** this authoring task changes no runtime or persisted state.

## 25. Handoff to LR-0017

LR-0017 should treat the catalogue as a constrained design menu, not a requirement to ship every candidate unchanged.

The implementation should preserve these player-facing promises:

- one slot, real choice;
- no vertical loot ladder;
- every item has a recognisable use case;
- path + item combinations create different play styles;
- rare means distinctive, not strictly better;
- prices remain an economy decision, not a mechanical balance patch;
- equipment remains readable on a phone;
- old saves and existing item ids remain stable.
