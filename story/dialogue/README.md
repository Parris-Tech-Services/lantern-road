# Lantern Road — Player-Leader & Consequential Dialogue Framework

**Task:** LR-0088  
**Owner:** Agent 2 — The Storyteller  
**Status:** Authoring only. This task does not modify runtime, save state or the current four-member combat roster.

## Why this exists

Lantern Road already has four persistent heroes with Trust, memories, bonds and decision reactions.

What it currently lacks is a strong player-facing answer to:

> **Who am I in this conversation?**

The player should not feel like an invisible cursor selecting orders for four unrelated units.

The authored answer is:

> **The player is the Leader of the party: an in-world social role whose words, promises, suggestions and decisions are heard and remembered.**

“Leader” is intentionally a role, not a fixed biography.

This authoring task does **not** decide that the Leader is:

- a fifth combatant;
- one of Garrick, Mira, Oren or Brindle;
- a custom avatar;
- a specific gender, appearance, age, class or voice;
- mechanically superior to the party.

Those are larger implementation/product decisions and should not be smuggled into Storyteller prose.

The dialogue framework works regardless of whether later implementation represents the Leader as a portrait, a named protagonist, a light-touch player identity, or an embodied member of the four-person roster.

## Files

- `PLAYER-LEADER-ROLE.md`
- `DIALOGUE-CHOICE-GRAMMAR.md`
- `COMPANION-AUTONOMY-AND-MEMORY.md`
- `REPRESENTATIVE-CONVERSATIONS.md`

## Core promise

A good Lantern Road conversation should make at least one of these true:

- the player learns something they could not learn from the map;
- the player reveals what kind of Leader they are becoming;
- a party member agrees, hesitates, refuses or changes the proposal;
- an NPC remembers what the party previously said or did;
- a promise creates a later obligation;
- a lie creates a later risk;
- a disagreement changes Trust, relationship tone or later dialogue;
- a previous topic is acknowledged rather than repeated from the beginning.

If none of those happen, the choice probably does not need to exist.

## Relationship to existing tasks

LR-0088 is **not** a parallel dialogue engine.

It is authored input for later work:

- LR-0037 — hero personal quests;
- LR-0038 — living NPC dialogue and recurring relationship depth;
- LR-0048 — enriched core quest integration;
- LR-0008 — campaign conversations and finale;
- future UI work may consume the choice labels, topic states and repeat-conversation rules.

LR-0045 owns broad recurring NPC callback prose. LR-0088 owns **player intent, conversation structure, companion autonomy and memory behaviour**.

## Canonical terminology

Use:

- **Leader** — the player-facing in-fiction role in dialogue authoring.
- **Party** — Garrick, Mira, Oren and Brindle collectively unless implementation later changes roster representation.
- **Party member** — a named companion.
- **Trust** — relationship between Leader and party member.
- **Faction standing** — faction relationship.
- **Renown** — regional reputation/legitimacy resource.

Do not expose internal ids, loyalty keys, world flags or condition-key names in dialogue.
