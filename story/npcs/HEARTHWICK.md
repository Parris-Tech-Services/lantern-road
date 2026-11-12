# Hearthwick: Recurring NPC Dialogue

Hearthwick should feel like the place that notices whether the road is becoming livable.

Its three recurring voices are deliberately different:

- **Rowan Pike** thinks in obligations.
- **Tessa Reed** thinks in arrivals, absences and gossip.
- **Sister Elira** thinks in what people carry home.

---

# Rowan Pike
**Role:** Mayor of Hearthwick  
**Faction:** Wardens of the Green March

## Voice

Practical, restrained and visibly tired of promises made from elsewhere.

Rowan rarely gives a speech. He asks what changed, who is responsible and whether the village can plan around it.

He does not flatter the party for renown.

## Motive

Keep Hearthwick connected without turning it into somebody else's outpost.

## Callback A: Old road restored by bargain

**Condition intent**

- `lantern_road` resolved by bargain / non-bloody dispersal.
- First return to Rowan after resolution.

**First-return line**

> Rowan looks past you toward the road before he looks at you.
>
> “Three carts came through before noon.”
>
> “Nobody lost a horse. Nobody lost a person.”
>
> He folds his arms.
>
> “I still don't like relying on the good sense of people who were hanging false lanterns last week.”
>
> “But the road is moving.”

**Repeat line**

> “Your bargain is still holding.”
>
> Rowan glances toward the gate.
>
> “I am trying not to sound surprised.”

**Purpose**

Acknowledges peace without pretending it is guaranteed.

## Callback B: Old road restored by force

**Condition intent**

- `lantern_road` resolved by combat / crew driven off.

**First-return line**

> “The carts are back.”
>
> Rowan's relief does not reach the word *back*.
>
> “So are two families asking whether the men you drove off have brothers.”
>
> He exhales through his nose.
>
> “Safe road. New problem. That's usually how this works.”

**Repeat line**

> “Traffic's steady.”
>
> “So far.”

## Callback C: High Warden standing

**Condition intent**

- Wardens of the Green March standing strongly positive.
- Do not play immediately after a quest turn-in if a more specific callback is available.

> Rowan lowers his voice.
>
> “The Wardens listen when your name is attached to a report now.”
>
> “Use that carefully. Small places can get crushed under help almost as easily as neglect.”

## Callback D: Low Warden standing

> “Crow's people asked whether I was still letting you use the south room.”
>
> Rowan meets your eyes.
>
> “I told them Hearthwick is not a barracks.”
>
> “Do not make me regret enjoying that sentence.”

## Callback E: Garrick personal arc: Shared Watch

**Condition intent**

- Garrick personal outcome `shared_watch`.

> Rowan watches Garrick delegate a repair check to two villagers instead of doing it himself.
>
> “That's new.”
>
> Garrick: “Don't make a festival of it.”
>
> Rowan: “Wouldn't dream of it. Banners are expensive.”

**Purpose**

Shows Garrick's change outside his own quest.

---

# Tessa Reed
**Role:** Innkeeper  
**Faction:** Gilt Caravan Guild

## Voice

Observant and dry; generous without being soft.

Tessa rarely says “I heard a rumour.” She tells you who arrived wet, who paid badly and who stopped speaking when a name came up.

## Motive

Keep the inn busy enough that Hearthwick remains a place people choose to stop.

## Callback A: Road safe

**Condition intent**

- old road marked safe;
- first return after consequence becomes active.

> “I had to put the second stew pot on.”
>
> Tessa says it as though this is a military report.
>
> “Two weeks ago I was cutting onions thinner.”
>
> She nods toward the road.
>
> “Whatever you did out there, it has an onion budget now.”

**Repeat line**

> “More boots. More mud. Better problem.”

## Callback B: Road still unsafe / delayed resolution

**Condition intent**

- early/mid campaign;
- lantern problem unresolved after several days.

> Tessa wipes an already-clean mug.
>
> “Three merchants turned around yesterday.”
>
> “One blamed bandits. One blamed weather.”
>
> “The third said he didn't care which story was true if both stories cost him a wheel.”

