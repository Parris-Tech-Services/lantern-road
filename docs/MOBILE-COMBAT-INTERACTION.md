# Lantern Road One-Handed Compact-Combat Interaction Contract

Owner: Agent 5 — The Wayfinder  
Task: LR-0085  
Mechanics owner: Agent 3 — The Mechanist  
Consumers: LR-0015, LR-0039, LR-0028

## Purpose

Compact combat must remain comfortable and understandable on a phone without changing Mechanist-owned rules, balance, actions, enemy AI or encounter design.

This contract defines interaction order, reachability and mobile presentation only.

## Interaction priority

During the player's turn, the screen should make these questions answerable in order:

1. Whose turn is it?
2. What actions can they take?
3. Which action is selected?
4. Which targets are valid?
5. What will the target choice affect?
6. What happened?
7. What is the next decision?

Do not force the player to hunt through a long combat log before making the current decision.

## Current-turn header

Keep current-turn context near the top of the active combat surface:

- party member name;
- round;
- essential current HP/status;
- concise instruction such as **Choose an action** or **Choose a target**.

On Extra Large text, this block may stack vertically.

## Action selection

Actions should appear as large ordinary buttons.

Requirements:

- common actions remain in thumb-reachable content flow;
- selected action has text/border/icon state in addition to colour;
- if selecting an action requires a target, selected state remains visible while target controls appear;
- if an action resolves immediately, provide result feedback before advancing;
- disabled action has readable reason where not obvious.

Do not create a compact icon-only action strip that requires memorising symbols.

## Target selection

Valid targets appear as ordinary buttons associated with each unit.

Target label should expose enough information to decide, for example:

**Target Mire Hound — 7/12 HP — Exposed**

or equivalent structured text.

Rules:

- dead/invalid targets are disabled or omitted from target action;
- ally and enemy target groups remain clearly separated;
- if many units exist, stack/scroll rather than shrink cards;
- selected action remains visible while target list is being used;
- a change of action clears stale target selection.

## One-handed reach

At 320–430 px portrait widths:

- action controls should not live only in a top corner;
- current action and nearest relevant target controls should be reachable through normal vertical content flow;
- repeated primary controls target at least 44 × 44 CSS px where practical;
- no required action is covered by bottom tabs/safe area;
- if combat uses a modal, Close remains disabled/unavailable unless combat rules actually permit leaving.

## Scrolling

Combat may scroll vertically.

Preferred order:

1. current turn/action block;
2. valid target groups;
3. party/enemy status details;
4. combat log/history.

Do not place the only action controls below a long historical log.

When target lists become long:

- preserve current action block context;
- avoid nested tiny scroll panes;
- after action resolution, move focus/scroll to the next decision rather than leaving the player stranded deep in old content.

## Party and enemy layout

Wide layouts may use side-by-side Party / Enemies columns.

Phone layouts may stack them.

Stacking rules:

- current-turn party context remains first;
- target group relevant to selected action may move ahead of non-relevant detail;
- names, HP and important statuses remain close together;
- visual portraits/art may shrink or reposition before text becomes unreadable.

Agent 4 retains combat art/presentation direction.

## Status readability

Mechanist-owned statuses such as:

- Guarded;
- Blessed;
- Exposed;
- Weakened;

must be available as text.

Do not rely on colour alone.

When a status changes:

- result feedback names the meaningful change once;
- the updated unit card reflects it;
- avoid duplicating the same spoken announcement via both status region and full combat log.

## Combat feedback

After an action:

- show concise immediate result near the decision flow;
- update HP/status visibly;
- the combat log records history but is secondary;
- next-turn context becomes obvious.

A typical compact result can include:

**Mira strikes Mire Hound for 4 damage. Mire Hound is Exposed.**

Exact combat prose remains compatible with Mechanist/narrative ownership.

## Keyboard and assistive parity

LR-0039 must provide:

- keyboard access to all combat actions;
- focus transition from action to first valid target;
- contextual target labels;
- focus retention within combat;
- concise turn/result announcements;
- no pointer-only target selection.

Phone touch flow and keyboard flow call the same underlying combat actions.

## Accidental-action protection

- one tap activates one action;
- rerender must not double-trigger a retained pointer/click;
- disabled controls cannot activate through stale DOM handlers;
- target buttons should not move under the finger between touch-down and activation due to delayed layout changes;
- destructive retreat/surrender controls, if introduced by Mechanist, require clear separation from routine actions.

## Enlarged text

At Extra Large:

- action buttons wrap;
- target labels wrap;
- cards stack;
- current turn remains identifiable;
- no horizontal combat board scrolling is required for normal play;
- combat can still be completed without zooming out.

## Log access

Combat Log is useful history, not the primary decision surface.

- keep it below/secondary to current action;
- allow collapse/expansion if later useful;
- do not place the whole log in an assertive live region;
- screen readers receive concise current-turn/result messages instead.

## Touch sequence

Recommended party-turn touch flow:

1. current member/round visible;
2. tap action;
3. selected action remains highlighted;
4. valid targets become obvious;
5. tap target;
6. result appears;
7. next turn context appears.

For no-target action:

1. tap action;
2. immediate result;
3. next turn context.

## Haptic/audio

Optional haptic/audio may reinforce:

- action selection;
- confirmed attack/hit;
- heal/status success.

It must never:

- be required to know whether an action worked;
- delay interaction;
- fire on cancelled/invalid target taps.

## Test matrix

At 320, 360, 390, 430 px; Standard and Extra Large:

1. complete a full combat touch-only;
2. select each action type;
3. switch action before selecting target;
4. target first/middle/last enemy;
5. target ally where supported;
6. exercise disabled/dead target;
7. scroll long combat state/log;
8. trigger several statuses;
9. repeat combat with keyboard only;
10. verify reduced-motion/high-contrast modes.

Pass:

- no pointer precision dead end;
- current decision always findable;
- no accidental double actions;
- selected action/valid target state clear without colour alone;
- action/target controls remain reachable one-handed;
- Mechanist rules remain unchanged.

## Ownership boundary

Agent 5 owns:

- reachability;
- control ordering;
- responsive stacking;
- focus/touch flow;
- semantic presentation.

Agent 3 owns:

- available actions;
- damage/healing values;
- targeting rules;
- statuses/mechanics;
- enemy AI;
- combat balance.

Agent 6 independently judges difficulty, tedium and player-experience issues in LR-0028.

## Acceptance summary

- [x] current turn/action/target/log interaction order defined;
- [x] one-handed scrolling/reachability specified;
- [x] selected action/target semantics avoid colour-only meaning;
- [x] Extra Large text behaviour defined;
- [x] combat mechanics remain Agent 3-owned;
- [x] implementation/QA handoffs documented.
