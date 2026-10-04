# Lantern Road — Build Viability & Whole-System Balance Scenario Matrix

Task: **LR-0087**  
Owner: **Agent 3 — The Mechanist**  
Primary consumer: **LR-0020 Build viability and whole-system balance pass**  
Inputs: parked **LR-0006**, **LR-0052**, **LR-0053**, **LR-0057**, **LR-0058**  
Status: authoring/measurement design only. This task does **not** edit runtime balance values, run Warden black-box QA, or claim that a configuration is “fun”.

## 1. Purpose

LR-0020 will eventually have to answer a difficult question:

> Do Lantern Road's progression, combat, equipment, injuries and economy create several viable ways to play, or do the systems collapse into one obvious solution?

That question should not be answered by intuition alone.

This matrix defines representative campaign configurations, resource strategies and failure signals so the final Mechanist balance pass can compare materially different ways of playing while preserving Josh as the final judge of fun and premium feel.

The matrix is deliberately **not** a fixed win-rate target.

A build can be viable even if it is:

- safer but slower;
- richer but more fragile;
- more reliable but less explosive;
- better at road checks but worse in combat;
- strong early and merely adequate late.

A balance defect exists when a choice becomes:

- **dominant** — broadly better with no meaningful trade-off;
- **a trap** — appears legitimate but is predictably much worse;
- **non-functional** — cannot perform its intended role;
- **economically compulsory** — the campaign economy effectively forces it;
- **unrecoverable** — ordinary bad luck produces a state with no credible non-grind recovery path.

## 2. Scope boundary

LR-0087 defines what LR-0020 should test.

It does not:

- alter `game.js` or `content.js`;
- set final prices;
- set final enemy stats;
- merge parked LR-0006;
- replace Agent 6 black-box QA;
- replace Agent 1 automation;
- declare a subjective fun score.

Mechanist balance work should use Warden evidence and automation results when they exist, but still owns the systemic interpretation of combat/progression/economy interactions.

## 3. Systems that must be reconciled before LR-0020 execution

The final balance pass should run only after these implementation tasks exist in merged form:

- LR-0006 — progression/build foundation;
- LR-0015 — combat depth and enemy behaviour;
- LR-0016 — economy/supplies;
- LR-0017 — equipment ecosystem;
- LR-0018 — injury/recovery;
- LR-0019 — encounter variety/signature fights.

The authoring inputs in this document are current design assumptions, not a substitute for reconciling the final merged values.

## 4. Current progression assumptions

### Garrick

**Bastion**
- +2 max HP;
- stronger Hold Fast.

**Breaker**
- +2 offensive damage.

### Mira

**Ghost**
- +1 Scout;
- +1 Guile;
- +2 initiative.

**Duelist**
- +1 offensive damage.

### Oren

**Seer**
- +1 Wits.

**Warder**
- +1 defence;
- stronger Bind.

### Brindle

**Beacon**
- stronger Lantern Grace;
- stronger Bless.

**Zealot**
- +1 Spirit;
- +1 offensive damage.

These are the parked LR-0006 values and must be re-read after LR-0006 eventually merges.

## 5. Current equipment assumptions

Foundation item pairs:

- Garrick: Mail Patch vs Iron Vambrace;
- Mira: Trail Charms vs Quickstep Blade;
- Oren: Keen Lens vs Warder Chalk;
- Brindle: Healer's Satchel vs Lamp Censer.

LR-0057 additionally proposes sidegrades around:

- Garrick: protection / Exposed payoff;
- Mira: Pin Shot setup / Guile-tempo;
- Oren: Exposed payoff / first-Bind tempo;
- Brindle: control hybrid / emergency healing.

LR-0020 should not assume every LR-0057 candidate ships unchanged. It should test the final implemented catalogue by **role**, not stale item names.

## 6. Current recovery assumptions

LR-0058 target model:

- one persistent injury per hero;
- common injury penalty generally one skill at -1;
- max-HP injury penalty capped around 0–2;
- no random lost turns;
- recovery through proper rest, portable treatment and/or specialist service;
- recovery should not require grinding.

Balance testing should always include at least one injured configuration, because pristine-party tests alone understate expedition pressure.

## 7. Current economy assumptions

From LR-0052:

- start: 28g and 6 rations;
- base ration target: 2–4g;
- inn target: 3–7g;
- portable healing target: roughly 6–18g by item type;
- meaningful gear: roughly 35–50g;
- ordinary authored quest payout: roughly 18–30g;
- competent quest-focused play should not require random-combat farming;
- one early defeat must remain recoverable.

These are guardrails rather than immutable final numbers.

## 8. Balance vocabulary

### Viable

A choice is viable when:

- its intended role actually matters;
- it can contribute to completing representative campaigns;
- its weakness can be understood and adapted around;
- choosing it does not create a hidden economic or mechanical dead end.

### Dominant

A choice is dominant when it is the rational default across materially different contexts because it provides nearly all upside with negligible opportunity cost.

Warning signs:

- selected in >80% of rational test scenarios for reasons unrelated to scenario identity;
- improves both offence and defence enough to erase alternative roles;
- remains best even when the scenario is deliberately designed to favour another choice.

The 80% figure is a **diagnostic prompt**, not a formal statistical threshold.

### Trap

A choice is a trap when:

- player-facing copy suggests a legitimate use;
- its intended situation occurs;
- yet an alternative remains clearly better in almost all such situations.

### Non-functional

A build/item/action is non-functional when its intended identity cannot reliably be expressed.

Examples:

- Guard build cannot meaningfully protect a telegraphed target;
- control build cannot alter dangerous enemy plans;
- support build spends turns healing but still cannot stabilise normal pressure;
- Scout/Guile path provides no campaign advantage because those checks are too rare.

### Unrecoverable spiral

A state is an unrecoverable spiral when:

- the player has not made obviously reckless repeated choices;
- ordinary bad luck/setback occurs;
- all accessible recovery routes require more resources than they restore;
- the only credible answer becomes grinding random encounters or restarting.

## 9. Representative party configurations

There are 16 binary path combinations across four heroes. LR-0020 does not need every combination in a full 18-day run if a smaller set covers the strategic extremes.

Use at least the following eight.

### B1 — Fortress

- Garrick: Bastion
- Mira: Ghost
- Oren: Warder
- Brindle: Beacon

**Identity:** defence, initiative, mitigation, sustain.

**Question:** can the safest party still finish fights/campaign objectives without combat becoming tedious?

**Failure signal:** survival is trivial and damage merely makes every fight longer.

### B2 — Vanguard

- Garrick: Breaker
- Mira: Duelist
- Oren: Seer
- Brindle: Zealot

**Identity:** direct offensive output.

**Question:** does damage shorten fights without deleting the tactical value of Guard, Bind, Bless and healing?

**Failure signal:** all enemy intent mechanics can be ignored because threats die before they matter.

### B3 — Control Road

- Garrick: Bastion
- Mira: Ghost
- Oren: Warder
- Brindle: Zealot

**Identity:** protection + initiative + control, with Brindle contributing offence.

**Question:** can control create tempo advantages without becoming permanent enemy shutdown?

**Failure signal:** Bind + Guard makes dangerous intents irrelevant every round.

### B4 — Support Hammer

- Garrick: Breaker
- Mira: Duelist
- Oren: Warder
- Brindle: Beacon

**Identity:** offence backed by control and healing.

**Question:** does this hybrid feel flexible without simply inheriting all strengths of B1 and B2?

**Failure signal:** it becomes the obvious “best of everything” configuration.

### B5 — Road Specialist

- Garrick: Bastion
- Mira: Ghost
- Oren: Seer
- Brindle: Beacon

**Identity:** travel/check reliability and sustain.

**Question:** do non-combat advantages save enough time/resources to compensate for lower raw damage?

