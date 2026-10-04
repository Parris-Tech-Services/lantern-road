# Lantern Road — Compact Combat Depth & Enemy Intent Specification

Task: **LR-0053**  
Owner: **Agent 3 — The Mechanist**  
Consumers: **LR-0015 Tactical combat depth and enemy behaviour**, **LR-0019 Encounter variety, elites and signature fights**  
Status: Authoring specification only. This task does **not** change `game.js`, `content.js`, save state, encounter rewards, or balance values.

## 1. Purpose

Lantern Road's combat should become more readable and more decision-rich without becoming a tactical-grid game.

The target is a compact phone-first fight where the player can answer three questions quickly:

1. **What is each enemy trying to do next?**
2. **Which party action changes that situation most meaningfully?**
3. **What am I giving up by making that choice?**

The system should reward reading enemy intent, choosing targets, timing Guard/Bless/Bind/Exposed, and adapting to party builds. It should not reward memorising opaque AI rules or repeating one mathematically dominant attack.

## 2. Current combat baseline

The current runtime has:

- four fixed party members;
- one turn-order list rolled at combat start;
- seven enemy archetypes;
- seven encounter definitions;
- four existing combat concepts that should remain canonical: **Guard**, **Bless**, **Exposed**, **Weakened**;
- party actions:
  - Garrick: Strike, Hold Fast;
  - Mira: Slip Knife, Pin Shot;
  - Oren: Sigil Bolt, Bind;
  - Brindle: Mace, Lantern Grace, Bless;
- enemy logic that is currently almost uniform:
  - sort living party by HP;
  - normally target the lowest-HP member;
  - sometimes redirect to a Guarded member;
  - roll attack and damage;
  - clear Weakened after the attack.

This means enemy stats differ, but enemy *decisions* barely do. The main depth opportunity is therefore behaviour and telegraphing, not a larger ruleset.

### Current enemy roster

| Archetype | Current identity | Current mechanical profile |
| --- | --- | --- |
| Road Brigand | basic melee human | 9 HP, Armor 10, Attack 3, 2–4 damage |
| Brigand Archer | ranged human | 7 HP, Armor 11, Attack 4, 2–4 damage, faster initiative |
| Marsh Wolf | fast beast | 8 HP, Armor 11, Attack 4, 2–5 damage |
| Bog Lurker | slow heavy beast | 10 HP, Armor 12, Attack 4, 3–5 damage |
| Veil Acolyte | cult humanoid | 8 HP, Armor 10, Attack 4, 2–4 damage |
| Ruin Wisp | fast spirit | 7 HP, Armor 12, Attack 4, 2–5 damage, highest initiative |
| Ford Leech | durable beast | 11 HP, Armor 9, Attack 3, 3–5 damage |

## 3. Combat design rules

### 3.1 Intent must be visible before consequence

Any enemy action stronger or stranger than a basic attack should normally be announced before it resolves.

The phone UI should show one short intent line on each living enemy card, for example:

- **Intent: Press Mira**
- **Intent: Take aim at Brindle**
- **Intent: Circle the weakest**
- **Intent: Coil for a heavy strike**
- **Intent: Prepare an ash rite**

Do not require the player to infer intent from animation alone.

### 3.2 Telegraphs are promises, not guesses

Once an enemy declares a named target or named special intent, that intent should resolve as advertised unless the player changes the board state in a clearly understandable way.

Allowed reasons for an intent to change:

- the target is knocked out;
- Guard deliberately intercepts/redirects it;
- the enemy is interrupted by a defined counter;
- the intent condition is no longer legal.

Do not silently retarget simply because another hero now has lower HP.

### 3.3 Prefer small behavioural rules over new status vocabulary

LR-0015 should deepen existing concepts before adding more statuses.

Use:

- Guard for protection and interception;
- Bless for offensive setup;
- Exposed for vulnerability;
- Weakened for reduced offensive effectiveness;
- intent labels for enemy plans.

A new persistent combat status should require a clear gap that these cannot express.

### 3.4 Counterplay should change decisions, not just numbers

Good counterplay asks the player to choose between competing actions.

Examples:

- protect the hero an Archer is aiming at, or race to knock the Archer out;
- Bind a Bog Lurker before its heavy strike, or accept the risk and focus another threat;
- use Pin Shot to make a high-Armor target easier for the next attacker, or take Mira's direct damage now;
- spend Brindle's turn healing, or use Bless to accelerate removal of a dangerous enemy.

### 3.5 Keep fights short

The intended depth is **decision density**, not turn count.

LR-0015 should normally avoid adding HP solely to make fights last longer. A normal encounter should expose its tactical idea quickly and resolve before its intent cycle becomes repetitive.

## 4. Proposed enemy behaviour vocabulary

Each enemy archetype should have:

- a **priority**: what it is trying to accomplish;
- a **default target rule**;
- one **recognisable special pattern** at most for the first implementation wave;
- an **intent label**;
- explicit **counterplay**;
- a **fallback** when its intended action becomes illegal.

### 4.1 Road Brigand — pressure

**Role:** baseline pressure enemy.

**Priority:** keep an injured party member under pressure while remaining easy to read.

**Intent cycle:**

- Default intent: **Press <target>**.
- Target: lowest-HP living party member at intent-selection time.
- Action: current normal melee attack.
- If a Guarded hero is deliberately intercepting, Guard may redirect the attack according to the finished Guard contract.

**Counterplay:**

- Hold Fast to protect the pressured hero.
- Heal the named target.
- Remove the Brigand before its turn.

**Why it exists:** this remains the clean baseline against which more specialised enemies are learned.

### 4.2 Brigand Archer — aim

**Role:** telegraphed back-line threat.

**Priority:** punish leaving a vulnerable target unprotected.

**Pattern:**

1. **Take Aim at <target>**.
2. On its next action, make an aimed shot against that same target.
3. The aimed shot should be meaningfully more dangerous than its normal shot through accuracy *or* damage, not both at extreme values.

**Preferred target:** lowest-HP non-Guarding target, with a slight preference for Brindle/Oren only if that preference is made deterministic and documented. Do not secretly hard-code “healer hate” without a visible reason.

**Counterplay:**

- Guard the named target.
- Knock the Archer out before the shot.
- Bind/Weaken the Archer so the shot is less reliable.
- Heal the target above the danger threshold.

**Fallback:** if the target is down, choose a new target and return to **Take Aim** rather than firing the powered shot immediately.

### 4.3 Marsh Wolf — pack hunter

**Role:** tempo and focus-fire threat.

**Priority:** coordinate with other wolves against one vulnerable hero.

**Pattern:**

- First active wolf chooses a **Pack Target** using lowest current HP percentage.
- Other wolves prefer that target while it remains alive.
- Visible intent: **Circle <target>**.
- A wolf attacking the Pack Target gains a modest accuracy bonus, not a large raw damage spike.

**Counterplay:**

- Guard the Pack Target.
- Heal the Pack Target enough to make continuing focus less attractive when the pack retargets.
- Remove one wolf quickly to reduce pack pressure.
- Weaken the next wolf in turn order.

**Important:** pack targeting must be visible. Hidden focus-fire is punishment, not readable pressure.

### 4.4 Bog Lurker — heavy wind-up

**Role:** slow threat that forces a tempo decision.

**Priority:** threaten a large hit that the player can see coming.

**Pattern:**

1. **Coiling** — no heavy damage this action; telegraph the target.
2. **Heavy strike at <target>** on its next action.
3. Return to a normal attack before coiling again.

The heavy strike should be dangerous enough to care about but should not routinely one-shot a healthy hero.

**Counterplay:**

- Bind/Weaken during the wind-up.
- Hold Fast on the named target.
- Spend damage to finish the Lurker before release.
- Heal the target above the likely danger band.

**Interaction with Exposed:** Exposed should help the party race the wind-up by improving hit reliability; it should not cancel the intent by itself.

### 4.5 Veil Acolyte — setup/support threat

**Role:** enemy that makes another enemy more dangerous rather than merely attacking.

**Priority:** create a short “deal with the ritual or deal with the beneficiary” puzzle.

**Pattern:**

- If an ally is alive, intent may be **Ash Rite: embolden <ally>**.
- The rite gives that ally a one-action offensive benefit expressed through existing combat numbers or intent, not a permanent new status.
- If alone, the Acolyte returns to a normal attack pattern.