## Callback C: Good Gilt Caravan Guild standing

> “Oswin's factors have stopped pretending they don't know your name.”
>
> Tessa slides over a bowl.
>
> “That can mean respect.”
>
> “It can also mean paperwork is coming.”

## Callback D: Bad Gilt Caravan Guild standing

> “Guild people are paying cash here instead of putting things on account.”
>
> She raises an eyebrow.
>
> “They only get that formal when they're nervous.”

## Callback E: Mira old-name outcome

### Mira publicly tells the truth

> Tessa sets down Mira's drink.
>
> “Venn or Quickstep?”
>
> Mira goes still.
>
> Tessa shrugs.
>
> “I asked what to put on the slate. Not who you were allowed to be.”

### Mira buries the old name

> Tessa glances at a traveller watching Mira too closely.
>
> “That woman has been Quickstep every time she's paid me.”
>
> “Far as my books are concerned, that's a very long time.”

**Purpose**

A social callback that supports Mira without claiming to resolve her identity.

---

# Sister Elira
**Role:** Road Priest  
**Faction:** Wardens of the Green March

## Voice

Gentle and concrete; difficult to bully.

Elira speaks plainly about grief and belief. She avoids polished moral slogans.

## Motive

Keep the shrine useful to ordinary travellers, not merely symbolically important.

## Callback A: Reliquary returned to Saint Rhel's Shrine

> Elira is replacing lamp oil when you arrive.
>
> “Someone left three copper pieces this morning.”
>
> “Someone else left half a pear.”
>
> She smiles.
>
> “Apparently Saint Rhel is accepting mixed currency again.”

**Repeat line**

> “People stop longer now.”
>
> “Not because the relic is powerful.”
>
> “Because somebody brought it home.”

## Callback B: Reliquary archived in Candlemere

> “I hear they have the reliquary behind good glass.”
>
> Elira says it without bitterness.
>
> “Good glass is useful.”
>
> She trims the wick.
>
> “So is a road people can still reach.”

**Repeat line**

> “Preserved is a good word.”
>
> “It simply isn't every good word.”

## Callback C: Brindle personal arc completed

**Any outcome**

> Elira notices Brindle's altered prayer text.
>
> “You changed the line.”
>
> Brindle: “I needed a line I could still say.”
>
> Elira nods.
>
> “Then keep that one until it stops being true.”

### If Brindle chose the child

> Elira later says, “Mercy given to one person does not become theft from everyone else simply because you remember them.”

### If Brindle chose the scout

> “Saving the person who can reopen a road is still saving a person.”
>
> “Just don't let usefulness become holiness.”

### If Brindle chose the pilgrims

> “People with no strategic value are still people.”
>
> “You would be surprised how often institutions need reminding.”

## Callback D: low Warden standing

> “The Wardens are angry with you.”
>
> Elira lights the second lamp.
>
> “That is not proof you are wrong.”
>
> “It is also not proof you are brave.”

**Purpose**

Keeps Elira from becoming a faction mouthpiece.

---

# Major-NPC depth pack (LR-0157)

This section fills the fields the existing callbacks do not state explicitly. It is authoring material, not a runtime script. Existing canon names and outcomes are fixed; faction identities stay as they are.

## Rowan Pike: full model

### Identity and place

- **Name:** Rowan Pike.
- **Role:** Mayor of Hearthwick.
- **Faction:** Wardens of the Green March.
- **Place:** Hearthwick; his working life is split between the gate road, the mayor's office and the inn.
- **Status:** Respected locally, but not powerful outside the village. He can convene people; he cannot command the Wardens.

### Speech style

Plain and procedural, with a dry edge. He asks what changed and who is responsible; whether the village can plan around it comes next. He uses short sentences when tired and longer ones only when explaining a constraint. He does not make speeches.

### Routine

- Morning: gate road, cart count, repair list.
- Midday: petitions and arguments in the village.
- Evening: inn or office; he prefers the inn when he needs to hear people who would not come to the office.
- After the old road is secured: he walks part of it himself before breakfast.