**Failure signal:** skills matter too rarely, making Ghost/Seer effectively worse combat choices.

### B6 — Risk Crew

- Garrick: Breaker
- Mira: Ghost
- Oren: Seer
- Brindle: Zealot

**Identity:** fast, skill-capable, aggressive, less defensive support.

**Question:** can high initiative and skill reliability become a distinct risk-management strategy?

**Failure signal:** either deletes encounters before retaliation or collapses from one bad roll.

### B7 — Protective Offence

- Garrick: Bastion
- Mira: Duelist
- Oren: Seer
- Brindle: Zealot

**Identity:** one dedicated protector with three pressure-oriented partners.

**Question:** can Garrick's defence meaningfully enable aggressive allies without Hold Fast becoming mandatory every turn?

**Failure signal:** Garrick is reduced to permanent Guard-bot play.

### B8 — Adaptive Hybrid

- Garrick: Breaker
- Mira: Ghost
- Oren: Warder
- Brindle: Beacon

**Identity:** damage + initiative + control + sustain.

**Question:** does it reward reading the encounter rather than applying one fixed rotation?

**Failure signal:** one repeating sequence solves most encounters.

## 10. Equipment strategy overlays

Run the build configurations under at least four item strategies.

### E1 — Path reinforcement

Equip items that naturally strengthen each selected path.

Purpose:

- detect runaway positive feedback;
- test whether “double down” becomes mandatory.

### E2 — Cross-build compensation

Equip items that cover each path's weakness.

Examples:

- offensive Garrick with defensive gear;
- Duelist Mira with setup gear;
- Seer Oren with control gear;
- Zealot Brindle with healing gear.

Purpose:

- verify hybridisation is real.

### E3 — Scenario swap

Change equipment based on expected encounter/route demands.

Purpose:

- verify one-slot equipment creates situational choice rather than permanent solved loadouts.

### E4 — Budget constrained

Use only one major gear purchase for the whole party through mid campaign.

Purpose:

- verify the campaign remains viable without four premium items;
- identify whether one hero's gear is economically compulsory.

## 11. Economy strategy overlays

### S1 — Frugal

- maintain rations;
- camp when practical;
- minimise consumable spend;
- no early gear;
- preserve 10–15g recovery reserve.

Question:

> Can conservative play progress without becoming a boring hoard strategy?

### S2 — Equipment investment

- save toward one 35–50g item;
- accept lower recovery reserve;
- keep minimal ration buffer.

Question:

> Does one meaningful item create a noticeable play-style change without making the campaign financially brittle?

### S3 — Recovery heavy

- use inns/consumables freely after damage;
- delay gear;
- avoid entering fights injured/high-Fatigue.

Question:

> Is safe recovery a valid strategy, or does it burn so much coin/time that it becomes a trap?

### S4 — Risk-forward

- fewer rests;
- accept moderate Fatigue;
- use portable healing selectively;
- pursue higher-value routes.

Question:

> Does accepting risk produce proportionate time/economic upside without becoming obviously optimal?

### S5 — Bad-luck recovery

Inject:

- one early combat defeat;
- one failed costly travel check;
- one persistent injury.

Question:

> Is there still at least one credible non-grind route back to stability?

## 12. Recovery-state overlays

Each core build should be observed under:

### R0 — Healthy

Baseline.

### R1 — One primary-skill injury

Examples:

- Mira with Sprained Ankle;
- Oren with Concussion.

Question:

> Does the hero remain useful, and can item/path choices adapt?

### R2 — Injury + Fatigue 3

Question:

> Is the pressure significant but readable?

### R3 — Injury + Fatigue 5

This is an adverse stress test, not expected normal steady state.

Question:

> Are actions still meaningful, or does the hero effectively stop functioning?

### R4 — Limited recovery resources

- 2 rations;
- about 10g;
- one injury.

Question:

> Is there a non-grind recovery route?

## 13. Combat scenario set