**Counterplay:**

- Focus the fragile Acolyte.
- Bind/Weaken the empowered attacker.
- Guard the attacker’s declared target.
- Race the beneficiary if it is already near defeat.

**Constraint:** do not create a stacking buff engine. One Acolyte contribution should be readable and bounded.

### 4.6 Ruin Wisp — volatile tempo

**Role:** fast enemy that pressures turn-order planning.

**Priority:** create urgency through initiative and target switching rather than raw durability.

**Pattern:**

- Intent alternates between **Flicker at <target>** and **Flare at <target>**.
- Flicker is the normal attack.
- Flare is a telegraphed accuracy-focused attack against a target not hit by that Wisp on its previous action where possible.

This encourages the player to protect more than one hero over the fight.

**Counterplay:**

- Pin Shot/Exposed to remove the low-HP Wisp quickly despite Armor 12.
- Bless a reliable attack to reduce miss risk.
- Guard the named Flare target.
- Bind/Weaken before the Flare.

**Constraint:** do not add random untargetability, dodge phases, or invisible immunity.

### 4.7 Ford Leech — attrition

**Role:** durable sustain threat.

**Priority:** punish leaving a low-Armor, high-HP enemy alive indefinitely.

**Pattern:**

- Normal intent: **Feed on <target>**.
- On a successful attack, restore a small bounded amount of HP to the Leech.
- Prefer the living party member with the highest current HP, distinguishing it from the “finish the weakest” baseline.

**Counterplay:**

- Burst the Leech while Exposed.
- Weaken it to reduce successful feeding.
- Use Guard on the selected target if the recovery race is becoming unfavourable.

**Constraint:** healing should never exceed the damage actually dealt and should not make the fight endless.

## 5. Intent selection contract

The implementation should separate **intent selection** from **intent resolution**.

Recommended conceptual state per enemy:

```text
intent = {
  key,            // stable internal id
  label,          // player-facing short label
  targetId,       // party member when applicable
  phase,          // optional small integer/string for wind-ups
  selectedRound   // debugging/testing evidence
}
```

This is a design contract, not a required persisted schema.

### Selection timing

Preferred order:

1. At combat start, create the first intent for each enemy.
2. After an enemy resolves its turn, select its next intent immediately.
3. The new intent remains visible until that enemy acts again.

This gives the player maximum information during intervening party turns.

### Resolution timing

When the enemy's turn begins:

1. read the already-visible intent;
2. validate target/action legality;
3. resolve it;
4. log a concrete result;
5. select the next intent;
6. render the new intent.

Do not select a fresh hidden action immediately before resolution.

## 6. Party decision axes

LR-0015 should make party turns meaningfully different along five axes.

### Targeting

The player should sometimes prefer:

- the enemy acting soonest;
- the enemy with the most dangerous declared intent;
- a low-HP enemy that can be removed now;
- a high-Armor enemy made Exposed;
- a support enemy enabling another threat.

“Always hit the lowest-HP enemy” should not be universally correct.

### Defence

Hold Fast should be a deliberate answer to known incoming pressure.

A good Guard decision trades Garrick's own damage for:

- interception;
- damage reduction;
- preserving a wounded hero;
- absorbing a telegraphed heavy shot.

Guard should not become an always-correct action when any ally is below a fixed HP threshold.

### Tempo

Some threats should reward acting now even when another action has better raw expected damage.

Examples:

- stopping an aimed shot;
- racing a coiling Lurker;
- removing an Acolyte before its rite matters;
- finishing a Wisp before its next high-initiative action.

### Status use

**Exposed** should answer “we need this target to become reliably hittable now.”

**Weakened** should answer “this declared enemy action is dangerous enough that reducing its chance/effect is worth Oren's turn.”

Neither status should be automatically optimal every round.

### Resource trade-offs

Brindle's turn is the clearest existing resource trade-off:

- Lantern Grace preserves HP now;
- Bless improves offensive reliability;
- Mace contributes direct pressure.

LR-0015 should preserve that triangle rather than adding a fourth action that dominates all three.

## 7. Existing hero actions: identity and risks

