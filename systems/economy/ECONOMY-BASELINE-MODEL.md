# Lantern Road — Economy Baseline Model & Target Ranges

Task: **LR-0052**  
Owner: **Agent 3 — The Mechanist**  
Primary consumer: **LR-0016 Economy, supplies and expedition pressure balance**  
Status: Authoring/model task only. This document does **not** rebalance `game.js`, `content.js`, faction modifiers, quest outcomes or persisted state.

## 1. Purpose

Lantern Road has an 18-day campaign, daily ration pressure, settlement services, portable healing, tools, gear, quest income and combat rewards. Those systems already create an economy, but there is no explicit target model describing how much pressure is desirable.

This document gives LR-0016 a baseline to balance against.

The intended player experience is:

- food matters, but buying food is not grind;
- rest matters, but one bad fight does not end the campaign economically;
- gear is a meaningful major purchase, not an automatic shopping-list item;
- portable healing is valuable because it saves time/location constraints, not because inns are unusable;
- authored quests are the main reliable income source;
- repeatable random fights/events can supplement income but should not become the optimal way to farm gold or renown;
- faction-specific prices remain a consequence layer owned by LR-0005, while this model defines global base-economy targets.

## 2. Current baseline snapshot

### Starting resources

A new campaign currently begins with:

| Resource | Starting amount | Base replacement value |
| --- | ---: | ---: |
| Gold | 28 | 28g liquid |
| Rations | 6 | 18g at 3g each |
| Bandages | 2 | 16g at 8g each |
| Lantern Oil | 1 | 9g |
| Rope | 1 | 12g |

The starting inventory therefore contains **55g of non-cash goods** plus **28g cash**, or **83g total nominal replacement value**.

That does not mean the player has 83g of spending power. Most starting goods cannot be sold and exist to prevent the campaign opening from immediately becoming a shopping tax.

### Campaign horizon

- Campaign goal: **12 Renown by day 18**.
- The party consumes **1 ration whenever time crosses into a new day**.
- Starting at day 1, 8am and playing through the day-18 horizon implies approximately **17 daily ration ticks** before day 19.
- Starting 6 rations therefore leave an approximate **11-ration campaign deficit** if the player reaches the full horizon with no food found.

At the current base price:

```text
11 replacement rations × 3g = 33g
```

That 33g is the simplest baseline “campaign upkeep” figure.

## 3. Current global base prices

### Supplies and consumables

| Item | Base price | Practical role |
| --- | ---: | --- |
| Rations | 3g | one campaign-day food unit |
| Bandage | 8g | 4 HP to one party member |
| Ward Salve | 14g | 2 HP to all + 1 Fatigue reduction |
| Healing Tonic | 16g | 7 HP to one party member |

### Tools

| Item | Base price |
| --- | ---: |
| Lantern Oil | 9g |
| Iron Spikes | 10g |
| Rope | 12g |
| Lockpicks | 18g |

### Existing gear on live main

| Gear | Base price |
| --- | ---: |
| Trail Charms | 36g |
| Mail Patch | 40g |
| Keen Lens | 42g |
| Healer's Satchel | 44g |

LR-0006 is parked with an explicit equipment-slot model and additional competing gear, but LR-0052 uses live-main prices as the current baseline. LR-0016 must reconcile with the final merged LR-0006 equipment set rather than copying stale prices.

### Inns

| Settlement | Inn cost | Effective cost if the sleep crosses a ration tick |
| --- | ---: | ---: |
| Hearthwick | 3g | ~6g including 1 replacement ration |
| Alderwatch | 4g | ~7g including ration |
| Blacksalt Crossing | 4g | ~7g including ration |
| Greyfen Market | 5g | ~8g including ration |
| Candlemere | 6g | ~9g including ration |

A proper inn rest:

- fully heals all four party members;
- clears Fatigue;
- advances to 7am;
- may consume a daily ration while time advances.

The real economic cost of an inn is therefore **coin + time + usually a ration tick**, not only the displayed room price.

