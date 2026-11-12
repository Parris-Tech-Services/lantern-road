# Lantern Road — Voice Bible

**Status:** Draft for Josh's approval. Inferred from existing canon; no canon name, place, faction or character has been renamed.
**Owner:** Agent 2 — The Storyteller. **Final creative authority:** Josh.
**Task:** LR-0155. **Companion machine-readable file:** [`voice.json`](../voice.json).
**Canon boundary:** existing names, map ids/co-ordinates, faction names, character identities and established outcomes are fixed. New material must fit this guide; it may not silently rewrite canon.

---

## 0. What this game is

A compact frontier road campaign: four travellers, one contested road, and a region where every settlement is one bad season from becoming a ruin.

The player is the **Leader** in the party, not an external controller. The story is about what leadership costs when the road is small enough that every choice has a name attached.

### Pillars

1. **The road is a relationship, not a corridor.** Travel changes people, prices, rumours and access. Revisiting is the point.
2. **Choices leave visible marks.** A number changing behind the UI is not a consequence. Somebody must say, charge, close, open or remember it.
3. **The party are people, not stat blocks.** They can disagree, refuse, counter-offer and remember how they were led. High Trust is not obedience.
4. **Phone-first, not phone-shrunk.** Short paragraphs, readable type, thumb-reachable choices, no lore dumps.
5. **Warmth without softness.** The Grey March is dangerous and often funny. It is not grimdark, and it is not whimsical.

### What it is not

- Not a chosen-one prophecy.
- Not a grimdark misery parade.
- Not a generic fantasy kingdom with the names changed.
- Not a power fantasy where companions become equipment.
- Not a lore wiki with a game attached.

---

## 1. The room

| Role | Owns | Does not touch |
| --- | --- | --- |
| **Showrunner (Josh)** | premise, tone, final canon, fun | — |
| **Worldsmith (code)** | names, places, trades, quirks, premise draws | prose |
| **Voice writer** | narration and dialogue in this style | names, facts, canon |
| **Quest writer** | offer, complication, decision, aftermath, non-ideal branch | naming grammar |
| **Continuity editor** | registry, map canon, callbacks, contradictions | new canon without approval |
| **Contrarian** | cuts clichés, stock beats and purple prose | facts |

The room is small on purpose. The model may propose; the showrunner decides.

---

## 2. House style

### Point of view and tense

- **Player-facing narration:** second person, present tense, close to the Leader's senses.
- **NPC dialogue:** first person, in the character's own register.
- **Camp/companion scenes:** close third or second person, whichever keeps the Leader present.
- **No omniscient narrator** explaining the theme.

### Rhythm

- Short paragraphs. One beat per paragraph.
- Vary sentence length; do not write every line as a punchy fragment.
- Dialogue carries action. A silence, a refusal or a price is a beat.
- End scenes on a concrete action, a cost or a question the player can act on — not a summary.

### Texture

- Name the exact object: the cracked bell clapper, the onion budget, the wet ledger, the spare bandage.
- Prefer work, weather, money, food and tiredness to abstract atmosphere.
- One odd, specific detail per scene is worth more than three poetic ones.
- Humour is dry, local and character-specific. One joke per scene is usually enough.
- Violence has aftermath: injury, expense, fear, repair, blame. Do not linger on gore.
- Grief is practical before it is lyrical.

### What to avoid

- “Not X — it's Y” chains, tricolon stacks, rhetorical question + answer, signposted conclusions.
- “Little did they know”, “the air was thick with”, “a shiver ran down”, “palpable”, “tapestry”, “testament”, “delve”.
- Explaining the theme in dialogue.
- Every NPC being quippy, mysterious or secretly important.
- Names that sound like generic fantasy rather than Grey March work.

The enforced list lives in `voice.json` (`avoid`, `banned_words`, `banned_phrases`) and is checked by the quality tooling. Do not recite a long banlist to the model; state what to do.

---

## 3. Naming grammar

The Grey March sounds like a wet English/Welsh border that has been worked for centuries: short given names, landscape/craft surnames, and places named for what they do or what happened there.

### Given names

- One or two syllables, usually.
- Soft or clipped consonants; endings in **-a, -en, -in, -y, -k, -d, -r**.
- Avoid the current model defaults: Elara, Elias, Kael, Lyra, Aria, Seraphina, Thorne, Cassian, Isolde, Nova. **Mara Kett is existing canon**; do not create a second, unrelated Mara.
- A name should sound speakable by a tired ferryman, not chosen from a fantasy name generator.

### Surnames

- Landscape, craft, trade or a family known for one thing: Pike, Reed, Marris, Crow, Pell, Marrow, Holt, Briar, Lark, Dane, Vale, Harran.
- **One family, one surname.** Do not give unrelated people the same surname.
- Reed is a family name shared by Tessa, Alwen and Tobin; treat that as a family, not a coincidence.

### Places

- Compound of a head + a tail: Alder + watch, Black + salt, Candle + mere, Grey + fen, Hearth + wick.
- Tails describe a function or landform: watch, salt, mere, fen, wick, ford, stead, cross, market, gate, reach, holm.
- Every place needs a reason to exist: a crossing, a salt pan, a lamp-oil depot, a ferry landing, a ledger office, a shrine on stilts.
- Existing map names and ids are protected. New places require a map-canon task; this guide does not authorise one.

### Reserved canon