### Motives, fears and limits

- **Wants:** keep Hearthwick connected without becoming somebody else's outpost.
- **Fears:** a safe road that attracts worse attention; being blamed for a decision made elsewhere; becoming a ceremonial mayor while real choices happen in Warden rooms.
- **Capabilities:** can authorise village space, call the local militia, vouch for the party, and make village labour available.
- **Limits:** no authority over Warden command, no treasury for large operations, no combat skill, no power to promise outside aid.
- **What he notices first:** mud on boots, the number of carts, and who is missing from the usual gate group.

### Knowledge boundaries

- **Public:** the road, village obligations, Warden patrol habits, who is struggling for labour.
- **Private:** which families are one bad season from leaving; which promises he has already broken.
- **Unknown:** Veil routes, the Archive's internal politics, Mira's old name, what the false-lantern crew intended beyond the road.
- **Stance to the player:** guarded while the party is only useful; steady once they keep a local promise; warming when they accept a cost he cannot repay.

### Taboo topics and tone changes

- **Taboo:** asking him to speak for all Wardens; calling villagers cowards; promising outside help he cannot guarantee.
- **Tone changes:** mention families or children and he becomes quieter and more precise. Praise the Wardens as an abstraction and he becomes clipped. Call Hearthwick “just a village” and he stops being polite.
- **Exit conditions:** he ends a conversation when the logistics are settled, when asked to speculate about Warden politics, or when a family needs him at the gate.

### First meeting

**Entry choices (exact intent):**

- **ASK: “What changed on the road?”** → he gives the latest practical fact and one cost.
- **PROBE: “Who is responsible?”** → he names a responsibility only if he has evidence; otherwise he refuses to guess.
- **COMMIT: “What does Hearthwick need from us?”** → he names one concrete need and what he can offer in return.

> The mayor is checking a gate hinge with his thumb when you approach.
>
> “You're the ones who came in by the south road.”
>
> He lets the hinge go.
>
> “What changed out there?”

### Return states

**Old road safe, by bargain**

> “Three carts before noon. Nobody lost a horse.”
>
> He looks at the gate.
>
> “I still don't like relying on the good sense of people who were hanging false lanterns last week.”
>
> “But the road is moving.”

**Old road safe, by force**

> “Traffic's back.”
>
> His relief does not reach the word *back*.
>
> “So are two families asking whether the men you drove off have brothers.”
>
> “Safe road. New problem.”

**Medicine outcome: delivered**

> “The ward got its medicine.”
>
> He says it like a fact he has checked twice.
>
> “Alderwatch will remember. Hearthwick will remember that we did not have to send anyone else.”

**Medicine outcome: diverted or too late**

> “The medicine never reached the ward.”
>
> He does not raise his voice.
>
> “I have four families asking whether the road is worth the promises made on it.”
>
> “Do not answer quickly.”

### Repeat-safe lines

- “What changed since we last spoke?”
- “The gate is still here. So is the list.”
- “If you have a practical answer, I will hear it. If you have a speech, Tessa's inside.”

## Tessa Reed: full model

### Identity and place

- **Name:** Tessa Reed.
- **Role:** Innkeeper.
- **Faction:** Gilt Caravan Guild.
- **Place:** Hearthwick; the inn is her workplace, her social intelligence network and her prison on busy nights.
- **Status:** Well liked, not deferential. She knows who pays, who lies and who is sleeping where.

### Speech style

Observant and dry; generous without being soft. She reports a social fact like a military report. She rarely says “I heard a rumour”; she says who arrived wet, who paid badly and who stopped speaking when a name came up.

### Routine

- Morning: orders, pots, yesterday's slate.
- Midday: the common room and the market traffic.
- Evening: arrivals, food, the delicate work of seating enemies apart.
- Late: the slate, the locked door and the one conversation she has been waiting all day to have.

### Motives, fears and limits

