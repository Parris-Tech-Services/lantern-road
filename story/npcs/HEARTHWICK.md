# Hearthwick — Recurring NPC Dialogue

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

## Callback A — Old road restored by bargain

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

## Callback B — Old road restored by force

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

## Callback C — High Warden standing

**Condition intent**

- Wardens of the Green March standing strongly positive.
- Do not play immediately after a quest turn-in if a more specific callback is available.

> Rowan lowers his voice.
>
> “The Wardens listen when your name is attached to a report now.”
>
> “Use that carefully. Small places can get crushed under help almost as easily as neglect.”

## Callback D — Low Warden standing

> “Crow's people asked whether I was still letting you use the south room.”
>
> Rowan meets your eyes.
>
> “I told them Hearthwick is not a barracks.”
>
> “Do not make me regret enjoying that sentence.”

## Callback E — Garrick personal arc: Shared Watch

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

Observant, dry and socially generous without being soft.

Tessa rarely says “I heard a rumour.” She tells you who arrived wet, who paid badly and who stopped speaking when a name came up.

## Motive

Keep the inn busy enough that Hearthwick remains a place people choose to stop.

## Callback A — Road safe

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

## Callback B — Road still unsafe / delayed resolution

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

## Callback C — Good Gilt Caravan Guild standing

> “Oswin's factors have stopped pretending they don't know your name.”
>
> Tessa slides over a bowl.
>
> “That can mean respect.”
>
> “It can also mean paperwork is coming.”

## Callback D — Bad Gilt Caravan Guild standing

> “Guild people are paying cash here instead of putting things on account.”
>
> She raises an eyebrow.
>
> “They only get that formal when they're nervous.”

## Callback E — Mira old-name outcome

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

Gentle, concrete and difficult to bully.

Elira speaks plainly about grief and belief. She avoids polished moral slogans.

## Motive

Keep the shrine useful to ordinary travellers, not merely symbolically important.

## Callback A — Reliquary returned to Saint Rhel's Shrine

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

## Callback B — Reliquary archived in Candlemere

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

## Callback C — Brindle personal arc completed

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

## Callback D — low Warden standing

> “The Wardens are angry with you.”
>
> Elira lights the second lamp.
>
> “That is not proof you are wrong.”
>
> “It is also not proof you are brave.”

**Purpose**

Keeps Elira from becoming a faction mouthpiece.
