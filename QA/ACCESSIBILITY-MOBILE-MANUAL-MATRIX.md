# Accessibility & Mobile Manual Test Matrix

Task source: LR-0051  
Consumers: LR-0039, LR-0022, LR-0029  
Contract: `docs/ACCESSIBILITY-INTERACTION-SPEC.md`

This matrix is intentionally concise and player-observable. Runtime implementation belongs to LR-0039; Agent 6 uses the relevant scenarios for independent black-box QA.

## Evidence to capture

For each executed case record:

- build/commit;
- browser/device or emulated viewport;
- input mode;
- text/contrast/reduced-motion setting;
- pass/fail;
- screenshot or short recording for visual/reachability defects;
- focused element / spoken announcement text for keyboard or screen-reader defects;
- reproduction steps for any failure.

## Representative configurations

| Code | Viewport/device | Input | Accessibility state |
|---|---|---|---|
| P320 | 320 x 700 portrait | Touch | Standard text |
| P320-X | 320 x 700 portrait | Touch | Extra Large text |
| P360-HC | 360 x 780 portrait | Touch | Large text + High Contrast |
| P390 | 390 x 844 portrait | Touch | Standard text |
| P430-RM | 430 x 900 portrait | Touch | Extra Large + reduced motion |
| KB | Desktop or phone with hardware keyboard | Keyboard only | Standard, then Extra Large |
| SR | Android TalkBack or equivalent screen reader | Swipe/focus + activation | Standard, then Extra Large |

## Manual scenarios

| ID | Surface | Setup / actions | Pass criteria | Primary consumer |
|---|---|---|---|---|
| T01 | One-handed navigation | P320. Start a campaign. Switch Context → Journal → Party → Log repeatedly with one thumb. | Tabs are reachable, do not overlap content/safe area, selected state is obvious, no accidental neighbouring activation. | LR-0029 |
| T02 | Map travel | P360-HC. Pan and zoom the map, then travel to an adjacent hex using touch. Repeat using the large semantic travel alternative. | Drag does not accidentally travel; zoom/centre controls are targetable; both travel paths cause the same destination/result feedback. | LR-0029 / LR-0022 |
| T03 | Narrow enlarged text | P320-X. Open Settings, Context actions, a dialogue/event and a shop. Scroll each surface. | No horizontal page scroll, clipped labels or unreachable Close/choice buttons; buttons wrap and remain targetable. | LR-0029 |
| T04 | Floating controls | P390. Open/close Settings and exercise bottom tabs while any shared launcher/dock is present. | No floating control obscures tabs, Close, choices or primary actions. | LR-0029 |
| T05 | Save/load touch | P390. Update Manual Save, continue until Autosave changes, open Load, choose each slot in separate checks. | Slots are named distinctly; success/failure is visible; loading one slot does not silently overwrite the other. | LR-0022 / LR-0029 |
| K01 | Travel without pointer | KB. Do not touch mouse/touchscreen. Navigate from page start to map/travel controls and travel to a neighbouring hex. | Current position and travel choices are understandable; travel completes with Enter/Space and visible feedback; canvas precision is unnecessary. | LR-0039 / LR-0022 |
| K02 | Tabs | KB. Focus the tab set, use Left/Right and Home/End, activate tabs. | Focus order is predictable; only one tab is selected; active panel corresponds to selected tab; focus indicator remains visible. | LR-0039 |
| K03 | Shop keyboard loop | KB. Open a market, buy/sell where possible, Tab/Shift+Tab across controls, then Escape. | Focus enters modal, stays inside, remains sensible after rerender, Escape closes, focus returns to Visit the market. | LR-0039 / LR-0022 |
| K04 | Dialogue/event keyboard loop | KB. Open dialogue and a travel/camp/site choice. Select branches using keyboard only. | Heading is encountered before choices; Enter/Space selects once; new scene receives focus; required choices cannot be bypassed with Escape. | LR-0039 / LR-0022 |
| K05 | Combat keyboard completion | KB. Enter combat and complete it without pointer input. | Action selection, target selection and turn progression are all keyboard operable; focus never escapes behind combat; disabled/dead targets are skipped. | LR-0039 / LR-0022 |
| F01 | Modal focus return | KB. Open each modal type from a known opener and close it through Close/Escape where allowed. | Focus returns to opener or documented logical fallback; no close leaves focus on body/browser chrome. | LR-0039 |
| SR01 | Map/travel semantics | SR. Explore map area and available travel alternatives. | Screen reader announces region/current position and meaningful adjacent travel labels; actionable travel is not hidden inside canvas only. | LR-0039 |
| SR02 | Dialog semantics | SR. Open shop, dialogue/event and Settings. Swipe through controls and close. | Dialog title is announced, background controls are not traversed, choices have meaningful names/states, focus returns after close. | LR-0039 |
| SR03 | Combat announcements | SR. Play several combat turns including status effects and target choice. | Party/enemy turn and consequential result are announced once; action/target labels contain needed HP/status context; entire combat log is not repeatedly announced. | LR-0039 |
| V01 | High Contrast | P360-HC and KB. Exercise tabs, disabled actions, selected combat action and focus indicators. | Meaning is not colour-only; selected/disabled/focus states remain distinguishable and text remains readable. | LR-0039 / LR-0029 |
| M01 | Reduced motion | P430-RM. Travel, open modals and complete combat actions. | Non-essential motion is removed/shortened; no information or completion state depends on animation; feedback remains visible. | LR-0039 / LR-0029 |
| A01 | Blocked actions | KB and P320. Attempt at least one insufficient-gold/item/unavailable action. | Disabled or rejected action explains why in player language; no silent state mutation; explanation is available visually and semantically. | LR-0022 |
| R01 | Rerender focus stability | KB. Trigger a purchase, item use, tab update and combat action that rerenders UI. | Focus remains on same logical control when possible or moves to a documented nearby fallback; never resets unpredictably to page start. | LR-0039 |

## Completion expectation for LR-0039

Before LR-0039 is considered implementation-complete, all keyboard/screen-reader contract cases above should pass in a real browser. Phone-specific cases should then be handed to Agent 6 for independent LR-0022/LR-0029 black-box confirmation rather than self-certifying subjective one-handed comfort.
