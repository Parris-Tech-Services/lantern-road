# Oren Thale — The Unfinished Page

## Character question

> **What is a correct decision worth if the person harmed by it never agreed that the cost was acceptable?**

Oren's arc should challenge his instinct to turn pain into an argument he can eventually solve.

He is not guilty because scholarship is bad.

He is guilty because he once treated uncertainty as a reason to make a clean decision quickly, then spent years refining the explanation instead of facing the person who lived with it.

## Entry requirements

Declarative intent:

- Oren Trust at least **Trusting** or equivalent threshold.
- Memory `oren_burned_page`.
- Strongest after the player has interacted with Candlemere, Moonmere or an Archive-facing quest.
- Ideal window: days 7–15.

## Backstory

The scorched page comes from an Archive field report concerning **Hollowglass Cavern**.

Years earlier, Oren was part of a small survey team studying unstable mineral panes that held old route markings.

A local guide named **Mara Kett** warned that the cavern's ringing changed before a collapse.

The senior archivist dismissed the warning as folklore.

Oren disagreed privately, but the evidence he could document was incomplete.

When the team had to choose between abandoning weeks of work or entering one final chamber, Oren recommended continuing.

The chamber failed.

Mara survived with a permanent hand injury that ended her work as a rope guide.

Oren's report described the event accurately.

It also described his recommendation as “reasonable under available evidence.”

That sentence has become the thing he cannot forgive.

The arc is not about proving he was secretly reckless.

The painful truth is that his recommendation **was** reasonable.

Someone was still hurt.

---

# Beat 1 — The Page Opens

Oren finally lets the player read the scorched report.

The important line:

> **Proceeding remains justified under available evidence.**

Underneath it, in different handwriting:

> **Available to whom?**

Oren says he does not know who wrote that.

He knows who he hopes did.

## Player choices

### Ask about Mara

He explains the accident plainly, without self-pity.

### Ask why he kept the page

> “Because destroying evidence of cowardice would be an unusually efficient form of cowardice.”

### Tell him the recommendation may still have been reasonable

Oren:

> “Yes.”
>
> “That is the part I am having trouble with.”

This should establish that the arc is not solved by absolution.

---

# Beat 2 — Mara Kett

Mara now repairs fine instruments and ferry hardware around Greyfen.

Her injured hand is visible but not treated as her whole identity.

She remembers Oren immediately.

Mara:

> “You finally ran out of footnotes?”

She is not waiting to forgive him.

She is not consumed by anger either.

She wants the Archive's copy of the report changed because it treats her warning as anecdotal colour rather than field knowledge.

## The conflict

The Archive can amend the report in three ways:

1. **Retraction:** Oren can state that his recommendation was wrong.
2. **Supplement:** preserve the original decision but formally add Mara's warning and later evidence.
3. **No amendment:** leave the record untouched and create a new independent account.

Each has a cost.

### Retraction cost

It may be emotionally satisfying, but it rewrites what Oren actually knew at the time.

### Supplement cost

It preserves uncomfortable ambiguity and makes the record more honest, but it leaves the original “reasonable” recommendation intact.

### Independent account cost

It refuses to let the Archive decide the final form of truth, but future readers may treat the official report as primary anyway.

---

# Beat 3 — Candlemere Hearing

This should be a small record-review scene, not a courtroom drama.

Sen Marrow or Iven Holt can facilitate.

Mara refuses to let Oren speak for her.

Oren must answer one question:

> “Do you want the record to prove you were wrong, or do you want it to show what happened?”

That question should determine the final choice.

---

# Final choice

## Outcome A — **Retract the Recommendation**

Oren formally writes:

> “My recommendation to proceed was wrong.”

### Benefit

The record clearly names responsibility.

Mara says the sentence matters because institutions rarely state harm that plainly.

### Cost

Oren simplifies history in a way he would condemn in another scholar.

The evidence genuinely was incomplete.

### Remembered outcome

`oren_outcome_retracted`

### Later callback

Oren becomes less likely to hide behind “reasonable at the time,” but may overcorrect toward self-blame.

Ending line direction:

> Oren supports systems that name responsibility clearly, even when he worries clarity can become another kind of distortion.

---

## Outcome B — **Amend the Record**

The original report remains.

Mara's warning, the sensory signs she observed, the later collapse evidence and the human outcome become part of the same official record.

Oren adds:

> “The recommendation was reasonable under the evidence we chose to recognise.”

### Benefit

This is the most epistemically honest option.

It changes what counts as evidence.

### Cost

It gives neither Oren nor Mara a clean moral sentence.

Mara:

> “Good. Clean sentences are how this happened.”

### Remembered outcome

`oren_outcome_amended`

### Later callback

Especially strong with **The Recorded Road** or **The Common Road**.

Oren can argue that records must remain revisable by people who were previously treated as sources rather than participants.

---

## Outcome C — **Give Mara the Page**

Oren withdraws his request to amend the Archive copy.

He gives Mara his personal scorched copy and helps her produce an independent account under her own name.

### Benefit

Mara owns the account instead of appearing as a correction inside Oren's story.

### Cost

The official Archive record remains flawed unless future pressure changes it.

Oren accepts that preserving truth does not require the Archive to own every truthful document.

### Remembered outcome

`oren_outcome_mara_account`

### Later callback

Strong resonance with **The Many Roads** and **The Common Road**.

In an Archive-heavy ending, Oren should explicitly worry about which account future officials will cite.

---

# Resolution

Mara asks Oren whether he is going to keep carrying the folded page.

Response varies:

### Retracted

Oren keeps it.

> “Apparently I still have things to learn from a sentence I no longer endorse.”

### Amended

He unfolds it flat for the first time.

### Mara Account

He gives it away.

Later, the empty inside pocket bothers him.

That should be shown as loss, not instant relief.

---

# Party callbacks

## Brindle

She should resist cheap absolution.

> “Forgiveness and accuracy are different needs.”

## Mira

She immediately understands the danger of official records treating unofficial expertise as anecdote.

## Garrick

He focuses on responsibility:

> “What changes for the next person in the cave?”

This can push Oren away from purely retrospective guilt.

---

# Declarative integration notes

Suggested conceptual hooks:

- `personal_arc.oren.status`
- `personal_arc.oren.outcome`:
  - `retracted`
  - `amended`
  - `mara_account`
- memories:
  - `oren_mara_named`
  - `oren_report_read`
  - outcome memory
- optional ending callback flags:
  - `archive_record_retracted`
  - `archive_record_amended`
  - `mara_independent_account`

No outcome is “Oren learns scholarship is bad.”

The arc should deepen his responsibility as a scholar, not remove the thing that makes him Oren.