Consume LR-0053's intent vocabulary and LR-0019's eventual implementation.

### C1 — Baseline pressure

Road Brigand-style enemies.

Observe:

- direct damage efficiency;
- Guard value;
- whether support actions are overkill.

### C2 — Crossfire

Melee pressure + aimed ranged threat.

Observe:

- target priority;
- Guard response;
- whether pure offence can safely ignore aim.

### C3 — Heavy wind-up

Bog Lurker-style telegraphed strike.

Observe:

- Bind value;
- Guard value;
- burst-race option;
- whether healing before/after is competitive.

### C4 — Support + heavy

Acolyte + heavy enemy.

Observe:

- whether support enemy changes target priority;
- whether control or raw focus dominates.

### C5 — High-Armor volatile

Wisp-style threats.

Observe:

- Pin Shot / Exposed;
- Bless;
- high initiative;
- accuracy-sidegrade equipment.

### C6 — Attrition

Leech-style sustain.

Observe:

- burst windows;
- status setup;
- whether sustain creates an endless fight.

### C7 — Multi-threat signature

At least three enemies with overlapping intents.

Observe:

- control spam limits;
- whether one protector/supporter can neutralise every threat;
- phone-readable complexity.

## 14. Campaign checkpoints

Use a small number of checkpoints rather than obsessively tracking every turn.

### Early checkpoint — day 4 or first two substantive quests

Record:

- Renown;
- gold;
- rations;
- Fatigue;
- party HP;
- injuries;
- gear owned/equipped;
- quest income vs random income;
- number of rests;
- number of fights.

Expected observation:

- player is making trade-offs but is not already economically solved;
- at least one path/item identity has had an opportunity to matter;
- no single setback has made the campaign irrecoverable.

### Mid checkpoint — day 9

Record the same metrics plus:

- major gear purchases;
- recovery spend;
- route choices skipped due to resources;
- repeated random encounters;
- dominant combat action frequency.

Expected observation:

- a competent campaign can afford either stronger recovery flexibility or meaningful equipment investment;
- rations still matter;
- build identities are visible;
- no action/path/item has invalidated alternatives.

### Late checkpoint — day 14

Observe:

- whether resource pressure still informs decisions;
- whether the strongest build has become a solved rotation;
- whether injuries create adaptation rather than shutdown;
- whether random farming was ever economically attractive.

### End checkpoint — day 18 / campaign conclusion

Record:

- Renown;
- final gold/rations;
- total quest income;
- total random income;
- total recovery spend;
- equipment purchases;
- defeats;
- injuries acquired/recovered;
- number of foodless days;
- repeated encounter count;
- final build/item configuration.

Expected observation:

- materially different successful resource/build histories are possible;
- no successful strategy requires grinding;
- ending wealth may vary significantly without making one run obviously “wrong”.

## 15. Progression dominance signals

Flag for investigation if:

- one path is chosen by testers for almost every scenario because its upside is broad and costless;
- a path's unique benefit rarely triggers;
- an offensive path removes the need for status/support mechanics;
- a defensive path makes defeat virtually impossible without meaningful time/offence cost;
- a skill path has too few relevant checks to matter;
- switching equipment cannot meaningfully alter a path's weaknesses.

### Path-specific probes

**Bastion vs Breaker**
- compare fight length;
- incoming damage;
- Hold Fast use;
- total recovery cost.

**Ghost vs Duelist**
- compare initiative advantage;
- Scout/Guile success;
- damage;
- avoided fights/time losses.

**Seer vs Warder**
- compare Wits success;
- Bind impact;
- damage prevented;
- turns spent controlling.

**Beacon vs Zealot**
- compare HP saved;
- Bless value;
- direct damage;
- healing turns required.

## 16. Action dominance signals

### Garrick

Flag if Strike or Hold Fast is optimal on >roughly 80% of meaningful turns across several scenario types.

### Mira

Flag if:

- Pin Shot is always the correct opener regardless of Armor/threat;
- or Slip Knife always outperforms setup.

### Oren

Flag if:

- Bind can suppress the only dangerous enemy indefinitely;
- or Sigil Bolt is always better because Weakened rarely matters.

### Brindle

Flag if:

- Lantern Grace is required every round;
- Bless is a rote permanent opener;
- Mace has no plausible tactical window.

Again, frequency is diagnostic evidence, not an automatic defect.

## 17. Equipment dominance signals

An item is suspicious if:

- it remains equipped across every scenario despite the player owning alternatives;
- it reinforces both the hero's strength and weakness enough that no swap is rational;
- it provides the same benefit as another item but numerically better;
- the “rare” option is simply best-in-slot.

An item is a trap if:

- its stated condition occurs regularly;
- yet using it still performs materially worse than a generic alternative.

## 18. Economy dominance signals

Flag if:

- buying gear early is always correct because food/rest pressure is negligible;
- hoarding is always correct because no purchase has enough payoff;
- inns dominate camp and consumables on coin, time and recovery simultaneously;
- portable healing dominates inn recovery in all contexts;
- repeatable random encounters become the preferred income source;
- one quest outcome is economically mandatory across unrelated narrative choices.

## 19. Injury/recovery defect signals

Flag if:

- one primary-skill injury makes a hero effectively unusable;
- injury + ordinary Fatigue routinely makes success mathematically implausible;
- the optimal response to any injury is always immediate specialist cure;
- the optimal response is always to ignore injuries;
- recovery cost exceeds a normal quest payout for common injuries;
- repeated knockouts stack into an unrecoverable state;
- players must grind random fights to afford treatment.

## 20. Combat depth defect signals

Consume LR-0053.

Flag if:

- enemy intents are visible but strategically irrelevant;
- pure damage kills threats before intents matter in most fights;
- every special enemy is best answered by the same action;
- Guard/Bind/Bless/Exposed become taxes rather than choices;
- high-initiative builds make enemy telegraphs meaningless;
- fights become longer without producing more decisions.

## 21. Non-functional choice test

For each path, equipment item and core action, answer:

1. What situation is this meant to be good in?
2. Does that situation occur naturally?
3. When it occurs, is the choice actually competitive?
4. Can the player understand why?
5. What does the player give up by choosing it?

If #2 or #3 is consistently “no”, the choice is non-functional.

If #5 has no answer, the choice may be dominant.

## 22. Trap-choice test

A choice is not a trap merely because it is difficult.

Use this test:

- player-facing description accurately states the purpose;
- player enters a matching scenario;
- player uses the choice correctly;
- the result is still clearly inferior to a generic alternative.

If all are true repeatedly, it is a trap.

## 23. Unrecoverable-spiral test

Construct at least these adverse states.

### U1 — early defeat

- day 2–4;
- lose ~10–16g;
- 3–4 rations;
- moderate Fatigue.

Pass if:

- at least one low-risk authored recovery route remains;
- no farming required.

### U2 — zero rations

- low gold;
- Fatigue rising;
- damaged party.

Pass if:

- nearest viable settlement/quest route can restore stability before daily penalties become self-amplifying.

### U3 — injury + low cash

- one persistent injury;
- ~10g;
- 2 rations.

Pass if:

- at least one recovery/adaptation strategy remains.

### U4 — failed equipment investment

- player bought an expensive item;
- then suffers one bad encounter.

Pass if:

- the purchase creates hardship but not an automatic restart.

## 24. Whole-system scenario matrix

Use this compact core matrix before expanding.