| Hero/action | Intended identity | Dominant-loop risk | Desired counterweight |
| --- | --- | --- | --- |
| Garrick — Strike | reliable direct pressure | Breaker path could make Strike always best | telegraphed threats make Hold Fast valuable |
| Garrick — Hold Fast | protect named target | could become automatic every round | opportunity cost of lost damage; some low-threat turns need no Guard |
| Mira — Slip Knife | efficient direct damage | could eclipse Pin Shot if damage always wins | Armor/priority targets make Exposed setup worthwhile |
| Mira — Pin Shot | setup via Exposed | could be mandatory opener every fight | weaker immediate damage and targets that are already easy to hit |
| Oren — Sigil Bolt | reliable Wits attack | high Wits scaling could crowd out Bind | dangerous declared intents make Weakened worth a turn |
| Oren — Bind | mitigation via Weakened | spamming Bind could trivialise one enemy | one-action duration; multiple threats; opportunity cost |
| Brindle — Mace | low-complexity damage | usually inferior unless Zealot | useful only when no heal/setup need exists |
| Brindle — Lantern Grace | sustain | healing every turn can drag fights | fights stay short; heal only when damage pressure justifies it |
| Brindle — Bless | accuracy setup | blessing best attacker every round could become rote | Bless is consumed; dangerous intents may demand healing instead |

## 8. Dominant-action risks to test in LR-0015

### Risk A: focus-fire remains universally optimal

If every enemy can be safely removed one-by-one with no meaningful response to intent, the new AI is cosmetic.

**Countermeasure:** support/wind-up enemies must create timing questions where the highest-priority target is not always the lowest-HP target.

### Risk B: Bind locks down the only dangerous enemy forever

Oren's Wits is already high, and LR-0006's Warder path/gear can strengthen Bind.

**Countermeasure:** keep Weakened short-lived and design encounters with overlapping threats. Do not solve this by making enemies immune to Bind without explanation.

### Risk C: Hold Fast becomes mandatory

Bastion Garrick under LR-0006 can strengthen Guard significantly.

**Countermeasure:** not every enemy intent should target the fragile hero, and not every intent should be high damage. Guard should answer specific danger, not be a tax.

### Risk D: damage paths delete tactical choices

Breaker Garrick, Duelist Mira and Zealot Brindle add offensive damage in LR-0006.

**Countermeasure:** depth should come from intent timing, target priorities and setup value, not from inflated enemy HP designed to neutralise offensive builds.

### Risk E: healing creates attrition stalemates

Beacon Brindle plus Healer's Satchel can improve sustain.

**Countermeasure:** encounters should remain short enough that healing buys tempo rather than enabling indefinite loops. Enemy sustain such as Ford Leech healing must stay bounded.

### Risk F: high initiative becomes pure free value

Ghost Mira gets an initiative bonus in LR-0006.

**Countermeasure:** initiative should be valuable because acting before a telegraphed threat matters. Do not add arbitrary anti-initiative enemies just to cancel the build.

## 9. LR-0006 progression assumptions to reconcile later

LR-0053 was authored while LR-0006 is parked and unmerged. LR-0015 must re-check these assumptions after LR-0006 is reconciled with the shared foundations.

### Current parked path assumptions

- Garrick:
  - **Bastion**: +2 max HP; stronger Hold Fast.
  - **Breaker**: +2 offensive damage.
- Mira:
  - **Ghost**: +1 Scout, +1 Guile, +2 initiative.
  - **Duelist**: +1 offensive damage.
- Oren:
  - **Seer**: +1 Wits.
  - **Warder**: +1 defence; stronger Bind.
- Brindle:
  - **Beacon**: +2 Lantern Grace healing; stronger Bless.
  - **Zealot**: +1 Spirit; +1 offensive damage.

### Current parked equipment assumptions

- Garrick: Mail Patch vs Iron Vambrace.
- Mira: Trail Charms vs Quickstep Blade.
- Oren: Keen Lens vs Warder Chalk.
- Brindle: Healer's Satchel vs Lamp Censer.

### Current injury assumptions

Knockout injuries can reduce Might, Scout, Wits or Spirit, and some reduce max HP. LR-0015 should therefore test combat while injured; it must not tune accuracy so tightly around pristine stats that one injury makes a hero non-functional.

### Reconciliation rule

