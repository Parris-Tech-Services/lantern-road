# Lantern Road — Decision Log

Keep this short. Record decisions that future agents would otherwise relitigate.

| Date | Decision | Why |
|---|---|---|
| 2026-10-04 | Target **premium indie**, not literal AAA scope. | The project is a compact browser RPG; polish, consequence and coherence matter more than production scale. |
| 2026-10-04 | Seven roles: Steward, Storyteller, Mechanist, Lamplighter, Wayfinder, Warden, Director. | Specialist ownership plus independent QA and design governance reduces duplicated work and drift. |
| 2026-10-04 | Warden reports and retests; it does not silently fix specialist features. | Keeps QA independent and routes defects to accountable owners. |
| 2026-10-04 | Black-box QA must drive a real browser. | Reading code/DOM is not equivalent to experiencing the game. |
| 2026-10-04 | Josh is creative director and final judge of fun/premium feel. | Fun is subjective; agents provide evidence, not authority. |
| 2026-10-04 | PRs stay small: one claimed task/scope, no unrelated cleanup. | Reduces merge collisions and makes review/retesting tractable. |
| 2026-10-04 | Current in-flight wave (LR-0003/0005/0006/0009) is grandfathered; LR-0011 and LR-0013 gate state-changing merges. | These branches existed before the architecture critique; invalidating them would waste work. |
| 2026-10-04 | LR-0010 modularises the monolith **after** the grandfathered wave and gates the next wave. | Splitting game.js/content.js underneath active branches would create the very conflicts we are trying to avoid. |
| 2026-10-04 | Storyteller owns faction consequence/modifier logic; Mechanist owns global base economy/prices. | Prevents LR-0005 and LR-0016 from both “balancing prices”. |
| 2026-10-04 | LR-0031 requires real committed illustration assets. | A second placeholder/sigil layer does not satisfy art production. |
| 2026-10-04 | Implementation PRs from Agents 1–5 require a final Director approval commit tied to the exact reviewed code head. | Prevents tone/terminology/scope drift and makes later code changes invalidate stale design approval. |
| 2026-10-04 | LR-0011 and LR-0013 cannot close on owner assertion: they require verified GitHub Actions evidence/artifacts, Agent 7 evidence review, and Josh's explicit Android phone check. | These are foundation gates for later save-changing work; machine evidence plus a real-device human check is stronger than AI self-attestation. |
| 2026-10-04 | Director review distinguishes **pillar drift** from local implementation variation; only changes that materially alter or undermine a vision promise, non-goal or recorded decision are design-governance blockers. | Prevents governance from turning ordinary implementation preference into product-direction authority while still catching real identity/scope drift. |
| 2026-10-04 | Canonical player-facing terminology may differ from legacy internal identifiers; cosmetic governance work must not rename persisted ids/save keys without an owning migration task. | Keeps UI language coherent without creating accidental save-compatibility or cross-agent work. |

| 2026-10-04 | Pure authoring/asset generation may proceed before LR-0010, but second-wave repository/runtime integration must wait for the LR-0010 architecture gate. | Preserves useful parallel work without reopening game.js/style.css collision risk during the grandfathered foundation wave. |
| 2026-10-04 | LR-0035 Director coherence review precedes LR-0014 Steward integration. | The Director diagnoses/routs design conflicts; the Steward then integrates cross-system fixes, preventing duplicate audits and blurred ownership. |
| 2026-10-04 | LR-0011 owns save schema/version/migration policy and LR-0016 owns global economy targets; specialist tasks consume those contracts rather than creating parallel persistence or pricing systems. | Keeps save compatibility and balance assumptions coherent across mobile, progression, equipment, injury and encounter work. |
| 2026-10-04 | Final release-candidate Warden QA must be downstream of all targeted specialist QA passes, not only narrative/combat/mobile checks. | Prevents the final gate from running before interaction, persistence, exploit, quest-state and onboarding risks have been exercised. |

| 2026-10-04 | Manual Save and Autosave are separate device-local slots; starting a new campaign may replace Autosave but never overwrites Manual Save unless the player presses Save Manual. | Makes phone resume convenient without turning autosave into a destructive or ambiguous checkpoint. |

## How to add a decision

Add one row when a task changes architecture, product direction, ownership boundaries, save compatibility, testing policy, or another choice that future agents are likely to revisit.

Do not log ordinary implementation details.