| Scenario | Build | Equipment | Economy | Recovery | Combat focus |
| --- | --- | --- | --- | --- | --- |
| M1 Safe road | B1 Fortress | path reinforcement | S1 Frugal | R0 | C2 Crossfire |
| M2 Damage race | B2 Vanguard | path reinforcement | S2 Gear investment | R0 | C3 Heavy wind-up |
| M3 Control pressure | B3 Control Road | cross-build | S1 Frugal | R1 | C4 Support + heavy |
| M4 Flexible party | B4 Support Hammer | scenario swap | S3 Recovery heavy | R1 | C5 High Armor |
| M5 Skill campaign | B5 Road Specialist | budget constrained | S1 Frugal | R2 | C1 + non-combat checks |
| M6 High risk | B6 Risk Crew | path reinforcement | S4 Risk-forward | R2 | C7 Multi-threat |
| M7 Protector test | B7 Protective Offence | cross-build | S5 Bad-luck recovery | R3 | C2/C3 |
| M8 Hybrid | B8 Adaptive Hybrid | scenario swap | S2 Equipment investment | R4 | C6 Attrition |
| M9 Recovery spiral | any mid-strength build | budget constrained | S5 | R4 | one ordinary combat |
| M10 Anti-farm | any strong build | best owned gear | S4 | R0 | repeated random encounters |

These ten do not replace broader QA. They are a Mechanist balance core.

## 25. Campaign strategy matrix

At least four of the above should be extended through an 18-day campaign:

### Full Run A — defensive/frugal

B1 + E2 + S1.

Goal:

- test whether defence saves enough recovery resources to compensate for slower combat.

### Full Run B — offensive/investment

B2 + E1 + S2.

Goal:

- test whether damage creates a snowball through faster fights + more wealth.

### Full Run C — hybrid/recovery

B4 or B8 + E3 + S3.

Goal:

- test adaptable play with higher service spend.

### Full Run D — bad-luck resilience

B5/B7 + E4 + S5, inject one early defeat + one injury.

Goal:

- test recovery without farming.

## 26. Income-source guardrail

At end of representative campaigns, calculate:

```text
authored income share = quest / authored reward value
random income share = repeatable travel/combat value
```

Do not set one mandatory percentage yet.

Investigate if:

- successful runs routinely derive more value from deliberately repeated random encounters than authored quests;
- random farming materially accelerates Renown;
- the player intentionally delays campaign objectives because wandering is economically superior.

## 27. Recovery-spend guardrail

Track:

- inn spend;
- consumable spend;
- specialist-treatment spend;
- food spend.

Investigate if:

- recovery consumes so much income that gear is practically impossible in every run;
- or recovery spend is near zero even in risky successful campaigns.

Both extremes indicate weak trade-offs.

## 28. Gear-affordability guardrail

By mid campaign, a competent build should plausibly have:

- one meaningful gear purchase;
- **or** deliberately retained equivalent recovery/tool reserve.

Flag if:

- all builds can effortlessly buy multiple premium items early;
- or no normal run can buy one meaningful item without farming.

## 29. Encounter-length observation

Do not set one universal turn-count requirement.

Instead record:

- number of full rounds;
- number of party turns;
- number of repeated identical actions;
- number of meaningful intent responses.

Investigate if:

- fight length rises without more meaningful decisions;
- or offensive builds routinely end signature threats before the first telegraph resolves.

## 30. Decision-density observation

For each fight, note:

- target-priority changes;
- defensive reactions to intent;
- status setup/payoff decisions;
- heal vs damage decisions;
- equipment-specific decisions.

A compact fight with three meaningful decisions is preferable to a long fight with twelve repeated attacks.

## 31. Choice regret vs defect

A player can reasonably regret a choice after new information.

That is not automatically a trap.

Example:

- buying damage gear before discovering a control-heavy encounter can be a legitimate strategic regret.

It becomes a defect when:

- the game gave enough information;
- the choice's advertised role should apply;
- yet the choice is still systematically worthless.

## 32. Josh creative-signoff boundary

Agents may report:

- repetition;
- dominant strategies;
- dead options;
- resource spirals;
- unclear trade-offs;
- pace/length evidence;
- player confusion.

Agents should not state:

> Build B2 is objectively more fun.

For subjective conclusions, present the evidence and leave the final creative judgement to Josh.

