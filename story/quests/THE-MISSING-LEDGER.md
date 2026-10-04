# The Missing Ledger

**Existing quest id:** `missing_ledger`  
**Core identity:** investigation / intrigue  
**Primary NPCs:** Oswin Marris, Nera Vale, Iven Holt  
**Primary sites:** Broken Span, Redwater Ferry, Smuggler's Cache

## What this quest is about

The ledger matters because it is evidence with multiple legitimate and self-interested claimants.

It should reveal that information can control roads as effectively as a gate.

The core choice is:

> **Who should control dangerous evidence when every custodian has reasons to use it?**

---

# Scene 1 — Oswin's offer: A Book People Are Afraid Of

Oswin has already searched his desk twice.

He knows the ledger is not there.

### Oswin

> “A ledger vanished.”
>
> “Please resist the natural urge to become excited.”
>
> He folds his hands.
>
> “It contains payments, exemptions, inspection delays and names belonging to people who prefer their names in smaller books.”

### Ask what it proves

> “Proves?”
>
> Oswin's smile thins.
>
> “It records.”
>
> “People start using the word *proof* when they want a document to choose sides for them.”

### Ask who might want it

He names no one first.

> “Guild rivals.”
>
> “Wardens.”
>
> “The Archive.”
>
> “People whose routes are more profitable when nobody knows they exist.”
>
> “And, regrettably, honest people.”

### Refuse

> “Sensibly done.”
>
> “If you reconsider, the danger will still be extremely documented.”

---

# Scene 2 — Broken Span: Chalk That Is Not Graffiti

The chalk marks should form a small investigation rather than instant directions.

Clues:

- route notches repeated under the bridge;
- rope fibres matching ferry moorings;
- a Guild inspection symbol altered by one stroke;
- one mark only visible when rain darkens the stone.

### Mira

> “People hide messages by making them look like things nobody respects.”

### Oren with keen lens

> “The alterations are consistent.”
>
> Mira: “You mean somebody has handwriting.”
>
> Oren: “That is an offensive simplification.”
>
> “Yes.”

### Complication

The clue points south, but not straight to “smugglers did it.”

At Redwater Ferry, similar tally cuts show the ledger changed hands.

Vesk can provide a quest-specific line:

> “Didn't see a book.”
>
> “Saw three people trying very hard to look like nobody carrying one.”

---

# Scene 3 — The cache: Dry Paper in a Wet Place

When the cache opens, the ledger should feel mundane.

Bound leather. Damp smell. Tight figures.

No glowing plot object.

### Oren

> “This could ruin people.”

### Mira

> “Paper usually needs help.”

### What the party can learn

A short inspection reveals three uncomfortable facts:

1. some Guild payments are legitimate maintenance costs;
2. some “expediting fees” clearly buy preferential inspection;
3. some unofficial routes exist because formal delays made ordinary movement impossible.

This is crucial.

The ledger must not prove “Guild evil.”

It proves incentives have shaped which roads work for whom.

---

# Decision scene

The player should be able to speak with claimants before final handover.

## Oswin's argument — Return it to the Gilt Caravan Guild

> “The book was stolen from us.”
>
> “That remains true even if you dislike what is written in it.”

He argues:

- private accounts include innocent names;
- release could collapse working contracts;
- internal corrections are possible;
- theft should not become public-interest policy.

He is self-serving **and** not entirely wrong.

## Nera's argument — Give it to the Ashen Veil

> “You think putting it in an official building makes it neutral?”
>
> “It makes the building stronger.”

She argues:

- vulnerable route users will be exposed if authorities get names;
- the Guild will bury leverage;
- the Veil can protect witnesses;
- secrecy can prevent retaliation.

She is self-serving **and** not entirely wrong.

## Holt's argument — Archive it as evidence

> “I cannot promise the record will produce justice.”
>
> “I can promise fewer people will be able to pretend the record never existed.”

He argues:

- chain of custody matters;
- copies and access rules can protect some names;
- durable evidence limits revision;
- the Archive itself must accept scrutiny.

He is institutional **and** not neutral.

---

# Outcome A — Return to Guild
**Canonical:** `returned_to_guild`.

### Trade-off

**Benefit:** respects ownership, restores working commercial records, avoids uncontrolled exposure.

**Cost:** the institution most embarrassed by the evidence regains control over it.

### Oswin turn-in

He checks the spine before the pages.

> “Still intact.”
>
> Mira: “Touching reunion.”

Oswin pays.

Before the party leaves:

> “For what it is worth, I do intend to fix some of what is in here.”
>
> Player:
>
> - “That isn't worth much yet.”
> - “Then make it worth something.”
> - “I didn't return it because I trust you.”

All valid.

---

# Outcome B — Give to Ashen Veil
**Canonical:** `buried_by_veil`.

### Trade-off

**Benefit:** vulnerable names and unofficial-route users stay outside immediate institutional reach.

**Cost:** evidence becomes dependent on an unaccountable network that may selectively use or suppress it.

### Nera handover

She does not open the ledger.

> “You expected me to check?”
>
> “If it's fake, somebody spent an extraordinary amount of effort disappointing me.”

She wraps it.

> “It will stop being one book.”
>
> Oren: “Copies?”
>
> Nera: “Something like survival.”

---

# Outcome C — Archive as evidence
**Canonical:** `archived_as_evidence`.

### Trade-off

**Benefit:** evidence survives in durable custody and becomes harder for one faction to erase.

**Cost:** official records can expose people who survived precisely by remaining unofficial.

### Holt handover

Holt asks the party to state where it was recovered.

Mira interrupts:

> “Before names go into anything, tell us who can read it.”

Holt pauses.

This should produce a short access-negotiation choice.

- broad scholarly access;
- restricted sensitive names;
- sealed names with route/payment data public.

Exact mechanical consequences can be later design work.

### Holt

> “Good.”
>
> “Evidence rules are more useful when someone argues before the filing cabinet closes.”

---

# Non-ideal branch — Read, copy, delay

The player may hold the ledger while deciding.

That delay should be authored.

### First delay callback

Oswin:

> “You have had enough time to become principled.”
>
> “I was hoping for decisive.”

### Nera

> “Keeping it is also a choice.”
>
> “Mostly a choice to become the person everyone visits.”

### Pressure

No arbitrary instant punishment.

Instead:

- inspection attention rises;
- NPCs ask;
- the party must carry the risk.

---

# Failure / loss branch

If future LR-0048 supports losing the ledger after recovery, do not simply fail the quest with “item missing.”

Authored result:

> The cache is open.
>
> The wrapping is there.
>
> The ledger is not.

The party can still report:

- where it was;
- what they saw;
- who knew;
- any copied evidence.

Outcome becomes **evidence without custody**, not zero content.

This can feed the Fractured March ending as unresolved accountability.

---

# Campaign callbacks

Support:

- Greyfen service/attitude changes;
- Oswin/Nera/Holt recurring callbacks;
- faction-pressure dialogue;
- ending matrix ledger row;
- Oren/Mira themes about evidence and secrecy.

## Declarative integration notes

Preserve existing canonical outcomes.

Potential authored state:

- ledger inspected/not inspected;
- sensitive names noted;
- access terms negotiated;
- decision delayed;
- ledger lost after recovery;
- claimant conversations seen.

No runtime implementation here.
