# LR-0140 — Current-main fun and friction micro-playtest — 4 October 2026

**QA task:** LR-0140  
**Game-under-test:** current `main` commit `54ef2802e3a47e2f8cecfa77f7f7a8603e873dd4`  
**Trigger/context:** Josh requested a current-build Warden retest immediately after LR-0021 historical baseline completion. Main immediately before the LR-0140 claim was `83d0aa54f0262d4e107103aee23ef2de8e52590a`.  
**QA tooling branch:** `agent/LR-0140-current-build-fun-loop-ed2f4260`  
**Real browser:** Playwright Chromium, 390×844 mobile viewport, touch/mobile context  
**Evidence run:** GitHub Actions `37193714501` — SUCCESS  
**Evidence artifact:** `11299079820` — `lr-0140-current-main-evidence`  
**Browser errors:** none recorded  
**Console errors:** none recorded  

The workflow checked out the Warden tooling and the game under test separately, verified the game checkout was exactly the commit above, then served only that exact current-main checkout to Chromium.

## What was retested

This was intentionally a narrow current-build micro-playtest, not another full regression:

1. fresh-campaign phone shell/opening decision;
2. resource pressure under repeated camping;
3. camp-event repetition under extended resting;
4. the Day 18 deadline and campaign resolution.

The historical LR-0021 map-travel automation signal was **not** promoted into a current defect because the current probe's unsuccessful guessed canvas coordinates are not sufficient player evidence.

## Current-main findings

### WFD-2026-001 — Zero-ration camping still allows sustained recovery

**Severity:** S2  
**Player impact:** HIGH  
**Owner:** Agent 3 — The Mechanist  
**Routed task:** LR-0016

Rations reached zero on Day 7. The run then continued camping until Day 19. Final visible state:

- 28 gold
- 0 rations
- Fatigue 0/6
- Renown 0
- 4/4 standing
- 93% health

Current main is slightly harsher than the historical baseline, where the party remained at 100% health, but the core problem still reproduces: lack of food does not create sustained enough pressure to stop repeated camping from remaining a comfortable strategy.

**Where a player sees it:** repeatedly press **Camp** after rations reach zero and watch fatigue recover while the party remains broadly healthy.

### WFD-2026-002 — Generic camp events repeat conspicuously

**Severity:** S2  
**Player impact:** MEDIUM  
**Owner:** Agent 2 — The Storyteller  
**Routed task:** LR-0007

Across 53 camps:

- **Thin Rations** appeared 6 times.
- **Night Steps** appeared 5 times.
- Night Steps occurred on consecutive camp events around Days 8–9 and again on consecutive camps on Day 18.

The companion-specific scenes remain the stronger moments. The generic repeats make extended camp play feel like a small random table rather than a responsive road campaign.

**Where a player sees it:** use **Camp** repeatedly across multiple days and notice identical event text returning.

### WFD-2026-003 — Day 18 deadline passes without resolution

**Severity:** S1  
**Player impact:** HIGH  
**Owner:** Agent 2 — The Storyteller  
**Routed task:** LR-0008

The test crossed the stated deadline with Renown 0. At **Day 19, 12am**:

- play continued normally;
- the GOAL chip still read **12 renown by day 18**;
- no failure/ending/late-game resolution had replaced the stale goal.

This is the highest-impact current finding because the game's central campaign promise fails to resolve.

**Where a player sees it:** allow the clock to pass Day 18 without reaching 12 Renown.

### WFD-2026-004 — Settings gear overlaps opening action on phone

**Severity:** S2  
**Player impact:** MEDIUM  
**Owner:** Agent 5 — The Wayfinder  
**Routed task:** LR-0009

At 390×844, the floating settings gear visibly sits over the lower-right of **Set out from Hearthwick.** on the opening Grey March modal.

This is already explicitly owned by LR-0009. Agent 5's parked mobile branch/PR reports a fix, but it is not merged to current main yet, so the Warden finding remains pending retest.

**Where a player sees it:** start a new campaign on a phone-sized viewport and look at the bottom-right of the opening modal.

## Positive current-build signals

- Fresh campaign booted correctly.
- The opening campaign goal and status chips rendered clearly.
- Real-browser run completed without page errors or console errors.
- The party-specific camp writing remains substantially stronger than generic camp filler.
- Current main now inflicts some health loss across the zero-ration endurance path, so the survival layer has moved slightly in the intended direction compared with the historical baseline.

## Routing / duplication check

No new specialist implementation tasks were created.

| Warden finding | Existing owner/task | Current status |
| --- | --- | --- |
| WFD-2026-001 supply-pressure loophole | Agent 3 / LR-0016 | BLOCKED on its declared foundations |
| WFD-2026-002 camp repetition | Agent 2 / LR-0007 | BLOCKED on its declared foundations |
| WFD-2026-003 Day 18 deadline | Agent 2 / LR-0008 | BLOCKED on its declared foundations |
| WFD-2026-004 phone gear overlap | Agent 5 / LR-0009 | READY but parked; fix prepared in PR #85, merge-gated |

## Retest rule

These findings are not resolved when the owning implementation merely exists on a branch. Agent 6 must retest the relevant current build after each owning fix merges.

