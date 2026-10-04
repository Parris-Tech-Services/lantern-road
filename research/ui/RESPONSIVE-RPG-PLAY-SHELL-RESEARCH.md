# LR-0095 — Responsive Narrative RPG Play-Shell Research

Owner: Agent 5 — The Wayfinder  
Task: LR-0095  
Date: 4 October 2026

## Question

How should Lantern Road present the same core travel → result → choice loop on phones and larger screens without forcing the player to scroll up to the map, down to see what happened, then back up to the map again?

## Recommendation in one sentence

**Keep the map persistently visible during the core travel loop, and move context/results/actions into a separate phone bottom sheet or desktop side pane that scrolls independently.**

Do not keep one long responsive document where the map and the result/action surface push each other vertically.

---

## Reference 1 — Inkle's Sorcery!

### Sources

- Inkle screenshots: https://www.inklestudios.com/2013/03/12/sorcery-screenshots.html
- Inkle/Sorcery postmortem: https://www.gamedeveloper.com/business/postmortem-i-steve-jackson-s-sorcery-i-series-by-inkle
- PC review/interface notes: https://www.pcworld.com/article/419443/sorcery-parts-one-and-two-review-choose-your-own-adventure-in-this-glorious-steve-jackson-adaptatio.html
- PC port notes: https://nerdybutflirty.com/2016/02/10/review-sorcery-parts-1-2/

### Observed shell

Sorcery! trades between two strong layers:

1. **strategic map movement** — the player drags the pawn/routes between locations;
2. **story flow** — narrative text and explicit choices.

The map also carries progress and consequence: travelled routes remain visible and spatially explain where the player has been.

The story interface keeps core resources such as stamina/wealth/provisions persistent while text and choices flow.

### Most useful design admission

Inkle's postmortem explicitly describes the reverse transition — finishing/interacting with story and going back to movement — as clunky. The authors say that, if redesigning, they would be tempted to leave the map and movement flags visible during story flow, but note the iPhone real-estate challenge.

That is almost exactly Lantern Road's current problem.

### What Lantern Road should take

- Treat the map as part of the continuous gameplay shell, not a page the player repeatedly travels back to.
- Keep high-value campaign state persistent.
- Let story/actions appear beside or over the map rather than replacing the player's spatial context.
- On phone, solve the space constraint with a **bottom sheet**, not full document scrolling.

### What Lantern Road should not copy

- Do not alternate between fully separate map/story pages if that recreates the same back-and-forth.
- Do not carry a touch-derived layout unchanged onto desktop; the Sorcery PC port retained some touch language/scroll friction.

---

## Reference 2 — Roadwarden

### Sources

- Official-source screenshot mirrored under CC BY: https://commons.wikimedia.org/wiki/File:Roadwarden_in-game_screenshot.png
- Steam: https://store.steampowered.com/app/1155970/Roadwarden/
- PC Gamer interface description: https://www.pcgamer.com/roadwarden-is-the-first-text-adventure-i-enjoyed-as-much-as-a-good-book/
- Switch-port usability caution: https://noisypixel.net/roadwarden-switch-review/

### Observed shell

Roadwarden's larger-screen interface is deliberately sectioned rather than one long document.

The core presentation keeps, simultaneously:

- illustration/map/context on the left;
- narrative and choices in the centre;
- player state/actions on the right.

This matters more than the exact number of columns: **world context, current prose/choice and state remain visible as neighbouring regions**.

### Why it works for Lantern Road

Roadwarden avoids making the player repeatedly navigate between “where am I?” and “what happened?” The current scene, prose, choices and persistent state share one stable play shell.

That is a strong desktop pattern for Lantern Road.

### Caution from controller/console adaptation

Reported Switch issues include:

- selection/focus being hard to see;
- menu navigation inherited from a cursor-like desktop model;
- text becoming too large and pushing choices off-screen;
- input overlap making it possible to advance/choose unintentionally.

The lesson is not “copy three columns to every device.” The lesson is:

> keep context persistent, but redesign the interaction shell for each input/viewport class.

---

## Reference 3 — Citizen Sleeper

### Sources

- Steam: https://store.steampowered.com/app/1578650/Citizen_Sleeper/
- Steam screenshots/features confirm full controller support and map/action-focused play.
- Controller/navigation critique: https://www.gameskinny.com/reviews/citizen-sleeper-review-the-good-life-is-just-a-dice-roll-away/

### Observed shell

