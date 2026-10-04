# Sister Brindle — What the Lamp Asks

## Character question

> **Can mercy remain mercy when there is not enough help for everyone at once?**

Brindle is good at giving comfort.

Her fear is not that faith is false.

It is that she may use compassionate language to avoid making choices that still leave somebody hurting.

Her arc should force a limited-resource decision where every option helps a real person and abandons another need for a time.

## Entry requirements

Declarative intent:

- Brindle Trust at least **Trusting** or equivalent threshold.
- Memory `brindle_unanswered_prayer`.
- Strongest after the medicine run or another visible scarcity consequence.
- Ideal window: days 6–15.
- Can proceed whether the medicine run succeeded or failed.

## Backstory

Brindle once travelled with a small Lamp-house relief circuit.

The rule she learned was simple:

> **Do not ask whether someone deserves care. Ask what care is possible.**

She still believes that.

The problem is that “possible” becomes cruel when there are three needs and supplies for one.

At **Saint Rhel's Shrine**, Sister Elira has received three requests before worsening weather:

1. a fevered child in an isolated farmstead;
2. an injured Warden scout who knows a safe route through flooded ground;
3. an elderly pilgrim group stranded with little food and one failing lantern.

There is only enough treated lamp-oil and medicine for one immediate journey before dark.

Waiting until morning may be safe for two of the groups.

Nobody knows which two.

This is not a puzzle with a hidden correct answer.

---

# Beat 1 — Brindle Does Not Finish the Prayer

At the shrine, Brindle begins the familiar road prayer.

She stops at:

> “Carry light where it is most needed.”

Then:

> “That is a very easy line to say when the road only points one way.”

Elira does not rescue her with doctrine.

Elira:

> “Then choose a road.”

## Player choices before the final choice

### Ask Brindle what she wants

She says:

> “I want enough.”

This is the most honest answer.

### Ask what the Lamp teaches

Brindle:

> “That every person has worth.”
>
> “It is less specific about inventory.”

### Tell her the player will choose

She is relieved for one second, then ashamed of the relief.

That reaction should matter.

---

# Beat 2 — Hear the Three Cases

Each request gets one short human detail.

## The child

The messenger is the child's older sister.

She has ridden too fast and keeps apologising for the horse.

## The scout

The scout is Fen Lark or another established Warden contact if available.

Their route knowledge could help many travellers tomorrow.

Saving the scout has a clear instrumental benefit, which makes the choice morally uncomfortable rather than obviously selfish.

## The pilgrims

They are not symbolically holy.

They are tired people.

One has a bad cough. One keeps trying to relight a lantern with wet hands.

Helping them will not unlock strategic advantage.

That is why the option matters.

---

# Beat 3 — The Allocation

The player chooses who receives immediate aid.

Brindle must participate in the choice.

If the player says “you decide,” she refuses:

> “No. You don't get to make my conscience into a hiding place for yours.”

That line is important.

The player can still ask her judgement, but responsibility remains shared.

---

# Final choice

## Outcome A — **Go to the Child**

### Benefit

Immediate aid goes to the person with the least agency and most uncertain condition.

### Cost

The scout and pilgrims wait.

If later conditions worsen, the game should acknowledge that the player could not know.

### Brindle response

She does not call it the compassionate choice.

> “It was a compassionate choice.”
>
> “That is different.”

### Remembered outcome

`brindle_outcome_child`

### Later callback

Brindle becomes more comfortable naming partial mercy:

> “We helped one person. We did not therefore help everyone.”

---

## Outcome B — **Go to the Scout**

### Benefit

The scout's survival or recovery may keep a safe route usable for many people.

### Cost

The choice explicitly values downstream benefit over the most immediately vulnerable request.

Brindle should struggle with this without condemning it.

### Remembered outcome

`brindle_outcome_scout`

### Later callback

Especially relevant to **The Guarded Road** or **The Gilded Road**:

> “Saving the person who keeps the road open can be mercy.”
>
> “It can also become a very convenient sentence.”

---

## Outcome C — **Go to the Pilgrims**

### Benefit

The party helps people whose need has almost no strategic leverage.

### Cost

The decision cannot be justified by route efficiency, evidence or political return.

### Remembered outcome

`brindle_outcome_pilgrims`

### Later callback

Brindle remembers this choice when the campaign finale reduces people to route categories.

> “Somebody has to remember the people who are bad arguments.”

---

# Complication and non-ideal outcomes

The other two groups should not automatically die.

That would turn uncertainty into punishment and create a hidden optimal answer.

Instead, later callbacks can vary:

- one group made it through the night;
- a neighbour intervened;
- the weather broke;
- the delay caused lasting harm;
- help arrived late;
- the outcome remains unknown before the finale.

The important consequence is **Brindle's relationship to choosing**, not a designer scoring the player.

If one delayed group suffers, the text should not say “you chose wrong.”

It should say what happened.

---

# Resolution — A Smaller Prayer

Back at the shrine, Brindle rewrites the unfinished line in her own travel book.

Original:

> Carry light where it is most needed.

New:

> Carry the light you have. Name the road you could not take.

She does not claim this is new doctrine.

It is what she needs to remember.

## Player response

### “That sounds less certain.”

Brindle:

> “Yes.”

She smiles.

> “I trust it more.”

### “You still helped someone.”

Brindle:

> “Yes. And I will not use them to erase the others.”

### Say nothing

She closes the book.

> “Thank you.”

---

# Campaign and ending callbacks

## Gilded Road

Brindle asks who becomes invisible when aid follows freight efficiency.

## Guarded Road

She accepts emergency prioritisation but insists that people denied priority be named and revisited.

## Recorded Road

She values visible obligations but asks how undocumented need enters the record.

## Many Roads

She values access but distrusts mercy that depends on knowing the right broker.

## Common Road

Strong resonance:

> “A shared burden is still a burden. At least fewer people can pretend they did not choose.”

## Fractured March

She focuses on local mercy that survived even when regional agreement did not.

---

# Party callbacks

## Garrick

He understands triage as responsibility but may default too quickly toward saving whoever protects others.

## Mira

She notices how “efficiency” can become a story powerful people tell about whose delay is acceptable.

## Oren

He wants criteria.

Brindle challenges him:

> “Criteria can help us choose.”
>
> “They cannot make the person we did not choose disappear.”

---

# Declarative integration notes

Suggested conceptual hooks:

- `personal_arc.brindle.status`
- `personal_arc.brindle.outcome`:
  - `child`
  - `scout`
  - `pilgrims`
- memories:
  - `brindle_three_requests`
  - `brindle_shared_choice`
  - outcome memory
- optional later callback state:
  - delayed-group aftermaths authored separately at integration time

Do not implement a hidden morality score based on which group receives aid.

The arc succeeds if the player remembers the cost and Brindle becomes more willing to name it.
