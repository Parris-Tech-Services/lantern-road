# Fever on the South Road

**Existing quest id:** `sealed_medicine`  
**Core identity:** delivery / timing  
**Primary NPCs:** Joric Pell, Yor Dane, Edda Briar, Nera Vale  
**Route:** Greyfen → Alderwatch

## What this quest is about

This is the campaign's clearest demonstration that time is a moral resource.

The crate should never feel like generic cargo.

The question is:

> **What does “urgent” mean when every road problem claims urgency and somebody else can offer a profitable reason to change destination?**

---

# Scene 1 — Joric's offer: The Time Is the Cargo

Joric has the sealed crate ready.

### Joric

> “Alderwatch needs medicine.”
>
> “Not ‘eventually needs.’”
>
> “Not ‘pays extra for.’”
>
> He taps the crate.
>
> “Needs.”

He explains:

- fever spreading through cramped quarters;
- Yor Dane sent exact quantities;
- normal Guild wagons are delayed;
- deadline is based on remaining stock, not prophecy.

### Ask what's inside

> “Enough that Yor asked me not to make him choose who gets the last dose.”

### Ask why the player

> “Because you have feet.”
>
> “Because you have weapons.”
>
> “Because right now those are more available than wagons.”

### Refuse

Joric does not moralise.

> “Then say no quickly.”
>
> “A fast no still leaves me time to find somebody slower.”

If refused, authored consequence may later show a substitute courier attempting the run.

---

# Scene 2 — The road south: Competing urgency

At least one authored complication should occur during the run.

Recommended scene:

A damaged cart blocks a narrow section.

Its driver carries food for a smaller settlement.

Moving it costs time.

### Choice A — help clear it

Costs time but restores route access for others.

Garrick:

> “If we leave it, the next wagon loses the same hour.”

### Choice B — manoeuvre around

Riskier / tiring but protects delivery time.

Mira:

> “We can solve their road after ours stops being on fire.”

### Choice C — ask driver to abandon load temporarily

Fastest for party, real cost to stranger.

No hidden morality score.

The driver may agree and resent it.

**Purpose:** time pressure becomes a choice involving people, not a countdown alone.

---

# Scene 3 — Nera's diversion offer

Only after the player understands the crate's purpose should the Ashen Veil offer appear.

Nera or a runner explains that another network also needs medicine.

Do not say “steal medicine for smugglers.”

### Nera

> “Alderwatch has walls, a quartermaster and people who can complain upward.”
>
> “There are marsh families with none of those.”

She offers coin because invisible needs do not have requisition forms.

### Player can ask whether all the crate would be diverted

Nera:

> “Enough to matter.”
>
> “That answer should bother you.”

This preserves the canonical diverted branch without making it cartoonishly evil.

---

# Outcome A — Delivered in time
**Canonical:** `delivered_in_time`.

### Arrival

Yor does not celebrate.

He breaks the seal and counts.

> “One, two, three…”

Only after the count:

> “Enough.”

Edda:

> “Beds?”
>
> Yor: “Still full.”
>
> “But we stop rationing by noon.”

### Joric later

> “That's what on time means.”
>
> “Nobody writes songs about stock arriving before the shelf goes empty.”

### Trade-off

The player spent time/resources to make the deadline.

Do not erase whatever they passed on the road.

---

# Outcome B — Late but useful
**Canonical:** `late_but_useful`.

The crate arrives after some stock ran out but while treatment still matters.

### Yor

> “Late.”
>
> He opens it anyway.
>
> “Useful.”
>
> He writes both words down.

### Edda

> “Do not let anyone call this failure.”
>
> “Do not let anyone call it on time.”

This should be one of the game's strongest examples of a non-binary outcome.

---

# Outcome C — Diverted
**Canonical:** `diverted`.

### Handover

Nera's people do not cheer.

A runner immediately splits the contents by destination.

Brindle sees labels being removed.

### Brindle

> “Who is waiting at the other end?”

Nera:

> “People.”
>
> Brindle: “Names.”
>
> Nera gives some.

Not all.

### Trade-off

**Benefit:** medicine reaches people formal routes may never serve; party receives meaningful coin/Veil favour.

**Cost:** Alderwatch's promised supply does not arrive; the player personally changes who gets priority.

### Alderwatch aftermath

Yor:

> “I already counted what didn't arrive.”

No melodramatic accusation required.

---

# Outcome D — Too late
**Canonical:** `too_late`.

Do not write:

> You failed.

Arrival scene:

Yor recognises the crate and closes his eyes briefly.

> “Bring it in.”
>
> Player may say: “It's too late.”
>
> Yor: “For yesterday.”
>
> “Not for tomorrow.”

Some harm already occurred.

The medicine remains useful if possible.

### Edda

> “We needed it sooner.”
>
> “We still need it now.”

This turns deadline failure into altered consequence rather than discarded content.

---

# Refusal / abandonment branch

If the player accepts then deliberately leaves the crate somewhere or refuses to continue:

Joric should later ask for a direct answer.

> “Did you lose it?”
>
> “Did somebody take it?”
>
> “Or did you decide it belonged somewhere else?”

The game should distinguish accident from choice where state permits.

---

# Campaign callbacks

Support:

- Alderwatch supply/ward state;
- Joric/Yor/Edda/Nera callbacks;
- Brindle personal themes;
- route-politics revelation;
- ending matrix medicine rows;
- Empty Crates Southbound event.

## Declarative integration notes

Preserve:

- `delivered_in_time`
- `late_but_useful`
- `diverted`
- `too_late`

Useful authored conditions:

- road complication choice;
- Nera offer seen/refused;
- deadline band at delivery;
- accepted-then-abandoned distinction;
- crate still carried after technical deadline.

Do not change actual time/balance values in this authoring task.
