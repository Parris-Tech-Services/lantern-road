# Lantern Road Mobile Typography & Content-Density Contract

Owner: Agent 5 — The Wayfinder  
Task: LR-0082  
Consumers: LR-0039, LR-0041, LR-0074  
Visual art direction remains Agent 4 ownership.

## Purpose

Lantern Road should stay readable and operable on narrow phones without shrinking important text, clipping choices, or turning every surface into an endless wall of content.

This contract defines phone readability and content-density behaviour. It does not choose fonts, colours, illustration style or runtime CSS implementation.

## Supported conditions

Verify all rules at:

- 320, 360, 390 and 430 CSS px portrait widths;
- Standard, Large and Extra Large in-game text settings;
- browser zoom where practical;
- default and High Contrast modes.

## General readability

- Critical game text must wrap rather than truncate.
- Body/story text should use a comfortable readable line length; on phones this usually means the available content width rather than artificial narrow columns.
- Paragraph spacing should separate ideas without creating excessive vertical travel.
- Section headings must remain visually distinct at all text sizes.
- Avoid all-caps blocks for narrative or instructions.
- Costs, HP, status, requirements and consequences must not be hidden behind ellipsis.

## Content priority

When space is constrained, preserve in this order:

1. current decision/action;
2. consequence-critical values and requirements;
3. current location/turn/context;
4. essential status;
5. supporting description;
6. historical/log detail;
7. decorative metadata.

Lower-priority detail may collapse, move below, or require scrolling. Higher-priority information must never disappear merely to keep a compact layout.

## Action labels

Buttons should use short concrete verb-first language where possible.

Rules:

- labels wrap to multiple lines before shrinking below the configured text size;
- a wrapped button remains a single large touch target;
- never truncate a label when doing so could change meaning;
- cost/requirement may appear in the label or adjacent text, but must remain readable;
- adjacent actions may stack vertically when horizontal fit becomes cramped.

## Dialogue and event prose

For dialogue/travel/camp/site events:

- use normal paragraph reflow;
- long text scrolls naturally;
- choices remain visually separated from story text;
- the first choice should not be pushed off-screen by unnecessary decorative spacing;
- Extra Large text may require substantial scrolling, but Close/choices must remain reachable;
- do not reduce text size to keep an entire scene on one screen.

## Choice lists

- one choice per clear interactive block when phone width is constrained;
- preserve authored order;
- maintain enough vertical separation to prevent accidental neighbouring taps;
- requirement/explanation text belongs with the affected choice;
- disabled state remains readable and distinguishable.

## Tabs

Canonical tabs: Context, Journal, Party, Log.

At narrow widths:

- labels remain complete;
- avoid icon-only replacement unless the text label remains available accessibly and the icon is canonical;
- if four tabs fit as the phone bottom bar, preserve stable widths/reachability;
- enlarged text may wrap or adjust spacing but must not make one tab dominate or disappear.

## Status strip

The status strip should prioritise compact, glanceable values.

- avoid turning it into a paragraph;
- if content cannot fit, stack or wrap logical groups;
- never overlap map or header controls;
- save/connectivity status may move to a secondary line rather than compressing gameplay values beyond recognition.

## Cards and item entries

Cards may stack vertically.

Preferred order:

1. name/title;
2. critical value/status/cost;
3. short description;
4. action.

Do not place long prose and multiple side-by-side buttons in a narrow two-column card if stacking is clearer.

## Compact combat

Phone combat should not compress two large columns into unreadably narrow columns.

At constrained width:

- Party and Enemies may stack;
- current turn/action block appears before target lists;
- HP and meaningful status remain visible near unit name;
- selected action state remains text/border/icon visible, not colour only;
- combat log is secondary and may be collapsed/placed after active decision controls;
- target labels must remain complete enough to distinguish units.

LR-0085 defines the full one-handed combat flow.

## Journal and Log

Journal:

- quest title/status/objective take priority;
- long history can appear below current objective;
- due/time pressure remains visible when mechanically relevant.

Log:

- chronological entries may be dense but must remain readable;
- do not reduce global text size just because the log is long;
- optional grouping/date separators may improve scanning without changing history.

## Map labels

For LR-0074:

- natural place name has priority over raw coordinate;
- grid reference may sit as compact secondary metadata;
- label collision may hide/reposition non-critical labels, but current party location and active/reachable target information remain available through semantic controls;
- never shrink labels until unreadable merely to show every name simultaneously.

## Truncation rules

May truncate only low-risk supporting text when:

- full text is available through expansion/details;
- truncation is visibly indicated;
- no gameplay-critical value or distinction is lost.

Never truncate:

- choice labels;
- settlement/site names when selecting between locations;
- item/ability names when the distinction matters;
- costs/requirements;
- HP/status values used for a decision;
- save slot names;
- error/recovery action labels.

## Tables and multi-column layouts

Avoid wide tables in player-facing phone UI.

Where structured comparison is needed:

- convert rows to stacked cards;
- use label/value pairs;
- allow horizontal scroll only for genuinely tabular information and never for the core action path.

## Scrolling

- document/modal scrolling is acceptable;
- nested scroll regions should be rare;
- never create a tiny scrolling box inside a scrolling modal for ordinary prose;
- sticky/fixed actions may be used only if they respect safe-area rules and do not obscure content;
- on modal open, initial focus should not force the player to start at the bottom of a long scroll.

## Extra Large mode

Extra Large is not an approximation. It must remain functionally complete.

Pass criteria:

- all action labels visible;
- no horizontal page scroll from ordinary UI;
- modal Close reachable;
- current decision understandable without zooming out;
- bottom tabs remain operable;
- cards stack instead of shrinking below chosen text size;
- long headings wrap cleanly.

## Browser zoom

Do not disable browser pinch zoom or viewport scaling.

At moderate browser zoom:

- controls reflow rather than overlap where possible;
- fixed surfaces continue respecting safe areas;
- critical buttons are not clipped off-screen.

## Density test matrix

At each representative width, Standard and Extra Large:

1. Context at settlement with several actions;
2. long dialogue/event with multiple choices;
3. shop with several items;
4. Party cards/status;
5. Journal with active quest detail;
6. long Log;
7. compact combat with multiple units;
8. Settings;
9. Load chooser;
10. canonical map with labels/controls once available.

Record:

- horizontal overflow;
- clipped/truncated critical text;
- accidental tiny targets;
- excessive nested scrolling;
- unreachable controls;
- information hidden solely to preserve density.

## Ownership boundary

Agent 4 owns visual typography style, palette and art composition.

Wayfinder owns whether the player can read and operate the interface on a phone.

LR-0039 implements accessibility/reflow behaviour. LR-0041 consumes the hierarchy for onboarding. LR-0074 consumes map-label density rules.

## Acceptance summary

- [x] dialogue, choices, cards, logs and combat density rules defined;
- [x] stack/collapse/scroll behaviour specified instead of text shrink;
- [x] critical truncation prohibitions defined;
- [x] Standard/Large/Extra Large and browser zoom covered;
- [x] visual art direction left with Agent 4;
- [x] no runtime implementation included.