## 4. Time, food and Fatigue pressure

### Travel time

Current terrain movement before road/weather adjustments:

| Terrain | Base move hours |
| --- | ---: |
| Plains | 6h |
| Forest | 8h |
| Hills | 8h |
| Swamp | 10h |
| High Ridge | 10h |

Road tiles reduce move time by 2h. Weather can add 0–2h.

This means a normal travel day can contain:

- two or more short road moves;
- one long off-road move plus interaction;
- one difficult move plus a camp/rest decision.

Food pressure is primarily linked to **elapsed campaign days**, not number of hexes moved.

### Camp

A normal camp:

- costs 8 hours;
- reduces Fatigue by 2;
- heals 2 HP to all;
- costs no direct gold;
- can still consume a ration if it crosses midnight;
- can trigger a camp event with further costs or risks.

Camp is therefore the low-cash recovery option, paid in **time, ration horizon and event exposure**.

### Starvation spiral

When a day advances with zero rations:

- every party member loses 2 HP;
- Fatigue increases by 1.

That is **8 aggregate party HP lost per foodless day**, plus Fatigue.

Fatigue also raises travel-event risk by **0.03 per Fatigue point**.

This creates a deliberate but potentially dangerous feedback loop:

```text
no food
→ party damage + Fatigue
→ higher travel-event risk
→ more chance of damage/combat/time loss
→ greater need for healing/rest
→ greater resource pressure
```

LR-0016 should preserve the tension but ensure the loop has practical exits.

## 5. Reliable authored quest income

Direct turn-in gold currently falls into a narrow, useful band.

| Quest/outcome | Direct turn-in gold |
| --- | ---: |
| Lanterns on the Old Road | 22g |
| Pilgrim's Reliquary — shrine | 18g |
| Pilgrim's Reliquary — Archive | 28g |
| Missing Ledger — Guild | 28g |
| Missing Ledger — Veil | 24g |
| Missing Ledger — Archive | 20g |
| Fever on the South Road | 20g |
| Silent Tower | 26g |
| Ash in the Marsh — Wardens | 24g |
| Ash in the Marsh — Veil | 20g |
| Ash in the Marsh — Archive | 18g |

Across the six core quests, direct turn-in income is roughly:

- **minimum-choice total:** about 124g;
- **maximum-choice total:** about 148g;

before combat rewards, random events or valuable loot.

This is healthy as a macro structure: authored quest completion has enough value to carry the economy without requiring repeatable grinding.

### Important exception

Some quest routes include combat that pays gold *before* the turn-in. For example, fighting Toll Cutters can produce combat gold/loot in addition to the 22g Old Road turn-in.

LR-0016 should compare **whole quest-route value**, not only turn-in values, before adjusting rewards.

## 6. Combat economic value

Combat gives direct gold plus probabilistic loot. Only `valuable` items can currently be sold. Rations from brigands are not sellable, but have **3g replacement value** because they replace a future purchase.

Approximate current expected economic value:

| Encounter | Avg direct gold | Expected sellable loot | Expected ration replacement | Approx total economic value |
| --- | ---: | ---: | ---: | ---: |
| Roadside Ambush | 11g | 6.75g | 1.20g | **18.95g** |
| Hungry Pack | 6g | 8.40g | 0g | **14.40g** |
| Toll Cutters | 14g | 9.90g | 2.40g | **26.30g** |
| Barrow Defenders | 16g | 4.65g | 1.20g | **21.85g** |
| Mosslight Circle | 15g | 6.75g | 0g | **21.75g** |
| Tower Wisps | 12g | 3.00g | 0g | **15.00g** |
| Night Raiders | 10g | 6.30g | 2.40g | **18.70g** |

Notes:

- Ashen Sigils are clue items, not sellable valuables, so they are not counted as cash EV.
- The values above do **not** subtract damage, consumables, time, defeat risk or recovery costs.
- They therefore describe gross economic reward, not profit.

