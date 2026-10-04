# The Silent Tower

**Existing quest id:** `silent_tower`  
**Core identity:** recovery / lore  
**Primary NPC:** Sen Marrow  
**Primary site:** Moonmere Tower

## What this quest is about

The Moonmere chart is evidence that the current road network is not inevitable.

The tower quest should feel like recovering a physical argument from a place weather is slowly erasing.

The question is:

> **Who should be able to use old knowledge once recovering it makes that knowledge politically valuable again?**

---

# Scene 1 — Sen's offer: Before Damp Wins

Sen is surrounded by references to a chart he has not seen.

### Sen

> “Moonmere Tower had a regional chart.”
>
> “I know this because six other documents complain about it.”
>
> “This is the Archive's preferred form of certainty.”

He explains:

- chart predates several current toll/patrol arrangements;
- tower roof is failing;
- route notes may disappear with another season of damp;
- thieves may value the materials without understanding the content.

### Ask why it matters

> “Because people keep saying ‘there has never been another road’.”
>
> “I distrust sentences beginning with ‘there has never been.’”

### Refuse

> “Fine.”
>
> Sen pauses.
>
> “Not emotionally fine.”
>
> “Administratively fine.”

---

# Scene 2 — The approach: A Tower That Does Not Want Visitors

The tower should require practical preparation.

Existing routes allow rope or skill.

Add authored detail:

- collapsed stair;
- reeds hiding stable ground;
- old maintenance marks;
- star-shaped iron anchors set into stone.

### If rope used

Garrick:

> “Good rope.”
>
> Mira: “Say it louder. It likes praise.”

### If skill route used

Oren identifies an old repair mark.

Mira tests it before trusting it.

> Oren: “The mark means safe load.”
>
> Mira: “The wall has had ninety years to disagree.”

---

# Scene 3 — The upper archive: Cold lights and wet paper

The wisps/combat should not be random monsters guarding treasure.

Authored interpretation:

The lights gather around mineral dust and old lamp salts disturbed by entry.

Whether supernatural or environmental remains ambiguous.

Oren does not get definitive proof.

After danger passes, the chart is found wrapped badly but intentionally.

### Chart details

It contains:

- current roads under older names;
- seasonal crossings;
- ferry symbols at places no official ferry remains;
- annotations about spring versus dry-season routes;
- maintenance obligations assigned to communities that no longer exist.

### Oren

> “This is not a lost road.”
>
> “It's a lost argument about which roads mattered.”

---

# Complication — The chart is useful before it is archived

On the return route or at Candlemere, someone like Vesk, Mira or a local traveller can identify practical value in copying portions.

Sen wants preservation first.

He is not unreasonable.

### Sen

> “Every extra handling is another chance to tear it.”

### Mira

> “Every week in a drawer is another chance somebody needs a road they don't know exists.”

This creates the resolution trade-off.

---

# Outcome A — Original to Archive, controlled copying
**Canonical backbone:** `chart_to_archive`.

This can remain the default current outcome.

### Handover

Sen lays out dry cloth before accepting it.

> “No dramatic unrolling.”
>
> “History has suffered enough from dramatic unrolling.”

The player can push for:

- route copies for Wardens;
- public-facing copy for travellers;
- restricted copy while unsafe crossings are verified.

### Trade-off

**Benefit:** original preserved; information can be checked before sending people onto obsolete routes.

**Cost:** Archive controls pace/access.

### Sen

If player asks for broader access:

> “Good.”
>
> “Make me defend the restriction instead of assuming it.”

---

# Outcome B — Field copy before handover
**New authored sub-outcome for LR-0048, still ends with Archive custody.**

The party allows Vesk/Mira/local route users to copy selected practical lines first.

### Trade-off

**Benefit:** useful knowledge leaves the tower immediately and is not monopolised.

**Cost:** unverified old routes may be treated as current truth; fragile chart handled more.

### Oren

> “A copy can spread an error faster than an original can correct it.”

### Mira

> “A locked original can preserve an error beautifully.”

This outcome can influence campaign-revelation strength/tone without changing quest identity.

---

# Outcome C — Delay handover pending access terms
**Refusal/delay material.**

The player keeps the chart temporarily.

Sen is unhappy but can negotiate.

> “I asked you to recover it.”
>
> “I did not specify ‘become a mobile archive.’”
>
> Player: “Then tell us who gets to read it.”
>
> Sen pauses.
>
> “Annoyingly fair.”

The quest remains active until terms are settled.

This supports meaningful refusal without creating a random alternate faction recipient.

---

# Aftermath — The Chart Starts Arguments

The quest should visibly change how people talk about routes before the regional campaign asks the player to make a final political choice.

### Sen

After any successful recovery:

> “People keep asking whether the chart proves them right.”
>
> Sen smooths the copied edge.
>
> “It proves there were more choices than they remember.”

### Vesk

If shown a route copy:

> “Old landing's real.”
>
> “Bad bank, though.”
>
> He hands it back.
>
> “History doesn't improve the current.”

### Mira

> “Useful thing about old maps.”
>
> “They prove official people used to be wrong in different directions.”

### Oren

If the chart is full:

> “We can compare claims now.”

If partial/damaged:

> “We can compare some claims.”
>
> Mira: “Look at you, learning moderation.”

**Consequence intent:** recovered knowledge should create new questions, not instantly unlock every old road as safe or correct.

---

# Failure branch — Chart damaged

If later integration supports failed retrieval/delay:

The chart may be partially water-damaged.

Do not reduce it to “quest failed.”

Recovered fragments still prove:

- at least one old ferry;
- at least one alternate road name;
- enough to support a weaker campaign revelation.

Sen:

> “Incomplete is not nothing.”
>
> “Half an argument is still more honest than pretending nobody argued.”

This directly supports LR-0043's weaker-revelation fallback.

---

# Campaign callbacks

Support:

- Day 9–10 route-network revelation;
- Sen/Oren/Vesk/Mira callbacks;
- Archive faction offer;
- ending matrix chart evidence;
- Recorded Road/Common Road nuance.

## Declarative integration notes

Preserve canonical main outcome `chart_to_archive`.

Possible sub-state:

- chart full/partial;
- field copy made;
- access terms negotiated;
- handover delayed;
- revelation evidence strength.

No runtime or save implementation here.
