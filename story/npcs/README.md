# Lantern Road — Recurring NPC Dialogue Pack

**Task:** LR-0045 — Author recurring NPC dialogue and relationship callbacks  
**Owner:** Agent 2 — The Storyteller  
**Status:** Authored blueprint only. Runtime/state integration belongs to LR-0038 after the shared architecture/save/browser-test foundations.

## Purpose

The Grey March should feel socially persistent. Named NPCs must remember enough of the party's history that returning to a settlement feels like returning to people rather than reopening static quest menus.

This pack gives all 15 existing named NPCs:

- a clear voice and motive;
- at least two materially different callback states;
- reactions to prior choices, faction standing, party relationships or local consequences;
- declarative conditions for later integration;
- short repeat-safe lines that can coexist with quest-specific dialogue.

The callbacks are not a second campaign plot. They are **social memory** around the existing quests and campaign spine.

## Canonical language

Use the exact faction names:

- **Gilt Caravan Guild**
- **Wardens of the Green March**
- **Archive of Candlemere**
- **Ashen Veil**

Use **Trust** for the player's relationship with Garrick, Mira, Oren and Brindle.

Do not expose internal phrases such as `world flag`, save keys or condition ids in player-facing dialogue.

## Voice rule

A callback should sound like the person speaking it, not like the game explaining state.

Bad:

> Your Warden standing is high, so I trust you.

Good:

> Edda taps the sealed dispatch against her palm. “You have brought back enough bad news intact that I believe you when you say this one matters.”

## Repetition rule

For implementation, each callback family should ideally have:

1. one first-return line;
2. one shorter repeat line;
3. an optional follow-up question or observation.

This lets NPCs remember the player without repeating a full speech every visit.

## Declarative trigger vocabulary

These are authoring notes, not runtime requirements.

Common trigger ideas:

- prior quest outcome;
- faction standing band;
- party member Trust band;
- personal-arc outcome;
- prior NPC conversation;
- settlement consequence state;
- time window / campaign phase;
- carried quest item;
- whether an NPC has already delivered a given callback.

Later LR-0038 implementation should map these to the shared campaign/consequence state rather than creating parallel persistence.

## Files

- `HEARTHWICK.md`
- `GREYFEN.md`
- `CANDLEMERE.md`
- `ALDERWATCH.md`
- `BLACKSALT.md`

## Scope boundary

This pack does **not**:

- replace LR-0047's expanded core-quest scenes;
- retell LR-0043's campaign revelation or final choice;
- implement LR-0005 world consequence logic;
- add new economy values or services;
- create new runtime/save state;
- resolve the LR-0044 personal arcs.

It supplies durable social reactions for later integration.
