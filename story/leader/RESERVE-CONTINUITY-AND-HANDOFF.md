# Reserve Companion Continuity & Integration Handoff

## Canonical rule

The active party is:

> **Leader + three active companions**

Garrick, Mira, Oren and Brindle remain available authored companions.

When all four are available, one can be a **reserve companion**.

Reserve status does not erase:

- Trust;
- personal-arc history;
- previous memories;
- relationship history;
- major public campaign knowledge.

---

# What a reserve companion knows

## They retain firsthand history

Anything they personally witnessed before entering reserve remains remembered.

Example:

Mira heard the Leader promise Rowan to clear the road.

If she becomes reserve afterward, she still remembers the promise.

## They can learn public outcomes

Major public consequences can plausibly reach reserve companions through:

- party debrief;
- settlement gossip;
- visible world changes;
- direct later conversation.

Example:

A reserve Oren can know that the Moonmere chart was recovered if the active party brings it back to Candlemere.

## They do not magically know private dialogue

A reserve companion should not know:

- a private promise made after they left;
- a secret whispered by Nera in a closed room;
- exact words of a camp conversation they missed;
- a lie told only to one NPC unless later revealed.

This prevents reserve characters from feeling omniscient.

---

# Rotation return greetings

A returning companion should acknowledge time away without punishing the player for party composition.

## Garrick returns

> “Anything break?”
>
> He looks at the party's gear.
>
> “Besides the obvious.”

If major crisis happened:

> “Start with what still needs doing.”

## Mira returns

> “I leave you alone for three roads and apparently everyone develops history.”

## Oren returns

> “I have received four versions of what happened.”
>
> “I assume all are wrong differently.”

## Brindle returns

> “You all look tired.”
>
> “Good. Means I can skip asking whether anything happened.”

---

# Background continuity in reserve

The reserve companion does not forget the Leader's chosen background.

Example, Road Hand Leader:

Returning Garrick:

> “Vesk says you argued with a ferryman about rope.”
>
> “So apparently the road hasn't changed you.”

Example, Archive-Taught:

Mira:

> “Oren tells me you've been correcting citations without me.”
>
> “I am hurt.”

These are flavour, not mechanical bonuses.

---

# Behaviour continuity in reserve

A reserve companion can learn **patterns** but not private evidence.

Example:

The Leader has become known for consulting the party.

Returning Brindle:

> “They say you've been asking people what they think.”
>
> “Dangerous habit.”
>
> She smiles.
>
> “Keep it.”

The line implies debrief/public knowledge.

---

# No reserve jealousy tax

Do not automatically reduce Trust because someone was reserve.

That would make roster rotation feel punitive and discourage using the system.

If a reserve companion is upset, it should come from an authored reason:

- personal quest urgency ignored;
- promise specifically made to them;
- major decision directly affected their values and they were excluded despite being available;
- repeated avoidance of them.

The player should not be punished simply for experimenting with party composition.

---

# Personal-quest urgency

If a reserve companion's personal quest becomes urgent:

- notify the player;
- give a plausible opportunity to rotate them in;
- do not silently fail the quest because they were reserve unless the player was clearly warned.

Storyteller authoring should support lines such as:

> Mira: “I know I wasn't travelling with you.”
>
> “This one is still mine.”

---

# Integration handoff

## LR-0090 — dialogue runtime

Needs to support:

- Leader chosen name;
- optional one background tag;
- background-conditioned dialogue options/nodes;
- specific remembered behaviour markers;
- active/reserve companion presence conditions;
- no private-memory leakage to absent companions.

## LR-0091 — direct companion pack

Should author:

- background-sensitive opening topics;
- reserve-return greetings;
- behaviour-pattern conversations;
- companion response to Leader name/background where natural.

## UI implementation

Should present background selection as compact and optional.

Recommended conceptual flow:

1. Leader name;
2. choose one background or **No Stated Background**;
3. one-sentence explanation that most identity will emerge through play.

Do not build:

- multiple-page biography;
- appearance editor solely because identity exists;
- mandatory faction selection;
- alignment questionnaire.

## Save/persistence

Actual storage/versioning belongs to LR-0011/LR-0090 integration.

This task only states the narrative contract.
