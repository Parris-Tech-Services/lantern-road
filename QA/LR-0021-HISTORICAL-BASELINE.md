# LR-0021 — Historical baseline full-campaign black-box playtest

**QA task:** LR-0021  
**Historical gameplay build tested:** `70056f6a323b8df3c36f854988dc2cc036fbf88d`  
**QA evidence heads:** opening/route run `ae633702ef209479ca9e7e9da033bca4ad1331f9`; endurance run `51578448b6e51851eb87cddca3975d66c29143b8`  
**Branch/environment:** `agent/LR-0021-qa-full-campaign-baseline-30957b31`; localhost static server in GitHub Actions  
**Device/browser:** Playwright Chromium, 390×844 mobile viewport, touch/mobile context  
**Browser automation method:** Playwright real browser  
**Campaign seed/save:** Fresh campaign after clearing browser storage; seed was not surfaced in player-facing UI  
**Evidence runs:** GitHub Actions 37178112389 (opening/route) and 37193163526 (endurance), artifacts 11294028597 and 11299248862  
**Playtest goal:** Establish a before-state for player clarity, pacing, reliability, resource pressure and campaign-end behaviour before the foundation wave changes the game.

> Historical-baseline rule: this report describes the old gameplay build above. Per the current LR-0021/LR-0139 coordination clarification, findings here are not current-main defects until LR-0140 retests the relevant loop against current main/current deployed.

## Session summary

- **Campaign span:** fresh Day 1 start through Day 19 in real Chromium. The endurance path used 53 camps to deliberately stress time/resource/pacing behaviour.
- **Major route/decisions:** opening rumours; Rowan Pike's road-trouble quest accepted; manual save; camp relationship choices; separate route run travelled Hearthwick → Redwater Ferry → plains/site content and exercised a Mosslight choice.
- **Strong moments:** the opening goal is concise; quest acceptance is explicit; arrival/travel feedback is visible; Garrick/Mira/Oren/Brindle camp scenes give the party noticeably more personality than stat-only companions.
- **Biggest friction:** supplies stopped feeling consequential after rations reached zero; a small event pool repeated visibly; the Day 18 campaign target did not produce an ending/failure transition in this baseline; floating feedback/settings surfaces could cover mobile decision space.
- **Did I ever not know what to do next?** The initial “Set out from Hearthwick” flow and highlighted-neighbour map guidance were understandable in this build. No confirmed opening soft-lock was observed.
- **Browser reliability:** no page errors or browser console errors were recorded in the successful endurance run.

## Findings

### [S2] Zero-ration camping does not create sustained expedition pressure

**Recommended owner:** Agent 3 — The Mechanist  
**Reproducibility:** Always in the historical endurance run  
**Existing queue checked:** Yes — matches **LR-0016 Economy, supplies and expedition pressure balance**; no duplicate task created.

**Steps**
1. Start a fresh campaign on historical build `70056f6a...`.
2. Remain at Hearthwick and repeatedly use **Camp**.
3. Rations reach **0** on Day 7.
4. Continue camping through Day 19.

**Expected**

Running out of rations should create sustained, readable pressure or a meaningful recovery/trade-off problem. Camping without food should not remain a near-free way to erase fatigue indefinitely.

**Observed**

The party continued camping normally from Day 7 through Day 19 at **0 rations**. The final player-visible state was **Fatigue 0/6**, **4/4 standing**, **100% health**, **28 gold**, **0 rations**, **Renown 0**. “Thin Rations” occasionally applied 1 fatigue, but subsequent camps repeatedly returned fatigue to 0.

**Player impact**

This baseline behaviour makes the survival/resource layer easy to bypass and weakens the stated expedition-pressure pillar. A player can spend away the campaign clock without food while remaining healthy and rested.

**Creative-director review needed?** No for the existence of sustained pressure; yes only for the exact severity/tuning of starvation or recovery penalties.

**Evidence / state notes**

- GitHub Actions run: 37193163526
- Artifact: 11299248862
- Final screenshot: `99-historical-final.png`
- Day 19 visible state: 0 rations, fatigue 0/6, party 100% health.

**Suggested acceptance test**

At 0 rations, repeated camping must impose a persistent cost/constraint that cannot be fully erased by simply camping again, while avoiding an unrecoverable death spiral.

---

### [S2] Camp-event repetition becomes conspicuous under repeated resting

**Recommended owner:** Agent 2 — The Storyteller  
**Reproducibility:** Always in the historical endurance run  
**Existing queue checked:** Yes — maps to **LR-0007 Conditional authored event expansion** and consumes the authored **LR-0046** event pack; no duplicate task created.

**Steps**
1. Start a fresh campaign on the historical build.
2. Repeatedly camp across the campaign clock.
3. Observe event titles and cadence.

**Expected**

Authored camp scenes should feel curated and responsive, with enough recent-event suppression/conditions that the exact same generic scene does not recur in an obviously repetitive cadence.

**Observed**