Citizen Sleeper uses a persistent spatial/station context with selectable action nodes and moves into dialogue/action surfaces while maintaining a strong sense of where the player is in the station.

It is designed for larger screens and controller as well as mouse.

Useful traits:

- world/navigation context remains a strong anchor;
- actions are discrete selectable targets;
- dialogue/action presentation is layered around the world rather than requiring a document-style trip back to a separate map page;
- current resources/action affordances remain accessible.

### Controller caution

Reviews report that map/menu navigation can become imprecise with controller input. That reinforces a Lantern Road rule already present in LR-0051/LR-0086:

- focus order must be deterministic;
- semantic action controls must not depend on cursor-like spatial precision.

---

# Cross-reference conclusions

## Pattern 1 — preserve spatial context

Sorcery!, Roadwarden and Citizen Sleeper all benefit from making “where I am” a durable part of the play experience.

Lantern Road should keep visible:

- map viewport;
- current party position;
- immediate reachable route/hex context;
- current location name.

The map should not disappear merely because a result or dialogue is active.

## Pattern 2 — result and next action belong together

After travelling, the player needs to see:

1. what happened;
2. what changed;
3. what can I do next?

Those belong in the same context/action surface.

Do not put the result in a transient toast near one edge while the next action is hundreds of CSS pixels away.

## Pattern 3 — persistent state should be compact

Keep immediately useful state visible:

- day/time;
- gold;
- rations;
- fatigue / key party pressure;
- current party/leader health summary where relevant.

Do **not** keep the entire Journal, Log, inventory detail or party sheets permanently open.

## Pattern 4 — phone and desktop should share information architecture, not identical geometry

Same logical regions:

- **World** — map/spatial context
- **Context** — latest result/current place/story
- **Actions** — what can be done now
- **Status** — compact party/resources

Phone: stacked overlay/sheet relationship.  
Desktop: split-pane relationship.

---

# Lantern Road phone recommendation

## Shell

Use a fixed-height app shell approximately equal to the visible phone viewport.

The page itself should not be the primary vertical scroll surface during the core travel loop.

### Region A — persistent map viewport

Approximate default height:

- **38–45% of usable viewport** in normal travel mode.

Contains:

- map;
- party marker;
- reachable hex indication;
- current location label;
- zoom/reset/centre controls;
- compact day/time/status overlay only if it does not obscure map interaction.

The map can pan/zoom independently.

### Region B — snap bottom sheet

Anchored to the bottom, above safe-area requirements.

Three conceptual positions:

1. **peek** — current place + one-line latest result + drag handle / explicit expand control;
2. **standard** — current result/context + primary actions;
3. **expanded** — longer dialogue, shop, Journal/Party/Log content.

The sheet owns its own vertical scrolling.

The map remains visible behind/above it except when a genuinely full-screen flow is justified.

Accessibility rule: dragging is optional. Provide explicit expand/collapse controls and logical focus movement.

## Phone core loop

### Before travel

Map visible.

Bottom sheet standard state:

- current place;
- short context;
- large neighbouring Travel/action buttons.

### Player taps a neighbouring hex / Travel button

- map gives immediate selection/travel feedback;
- map remains on screen;
- party marker moves when travel resolves;
- bottom sheet updates in place.

### After travel

Bottom sheet automatically shows:

- **result first**;
- resource/time changes second;
- available local actions third.

Suggested automatic sheet position: **standard**, not fully expanded unless the result is a substantial authored scene.

The player can see both:

- where they arrived;
- what happened.

No scroll back to the map is required.

### During long dialogue/event

Sheet may expand to 70–90% of viewport.

Still retain:

- a thin strip/glimpse of map where practical; or
- a clear location header if the content legitimately needs nearly full height.

On close/resolution, return to standard sheet, not document top/bottom.

## Phone navigation tabs

Context / Journal / Party / Log remain bottom-thumb navigation, but conceptually they switch the **sheet content**, not the whole page.

Map stays persistent for Context and ordinary travel.

For Journal/Party/Log, the sheet may expand further because those are deliberate information modes.

## Phone action placement

Primary repeated actions should be in the lower half of the sheet.

Examples:

- Travel
- Rest
- Trade
- Talk
- Camp
- dialogue choices
- combat actions

Do not require reaching a map control at the top and then scrolling to a choice at the bottom for every step.

---

# Phone wireframe