## 7. Defeat economics

Every combat defeat currently applies a universal:

- **-10g**;
- **+2 Fatigue**;
- fallback to the last settlement;
- party restoration to roughly 45% max HP.

Encounter-specific defeat effects apply as well.

The most obvious early spiral is **Toll Cutters**:

- encounter-specific loss: -6g and +1 Fatigue;
- generic defeat: -10g and +2 Fatigue;
- combined: **-16g and +3 Fatigue**.

From the 28g start:

```text
28g - 16g = 12g
```

Twelve gold buys only four base-price rations, before rest/healing/tool costs.

That is a meaningful setback, but if it occurs early it is close to the threshold where food, Fatigue and healing pressure can compound.

### Defeat guardrail

After a single early defeat on a normal route, the player should still have access to at least **one credible recovery plan** without farming:

- 3–4 ration-days of food; **or**
- a cheap inn + 2 ration-days; **or**
- a nearby authored quest/event payout that is not gated behind another high-risk fight.

A single normal defeat may force sacrifice. It should not routinely force a restart.

## 8. Repeatable income and farming risk

Several travel events and combats can recur because the live system does not globally retire them after first resolution.

Examples:

- Broken Axle can award 10g or 12g on a successful check.
- Roadside Ambush can pay roughly 19g gross expected economic value.
- Hungry Pack can pay roughly 14g.
- Night Raiders can pay roughly 19g.
- Repeated combats currently also grant Renown through encounter `onWin` effects.

This creates two related risks:

1. **gold farming:** repeatedly travel through risky tiles because random fights become profitable once the party is strong;
2. **Renown farming:** repeat random combat instead of engaging with authored quests.

### Farming guardrail

Repeatable/random content should be:

- optional supplemental income;
- useful when recovering from bad luck;
- less efficient than authored campaign progress over time;
- unnecessary for reaching the 12-Renown goal.

A player who chooses an efficient quest route should never need to wander specifically to trigger random fights for money.

LR-0016 should coordinate any Renown-loop concern with the progression/campaign owners rather than silently rewriting progression rewards inside an economy patch.

## 9. Representative 18-day spending models

These are planning models, not exact playthrough predictions. Random events, discovered food, faction modifiers and route choices will move the numbers.

### Model A — Frugal road campaign

Assumptions:

- buy the missing 11 rations: 33g;
- use two cheap/medium inns: 8g total;
- buy one extra bandage: 8g;
- avoid gear purchase;
- no defeat.

Total discretionary cash spend:

```text
33 + 8 + 8 = 49g
```

Starting cash is 28g, so outside income required is:

```text
49 - 28 = 21g
```

**Interpretation:** one ordinary quest turn-in approximately funds the rest of a frugal campaign. This is a good lower-pressure baseline.

### Model B — Balanced questing campaign

Assumptions:

- 11 rations: 33g;
- three inns (3g + 4g + 5g): 12g;
- two bandages: 16g;
- one healing tonic: 16g;
- one 12g utility tool;
- no major gear purchase.

Total:

```text
33 + 12 + 16 + 16 + 12 = 89g
```

Outside income required after starting 28g:

```text
89 - 28 = 61g
```

Three average quest turn-ins at about 22g each provide roughly 66g.

**Interpretation:** three quests should comfortably support a balanced run without farming, while still making purchases feel consequential.

### Model C — Build-investment campaign

Assumptions:

- 11 rations: 33g;
- three inns: 12g;
- one extra bandage: 8g;
- one major gear purchase around 40g;
- one 12g utility tool.

Total:

```text
33 + 12 + 8 + 40 + 12 = 105g
```

Outside income required:

```text
105 - 28 = 77g
```

Three quest turn-ins (~66g) plus one ordinary successful combat (~15–20g gross economic value) approximately fund this route.

**Interpretation:** one meaningful gear purchase should be realistic during a competent campaign, but should compete with comfort/recovery spending.

### Model D — Bad-luck recovery campaign

Assumptions:

