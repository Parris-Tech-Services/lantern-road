# Lantern Road — Player-Leader & Consequential Dialogue Framework

**Task:** LR-0088  
**Owner:** Agent 2 — The Storyteller  
**Status:** Authoring only. This task does not modify runtime, save state or implement roster mechanics.

## Why this exists

Lantern Road already has four persistent heroes with Trust, memories, bonds and decision reactions.

What it currently lacks is a strong player-facing answer to:

> **Who am I in this conversation?**

The player should not feel like an invisible cursor selecting orders for four unrelated units.

The authored answer is:

> **The player is the Leader of the party: an in-world social role whose words, promises, suggestions and decisions are heard and remembered.**

“Leader” is intentionally a role, not a fixed biography.

LR-0089 has settled the roster canon:

- the active adventuring party is **Leader + three active companions**;
- Garrick, Mira, Oren and Brindle are the **companion roster**;
- when all four companions are available, one is reserve.

This authoring task does **not** decide that the Leader is:

- one of Garrick, Mira, Oren or Brindle;
- a custom avatar;
- a specific gender, appearance, age, class or voice;
- mechanically superior to the companions.

Those are larger implementation/product decisions and should not be smuggled into Storyteller prose.

The dialogue framework assumes the ratified roster above while remaining authoring-only; LR-0088 does not itself implement active/reserve roster mechanics.

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

- **Leader** — the player-facing in-fiction role and one member of the active four-person adventuring party.
- **Party** — the active adventuring party: Leader + three active companions.
- **Companion roster** — Garrick, Mira, Oren and Brindle collectively.
- **Companion** — a named member of that companion roster.
- **Reserve companion** — the one companion outside the active party when all four companions are available.
- **Trust** — relationship between Leader and party member.
- **Faction standing** — faction relationship.
- **Renown** — regional reputation/legitimacy resource.

Do not expose internal ids, loyalty keys, world flags or condition-key names in dialogue.
