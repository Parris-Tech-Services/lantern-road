# Lantern Road — Evolving Rumour Network

**Task:** LR-0100 — Author evolving rumour network and settlement gossip pack  
**Owner:** Agent 2 — The Storyteller  
**Status:** Authoring only. Runtime/state integration belongs to later dialogue/consequence work.

## Purpose

“Hear rumours” should feel like listening to a changing Grey March.

The current game already has 22 useful rumour seeds. This pack does not discard them. It gives them:

- settlement context;
- pre/post outcome variants;
- source character;
- reliability;
- faction bias where appropriate;
- repeat-safe follow-ups;
- late-campaign reinterpretations.

A rumour is not merely a quest marker.

It can also show:

- what ordinary people think happened;
- which faction is shaping the story;
- how quickly truth changes in transit;
- what the party's choices look like from outside.

## Reliability tags

These are authoring metadata, not player-facing labels unless later UI deliberately exposes source confidence.

### RELIABLE

The core factual claim is strong enough to guide action.

Use for:

- route warnings;
- known quest hooks;
- public settlement conditions;
- clearly observed aftermath.

### LIKELY

Mostly grounded, with uncertain detail.

Useful for:

- route activity;
- second-hand timing;
- partial faction information.

### BIASED

Facts are present, but the speaker's interpretation strongly serves a faction or personal interest.

A BIASED rumour must not make essential navigation unfair.

### HEARSAY

Unverified social information.

Use for:

- motives;
- exaggeration;
- social consequence;
- local speculation.

Do not hide a required quest destination behind deliberately false hearsay.

### LOCAL COLOUR

No gameplay-critical fact is being conveyed.

Use to make settlements feel lived in.

## Source tags

Suggested source identities:

- inn table;
- caravan driver;
- ferryman;
- pilgrim;
- Warden off duty;
- Guild clerk;
- Archive copyist;
- Veil runner;
- market seller;
- dock worker;
- traveller;
- child;
- local elder.

Named NPCs may deliver rumours, but LR-0045 still owns their broader recurring-dialogue voice.

## Repeat behaviour

A topic should not loop forever.

### First hearing

Full rumour text.

### Repeat, unchanged state

Short reference:

> “Still no word from the south.”

or:

> “Same story. Different mouth.”

### Changed state

Replace the old rumour with a consequence variant.

Example:

Before:

> “Lanterns are moving by the Weeping Stones.”

After bargain:

> “Funny thing. The lanterns stopped, but one of the men who carried them is apparently loading flour in Hearthwick now.”

After violence:

> “Road's open. Nobody goes near the ditch by the third stone.”

### Exhausted fallback

If the player has heard all currently eligible meaningful rumours, do **not** repeat the oldest quest hook as though new.

Use local fallback:

> “Nothing new. Which is suspicious enough around here.”

or a harmless local-colour line.

## Critical fairness rule

Rumours can be wrong about:

- motive;
- blame;
- numbers;
- who deserves credit;
- whether an institution is trustworthy.

Rumours should remain dependable enough about:

- where a known site roughly is;
- whether a public road is closed;
- whether a major settlement is in crisis;
- whether a quest-giver publicly asked for help.

The player should feel socially uncertain, not mechanically cheated.

## Declarative metadata

Later integration may map each rumour to:

- `settlement`
- `source_type`
- `reliability`
- `topic`
- `campaign_phase`
- quest stage/outcome condition
- faction-standing condition
- world consequence condition
- heard/not-heard state
- supersedes prior rumour id
- repeat fallback id

Do not create a separate persistence system. LR-0090/LR-0005/LR-0008 should consume shared state.

## Files

- `HEARTHWICK.md`
- `GREYFEN.md`
- `CANDLEMERE.md`
- `ALDERWATCH.md`
- `BLACKSALT.md`
- `ROAD-AND-INN-FALLBACKS.md`
