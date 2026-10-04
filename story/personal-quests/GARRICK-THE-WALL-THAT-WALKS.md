# Garrick Vale — The Wall That Walks

## Character question

> **Is responsibility the same thing as making yourself the person who gets hurt first?**

Garrick's flaw is not courage. It is that he has learned to make his usefulness indistinguishable from self-erasure.

He should never become a coward or stop protecting people. His arc asks whether protection can become shared responsibility instead of permanent self-sacrifice.

## Entry requirements

Declarative intent:

- Garrick Trust at least **Trusting** or equivalent threshold.
- Memory `garrick_shared_weight`.
- Prefer after at least one road-danger quest outcome.
- Ideal window: days 6–14.
- Should not require any single regional campaign ending path.

## Existing hooks

Use what the game already established:

- Garrick keeps first watch because “if somebody is awake, everybody else gets to sleep.”
- He values Duty and Protection.
- He respects decisive protection but can disagree with needless harm.
- Watcher's Rest and Broken Span both naturally fit his history.

## Backstory revealed by the arc

Before joining the current party, Garrick travelled with a small Warden relief detail during a spring washout.

At a half-collapsed crossing, he ordered the rest of the group to move civilians while he stayed behind to hold the approach against raiders.

The plan worked.

A younger Warden named **Perrin Holt** saw Garrick stay and copied him at the next bottleneck. Perrin was badly injured.

Garrick has carried the wrong lesson from that day:

> “If I had been stronger, he would not have needed to do it.”

The actual unresolved question is whether Garrick taught people that duty means nobody else should ever see him ask for help.

Perrin does **not** hate Garrick. That would make the conflict too easy.

Perrin is alive, capable, and now helps maintain Watcher's Rest. He is proud of what he did and angry that Garrick still treats him like the mistake in Garrick's story.

---

# Beat 1 — The Name in the Old Watch Log

## Delivery

At Watcher's Rest, an old weather-and-duty ledger contains Garrick's name beside a spring flood entry.

Perrin has added a newer note underneath:

> **Vale still owes me one dry pair of socks.**

Garrick tries to close the book before anyone reads further.

## Player choices

### Ask Garrick who Perrin is

Garrick admits there was “a bad crossing and a worse decision.”

He refuses to call Perrin reckless.

He calls himself careless for giving someone else the idea that staying behind was noble.

**Memory:** `garrick_perrin_named`

### Let Garrick close the book

He appreciates the privacy, but the arc does not disappear.

Later, Perrin recognises him directly.

**Memory:** `garrick_privacy_kept`

### Tease him about the socks

Small warmth if Trust is already high.

Garrick says:

> “I had one pair. He had two feet. It was an impossible logistical problem.”

This should be a rare joke, not a new comic persona.

---

# Beat 2 — Perrin at Watcher's Rest

Perrin is repairing a shutter with one hand and holding nails in his mouth.

He greets Garrick without ceremony:

> “You still standing in doors nobody asked you to block?”

Garrick:

> “You still walking into trouble because somebody else did it first?”

Perrin:

> “Good. We have established we both remember the same day badly.”

## What the player learns

Perrin did not copy Garrick because he was fooled by heroism.

He stayed because there were still people behind him.

He resents Garrick's assumption that Perrin's choice belonged to Garrick.

> “You don't get to own my bad decisions just because you made yours first.”

This is the emotional centre of the arc.

## Trade-off setup

A nearby foot crossing has become dangerous after rain.

Perrin wants to organise locals into rotating watches and repair teams.

Garrick wants to stay personally until the crossing is safe.

Both answers are defensible.

- Garrick is genuinely the most capable protector there.
- If Garrick stays, the party loses time during an already pressured campaign.
- If locals take responsibility, inexperienced people accept real risk.
- If the crossing is abandoned, travellers face a much longer route.

---

# Beat 3 — The Crossing

This should be a short authored sequence, not a dungeon.