Mira Quickstep, Oren Thale, Mara Kett, Garrick Vale, Sister Brindle, Rowan Pike, Tessa Reed, Sister Elira, Oswin Marris, Halden Crow, Joric Pell, Sen Marrow, Iven Holt, Alwen Reed, Edda Briar, Fen Lark, Yor Dane, Nera Vale, Tobin Reed and Vesk Harran are **reserved**. Do not rename them. Do not give a new core character the same name.

The full list and ownership status are in [`docs/NAME-REGISTRY.md`](NAME-REGISTRY.md) and `voice.json`.

### New names

New core names come from `voice.json` via the seedable generator, not from a model's first suggestion. A human approves the draw. The model receives the chosen name as a fixed fact.

---

## 4. How the cast speaks

| Tier | Pattern | Tic / habit | Never says |
| --- | --- | --- | --- |
| **Leader** | Plain, direct, asks for specifics; the player's own words | — | A pre-written personality |
| **Garrick** | Short declaratives; duty, weight, protection | States the cost after accepting it | A speech about honour |
| **Mira** | Quick, dry, deflecting with accuracy | Answers the real question one beat late | A straight confessional answer on demand |
| **Oren** | Precise, curious, qualifies claims | Turns “I don't know” into a careful paragraph | A confident answer he has not checked |
| **Brindle** | Gentle, penetrating, practical mercy | Asks the question people are avoiding | A sermon |
| **Rowan** | Obligations, logistics, tired restraint | Asks what changed and who is responsible | Flattery |
| **Tessa** | Arrivals, absences, prices, gossip | Reports a social fact like a military report | “I heard a rumour” |
| **Elira** | What people carry home; small holy things | Lets a silence do the work | A lecture on faith |
| **Crowd** | Functional, local, brief | One concrete want or worry | A lore dump |

### Sample lines

**Garrick**
> “I can.”
>
> He does not take the bandage.

**Mira**
> “You need a route, a lie spotted, or an opinion you'll ignore?”

**Oren**
> “That is not the same thing as evidence.”

**Brindle**
> “You don't have to explain it tonight.”

**Rowan**
> “What changed, who is responsible, and can the village plan around it?”

**Tessa**
> “More boots. More mud. Better problem.”

**Elira**
> “People carry home what they cannot say on the road.”

---

## 5. Dialogue rules

A choice is worth offering only if changing it changes at least one of:

- information;
- relationship or Trust;
- commitment or promise;
- future availability;
- remembered tone;
- immediate action;
- interpretation of the same action.

If three options produce the same paragraph and the same consequence, they are not three choices.

- Three or four options; explicit leave.
- Exact intent, not tone labels alone.
- Repeat visits get repeat-safe lines, not the first-meeting speech again.
- Companions are persuadable, not programmable.
- A guarded companion is harder to draw out; a proud companion resists help; a bold companion pushes for action. Behaviour comes from character, not a random obstruction roll.
- No invisible persuasion check decides a person's core boundary.

---

## 6. Quest shape

Every core quest has:

1. **Offer** — a person with a want, not a quest board.
2. **Complication** — a cost, a contradiction or a second claimant.
3. **Decision** — a choice with at least two viable routes.
4. **Aftermath** — a visible change in a place, price, service, route, faction or relationship.
5. **Non-ideal branch** — failure or compromise produces content, not a reload.
6. **Callback** — a return line, an epilogue line or a changed world state.

Key truths need at least two independent routes. A clue that can only be found one way is a lock, not a mystery.

---

## 7. Slop and quality rules

Write toward:

- the exact object, not the mood;
- the specific person, not “the villagers”;
- one concrete consequence, not a promise of significance;
- an action the player can take, not a summary of what they learned;
- a line that could only belong to this character, in this place, with this history.

Quality gates for new material:

- No banned word/phrase from `voice.json` unless deliberate.
- Median `slop_lint` score at most 5; no new player-facing file above 15.
- Blind speaker test: three characters are distinguishable with names removed.
- Every new name is in the registry and approved by the showrunner.
- No new canon place, faction or map id.
- Every quest has an aftermath and at least one callback.
- A human editor reads it aloud before merge.

---

## 8. Samples and anti-samples

**Good — concrete, warm, dry:**

> Tessa wipes an already-clean mug.
>
> “Three merchants turned around yesterday.”
>
> “One blamed bandits. One blamed weather.”
>
> “The third said he didn't care which story was true if both stories cost him a wheel.”

**Good — consequence, not explanation:**

> “The carts are back.”
>
> Rowan's relief does not reach the word *back*.
>
> “So are two families asking whether the men you drove off have brothers.”

**Anti-sample — generic:**

> The tension in the room was palpable as the weight of the decision settled over them, a tapestry of hope and fear.

Why it fails: no object, no person, no cost; it tells the reader what to feel.

---

## 9. Canon change process

1. The showrunner proposes a change.
2. The continuity editor checks map canon, save keys, actor keys and prior prose.
3. A dedicated task records the change and its migration.
4. The registry is updated before new prose uses the name.
5. No agent renames a reserved character as part of an unrelated task.

For a rename that affects persisted ids or save keys, a migration task is mandatory. For a prose-only epithet, record it as an alias, not a replacement.

---

## 10. Provenance

- **Derived from existing canon:** Hearthwick NPC voice notes, companion packs, dialogue-choice grammar, representative conversations, Player-Leader contract, terminology and product vision.
- **Inferred for this draft:** the compact phrasing of the style rules, the naming grammar, the sample/anti-sample pair and the quality gates.
- **Not decided by this document:** Josh's final approval of tone, any rename, any new canon place or faction, and any runtime change.
