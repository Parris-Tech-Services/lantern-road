# Lantern Road — Hero Personal Arc Pack

**Task:** LR-0044 — Author the four hero personal arcs  
**Owner:** Agent 2 — The Storyteller  
**Status:** Authored blueprint only. Runtime/save integration belongs to LR-0037 after the foundation gates.

## Purpose

These arcs turn Garrick Vale, Mira Quickstep, Oren Thale and Sister Brindle into people whose private histories collide with the same question driving the 18-day campaign:

> **What do we owe other people when the road cannot carry everyone safely at once?**

Each arc is deliberately local and personal. None is required to understand the regional campaign. None should replace the player's main route choices.

## Shared rules

- Each arc requires **Trust** and a prior memory from LR-0004.
- Each arc uses existing settlements/sites where possible.
- Each arc contains at least one real trade-off, not a hidden best answer.
- Each arc produces a remembered outcome that can affect later dialogue, party tone or the ending.
- No arc gives raw power for choosing the “kindest” answer.
- Failure or refusal should remain authored outcomes, not dead content.
- Exact state keys below are declarative integration notes only.

## Arc files

- `GARRICK-THE-WALL-THAT-WALKS.md`
- `MIRA-THE-NAME-BEFORE-THE-ROAD.md`
- `OREN-THE-UNFINISHED-PAGE.md`
- `BRINDLE-WHAT-THE-LAMP-ASKS.md`

## Canonical faction language

Where these arcs or their later callbacks refer to factions, use the exact player-facing names:

- **Gilt Caravan Guild**
- **Wardens of the Green March**
- **Archive of Candlemere**
- **Ashen Veil**

## Shared integration vocabulary

Recommended conceptual state:

- `personal_arc.<member>.status`: `locked | offered | active | resolved | refused`
- `personal_arc.<member>.outcome`
- `personal_arc.<member>.memory_ids[]`
- existing Trust
- existing party relationships
- existing quest/world outcomes
- later ending callback consumption by LR-0008

Do not expose these internal keys to players.