Across 53 camps, the browser recorded:
- **Thin Rations** — 7 appearances
- **Night Steps** — 5 appearances
- **Quiet Camp** — 4 appearances

Most notably, **Night Steps** appeared on two consecutive camps on Day 15. The companion-specific scenes were stronger and more memorable than the generic repeats.

**Player impact**

Repeated identical events make authored road life feel like a small random table rather than a responsive campaign, increasing tedium and reducing the impact of otherwise strong companion scenes.

**Creative-director review needed?** Yes for preferred cadence/variety, but the immediate-repeat evidence is objective enough to justify a current-build retest.

**Evidence / state notes**

- GitHub Actions run: 37193163526
- Artifact: 11299248862
- Current-main retest required under LR-0140 because the event/content pipeline has changed since this historical build.

**Suggested acceptance test**

Track recent camp-event IDs and ensure immediate repeats are suppressed unless an event is explicitly authored to recur; verify generic events do not crowd out newly integrated conditional/character events.

---

### [S2] Day 18 goal does not resolve the campaign in the historical build

**Recommended owner:** Agent 2 — The Storyteller  
**Reproducibility:** Always in the historical endurance run  
**Existing queue checked:** Yes — directly matches **LR-0008 Strengthen the 18-day campaign arc and endings**; no duplicate task created.

**Steps**
1. Start a fresh campaign.
2. Earn no renown.
3. Advance time by camping until Day 18 and beyond.
4. Continue to Day 19.

**Expected**

The player-facing promise “12 renown by day 18” should resolve into an ending, failure, late-game transition or other explicit campaign consequence when the deadline is crossed.

**Observed**

Play continued normally to **Day 19, 12am** with **Renown 0**. The goal card still read **12 renown by day 18** and no ending/failure transition surfaced.

**Player impact**

The campaign clock reads like a central objective but is not binding in this baseline, weakening urgency and making the stated 18-day structure feel cosmetic.

**Creative-director review needed?** No for requiring a clear deadline consequence; yes for the exact ending/failure structure.

**Evidence / state notes**

- GitHub Actions run: 37193163526
- Artifact: 11299248862
- Final screenshot visibly shows Day 19 alongside the unchanged Day 18 goal.

**Suggested acceptance test**

Crossing the campaign deadline must produce the appropriate authored late-game resolution exactly once, preserve the result across save/load, and prevent the goal card from remaining stale afterward.

---

### [S2] Mobile floating feedback can obscure an active decision sheet

**Recommended owner:** Agent 5 — The Wayfinder  
**Reproducibility:** Observed in the historical opening/route run  
**Existing queue checked:** Yes — already covered by **LR-0009 Phone-native interaction and accessibility pass** plus the mobile safe-area/floating-control contract; no duplicate task created.

**Steps**
1. Use a 390×844 touch/mobile Chromium viewport.
2. Travel into a plains/site event.
3. Observe the active bottom decision sheet while travel feedback is still visible.

**Expected**

Transient feedback and floating controls should never cover actionable modal/sheet choices.

**Observed**

The “Travelled into Plains” feedback surface overlaid the bottom portion of the “Signs of a Missing Caravan” decision sheet. The historical intro screenshot also showed the floating settings gear occupying the lower-right action region of the intro modal.

**Player impact**

A phone player can have a decision control partially hidden or visually competed with by secondary UI, increasing mis-taps and making the interface feel cramped.

**Creative-director review needed?** No.

**Evidence / state notes**

- GitHub Actions run: 37178112389
- Artifact: 11294028597
- Screenshot: `16-east-step-2.png`
- LR-0009 now explicitly requires the settings gear/floating controls not to overlap actionable buttons, so this is baseline evidence for that existing work.

**Suggested acceptance test**

At supported phone widths and enlarged text sizes, show travel/status feedback while a modal/bottom sheet is open and verify every action remains fully visible, reachable and unobscured.

## Existing-work routing summary

| Warden baseline evidence | Existing owner/task | What a later player should visibly notice |
| --- | --- | --- |
| Zero-ration camping remains comfortable | Agent 3 / LR-0016 | Running out of supplies creates sustained, readable expedition pressure and real trade-offs. |
| Generic camp events visibly repeat | Agent 2 / LR-0007 (+ authored LR-0046 pack) | Camp/travel scenes vary more and react to party/world state instead of immediately repeating. |
| Day 18 passes without resolution | Agent 2 / LR-0008 | The campaign deadline produces an explicit late-game outcome/ending rather than silently continuing. |
| Toast/settings UI covers decision space | Agent 5 / LR-0009 | On phone, settings/feedback moves out of the way and decision buttons remain unobscured. |

## Retest log

- **Next required retest:** LR-0140 on current main/current deployed after LR-0021 is closed.
- **Result:** Historical baseline only — do not mark current defects resolved or still reproducible from this report.
- **Notes:** Current main advanced substantially during this session. LR-0140 must record its own exact tested SHA and route only findings that remain reproducible.
