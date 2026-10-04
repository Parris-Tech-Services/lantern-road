# LR-0130 Iconography Phone & Accessibility QA Matrix

Contract: `docs/ICONOGRAPHY-INTERACTION-AUDIT.md`  
Sprite: `assets/ui/icons.svg`

## Test configurations

| Code | Viewport | Mode |
| --- | --- | --- |
| P320 | 320×700 | Standard text |
| P320-X | 320×700 | Extra Large |
| P390 | 390×844 | Standard |
| P430-HC | 430×900 | High Contrast |
| KB | Desktop/phone keyboard | Keyboard only |
| SR | Android TalkBack or equivalent | Screen reader |

## Structural checks

| ID | Check | Expected |
| --- | --- | --- |
| I01 | Symbol inventory | 40 unique symbol ids. |
| I02 | ViewBox | Every production symbol uses 0 0 24 24. |
| I03 | Colour source | No per-symbol hard-coded semantic colour; currentColor inheritance preserved. |
| I04 | Missing sprite | Text/action meaning still exists if icon fails to render. |

## Resource checks

| ID | Check | Expected |
| --- | --- | --- |
| R01 | Gold/Rations/Fatigue/Health/Time | Glyph accompanied by label/context and value. |
| R02 | Renown | Player-facing term is Renown, not generic reputation/faction standing. |
| R03 | Resource update | Consequential change is visible in text, not icon colour only. |

## Action checks

| ID | Check | Expected |
| --- | --- | --- |
| A01 | Travel/Rest/Talk/Trade/Search | Visible action text remains present on phone. |
| A02 | Save/Load | Explicit visible words distinguish save from load; Manual Save/Autosave wording remains intact. |
| A03 | Journal/Inventory | Meaning remains obvious at P320-X; icon does not replace accessible text/name. |
| A04 | Sound | If compact/icon-only, accessible name and current state are exposed; Settings provides visible text equivalent. |
| A05 | Target size | Interactive glyph is inside an approximately 44×44 CSS px or larger target. |

## Confusable-pair checks

| ID | Pair | Expected |
| --- | --- | --- |
| C01 | Warden / Defend / Guarded | Context/text makes each meaning unmistakable. |
| C02 | Health / Heal | Resource versus action is explicitly labelled. |
| C03 | Settlement / Inn | Inspection/legend names category/place. |
| C04 | Site / Renown | Map versus progression context never relies on star-like glyph alone. |
| C05 | Save / Load | No icon-only destructive ambiguity. |
| C06 | Bridge / Ford / Ferry | Crossing type/name available in map inspection. |
| C07 | Shrine / Blessed | Place versus status explicitly named. |
| C08 | Travel / Trade | Visible verbs remain. |

## Map checks

| ID | Check | Expected |
| --- | --- | --- |
| M01 | Party marker | Non-colour-only current-position treatment plus text/summary equivalent. |
| M02 | Known settlement/site | Interactive marker has meaningful accessible name. |
| M03 | Hidden site before discovery | No icon, name or accessibility node leaks its existence. |
| M04 | Legend | Every legend glyph has visible text. |
| M05 | P320 marker use | Marker remains tappable/inspectable without requiring a 20 px precision target. |
| M06 | High Contrast | Marker selected/current/reachable states remain distinguishable without colour alone. |

## Combat/status checks

| ID | Check | Expected |
| --- | --- | --- |
| S01 | Attack/Defend/Heal/Aim | Visible action verbs remain; keyboard focus on button/container. |
| S02 | Guarded/Blessed/Exposed/Weakened/Injury | Status word remains directly available. |
| S03 | Target accessible name | Consequential status can be heard/read while choosing target. |
| S04 | 16 px stress test | Thin details may soften, but no critical meaning depends on them; primary uses prefer 18–24 px. |

## Accessibility checks

| ID | Check | Expected |
| --- | --- | --- |
| X01 | Labelled button SVG | SVG is aria-hidden; parent/visible text provides accessible name without duplicate announcement. |
| X02 | Map marker | Parent marker/control carries name/type/grid semantics. |
| X03 | Status chip | Screen reader receives the status word once, not duplicate SVG title + text. |
| X04 | Disabled action | Disabled state and reason remain readable; low-opacity icon is not the only cue. |
| X05 | Selected/toggled action | aria/state plus visual container treatment; icon colour alone is insufficient. |

## Evidence

For runtime integration record:

- build identity;
- viewport/text/contrast mode;
- icon id;
- rendered glyph size;
- control hit-box size where interactive;
- accessible name;
- screenshot for confusable-pair/high-contrast defects;
- pass/fail.

Agent 6 should run the player-facing cases in a real browser after runtime integration exists.