- 11 rations: 33g;
- four inns: 16g;
- two bandages: 16g;
- one healing tonic: 16g;
- one severe 16g Toll Cutters defeat;
- no gear.

Total cash pressure:

```text
33 + 16 + 16 + 16 + 16 = 97g
```

Outside income required:

```text
97 - 28 = 69g
```

Three average quest turn-ins (~66g) almost cover this; one small combat/event reward closes the gap.

**Interpretation:** a rough campaign can recover, but only if authored income remains accessible. This is close to the desired upper-pressure boundary.

## 10. Target ranges for LR-0016

These are global **base-economy** targets before faction-specific price modifiers.

### Rations

Target base price: **2–4g** each.

Current 3g is within target.

Desired campaign behaviour:

- starting food should cover roughly the first third of the horizon;
- a competent player should normally maintain a **2–5 ration buffer**;
- running out should be possible after poor planning/bad luck;
- recovery from zero food should not require combat farming.

### Inns

Target base room price: **3–7g**, before ration replacement and faction modifiers.

Current 3–6g is within target.

Desired behaviour:

- cheap inn + ration replacement should cost roughly 2–3 ration-days;
- a full heal/fatigue reset should feel meaningfully more expensive in time/coin than a normal camp;
- inns should remain affordable after one normal quest payout;
- high-cost settlements may be a strategic choice, not a trap.

### Portable healing

Target ranges:

- Bandage-equivalent: **6–10g**;
- Healing-Tonic-equivalent: **12–18g**;
- party-wide/fatigue recovery item: **12–18g**.

Current prices sit inside these bands.

Portable healing should trade **coin for time/location flexibility**. Near a safe settlement, an inn may be economically stronger; on the road, consumables preserve campaign time.

### Gear

Target early/mid campaign gear band: **35–50g** per meaningful piece.

Current 36–44g is within target.

A gear item should cost approximately:

- 9–14 ration-days;
- 1.5–2.5 ordinary quest turn-ins;
- enough that buying it competes with comfort/recovery, but not so much that the player must grind.

### Quest payouts

Target ordinary authored quest payout: **18–30g direct**, with route-specific combat/loot considered separately.

Current quest turn-ins fit this range.

### Random/repeatable income

Target:

- a normal random encounter/event win should usually produce **less total progress per campaign-hour** than pursuing an authored quest;
- repeatable income should help absorb bad luck, not become the optimal route;
- no ordinary repeatable event should be required to afford campaign food.

## 11. Early / mid / late guardrails

### Early campaign — days 1–5

Desired state after normal play:

- 2–5 rations or enough liquid gold to buy them;
- at least **10–15g effective recovery reserve** after unavoidable purchases;
- one bad event should not force starvation;
- gear is aspirational rather than expected.

Red flag:

- **<6g and <2 rations** after one ordinary setback with no accessible low-risk authored payout.

### Mid campaign — days 6–12

Desired state:

- 3–5 ration buffer;
- roughly **20–50g liquid/discretionary value** after preserving food needs;
- enough choice to buy one tool/recovery package or save toward gear;
- one gear purchase may be possible for a player who has prioritised income.

Red flag:

- the optimal strategy becomes repeatedly triggering random encounters for cash.

### Late campaign — days 13–18

Desired state:

- food remains relevant but no longer dominates every purchase;
- a competent campaign can end with either:
  - one meaningful gear investment plus a modest reserve; or
  - no gear but stronger recovery/tool flexibility;
- roughly **20–80g final surplus/value** is acceptable depending on route and risk appetite;
- the player should not need to exhaust all shops/resources simply because the campaign reaches day 18.

Red flag:

- all successful runs converge on hoarding because no late purchase matters; or
- all successful runs converge on buying the same gear because upkeep is trivial.

## 12. Global economy vs faction modifiers

Recorded ownership boundary:

- **Agent 3 / LR-0016:** global base prices, income, costs and resource-pressure targets.
- **Storyteller / LR-0005:** faction-specific consequences and local modifiers.

