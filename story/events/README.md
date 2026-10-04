# Lantern Road — Conditional Travel & Camp Event Pack

**Task:** LR-0046 — Author conditional travel and camp event pack  
**Owner:** Agent 2 — The Storyteller  
**Status:** Authoring only. LR-0007 later integrates this material into the event engine.

## Purpose

The existing event set already covers several useful road hazards: storms, broken axles, suspicious travellers, wolves, checkpoints, toll cutters, roadside shrines and night raiders.

This pack deliberately adds a different layer:

- social memory;
- party character;
- faction pressure;
- road-specific atmosphere;
- consequences of earlier choices;
- low-stakes human moments between major quests;
- events whose meaning changes because of what the player has already done.

The aim is not “more random events.” It is a curated set of scenes that make repeated travel through the Grey March feel authored and reactive.

## Pack size

- **12 travel events**
- **10 camp events**
- **22 total authored events**

## Event design rule

Every event must primarily do at least one of these:

1. reveal character;
2. create a genuine trade-off;
3. foreshadow a consequence;
4. reflect a prior choice;
5. make a specific road/region feel socially real.

Avoid events whose only narrative purpose is:

> pass check → gain resource  
> fail check → lose resource

Resource effects may support an event later, but they should not be the reason the event exists.

## Declarative condition vocabulary

These are authoring notes for LR-0007, not implemented state keys.

Possible condition families:

- **party:** named party member present/standing;
- **Trust:** player-party relationship band;
- **party relationship:** bond/friction between named members;
- **injury/condition:** future LR-0020/LR-0018 state;
- **weather:** drizzle, rain, storm, clear, heat/cold if supported;
- **terrain:** road, swamp, hills, forest, river-adjacent;
- **time:** dawn/day/dusk/night;
- **faction standing:** positive/negative band with a named faction;
- **quest outcome:** named existing quest result;
- **campaign phase:** early / obligations / revelation / pressure / convergence;
- **item:** carried rope, lamp oil, medicine, ledger/chart evidence, etc.;
- **prior event:** whether this authored event or callback already occurred;
- **personal arc outcome:** future LR-0037 result;
- **settlement/world consequence:** LR-0005 state.

LR-0007 should map these authoring conditions onto the shared runtime architecture rather than creating a second condition system.

## Files

- `TRAVEL-EVENTS.md`
- `CAMP-EVENTS.md`

## Repetition policy

Events marked **one-shot** should not repeat.

Events marked **repeatable with variant** may recur only if the text or branch meaning changes.

Events marked **callback-only** require a specific prior event/outcome and should feel like payoff rather than random chance.

## Tone

Keep events grounded in:

- wet roads;
- awkward pauses;
- tired travellers;
- repairs;
- ferries;
- food;
- ledgers;
- lamps;
- signs;
- weather;
- people improvising around weak institutions.

Do not use:

- cosmic prophecy;
- chosen-one language;
- generic “mysterious stranger” filler;
- comedy detached from character;
- game-system jargon in dialogue.
