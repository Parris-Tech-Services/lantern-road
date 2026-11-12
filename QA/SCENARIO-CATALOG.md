# Lantern Road — Warden Black-Box Scenario Catalogue

**Task:** LR-0054  
**Owner:** Agent 6 — The Warden  
**Status:** Manual QA methodology. Not a playtest result, not a fun score, not an automated harness.
**Game under test:** current `main` or current deployed build. Record the exact SHA/build every run.

---

## How to use this catalogue

1. Read the scenario’s **setup**, then play it as a player — no source-code shortcuts.
2. Capture the exact **commit/build**, device/browser, campaign state and any console errors.
3. Compare against the **invariant / expected** column, not against a preferred design.
4. Record confirmed, non-duplicate findings under `QA/findings/` using `QA/FINDING-SCHEMA.json`.
5. Route specialist fixes to the owning agent. Warden does not fix them inside this task.
6. Retest only after the owner’s fix merges; only then mark a finding `RESOLVED`.
7. If a scenario reveals nothing, record that it passed; do not manufacture a finding.

**Severity:** S0 blocker · S1 high · S2 medium · S3 low.  
**Evidence:** screenshot or short recording, state snapshot (`window.render_game_to_text()`), console/page errors, exact steps.

---

## Scenario index

| ID | Area | What it proves | Automation candidate |
| --- | --- | --- | --- |
| QA-SCN-01 | First five minutes | A new player can consent, start and take a first action | Yes |
| QA-SCN-02 | Travel and map | Hex travel changes position, time and resources | Yes |
| QA-SCN-03 | Modal and navigation | Context/Journal/Party/Log and close/back flows do not trap | Partial |
| QA-SCN-04 | Manual save/load | Save survives reload and restores the same campaign | Yes |
| QA-SCN-05 | Autosave/resume | Autosave resumes without a hidden new-game reset | Yes |
| QA-SCN-06 | Combat | A real combat action reaches a new round and exits cleanly | Yes |
| QA-SCN-07 | Site and quest | Site action gives visible feedback and quest state agrees | Yes |
| QA-SCN-08 | Shop and resources | Price, gold, inventory and feedback agree | Partial |
| QA-SCN-09 | NPC conversation | A recurring NPC conversation is repeat-safe and state-aware | Partial |
| QA-SCN-10 | Faction consequence | Standing/quest outcome is visible in a service or note | Yes |
| QA-SCN-11 | Phone one-handed | Core actions remain reachable at 390×844 and enlarged text | Partial |
| QA-SCN-12 | Adversarial repeats | Double actions, reloads and revisits do not duplicate or corrupt | Partial |

Existing Playwright coverage lives in `tests/e2e/game.spec.cjs`. This catalogue is deliberately broader and more player-facing than that suite; it does not replace it.

---

## QA-SCN-01 — First five minutes

**Setup:** Fresh browser profile, no local save, `?e2e=1` on localhost or deployed build without test hooks.

**Actions:**
1. Open the game. Read the title/intro.
2. Decline analytics if the banner is present.
3. Start a new campaign from the intro.
4. Confirm the map and Hearthwick context are readable.
5. Talk to Rowan and accept the road-trouble job.

**Invariant / expected:**
- Consent is explicit; no game control is used before consent.
- The player reaches a playable map without a blank screen.
- Hearthwick, party, resources and at least one NPC action are visible without scrolling through a lore dump.
- Accepting the quest produces visible confirmation and a journal/quest state change.
- No uncaught page errors.

**Capture:** first-screen and post-quest screenshots, state snapshot, console errors.  
**Failure:** S0 if no playable start; S1 if the first action is blocked; S2 if the player cannot tell what to do next.

---

## QA-SCN-02 — Travel and map

**Setup:** New campaign at Hearthwick.

**Actions:**
1. Note position, day, hour, rations and fatigue.
2. Travel to one adjacent hex using the canvas (or the phone travel buttons).
3. Travel again in a different direction.
4. Open the map controls; pan, zoom, centre and focus.
5. Check the journal/context for the new location.

**Invariant / expected:**
- Position changes to the intended hex; the party marker and context agree.
- Time and supplies change according to terrain/travel rules; no silent negative resource.
- The player can return or continue; no one-way soft lock.
- Map labels, reachable hexes and site markers agree with state.
- No page errors; no duplicate travel from one input.

**Capture:** before/after state, screenshots at both hexes, map zoom level, device.  
**Failure:** S0 if travel cannot continue; S1 if position/state disagree or resources corrupt; S2 if the player cannot understand the cost.

---

## QA-SCN-03 — Modal and navigation

**Setup:** Campaign in Hearthwick with a quest active.

**Actions:**
1. Open and close Context, Journal, Party and Log in both orders.
2. Open a dialogue, close it, reopen it.
3. Open Settings/Accessibility, change text size, close it.
4. Use browser Back where available.
5. Reload while a modal is open.