LR-0016 should therefore:

1. balance using neutral/base prices first;
2. test plausible faction modifier extremes afterward;
3. preserve the meaning of faction standing;
4. avoid changing base prices merely to cancel a local consequence modifier.

Example:

If a faction modifier makes one inn cheaper, that should feel like a benefit. The global economy should not raise every inn price just to neutralise it.

## 13. Specific problems LR-0016 should test

### Problem A — repeated combat profitability

Test whether a strong party can intentionally farm travel combats for positive gold/loot/renown faster than questing.

Desired response:

- reduce loop efficiency or one-time rewards;
- do not simply increase enemy HP/damage as an “economic tax”.

### Problem B — starvation/Fatigue feedback

Test zero-ration states from early and mid campaign.

Desired response:

- pressure should be visible and serious;
- one or two bad days should still allow a credible route back to safety;
- no soft-lock where every available action worsens resources faster than recovery is possible.

### Problem C — defeat shock

Test the Toll Cutters -16g case at low starting wealth.

Desired response:

- meaningful sacrifice, not automatic restart;
- player can still choose food/rest/quest recovery;
- avoid stacking multiple hidden penalties on top.

### Problem D — inn vs consumable dominance

Compare:

- camp;
- cheap inn;
- expensive inn;
- bandage;
- tonic;
- ward salve.

Desired response:

- each is best in some context;
- no option dominates on coin, time, healing and Fatigue simultaneously.

### Problem E — gear affordability

Test whether one gear purchase is realistically affordable without farming in a competent run.

Desired response:

- yes, if the player gives up some comfort/recovery;
- multiple premium gear pieces should require stronger performance or later-campaign wealth.

### Problem F — choice-outcome payout distortion

Some morally/narratively different quest endings pay different amounts.

Desired response:

- gold differences may support narrative consequence;
- no single faction/outcome path should become the obvious economic “correct answer” across the whole campaign.

## 14. Recommended LR-0016 measurement set

For representative runs, record at least once per campaign day:

- gold;
- rations;
- Fatigue;
- aggregate party HP percentage;
- consumables held;
- gear purchased;
- cumulative quest income;
- cumulative combat/event income;
- cumulative food spend;
- cumulative rest/recovery spend;
- defeats;
- days spent foodless;
- Renown.

At campaign end additionally record:

- total repeatable/random encounters completed;
- proportion of income from authored quests vs repeatable/random sources;
- number of times the player had <2 rations;
- number of times the player had <6g;
- whether any recovery state felt economically unrecoverable.

## 15. Balance success criteria

LR-0016 should aim for all of these simultaneously:

1. **No grind requirement:** a competent quest-focused run can meet food/recovery needs without farming random encounters.
2. **Real trade-offs:** gear, healing, tools and comfort compete for gold.
3. **Recoverable bad luck:** one normal defeat or failed check does not routinely doom the run.
4. **Meaningful scarcity:** foodlessness and high Fatigue remain genuine threats.
5. **No infinite-value loop:** repeatable events/combat do not dominate authored play.
6. **Build freedom:** economy does not make one LR-0006 equipment/build path obviously superior because only it is affordable.
7. **Narrative separation:** faction/local modifiers remain meaningful consequence rather than being flattened by global price tuning.

## 16. Handoff to LR-0016

LR-0016 should use this document as the neutral-economy contract, then validate it through representative real runs after the shared architecture/save/browser foundations are ready.

Recommended order:

1. instrument/record current baseline runs without changing prices;
2. verify the ration/defeat/repeatable-income pressure identified here;
3. adjust one economic axis at a time;
4. rerun early, mid and full 18-day scenarios;
5. test neutral prices first;
6. test faction-modified prices second;
7. document any final target changes rather than leaving magic numbers unexplained.

The purpose is not to make every run end with the same bank balance. The purpose is to keep scarcity readable, choices meaningful and failure recoverable without turning the Grey March into a farming loop.