- **Wants:** keep the inn busy enough that Hearthwick remains a place people choose to stop.
- **Fears:** a guest harmed under her roof; debt she cannot trade her way out of; being treated as only an innkeeper.
- **Capabilities:** feed and lodge the party, extend limited credit, hear what travellers say, introduce people, refuse service.
- **Limits:** no faction authority, no fighter's training, cannot leave the inn for long, cannot protect a guest from the road.
- **What she notices first:** wet cloaks, who eats quickly, who pays in odd coin, who stops talking when a name comes up.

### Knowledge boundaries

- **Public:** arrivals, prices, who is hiring, which road stories are current.
- **Private:** who is sleeping where; which guest is hiding; which local debt is about to break.
- **Unknown:** Veil routes, Archive catalogues, what Mira's old name means to the people who use it.
- **Stance to the player:** professionally warm by default; warmer when they treat staff well; cold and formal when they make her choose between a guest and a convenience.

### Taboo topics and tone changes

- **Taboo:** asking her to betray a guest's confidence; calling her a gossip; suggesting her work is easy.
- **Tone changes:** cruelty to staff or travellers makes her polite and cold. A genuine thank-you makes her give you a better table and a worse price. A threat to a guest makes her stop performing hospitality.
- **Exit conditions:** she ends a conversation when a customer is waiting, when a guest's secret is pressed, or when someone insults the inn.

### First meeting

**Entry choices (exact intent):**

- **ASK: “Who came through this week?”** → she gives one useful arrival and one odd detail.
- **PROBE: “What are you not saying?”** → she tests whether you are asking for safety or for gossip.
- **OFFER: “What does the inn need?”** → she names a practical favour and what she will trade for it.

> Tessa is cutting bread into pieces that are almost but not quite even.
>
> “You're the party from the south road.”
>
> She points the knife at a chair.
>
> “Sit. You look like a rumour.”

### Return states

**Old road safe**

> “I had to put the second stew pot on.”
>
> She says it like a military report.
>
> “Two weeks ago I was cutting onions thinner.”
>
> “Whatever you did, it has an onion budget now.”

**Medicine delivered**

> “The ward sent a boy for broth.”
>
> She lifts the lid.
>
> “That's the first time this month somebody asked me for food instead of a price.”

**Medicine diverted**

> “The ward sent nobody.”
>
> She wipes the counter.
>
> “Alderwatch is close enough to hear bad news. It is not close enough to make it convenient.”

### Repeat-safe lines

- “More boots. More mud. Better problem.”
- “If you're here for gossip, buy something first.”
- “You can have the corner table. The corner table has opinions.”

## Sister Elira: full model

### Identity and place

- **Name:** Sister Elira.
- **Role:** Road Priest.
- **Faction:** Wardens of the Green March.
- **Place:** Hearthwick and Saint Rhel's Shrine; the road is part of her parish.
- **Status:** Moral authority without political command. People bring her what they cannot say elsewhere.

### Speech style

Gentle and concrete; difficult to bully. She speaks plainly about grief and belief. She avoids polished moral slogans and lets a silence do work.

### Routine

- Dawn: lamps, water, the shrine step.
- Day: travellers, the sick, the ones who need a rite or a reason to keep walking.
- Evening: the inn, the gate or the shrine, depending on who is avoiding whom.
- Night: the lamp that is kept for anyone still on the road.

### Motives, fears and limits

- **Wants:** keep the shrine useful to ordinary travellers, not merely symbolically important.
- **Fears:** the reliquary becoming an asset; being asked to bless a choice she cannot bless; an empty shrine with a full ledger.
- **Capabilities:** steady the frightened, tend wounds, perform rites, read what people carry, refuse to give a false absolution.
- **Limits:** no faction command, little money, no power to undo a decision, no authority over the Archive or the Wardens.
- **What she notices first:** hands, what people carry, and whether the lamp oil has been refilled.

### Knowledge boundaries

- **Public:** shrine customs, who is sick, which families are in mourning, Brindle's prayer changes.
- **Private:** what people confess; which pilgrim is not telling the truth about why they came.
- **Unknown:** Archive politics, Veil routes, the full history of the reliquary, Mira's old name.
- **Stance to the player:** courteous by default; warmer when they bring someone home; precise and distant when they treat the shrine as a tool.

