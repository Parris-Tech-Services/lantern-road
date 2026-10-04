# Lantern Road — Terminology & Tone Guide

Owner: **Agent 7 — The Director**  
Final creative authority: **Josh**

This is the canonical working language guide for Lantern Road. It standardises player-facing terms and design language without forcing legacy internal identifiers to be renamed unless a task explicitly owns that migration.

## Canonical product and world terms

- **Lantern Road** — the game.
- **Grey March** — the frontier region.
- **Party** — the four-person player group in UI/system language.
- **Party member** — generic term for Garrick, Mira, Oren or Brindle.
- **Leader** — the player’s in-world role and one of the four active adventurers. The Leader is the default external speaker and owns irreversible party-level story choices.
- **Active companion** — one of the three companions currently travelling with the Leader.
- **Reserve companion** — an available authored companion not currently in the four-person active adventuring party; reserve state does not erase Trust, personal-arc or character history.
- **Companion roster** — all authored companions currently available to travel with the Leader.
- **Settlement** — a populated service/social location.
- **Site** or **adventure site** — a non-settlement authored location.
- **Faction standing** — the player's relationship/reputation with a faction. Prefer this in player-facing system language; legacy implementation keys may still say `reputation`.
- **Renown** — campaign goal/progress resource.
- **Gold** — currency.
- **Rations** — expedition food/supply resource.
- **Fatigue** — expedition pressure stat.
- **Condition** — persistent or temporary altered character state.
- **Injury** — a persistent harmful condition caused by combat or adventure consequence.
- **Camp conversation** — authored party interaction during camp/rest flow.
- **Trust** — player-facing relationship measure between the player and a party member. Legacy internal state may use `loyalty`; do not expose that key as a competing UI label.
- **World flag** — internal implementation term only; never use it as player-facing prose.
- **Map canon** — the approved Grey March place identities, names, coordinates and coordinate rules recorded in `world/map-canon.json`.
- **Grid reference** — the human-facing location reference derived from canonical q/r, such as **E5**. Use it for map/navigation UI where helpful; ordinary dialogue normally uses the place name.
- **Terrain atlas** — the authored illustrated background map. It is a visual layer, not authoritative gameplay data.
- **Dynamic map overlay** — labels, symbols, roads, party marker, reachable hexes, discovery/fog, quest affordances and mutable world-state marks drawn from game/canon data over the terrain atlas.
- **PROPOSED map label** — a candidate name/location from concept art or authoring work that is not canon until approved through the map-canon protocol.

## Party skills and progression vocabulary

Use the current skill names exactly:

- **Might**
- **Scout**
- **Wits**
- **Spirit**
- **Guile**

Progression language:

- **Skill** — one of the five named competencies above.
- **Ability** — a named party-member action or defining capability, such as Hold Fast or Lantern Grace.
- **Equipment** — carried gear that changes capability or trade-offs.
- **Equipment slot** — a defined category/location for equippable gear when the progression foundation exposes slots.
- **Build** — internal/design shorthand for a deliberate combination of abilities and equipment. Avoid using it in character dialogue.
- **Choice with trade-off** — preferred framing for progression. Avoid treating every progression choice as a linear “upgrade”.
- **Mutually exclusive choice** — two or more progression options where selecting one closes another path; make the exclusion clear before commitment.

Do not introduce a separate XP/level vocabulary unless a queued Mechanist task explicitly establishes such a system.

## Combat vocabulary

Lantern Road combat is **compact combat**, not tactical-grid combat.

Use these terms consistently:

- **HP** — the current numeric health measure used by combat and item effects. In natural prose, **health** is fine; do not create a second mechanical resource called Health.
- **Attack** — offensive accuracy/effectiveness.
- **Damage** — HP lost from a successful harmful effect.
- **Initiative** — turn-order priority.
- **Guard** — protective combat status used to intercept or blunt harm.
- **Bless** — beneficial combat status/action currently used by the party.
- **Exposed** — vulnerability status.
- **Weakened** — reduced offensive effectiveness status.
- **Retreat** — the consequence flow after losing a fight; avoid describing ordinary combat defeat as a permanent “game over” unless a later explicit design decision changes that rule.

Keep combat labels short and readable on a phone. If a new status is added, use one clear player-facing name and explain its effect where the player first encounters it.

## Exact faction names

Use these consistently:

- **Gilt Caravan Guild**
- **Wardens of the Green March**
- **Archive of Candlemere**
- **Ashen Veil**

Do not casually shorten or rename them in system UI. A character may use an informal shortening only when it is clearly part of that character's voice.

## UI language

Current major tabs:

- **Context**
- **Journal**
- **Party**
- **Log**

UI conventions:

- Use short, concrete, mobile-readable labels.
- Action buttons should usually be verb-first phrases such as **Rest**, **Travel**, **Trade**, **Talk**, or a similarly clear specific action.
- Do not introduce two labels for the same system or action.
- When an action fails or is unavailable, explain **why** in player language rather than exposing implementation state.
- Important state changes should surface as visible feedback; a silent state mutation is not sufficient player communication.
- Do not expose internal identifiers such as `world_flag`, `loyalty`, content ids or save-schema keys.

## Narrative tone

Aim for:

- grounded frontier fantasy;
- restrained, specific prose;
- human characters with differing motives;
- weather, distance, fatigue and scarcity as lived texture;
- consequences that feel local and concrete;
- occasional warmth or humour that arises from character, not quippy modern banter.

Avoid:

- generic epic-fantasy bombast;
- constant sarcasm or Marvel-style quips;
- lore dumps when a concrete detail will do;
- modern product/technical language in character dialogue;
- melodrama that is not earned by prior play;
- interchangeable filler written only to increase content volume.

## Design language

Prefer:

- **choice with trade-off** over “upgrade”;
- **visible consequence** over hidden score-only change;
- **readable pressure** over surprise punishment;
- **authored event** over generic filler event;
- **compact combat** over tactical-grid combat;
- **phone-first** over merely responsive;
- **premium indie** over “AAA” when describing the target scope.

## Naming conventions

Player-facing names:

- Proper nouns, settlements, factions, named abilities and named items use deliberate title-style names.
- Reuse an established name rather than inventing a near-synonym.
- System labels use the canonical terms in this file unless a task explicitly changes the terminology.

Implementation/content identifiers:

- Prefer stable lowercase `snake_case` ids for content and state keys, matching the existing content model.
- Internal ids are not player-facing copy and do not need to mirror display-name punctuation or capitalisation.
- Do not rename persisted ids or save keys as a cosmetic terminology cleanup; save-compatible migrations belong to the task that owns that change.
- A new alias for an existing system should not be added merely to avoid updating references; choose one canonical player-facing term.

## Ownership terminology

- **Steward** — integration/architecture/production discipline.
- **Storyteller** — narrative/characters/consequences.
- **Mechanist** — combat/progression/economy/balance.
- **Lamplighter** — art/audio/presentation/atmosphere.
- **Wayfinder** — mobile UX/accessibility/interaction quality.
- **Warden** — independent black-box QA/playtesting.
- **Director** — design coherence, terminology, vision and cross-task conflict review.

If wording or ownership is unclear, The Director should resolve the ambiguity in this guide or the decision log rather than allowing separate agents to invent competing conventions. Genuine changes to product direction are escalated to Josh.