LR-0015 should consume the *final merged* LR-0006 numbers. If the progression values change during reconciliation, preserve the behavioural goals in this document and retune numeric bonuses rather than cloning stale values.

## 10. Signature encounter patterns for LR-0019

These are patterns, not mandated encounter names or final content.

### Pattern 1 — Crossfire

**Composition:** one pressure melee enemy + one Archer.

**Question:** protect the aimed target, remove the Archer, or finish the melee enemy first?

**Good teaching use:** early campaign introduction to visible intent.

### Pattern 2 — Pack Collapse

**Composition:** two or three pack hunters with shared visible focus.

**Question:** can the player break coordinated pressure before the Pack Target falls?

**Variation:** one tougher pack leader later, but avoid a new hidden aura system unless LR-0019 explicitly owns it.

### Pattern 3 — Ritual and Hammer

**Composition:** Veil Acolyte + Bog Lurker or another heavy enemy.

**Question:** interrupt/remove the support piece or prepare for the heavy declared strike?

**Use:** signature Mosslight-style fight where target priority changes by round.

### Pattern 4 — Volatile Lights

**Composition:** two Ruin Wisps with staggered intent timing.

**Question:** spend setup to hit high Armor reliably, or spread protection across their alternating Flare targets?

**Constraint:** do not make both Wisps execute identical special actions simultaneously every round; stagger them for readability.

### Pattern 5 — Attrition Anchor

**Composition:** Ford Leech + fragile fast threat.

**Question:** kill the fragile threat first and risk the Leech feeding, or burst the durable sustain enemy before it recovers?

**Use:** later encounter where Exposed and Bless can create a burst window.

## 11. Recommended first implementation slice for LR-0015

Implement the smallest vertical slice that proves the model:

1. Add explicit visible intent state.
2. Give **Road Brigand** the baseline Press behaviour.
3. Give **Brigand Archer** the two-step Take Aim pattern.
4. Give **Bog Lurker** the Coiling heavy-strike pattern.
5. Preserve current Guard/Bless/Exposed/Weakened semantics.
6. Add browser tests proving:
   - intent is visible before action;
   - a declared target is stable;
   - Guard meaningfully answers an aimed/heavy strike;
   - Weakened affects the declared attack;
   - removing an enemy before its special action cancels that action cleanly.

Only after that slice is readable and fun should LR-0015 add the remaining archetype behaviours.

This avoids implementing seven clever enemies at once and discovering the intent UI itself is unclear.

## 12. Phone-first presentation requirements

An enemy card should show, in this order:

1. enemy name;
2. HP / Armor;
3. **Intent** in one concise line;
4. current canonical statuses;
5. target button when relevant.

Intent text should normally fit on one phone-width line or wrap to two short lines.

Avoid:

- paragraph-length tactical explanations;
- icon-only intent;
- colour as the only distinction;
- hover-dependent detail;
- intent text hidden in the combat log.

The combat log explains what happened. The enemy card explains what is about to happen.

## 13. Acceptance mapping for LR-0053

- **Distinct enemy priorities and telegraphs:** Sections 4–5 define a behavioural identity and readable intent for all seven current enemy archetypes.
- **Party decision axes:** Section 6 defines targeting, defence, tempo, status use and resource trade-offs.
- **Dominant-action risks:** Sections 7–8 identify current and LR-0006-derived loop risks with counterplay that does not rely on stat inflation.
- **Signature encounter patterns:** Section 10 provides five reusable patterns for LR-0019.
- **LR-0006 reconciliation assumptions:** Section 9 records the current parked paths, gear and injury assumptions and explicitly requires later reconciliation.
- **No blocked runtime integration:** This document changes no runtime or persisted state.

## 14. Handoff to LR-0015 and LR-0019

LR-0015 should treat this specification as a design input, not immutable code architecture. Its implementation is successful if the resulting fights preserve these player-facing promises:

- enemy plans can be read before they land;
- different enemies force different priorities;
- Guard/Bless/Exposed/Weakened have situational reasons to exist;
- party builds change *how* the player answers pressure without creating one mandatory build;
- fights stay compact;
- no tactical grid is introduced.

LR-0019 should use the encounter patterns after LR-0015 proves the behaviour system, rather than creating bespoke one-off combat code for every signature fight.