### Taboo topics and tone changes

- **Taboo:** using the reliquary as a bargaining chip; debating faith for sport; asking her to choose a faction on the spot.
- **Tone changes:** cruelty dressed as doctrine makes her precise, not angry. A child in need makes her leave the conversation without apology. Dismissing the shrine as superstition makes her stop offering the gentle version.
- **Exit conditions:** she ends a conversation when someone needs a rite, when the reliquary is treated as an asset, or when the question is only a test.

### First meeting

**Entry choices (exact intent):**

- **ASK: “Who left the pear?”** → she gives a small human answer and one thing it reveals about the road.
- **SUPPORT: “What does the shrine need?”** → she names a practical need and a limit on what she will accept.
- **CHALLENGE: “Does the reliquary belong here?”** → she answers with a condition, not a slogan.

> Elira is trimming a wick that does not need trimming.
>
> “You can put that down.”
>
> She means the pack, not the question.
>
> “You don't have to carry it into the shrine.”

### Return states

**Reliquary returned**

> “Someone left three copper pieces this morning.”
>
> “Someone else left half a pear.”
>
> She smiles.
>
> “Apparently Saint Rhel is accepting mixed currency again.”

**Reliquary archived**

> “I hear they have it behind good glass.”
>
> She says it without bitterness.
>
> “Good glass is useful.”
>
> “So is a road people can still reach.”

**Medicine delivered**

> “The ward is quieter.”
>
> She refills the lamp.
>
> “Not peaceful. Quieter.”
>
> “There is a difference, and the difference has names.”

### Repeat-safe lines

- “People stop longer now. Not because the relic is powerful. Because somebody brought it home.”
- “You can ask the difficult question. You cannot demand a convenient answer.”
- “The lamp is for anyone still on the road. That includes you.”

---

## Cross-NPC scene: The Onion Budget

**Where:** the Hearthwick inn, evening.
**When:** after the party has resolved the old road and at least heard about the medicine run.
**Purpose:** show Rowan and Tessa as people with different jurisdictions; give the Leader a small consequential entry choice.

Tessa is counting onions on the counter. Rowan stands in the doorway with his hat in his hand, which means he has already been standing there too long.

> **Tessa:** “Three carts. Two paid on time. One paid in clipped coin.”
>
> **Rowan:** “Did you take it?”
>
> **Tessa:** “I weighed it. That's not the same as trusting it.”
>
> **Rowan:** “The ward at Alderwatch is still short.”
>
> **Tessa:** “Then send them onions. Onions don't need an escort.”

Rowan looks at the party.

> “She's not wrong.”
>
> Tessa, without looking up:
>
> “Write that down. He admits it once a season.”

**Leader entry choices (exact intent):**

- **ASK: “What happened to the medicine?”** → Tessa gives the local version; Rowan gives the Warden version; the difference matters.
- **OFFER: “We can carry a crate to Alderwatch.”** → Rowan accepts only if the party names a realistic departure; Tessa records the favour and the cost.
- **STAY OUT: “I'll leave you to the onions.”** → they continue; Tessa later mentions the argument to the player, and Rowan does not.

**If medicine was delivered:** Tessa puts an extra pot on. Rowan does not say thank you in front of the room; he finds the Leader at the gate later and says it once.

**If medicine was diverted or too late:** Tessa counts the clipped coin again. Rowan asks who knew and when. Neither raises their voice. The room gets quieter around them.

**Consequence intent:** the scene changes the player's information, the Rowan/Tessa relationship, and whether the Leader is trusted with the next local problem. It does not change base prices or quest outcomes.

---

## Blind speaker check

Names removed; each line should identify the speaker from voice and attention alone.

1. “What changed, and who is paying for it?”
2. “You're wet, you're late, and you're not eating standing up.”
3. “You can put that down. You don't have to carry it into the shrine.”

Expected: 1 Rowan, 2 Tessa, 3 Elira. If a reader cannot distinguish them, the voice is not yet specific enough.
