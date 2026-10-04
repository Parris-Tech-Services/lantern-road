# LR-0091 Integration Handoff

## Goal

This pack should become a direct **Talk** interaction with currently available companions once the dialogue runtime exists.

It is intentionally declarative so LR-0090/LR-0093 can consume it without re-authoring the conversations.

## Required runtime inputs

Per companion:

- active/reserve status;
- Trust;
- current HP/injury/fatigue condition;
- personal-arc status/outcome;
- recent major quest outcome;
- selected topic-memory state;
- selected Leader behaviour-pattern memories;
- key companion-to-companion relationship state.

## Required conversation capabilities

LR-0090 should support:

- greeting node selected by condition priority;
- topic hub;
- first/repeat/changed topic variants;
- advice topics before irreversible choices;
- post-choice callback topics;
- request → accept / hesitate / counter-offer / refuse resolution;
- conditionally available follow-up options;
- topic cooldown/closure;
- delayed callback eligibility.

## Required autonomy handoff

LR-0093 should consume request dialogue without converting companions into random blockers.

Examples:

### Garrick

Treatment refusal can come from conserving supplies or self-sacrificial duty.

### Mira

Refusal can come from loss of agency or exposure of personal history.

### Oren

Refusal can come from evidentiary integrity or needless risk.

### Brindle

Refusal can come from faith being used to manipulate or cruelty being sanitised.

The same mechanical request can therefore produce different dialogue logic.

## Suggested request result vocabulary

Authoring-only names:

- `accept`
- `hesitate`
- `counteroffer`
- `soft_refuse`
- `value_refuse`
- `incapable`

Do not surface these labels to the player.

## Suggested topic groups

Each companion should expose only relevant/current topics, not a completionist wiki list.

- `self`
- `road`
- `garrick`
- `mira`
- `oren`
- `brindle`
- `factions`
- `recent_choice`
- `personal_arc`
- `condition`
- `advice`

Hide the companion's own name topic where redundant.

## Advice integration

Before a major irreversible quest/campaign decision, the UI may offer:

> **Ask the party**

This should open advice from currently active companions only.

Advice must not:

- automatically reveal the best outcome;
- seize the final choice from the Leader;
- pretend reserve companions witnessed the discussion.

## Post-choice integration

After a major decision, at least one currently active companion with a strong value stake should have a new conversation topic.

Do not force every companion to comment every time.

## Reserve continuity

A returning reserve companion can know public outcomes via debrief.

They should receive phrasing such as:

> “I heard what happened at Greyfen.”

not:

> “When Oswin said that in the room…”

unless they were actually present.

## Current-condition integration

Condition changes greeting and request availability.

Examples:

- severely hurt companion: condition topic jumps near top;
- exhausted companion: deep topic may defer;
- healthy companion: no generic health topic.

## No mechanic ownership

LR-0091 does not decide:

- bandage cost;
- rest duration;
- injury thresholds;
- success chances;
- roster switching rules;
- action points;
- Trust numeric tuning.

Those remain with relevant systems/runtime owners.

## Minimal playable slice

If runtime integration must land incrementally, first ship:

1. direct Talk button on active companion;
2. condition/trust greeting;
3. three recurring topics;
4. one recent-choice callback;
5. treatment/rest request with authored acceptance/refusal/counter-offer;
6. repeat-safe memory.

Then expand to the full authored pack without changing the narrative contract.
