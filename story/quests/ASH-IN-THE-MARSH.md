# Ash in the Marsh

**Existing quest id:** `ash_in_marsh`  
**Core identity:** faction / investigation  
**Primary NPCs:** Edda Briar, Nera Vale, Iven Holt  
**Primary site:** Mosslight Ruins

## What this quest is about

Mosslight should turn a “mysterious green lights” rumour into a political problem made by real needs.

The Ashen Veil routes are useful because official systems fail some people.

They are dangerous because usefulness without accountability can protect abuse as easily as vulnerable travellers.

The question is:

> **When an unofficial system is carrying real need, do you legitimise it, expose it, document it or break it?**

---

# Scene 1 — Edda's offer: I Need Facts, Not Ghosts

Edda is looking at a marsh map covered in uncertain marks.

### Edda

> “My scouts say green lights.”
>
> “Half the town says spirits.”
>
> “The other half says smugglers.”
>
> She hands the map over.
>
> “I can plan around smugglers.”

### Ask what she wants

> “Names if you can get them.”
>
> “Routes.”
>
> “What they're moving.”
>
> “And whether sending Wardens in makes anything better.”

That last line matters.

Edda is not asking for automatic suppression.

### Refuse

> “Fine.”
>
> “Then if you hear somebody call it ghosts, tell them ghosts have excellent logistics.”

---

# Scene 2 — Entering Mosslight: The lights are instructions

The green lights are route signals.

At least three meanings:

- safe water depth;
- patrol absent;
- cargo waiting.

Black candles indicate a route temporarily closed.

### Mira

> “Not haunting.”
>
> “Scheduling.”

### Oren

> “An undocumented signalling standard.”
>
> Mira: “You found a way to make crime sound employable.”

### Complication

The party sees actual cargo:

- medicine;
- letters;
- lamp oil;
- one crate whose contents are clearly less sympathetic contraband.

Do not make every shipment noble.

That is the point.

---

# Scene 3 — Nera / Mosslight runners

Nera or a local runner explains:

- some people use Mosslight because inspections delay vital goods;
- some use it to avoid lawful seizure;
- some Wardens quietly tolerate specific crossings;
- some Veil brokers profit from dependency.

### Nera

> “You want a clean answer?”
>
> She gestures toward the marsh.
>
> “Wrong terrain.”

### Garrick

> “People with medicine don't excuse the people moving knives.”

### Nera

> “No.”
>
> “And knives don't make medicine imaginary.”

This should be the quest's thesis.

---

# Decision preparation — Gather enough facts

Before the final choice, allow the player to ask:

- who runs which route;
- what percentage is medicine/letters versus contraband;
- whether the Wardens have seized legitimate cargo;
- whether the Veil has punished abusive runners.

Answers should remain incomplete.

The player is choosing under uncertainty.

---

# Outcome A — Expose Mosslight to the Wardens
**Canonical:** `exposed_to_wardens`.

### Evidence handover

Edda asks:

> “Can I act on this without guessing?”

The player provides names/routes.

### Trade-off

**Benefit:** dangerous/illegal activity becomes targetable; patrols can intervene; accountability has a named authority.

**Cost:** useful unofficial routes close or become risky, including some used by people failed by formal systems.

### Edda

> “I'll target stores and armed routes first.”
>
> “I am not promising nobody innocent gets squeezed.”
>
> “I am promising I know that's a failure, not collateral vocabulary.”

### Nera aftermath

> “Three routes went dark.”
>
> “One deserved to.”
>
> “Remember the other two when somebody calls this clean.”

---

# Outcome B — Broker with the Ashen Veil
**Canonical:** `brokered_with_veil`.

The party seeks a concrete compact:

- no Warden medicine stores targeted;
- no predatory tolling on designated need routes;
- Mosslight keeps alternative crossings;
- no public admission required.

### Trade-off

**Benefit:** practical access stays alive; violence/seizures may fall; medicine/letters continue.

**Cost:** relies on informal enforcement and Nera's network; abuses may remain hard to expose.

### Nera

> “You want rules.”
>
> “We already have rules.”
>
> Garrick: “Rules nobody can see aren't much comfort.”
>
> Nera: “Neither are visible rules nobody follows.”

### Edda aftermath

> “I know there's an arrangement.”
>
> “I also know two medical bundles arrived yesterday.”
>
> “Do not make me call that approval.”

---

# Outcome C — Record Mosslight as evidence
**Canonical:** `recorded_as_evidence`.

The party takes a sigil/routes/evidence to Holt.

### Trade-off

**Benefit:** makes the network impossible to dismiss as superstition and creates a durable basis for future decisions.

**Cost:** records can expose routes/users without immediately providing a better alternative.

### Holt

> “Evidence is not an action.”
>
> “Good.”
>
> “People forget that and then blame paper for their decisions.”

He asks how sensitive route details should be treated.

Possible sub-choice:

- full record;
- sealed route specifics;
- public summary + restricted names.

### Nera

If she learns:

> “You put the marsh in a filing cabinet.”
>
> Mira: “Only the part that fits.”
>
> Nera: “That's exactly what worries me.”

---

# Violence branch — Break the circle

Existing gameplay allows combat.

It should not accidentally become a fourth clean political solution.

If violence happens:

- party can still later report to Edda or Holt;
- some evidence is lost;
- Veil standing suffers;
- the route network disperses rather than vanishes.

### After fight

> The green lights go out one by one.
>
> The marsh does not become empty.
>
> It becomes harder to read.

This is a **partial outcome**, not “Mosslight solved.”

LR-0048 can map subsequent turn-in to one of the canonical institutional outcomes with altered tone.

---

# Refusal branch — Walk away after parley

The player may decide they lack enough knowledge.

Nera:

> “Good.”
>
> “Anyone who understands this place in one conversation is selling something.”

Edda later:

> “Not enough?”
>
> Player can say:
>
> - “Not enough to send people in.”
> - “Not enough to defend them either.”
> - “We need another route through the facts.”

Quest remains active.

This makes caution authored rather than incomplete.

---

# Campaign callbacks

Support:

- route-risk changes;
- Alderwatch/Blacksalt social state;
- Edda/Nera/Holt recurring dialogue;
- Mira/Oren/Garrick party reactions;
- ending matrix Mosslight row;
- Reed Signs After Rain event.

## Declarative integration notes

Preserve canonical outcomes:

- `exposed_to_wardens`
- `brokered_with_veil`
- `recorded_as_evidence`

Potential authored state:

- cargo composition observed;
- route details learned;
- parley/refusal;
- violence occurred;
- evidence completeness;
- record access terms.

No runtime implementation here.