**Invariant / expected:**
- Every modal has an obvious close/back action.
- Background controls are not silently clickable through the modal.
- Closing returns to the same campaign state; no hidden tab reset.
- Browser Back does not create a second campaign or lose the save.
- Text-size changes do not hide the close/action controls.

**Capture:** screenshots of each modal, focus behaviour, state before/after.  
**Failure:** S0 if trapped; S1 if state resets; S2 if the player cannot find the exit.

---

## QA-SCN-04 — Manual save and load

**Setup:** New campaign; accept the road-trouble job; close dialogue.

**Actions:**
1. Record quests, day, hour, position and gold.
2. Save Manual.
3. Reload the page.
4. Load Manual Save.
5. Compare restored state with the recorded state.

**Invariant / expected:**
- Manual save confirmation is visible.
- Reload does not erase the manual save.
- Load restores quests, day/hour, position and resources.
- No new campaign starts implicitly.
- A second save replaces the manual save with a clear confirmation.

**Capture:** state before save, after reload, after load; localStorage presence; console errors.  
**Failure:** S0 if save is lost or corrupt; S1 if load restores the wrong campaign; S2 if the player cannot tell which save loaded.

---

## QA-SCN-05 — Autosave and new-game guard

**Setup:** New campaign; accept a quest; wait for autosave.

**Actions:**
1. Confirm the autosave state in the UI.
2. Reload and confirm the campaign resumes.
3. Open New Campaign; choose “Keep current campaign”.
4. Open New Campaign again; choose “Start new campaign”.
5. Verify the manual save remains available.

**Invariant / expected:**
- Autosave resumes the same quest and day without a hidden reset.
- New Campaign asks for confirmation.
- Keeping the campaign changes nothing.
- Starting new creates a new campaign; it does not delete the manual save.
- No duplicate quest progress or duplicated rewards.

**Capture:** localStorage keys, before/after state, screenshots of the confirmation.  
**Failure:** S0 if a new campaign silently overwrites the old one; S1 if autosave loses progress; S2 if the choice is unclear.

---

## QA-SCN-06 — Combat

**Setup:** Campaign with a reachable encounter (or deterministic `?e2e=1` test hook on localhost).

**Actions:**
1. Start combat.
2. Select a combat action and a valid target.
3. Complete at least one round.
4. Try an invalid target/empty action.
5. Finish or retreat; return to exploration.

**Invariant / expected:**
- Action and target are clearly selected; HP/damage/status feedback appears.
- Round advances only after valid input.
- Invalid actions do not silently consume a turn or crash.
- End/retreat returns to a playable exploration state with state consistent.
- No duplicate damage from repeated clicks.

**Capture:** screenshots of action/target states, combat state JSON, console errors.  
**Failure:** S0 if combat hard-locks; S1 if state corrupts or actions duplicate; S2 if the player cannot understand turn/status.

---

## QA-SCN-07 — Site and quest

**Setup:** Campaign with Saint Rhel’s Shrine discovered.

**Actions:**
1. Travel to or place at Saint Rhel’s.
2. Use the shrine action.
3. Open the Journal and check the quest/rumour state.
4. Leave and return.
5. Complete or advance one quest step if available.

**Invariant / expected:**
- The site panel names the place and offers a concrete action.
- The action gives visible feedback and a cost/benefit.
- Journal/quest state agrees with what the site said.
- Returning does not replay a one-use reward or duplicate an item.
- A blocked action explains why, rather than doing nothing.

**Capture:** site panel, feedback, journal state, before/after inventory.  
**Failure:** S1 if a quest step corrupts or duplicates; S2 if a visible action is silent.

---

## QA-SCN-08 — Shop and resources

**Setup:** Campaign with enough gold to buy one item and not enough for a second expensive item.

**Actions:**
1. Open the market at Hearthwick.
2. Buy one affordable item.
3. Attempt an unaffordable item.
4. Sell one item if selling is available.
5. Check gold, inventory and feedback.

**Invariant / expected:**
- Displayed price, gold deducted and inventory gained agree.
- Unaffordable purchase explains the shortfall and changes nothing.
- A unique/non-stack item cannot be bought twice.
- Feedback names the item and the new gold total.
- Faction/standing price notes agree with the actual charged price.

**Capture:** price before, gold/inventory after, screenshots, state JSON.  
**Failure:** S1 if gold/inventory corrupt; S2 if price and charge disagree.

---

## QA-SCN-09 — NPC conversation and repeat safety

**Setup:** Hearthwick, after the road quest is active or resolved; talk to Rowan, Tessa and Elira.

**Actions:**
1. Talk to each NPC once; note the greeting and topic.
2. Close and talk again.
3. Return after one world-state change (road safe, medicine outcome, reliquary outcome).
4. Ask a personal or taboo topic.
5. Leave mid-conversation.