## 33. Data recording template

For each scenario/run:

```text
Scenario ID:
Final runtime commit:
Build paths:
Equipment:
Day/checkpoint:
Gold:
Rations:
Fatigue:
Party HP:
Injuries:
Renown:
Quest income:
Random income:
Food spend:
Recovery spend:
Gear spend:
Defeats:
Combat rounds:
Most-used action per hero:
Meaningful intent responses:
Observed dominant choice:
Observed trap/non-functional choice:
Recovery spiral present?:
Notes:
```

## 34. Fix-order discipline for LR-0020

When a defect is found, fix the root system first.

Recommended order:

1. **Broken mechanic / bug**
2. **Unreadable rule**
3. **Dominant action behaviour**
4. **Encounter composition**
5. **Item effect**
6. **Resource price/reward**
7. **small numeric tuning**

Do not immediately inflate enemy HP or prices because a build is strong.

## 35. Cross-system examples

### Example A — Breaker appears dominant

Before nerfing Breaker damage, ask:

- are enemy intents resolving too slowly?
- is Guard rarely useful?
- are enemies too fragile?
- are combat rewards creating a damage snowball?
- is Breaker's gear also reinforcing damage without trade-off?

### Example B — Beacon appears mandatory

Before nerfing healing, ask:

- are recovery resources too expensive?
- is enemy damage too unavoidable?
- is Guard ineffective?
- are fights too long?
- are injuries making damage persistence too punishing?

### Example C — Ghost appears weak

Before buffing Scout:

- are Scout/Guile checks too rare?
- does initiative matter with visible intent?
- does Trail Charms duplicate rather than complement Ghost?
- are routes too similar economically?

## 36. Regression expectations

Every LR-0020 balance fix should re-check:

- save/load;
- representative early combat;
- representative signature combat;
- one injured state;
- one low-resource state;
- one alternate build that was not the target of the fix.

Balance patches frequently create collateral traps.

## 37. Stop conditions for LR-0020

LR-0020 should not become endless tuning.

The pass can close when:

- all representative path identities are functional;
- no obvious dominant action/path/item remains across unrelated scenarios;
- no ordinary choice is a clear trap;
- bad-luck scenarios remain recoverable without farming;
- quest-focused campaigns can support multiple spending strategies;
- combat intent creates real response decisions;
- remaining uncertainties are specific enough to create targeted follow-up tasks.

Do not keep adjusting numbers merely because two viable strategies have different strengths.

## 38. Assumption reconciliation checklist

Immediately before LR-0020 starts, re-read final merged:

- LR-0006 progression values;
- LR-0015 enemy intent implementation;
- LR-0016 economy targets;
- LR-0017 final item catalogue;
- LR-0018 recovery costs/effects;
- LR-0019 encounter/reward set.

Then update this matrix only where the assumptions no longer match.

Do not carry stale parked-branch numbers into final tuning.

## 39. Acceptance mapping for LR-0087

- **Representative party build combinations:** Sections 9–10.
- **Spending/resource strategies:** Sections 11, 25–28.
- **Dominance/trap/non-functional/spiral signals:** Sections 15–23.
- **Early/mid/late checkpoint matrix:** Sections 14, 24–25.
- **Mapped authoring assumptions/reconciliation:** Sections 3–7, 38.
- **No black-box/runtime scope violation:** Sections 1–2 and 32.

## 40. Handoff to LR-0020

Use this matrix to structure the capstone balance pass, not to predetermine its conclusions.

The final balanced game should permit players to say things like:

- “I played cautiously and spent more on recovery.”
- “I bought one strong piece of gear early and accepted risk.”
- “I leaned into control and avoided damage.”
- “I used an aggressive party and finished fights quickly, but bad hits hurt.”
- “An injury changed how I played for a few days.”

It should not reduce to:

- “always choose these four paths”;
- “always buy these four items”;
- “always spam this action”;
- “always farm this encounter”;
- “restart if you lose once.”
