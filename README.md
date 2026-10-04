# Lantern Road

Lantern Road is a static browser adventure RPG built with HTML, CSS, and vanilla JavaScript.

You lead a party of four adventurers across the Grey March on a real hex map. You travel town to town, hear rumours, accept quests, inspect ruins, bargain with factions, manage supplies, survive travel events, and fight compact party battles when trouble catches up.

## Files

- `index.html`
- `style.css`
- `content.js`
- `game.js`
- `manifest.webmanifest`
- `sw.js`
- `LICENSE`

## Running It

### Local
Open `index.html` in a browser, or serve the folder with a simple static server.

Example with Python:

```bash
python -m http.server 8080
```

Then open `http://localhost:8080`

### GitHub Pages
1. Create a GitHub repo.
2. Upload all files from this folder to the repo root.
3. Commit and push.
4. In GitHub go to **Settings → Pages**.
5. Under **Build and deployment**, choose:
   - **Source:** Deploy from a branch
   - **Branch:** `main`
   - **Folder:** `/ (root)`
6. Save.
7. Wait for Pages to publish.
8. Your game will appear at:

```text
https://YOUR-USERNAME.github.io/YOUR-REPO/
```

## How to Play

- Tap a neighbouring hex to travel.
- Tap your current hex to focus the current settlement or site.
- Use the **Context** tab for local services, NPCs, and site actions.
- Use the **Journal** tab for quests, rumours, discovered places, and faction standing.
- Use the **Party** tab for HP, skills, and consumables.
- Use the **Log** tab for recent events.
- Save and load with the buttons in the top bar.
- Press `F` or use the top-bar button to toggle fullscreen.

## Runtime inspection

- `window.render_game_to_text()` returns a concise JSON summary of the campaign, active quests, and combat.
- `window.advanceTime(ms)` refreshes the turn-based view deterministically and returns the same summary.

## Browser regression tests

Lantern Road's critical browser loops are covered by Playwright using a phone-sized Chromium project.

Run locally:

```bash
npm install
npx playwright install chromium
npm run test:e2e
```

The suite in `tests/e2e/` drives the real game UI and covers:

- starting a campaign and accepting a quest;
- clicking the canvas to travel to an adjacent hex;
- saving, reloading the page, and restoring campaign progress through localStorage;
- executing a real site action;
- entering combat and completing a party combat action;
- failure on uncaught browser page errors.

Deterministic setup for the site/combat cases is exposed only when Lantern Road is running on `localhost` or `127.0.0.1` with `?e2e=1`. The deployed game does not expose those test hooks.

CI runs the same suite in Chromium. LR-0013 is not allowed to close until its successful CI evidence and required Android smoke check are recorded.

## Design Overview

Lantern Road is a compact campaign sandbox rather than a giant CRPG. The core loop is:

1. Travel between hexes.
2. Spend time and rations.
3. Hear rumours and accept jobs.
4. Visit sites and settlements.
5. Resolve events through skill checks, choices, and small combats.
6. Change faction standing and world state.
7. Earn renown before the frontier season hardens.

The world is deliberately small so choices can echo cleanly.

## Architecture Overview

### Content-as-data
`content.js` stores the authored game content:

- terrain definitions
- map tiles
- factions
- party templates
- items
- enemy archetypes
- settlements
- NPCs
- rumours
- sites
- quest metadata
- travel events
- camp events
- encounter templates

### Engine
`game.js` handles:

- world state
- seeded RNG
- travel and time progression
- quest progression
- faction standing
- inventory and resources
- dialogue routing
- site interactions
- combat
- save/load
- rendering for map, tabs, modals, and UI

The engine is intentionally data-driven where it matters, while keeping quest/site/NPC logic readable.

## Quest System Overview

Included questlines:

1. **Lanterns on the Old Road**  
   False lantern crews near the Weeping Stones are choking traffic.

2. **The Missing Ledger**  
   A dangerous guild ledger vanished into the southern reeds.

3. **The Pilgrim's Reliquary**  
   Recover a small holy relic before it is stripped, sold, or archived.

4. **Fever on the South Road**  
   Deliver medicine to Alderwatch before delay becomes harm.

5. **The Silent Tower**  
   Recover the Moonmere star chart from a decaying frontier tower.

6. **Ash in the Marsh**  
   Investigate the organised people behind the Mosslight lights and decide what to do with them.

Each quest has tracked stages and can shift faction outcomes.

## World-State and Faction System Overview

Factions:

- Gilt Caravan Guild
- Wardens of the Green March
- Archive of Candlemere
- Ashen Veil

Player choices affect faction standing. That standing changes the tone of the run, and several quest outcomes favour one faction over another.

World flags also track resolved road threats, revealed hidden sites, cleared ruins, recovered items, and important route changes.

## Travel and Event Resolution Overview

Travel is hex-by-hex with:

- terrain movement cost
- road bonuses
- weather pressure
- fatigue
- daily ration use
- random travel events
- camp events
- discovered sites and rumours

Resolution uses a simplified tabletop-style check:

- `d20 + skill modifier`
- compare to DC
- apply authored success/failure effects

Skills matter outside combat, especially:

- Scout
- Wits
- Spirit
- Guile
- Might

## Combat Simplifications Made

Combat is compact on purpose.

- Turn order is initiative-based.
- Each party member has a very small move set.
- Enemies are card-based units, not map tokens.
- Position is abstracted into target selection rather than a tactical grid.
- Status effects are light: exposed, weakened, guard, bless.
- Losing a fight causes a retreat to the last safe settlement instead of a hard fail-state.

This keeps danger meaningful without turning the whole game into a tactics engine.

## Save / Load Approach

Save data is stored in `localStorage`.

It preserves:

- seed and RNG state
- day, hour, weather
- position
- discovered map and sites
- inventory
- gold, fatigue, renown
- faction standings
- quest state
- party HP and statuses
- combat state
- logs
- world flags
- active data scenes

## Mobile / Touch Approach

The UI is designed for both desktop and mobile browser play.

- Large tap targets
- No hover-only interactions
- Big choice buttons
- Sticky tab layout on smaller screens
- Canvas map with touchable hexes
- Modal interactions for events, dialogue, shops, and combat
- Portrait-friendly stacked layout, with map still readable

## Extension Points for Prompt 2 / Prompt 3

This build is set up to grow cleanly.

### Easy content extensions
Add more entries in `content.js` for:

- settlements
- sites
- rumours
- items
- enemy archetypes
- travel events
- camp events
- encounters
- quests
- NPCs

### Engine extensions
Good next steps in `game.js`:

- deeper faction gating
- more granular quest state transitions
- more authored dialogue trees
- more encounter-specific AI
- inventory equipment slots
- additional regions
- river travel rules
- condition effects like poison, fear, or exhaustion
- multi-step site dungeons
- more robust save-state restoration for all dialogue states

### Strong Prompt 2 direction
Prompt 2 can safely expand:

- quest variety and count
- more settlements and sub-sites
- richer town-specific services
- more dynamic economic rules
- more faction consequences
- more exploration-specific site chains

### Strong Prompt 3 direction
Prompt 3 can target polish:

- minimap and legend
- soundtrack via Web Audio
- better map iconography
- animation and feedback
- richer combat presentation
- accessibility options
- richer end-of-campaign summary

## License

MIT