The player sees:

- wet rope;
- improvised lantern markers;
- tired locals;
- Garrick automatically taking the most exposed position;
- Perrin deliberately handing him a coil instead of a weapon.

Perrin:

> “Carry something useful.”

## Final choice

### Outcome A — **Share the Watch**

The player backs Perrin's rotating local plan.

Garrick must train people, assign responsibility, and leave before everything is perfect.

He hates this.

That is why it matters.

#### Garrick change

He accepts that protection can include making other people capable of acting without him.

#### Remembered outcome

`garrick_outcome_shared_watch`

#### Later callback

At a later camp:

> Garrick checks the road behind them once, then does not check it again.
>
> “Perrin said he had it.”
>
> He sounds like he is practising the sentence.

#### Ending callback direction

Especially resonant with **The Common Road**:

> Garrick recognises a settlement where responsibility is distributed rather than merely assigned to one larger shield.

Also works with faction endings:

- Wardens: he supports clear duty but presses for shared local competence.
- Guild: he asks who gets trained when profitable routes shift.
- Archive: he asks whether written obligation includes actual people able to act.
- Veil: he respects distributed resilience but distrusts responsibility that cannot be named.

---

### Outcome B — **Hold Until It Is Safe**

The player backs Garrick's instinct to stay.

The party spends meaningful time while he personally secures the crossing and trains nobody beyond immediate instructions.

The crossing is safer **now**.

That is a legitimate result.

#### Garrick change

He feels vindicated but cannot avoid Perrin's question:

> “And when you leave tomorrow?”

#### Remembered outcome

`garrick_outcome_held_line`

#### Later callback

At camp, Garrick admits:

> “I know how to be useful for one bad night. I'm less certain what I'm teaching people for the morning after.”

#### Ending callback direction

He is more comfortable with **The Guarded Road** or another model with explicit responsibility, but the ending should keep the unresolved cost visible.

---

### Outcome C — **Close the Crossing**

The player decides the crossing is not worth the present risk.

This is not framed as cowardice.

People will walk farther. Supplies will cost more time. Nobody is asked to bleed for a route that cannot be maintained.

#### Garrick change

This is hardest for him because it asks him to admit that not every danger is his to absorb.

#### Remembered outcome

`garrick_outcome_closed_crossing`

#### Later callback

Garrick later says:

> “I keep thinking about the people taking the long way.”
>
> After a pause:
>
> “Then I think about the people who got home.”

#### Ending callback direction

Useful for any ending that openly acknowledges scarcity instead of promising every road can stay open.

---

# Resolution scene

Perrin gives Garrick the old pair of repaired socks.

Not as a joke gift.

As proof that time continued after the day Garrick froze in memory.

Perrin:

> “You keep remembering me bleeding. I keep remembering waking up.”
>
> “Those are not the same story.”

Garrick should not become suddenly healed.

He can answer differently by outcome:

### Shared Watch

> “No. I suppose they aren't.”

### Held Line

> “I still should have seen it coming.”

Perrin:

> “You still think seeing everything is your job.”

### Closed Crossing

> “I hated leaving it.”

Perrin:

> “Good. Means you understood the cost.”

---

# Declarative integration notes

Suggested conceptual hooks:

- `personal_arc.garrick.status`
- `personal_arc.garrick.outcome`:
  - `shared_watch`
  - `held_line`
  - `closed_crossing`
- memory:
  - `garrick_perrin_named`
  - `garrick_privacy_kept`
  - outcome memory
- possible party-bond reaction:
  - Brindle tends to support Shared Watch or Closed Crossing if the choice honestly names cost.
  - Mira may respect Shared Watch because it distributes agency.
  - Oren may appreciate explicit responsibility regardless of outcome.

Do not award a simple “best” Trust bonus to one ending.

The player's relationship with Garrick should respond more to **whether they take his fear seriously** than whether they pick the designer's preferred answer.