~~~text
┌─────────────────────────────────────┐
│ Day 4 · 13:00     Gold 22  Rations 4│  compact status
├─────────────────────────────────────┤
│                                     │
│          GREY MARCH MAP             │
│      ◇ road       ◆ Hearthwick      │
│                ● party              │
│                                     │
│  [−]      [Centre]       [+]        │
│                                     │
├─────────────── handle ───────────────┤
│ Hearthwick                           │
│ You arrive before the rain breaks.  │  latest result
│ +1 hour · Fatigue +1                │
│                                     │
│ [Rest at the inn]                   │
│ [Visit the market]                  │
│ [Talk to Mira]                      │  primary actions
│                                     │
├─────────────────────────────────────┤
│ Context   Journal   Party   Log     │  thumb tabs
└─────────────────────────────────────┘
~~~

Expanded dialogue:

~~~text
┌─────────────────────────────────────┐
│  map remains partly visible         │
├─────────────── handle ───────────────┤
│ The Ferryman                        │
│                                     │
│ Dialogue/result text scrolls here.  │
│                                     │
│ [Ask about the eastern road]        │
│ [Offer 3 gold]                      │
│ [Leave]                             │
├─────────────────────────────────────┤
│ Context   Journal   Party   Log     │
└─────────────────────────────────────┘
~~~

---

# Lantern Road desktop recommendation

## Split pane

Use the available width instead of stretching one phone column.

Recommended starting proportions:

- **55–62% map/world pane**
- **38–45% context/action pane**

Top-level compact status may span both panes.

### Left pane — world

Persistent:

- map;
- party marker;
- routes/reachable hexes;
- place labels;
- zoom/centre controls.

### Right pane — context/action

Independently scrollable:

- current place/result;
- narrative/dialogue;
- local actions;
- choice buttons;
- shop/combat context as appropriate.

Keep the **current decision controls** near the visible end of the current context rather than below unrelated historical information.

Tabs may switch the right pane between Context / Journal / Party / Log.

## Desktop wireframe

~~~text
┌────────────────────────────────────────────────────────────────────┐
│ Day 4 · 13:00   Gold 22   Rations 4   Fatigue 2   Party healthy   │
├──────────────────────────────────┬─────────────────────────────────┤
│                                  │ Hearthwick                      │
│                                  │                                 │
│          GREY MARCH MAP          │ You arrive before the rain...  │
│                                  │                                 │
│   ◆                ●             │ +1 hour · Fatigue +1           │
│       roads / reachable hexes    │                                 │
│                                  │ [Rest at the inn]               │
│                                  │ [Visit the market]              │
│                                  │ [Talk to Mira]                  │
│                                  │                                 │
│                                  │ Context Journal Party Log       │
├──────────────────────────────────┴─────────────────────────────────┤
│ optional unobtrusive status / build support surface               │
└────────────────────────────────────────────────────────────────────┘
~~~

## Desktop dialogue

Do not replace the map with a full-width modal for ordinary dialogue if a right-pane scene can safely contain it.

Use true modal takeover only when the interaction genuinely requires exclusive focus, such as:

- major confirmation;
- complex combat presentation if pane space is insufficient;
- Settings;
- save/load recovery.

---

# Tablet / intermediate widths

Do not pick a breakpoint solely by device name.

When two panes no longer keep both map and choices comfortably readable:

- transition to the phone-style persistent map + sheet shell;
- do not squeeze desktop panes until text/actions become cramped.

The breakpoint should be driven by content fit under Standard and Large text, not “768 px means tablet”.

---

# Persistent core-loop information

## Always/persistently visible where practical

### Map/world
- current spatial position;
- reachable immediate context;
- location identity.

### Compact campaign status
- day/time;
- gold/rations;
- fatigue or equivalent current pressure;
- critical party health state.

### Current context
- latest travel/action result;
- current place/scene title.

### Available actions
- immediate next actions/choices.

## Not persistent

- full historical Log;
- full Journal;
- detailed inventory;
- full party sheets;
- long help/tutorial material;
- support diagnostics.

These become sheet/pane modes.

---

# Action feedback recommendation

Every state-changing action should update the **context pane/sheet**.

Use toast feedback only for small secondary confirmations.

Examples:

Travel:
- map party position changes;
- context header becomes destination;
- result summary appears at top of sheet/pane.

Rest:
- context result explains cost/time/healing;
- compact status updates at the same time.

Rumours:
- learned rumour/result appears in context;
- Journal badge/secondary state may update.

This makes feedback visible where the player is already looking, rather than forcing Log hunting.

---

# Dialogue choice presentation

Phone:

- full-width stacked choices;
- close vertical relationship to the text they answer;
- sheet scroll, not whole-page scroll;
- choices remain above bottom safe-area/tab zone.

