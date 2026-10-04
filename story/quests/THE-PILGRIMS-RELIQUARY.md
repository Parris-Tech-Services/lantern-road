# The Pilgrim's Reliquary

**Existing quest id:** `pilgrim_reliquary`  
**Core identity:** ruin / moral choice  
**Primary NPCs:** Sister Elira, Alwen Reed, Archive representatives  
**Primary site:** Saint Rhel's Shrine

## What this quest is about

A small holy object matters differently to different people.

The choice should not be “faith versus science.”

It is:

> **Does preserving an object mean protecting it from the people and place that gave it meaning, or does leaving it in place accept preventable risk?**

---

# Scene 1 — Elira's request: Small Things Get Taken First

Elira is replacing a shrine wick when she asks.

### Elira

> “Looters have started taking silver from the old road shrines.”
>
> “Not because the silver is especially valuable.”
>
> “Because small places have nobody standing beside them.”

She describes Saint Rhel's reliquary:

- saint-bone fragment;
- modest silver case;
- carried between roadside communities generations ago;
- later hidden when raiding worsened.

### Ask whether it is miraculous

> “No miracle I can certify.”
>
> “It has mostly persuaded tired people to stop walking for five minutes.”

### Ask why not leave it hidden

> “Because somebody already found the outer marks.”
>
> “Hidden is a condition, not a guarantee.”

### Refuse

> “Then do not go out of guilt.”
>
> “Guilt is poor company on a wet road.”

---

# Scene 2 — Saint Rhel's Shrine: The Hidden Way

The hidden chamber should require attention to how people used the shrine.

Clues:

- soot pattern where many hands shielded lamps;
- prayer notch worn smooth at shoulder height;
- a draft behind stone;
- wax drips leading nowhere obvious.

### Brindle

If she finds the catch:

> “Somebody prayed here often enough to wear the stone.”
>
> Oren: “That is evidence.”
>
> Brindle: “Careful. You'll make it sound respectable.”

If lantern oil reveals it:

> Mira: “So the sacred mystery was better lighting.”
>
> Brindle: “Most mysteries improve with better lighting.”

---

# Scene 3 — The chamber

The reliquary is not alone.

Inside:

- wax stubs;
- a pilgrim token;
- scratched names;
- one later note warning: **Candlemere asked twice. We said no twice.**

This complicates Archive custody before anyone argues for it.

### Oren

> “That could mean many things.”

### Brindle

> “It means at least one thing.”
>
> “Someone thought keeping it here was a decision worth recording.”

---

# Complication — Alwen's account

Before final custody, Alwen Reed can explain why Candlemere wants it.

The Archive has better preservation.

The road shrine has suffered theft attempts.

### Alwen

> “If you ask whether the Archive can keep silver drier than a roadside niche, yes.”
>
> “If you ask whether that settles ownership, no.”

This prevents Elira from being the only “local faith” voice.

---

# Outcome A — Return to Saint Rhel's Shrine
**Canonical:** `returned_to_shrine`.

### Trade-off

**Benefit:** restores the object to the community/place that gave it meaning and keeps pilgrimage living rather than curated.

**Cost:** accepts physical risk and future theft.

### Elira turn-in

She unwraps it, then wraps it again.

> “I thought I would want to see it.”
>
> “Apparently I wanted to know it could come home.”

She does **not** put it on display immediately.

> “We'll decide how to keep it.”
>
> “Home does not have to mean careless.”

### Brindle

If Trust is high:

> “Thank you for not confusing holy with invulnerable.”

---

# Outcome B — Archive it in Candlemere
**Canonical:** `archived`.

### Trade-off

**Benefit:** strong preservation, documentation and controlled access.

**Cost:** removes the object from the road and from people who understand it through use rather than study.

### Archive handover

Holt or Sen asks whether Elira consented.

The player can answer honestly.

If she did not:

> Holt: “Then the custody is lawful only in the least interesting sense.”
>
> “Write that down.”

This line preserves nuance.

### Elira aftermath

When told:

> “Safe?”
>
> The player confirms.
>
> “Good.”
>
> She trims the shrine lamp.
>
> “I am allowed to be glad and unhappy in the same minute.”

---

# Non-ideal branch — Leave it in the chamber

The player can decide neither claimant has made the case.

This should not count as completion immediately unless LR-0048 chooses to formalise a refusal outcome.

Authored scene:

> Brindle wraps the reliquary and places it back.
>
> “Hidden is still a choice.”
>
> Oren: “And temporary.”
>
> Mira: “Most choices are.”

Later:

- looter pressure may increase;
- the party can return;
- Elira accepts “not yet” but reminds them time exists.

---

# Failure branch — Chamber disturbed before recovery

If later integration supports time-sensitive looting:

The party returns to find:

- pried stone;
- wax crushed under boots;
- reliquary gone;
- one dropped piece of silver wire.

The quest becomes investigation / loss rather than silent failure.

Elira:

> “Then we look for the person.”
>
> “The object is not more important because we failed to protect it.”

This can become a partial unresolved ending callback.

---

# Campaign callbacks

Support:

- Hearthwick/Saint Rhel social change;
- Elira/Alwen callbacks;
- Archive custody theme;
- Brindle ending dialogue;
- ending matrix distinction between shrine and Archive.

## Declarative integration notes

Preserve canonical outcomes:

- `returned_to_shrine`
- `archived`

Optional authored state:

- chamber note read;
- Alwen consulted;
- custody delayed;
- reliquary lost before recovery.

No runtime changes here.