**Invariant / expected:**
- Each NPC sounds like themselves with names removed.
- First meeting, return and repeat lines differ; no identical first-meeting replay.
- The NPC acknowledges the current world state where authored.
- A taboo/exit line ends the topic without breaking the conversation UI.
- No silent state change; no new name/place outside canon.

**Capture:** one line per NPC, state, screenshots; note any repeated text.  
**Failure:** S2 if the same first-meeting text repeats; S1 if dialogue contradicts state; S3 if a line is tonally wrong but functional.

---

## QA-SCN-10 — Faction consequence visibility

**Setup:** Current campaign with at least one faction standing change or completed quest outcome (use a real play path; test hooks are for deterministic setup only).

**Actions:**
1. Note faction standing and settlement price/inn cost.
2. Change standing through a quest/decision.
3. Open the settlement context and the faction/standing area.
4. Check the inn cost and shop price.
5. Save, reload and check the note again.

**Invariant / expected:**
- The player can see a before/after faction change, not only a number.
- The price/inn effect agrees with the displayed note.
- A direct quest outcome can improve trade even when standing is neutral; the note must say so.
- The consequence survives save/load.
- No base economy rebalance outside the documented modifier.

**Capture:** standing, inn cost, buy price, note text, state JSON, save/reload comparison.  
**Failure:** S1 if displayed effect and charge disagree; S2 if the consequence is invisible; S0 if save corrupts.

---

## QA-SCN-11 — Phone one-handed

**Setup:** 390×844 and 360×780 browser viewport, touch emulation; repeat with Large/Extra Large text.

**Actions:**
1. Start a campaign.
2. Reach the map, Context, Journal, Party and a dialogue.
3. Travel with the large neighbouring buttons.
4. Open Settings; change text size and high contrast.
5. Try the primary action in each screen with one thumb.

**Invariant / expected:**
- Primary actions are reachable without pinch-zoom.
- Floating controls never cover a required button.
- Enlarged text does not clip names, choices or close buttons.
- Map pan/zoom and travel buttons agree.
- A phone user can complete the first quest without a desktop-width layout.

**Capture:** screenshots at each viewport/text size, device/browser.  
**Failure:** S1 if a required action is unreachable; S2 if text clips or controls overlap.

---

## QA-SCN-12 — Adversarial repeats and recovery

**Setup:** Current campaign with a quest and a save.

**Actions:**
1. Double-click a travel button and a dialogue choice.
2. Open a modal, then reload mid-modal.
3. Save during/after combat if allowed.
4. Revisit a resolved site and a completed quest NPC.
5. Load an old save after a new campaign.
6. Go offline/online if the PWA is installed.

**Invariant / expected:**
- One input produces one state change; no duplicate reward, damage or quest acceptance.
- Reload mid-modal recovers to a playable state or a clear saved state.
- Resolved content remains resolved; no replay of one-use rewards.
- Old save loads without overwriting the newer manual save.
- Offline reload either works from cache or explains the failure.

**Capture:** before/after state, localStorage, network mode, console errors, exact repeat count.  
**Failure:** S0 if data loss/corruption; S1 if duplicate rewards or soft lock; S2 if recovery is confusing.

---

## Automation candidates for LR-0013

The existing `tests/e2e/game.spec.cjs` already covers:

- first quest acceptance;
- adjacent canvas travel;
- manual save/reload;
- site action + combat action;
- autosave/new-game guard;
- faction/quest world state.

Add next, in this order:

1. **QA-SCN-04/05** — save plus autosave in one flow with state equality.
2. **QA-SCN-08** — buy/unaffordable/sell price and inventory assertions.
3. **QA-SCN-10** — faction consequence before/after save.
4. **QA-SCN-12** — duplicate-click and reload-mid-modal guards.
5. **QA-SCN-11** — 390×844 and enlarged-text reachability screenshots.

Do not automate a scenario until its manual invariant is stable; automation should preserve the same player-visible expectation.

---

## Mapping to Warden tasks

| Task | Use |
| --- | --- |
| LR-0021 | Historical baseline comparison only; do not present as current-build evidence |
| LR-0140 | Use the relevant scenarios for the loops materially changed since the last micro-playtest |
| LR-0022 | QA-SCN-01/03/11 for navigation and interaction |
| LR-0023 | QA-SCN-04/05/12 for save/load/resume |
| LR-0025 | QA-SCN-07/09 for quest and NPC state |
| LR-0026 | QA-SCN-01 for fresh-player clarity |
| LR-0029 | QA-SCN-11 for phone usability |
| LR-0013 | Use the automation-candidate subset only |

Findings must still follow `QA/FINDING-SCHEMA.json` and search the live queue before creating a follow-up task.