Desktop:

- right-pane stacked choices;
- avoid tiny inline links across a wide paragraph;
- keyboard/controller focus order follows visual order.

Controller/keyboard:

- one deterministic focused choice at a time;
- selected/focused styling obvious without cursor-like precision;
- avoid inherited desktop hover assumptions.

---

# Map context preservation

A core Lantern Road rule should be:

> Opening Context content must not destroy map state.

Preserve:

- zoom;
- pan;
- party centre;
- selected/focused reachable hex where sensible.

After resolving a scene:

- return to the same map camera;
- update world overlays;
- show result in context sheet/pane.

Do not reset the camera simply because narrative content rerendered.

---

# Why not one long responsive page?

The current observed loop is structurally caused by document flow:

1. map sits above;
2. result/context sits below;
3. player scrolls between the two;
4. each travel/action repeats the distance.

Making buttons larger does not solve that.

The fix is **separate spatial and context scroll domains**, not more vertical spacing tweaks.

---

# Implementation guidance for LR-0096

LR-0096 should test the following architecture:

## Phone

- viewport-height shell;
- persistent map region;
- bottom sheet with snap/expand states;
- independent sheet scroll;
- fixed bottom tabs controlling sheet modes;
- semantic map/travel alternatives;
- safe-area contract from LR-0081;
- gesture contract from LR-0080;
- typography/reflow from LR-0082.

## Desktop

- persistent map left pane;
- context/actions right pane;
- independent right-pane scrolling;
- compact shared status header;
- tabs swap right-pane content;
- no repeated whole-page map/result scroll.

## State ownership

Layout transitions must preserve:

- campaign state;
- current map camera;
- selected tab;
- modal/focus semantics;
- save/autosave state.

Do not create a second phone-specific gameplay state model.

---

# Acceptance tests for the future shell

## Phone travel loop

Repeat five travels without using page-level vertical scrolling.

Pass:

- map remains available;
- each result appears immediately in sheet;
- next travel/action remains reachable;
- no up/down document shuttle.

## Phone dialogue

Open long dialogue, make two choices, return to travel.

Pass:

- sheet handles narrative scrolling;
- map camera survives;
- return lands at useful standard sheet position.

## Desktop travel loop

Travel repeatedly while map remains in left pane.

Pass:

- result/actions update in right pane;
- no document-level scroll required to alternate map and results.

## Large text

Repeat phone loop with Extra Large text.

Pass:

- sheet expands/scrolls;
- map remains usable;
- choices not hidden under tabs;
- no horizontal overflow.

## Keyboard/controller-style navigation

Navigate context/actions without mouse precision.

Pass:

- focus remains deterministic;
- map pan/select does not consume focus unexpectedly;
- dialogue options are reachable in visual order.

---

# Final recommendation

Lantern Road should **not** treat its phone version as a desktop page squeezed to one column.

Use one information architecture with two responsive shells:

- **Phone:** persistent map + snap/scroll bottom sheet.
- **Desktop:** persistent map + independently scrolling context/action pane.

This directly solves Josh's observed map → result → map scrolling loop while fitting the established product identity: a dense road campaign where movement, place, consequence and choice remain visibly connected.

## Sources consulted

- Inkle, “Sorcery screenshots!” — https://www.inklestudios.com/2013/03/12/sorcery-screenshots.html
- Inkle postmortem via Game Developer — https://www.gamedeveloper.com/business/postmortem-i-steve-jackson-s-sorcery-i-series-by-inkle
- PCWorld, Sorcery! Parts One and Two review — https://www.pcworld.com/article/419443/sorcery-parts-one-and-two-review-choose-your-own-adventure-in-this-glorious-steve-jackson-adaptatio.html
- Roadwarden official-source screenshot — https://commons.wikimedia.org/wiki/File:Roadwarden_in-game_screenshot.png
- PC Gamer, Roadwarden UI/review — https://www.pcgamer.com/roadwarden-is-the-first-text-adventure-i-enjoyed-as-much-as-a-good-book/
- Noisy Pixel, Roadwarden Switch interface critique — https://noisypixel.net/roadwarden-switch-review/
- Citizen Sleeper Steam page/screenshots/controller support — https://store.steampowered.com/app/1578650/Citizen_Sleeper/
- GameSkinny, Citizen Sleeper controller/map navigation critique — https://www.gameskinny.com/reviews/citizen-sleeper-review-the-good-life-is-just-a-dice-roll-away/
