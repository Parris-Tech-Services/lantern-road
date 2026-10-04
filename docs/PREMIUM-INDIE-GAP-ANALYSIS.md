# Lantern Road — Premium Indie Gap Analysis

**Snapshot:** 4 October 2026

Lantern Road is already a real compact browser RPG rather than a UI mock-up. Its current build includes a 72-hex region, 5 settlements, 11 adventure sites, 15 NPCs, 6 questlines, 4 factions, 25 items, 7 enemy archetypes, travel/weather/time pressure, fatigue and supplies, skill checks, faction reputation, combat, and save/load.

The useful comparison is not literal "AAA" production scale. It is the level of polish, authored consequence, character attachment, presentation and replayability found in top-tier commercial indies.

## Benchmark games

Useful comparison points:

- [Roadwarden](https://store.steampowered.com/app/1155970/Roadwarden/) — travel-focused text RPG, investigation, inventory, character creation and extensive authored conversation.
- [Citizen Sleeper](https://www.playstation.com/en-au/games/citizen-sleeper/) — simple underlying mechanics elevated by characters, relationships, branching stories, clocks and strong narrative pressure.
- [Wildermyth](https://store.steampowered.com/app/763890/Wildermyth/) — party members who change through relationships, decisions, injuries and campaign events.
- [Curious Expedition 2](https://store.steampowered.com/app/1040230/Curious_Expedition_2/) — expedition management, party relationships, loyalty, conditions and procedural travel stories.
- [Battle Brothers](https://battlebrothersgame.com/features/) — deep party/equipment progression, strong systemic consequences, distinctive presentation and substantial audio identity.

## Current gap

| Area | Lantern Road now | Premium-indie target |
| --- | ---: | ---: |
| Core systems | 7/10 | 9/10 |
| Exploration | 7/10 | 9/10 |
| Choice and consequence | 6/10 | 9/10 |
| Characters | 4/10 | 9/10 |
| Combat depth | 5/10 | 8/10 |
| Progression/builds | 4/10 | 9/10 |
| Art/presentation | 3/10 | 9–10/10 |
| Audio/atmosphere | 1/10 | 9/10 |
| Replayability | 5/10 | 8–9/10 |
| Mobile experience | 7/10 | 9/10 |

These scores are design-direction estimates, not review scores.

## The biggest missing ingredient

The main gap is **personality and emotional weight**, not simply another mechanic.

Lantern Road already has Garrick, Mira, Oren and Brindle, but they currently function more like useful party stat/ability packages than people the player can become attached to.

The biggest upgrade would be to let party members:

- react to major decisions
- talk around camp
- disagree with one another
- form friendships, rivalries or loyalties
- gain injuries, fears or traits
- receive personal quests
- remember earlier events
- unlock or lose abilities because of what happened to them

The goal should be for the player to care about *what happens to Garrick*, not only whether Garrick has enough HP.

## Presentation gap

The current project is deliberately lightweight HTML/CSS/JavaScript and has almost no dedicated visual or audio asset layer. That is one of the clearest differences between Lantern Road and a premium commercial indie.

High-value additions:

- illustrated NPC portraits
- one strong illustration for each major settlement/site
- enemy and item art
- improved map iconography
- movement and combat animation
- hit/heal/status feedback
- ambient rain, wind, marsh, inn and ruin soundscapes
- a restrained soundtrack
- optional mobile vibration/haptic cues

The game does not need expensive 3D graphics. It needs a coherent visual and audio identity.

## Recommended development order

### 1. Visual and audio identity

Add artwork, animation, atmosphere and feedback before dramatically increasing content volume.

### 2. Make the four heroes actual people

Add personal stories, camp conversations, changing relationships, strong reactions and character-specific consequences.

### 3. Deepen consequence

A choice should do more than change a hidden number.

Examples:

- NPC dialogue changes
- faction services appear or disappear
- routes become safer or more dangerous
- prices change
- settlements visually/narratively change
- future events branch
- endings remember specific decisions

Instead of only showing "Guild +1", the player should feel that the Grey March changed because they backed the Guild.

### 4. Add real progression and builds

Potential additions:

- equipment slots
- branching upgrades for each party member
- injuries and persistent conditions
- mutually exclusive abilities
- meaningful gear trade-offs
- character transformations caused by events

### 5. Expand authored event variety

The current travel/camp system is sound, but repeated events will become recognisable quickly.

Prefer roughly **40–60 memorable conditional events** over hundreds of generic ones. Events should react to:

- party members
- injuries/traits
- weather
- faction standing
- carried items
- earlier decisions
- time/day
- quest outcomes

### 6. Strengthen the campaign arc

The current 18-day renown structure is a useful frame.

Build a stronger dramatic arc around it:

1. frontier problems and local jobs
2. signs that apparently separate problems are connected
3. a mid-campaign revelation
4. escalating faction conflict
5. a hard late-game decision
6. several substantially different endings

### 7. Make phone play feel native

Lantern Road's browser/mobile focus can become a genuine advantage.

Priorities:

- one-handed bottom-sheet interactions
- larger illustrated choice cards
- reliable map pinch/zoom and panning
- autosave
- multiple save slots
- strong touch feedback
- adjustable text size
- high-contrast/accessibility settings
- clear immediate feedback after every action

## Product identity

Do **not** try to turn Lantern Road into Battle Brothers.

Its strongest potential identity is closer to:

> **Roadwarden + Curious Expedition + a tabletop road campaign, designed to play comfortably in a phone browser.**

That is distinctive enough to build around.

## Highest-value next move

Before adding another region or dozens of new mechanics, invest in:

1. **characters**
2. **art**
3. **sound**
4. **visible consequences**

The current engine already contains enough game structure to support a much richer experience.
