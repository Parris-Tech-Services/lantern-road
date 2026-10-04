# AED Agent Tooling and Capability Matrix

**Task:** LR-0113  
**Agent:** 8 — AED (Agent Efficiency Department)  
**Snapshot:** 4 October 2026

## Purpose

This audit checks whether each specialist role can actually satisfy its queue acceptance criteria with an explicit tool/evidence path. It does not assume that reading source is equivalent to browser testing, that generated art is equivalent to committed production assets, or that an agent can perform Josh-only device evidence.

## Capability classes

| Capability | Repository-provided path | External/session capability | Human-only? |
|---|---|---|---|
| Git/repository edits, branches, PRs | GitHub repository + claim protocol | GitHub connector/API/UI | No |
| Coordination validation | `scripts/validate-agent-coordination.mjs` + Actions | Node locally or Actions | No |
| Content integrity | `scripts/validate-content.mjs` + Actions | Node locally or Actions | No |
| Real-browser gameplay QA | QA contract; LR-0013 parked harness | Playwright / agent-browser / equivalent | No |
| Service-worker/PWA behavioural QA | Browser + SW scenarios | Chromium/real browser | No |
| Image generation | LR-0042 workflow/shot briefs on parked branch | Image-generation capability | No |
| Asset provenance | Manifest/docs produced in art branches | Git + generation metadata | No |
| Android physical-device validation | gate-evidence contract | Physical Android phone | **Yes — Josh** |
| Director exact-head review | design-review protocol | GitHub PR/commit inspection | No |
| CI artifact verification | Actions + gate-evidence verifier | GitHub Actions read access | No |
| Audio production | Web Audio already exists; LR-0032 future asset pass | Browser/audio-asset creation/source capability | No, but source capability may vary |

## Agent 1 — The Steward

### Needs
- GitHub repository write access.
- Branch/PR/merge and Actions inspection.
- Node validation commands.
- Real-browser regression capability for LR-0013 and runtime integrations.
- Ability to inspect/test static browser files without introducing an unnecessary build framework.

### Current support
Strong. Main already contains coordination, action-runtime and content-integrity validation. LR-0013 has a successful real-browser harness on a parked branch.

### Gap
The reusable Playwright/browser harness is not yet on `main`, so downstream agents cannot rely on one canonical repository command today.

### Fallback
Until LR-0013 merges, use a real browser externally for player-visible changes and preserve evidence in the relevant PR/QA report. Never replace this with DOM/source inspection.

## Agent 2 — The Storyteller

### Needs
- Repository text authoring.
- Canon/terminology access.
- Search across existing story, tasks and decisions.
- Ability to produce durable authoring artifacts separately from runtime integration.

### Current support
Strong. The author-now/integrate-later split is working and avoids requiring browser/runtime tooling for prose tasks.

### Gap
None material for pure authoring. Runtime consequence integration remains intentionally gated and should not be simulated inside prose tasks.

### Fallback
If runtime integration is blocked, continue only durable authored content/specification already represented by a queue task; do not create a parallel dialogue/quest engine.

## Agent 3 — The Mechanist

### Needs
- Repository text/data authoring.
- Calculations/model reasoning.
- Runtime/browser testing once systems are integrated.
- Shared save/economy/action contracts.

### Current support
Strong for specification/model work. Many Mechanist tasks are deliberately author-now.

### Gap
Integrated balance cannot be credibly finalised until the runtime foundations and browser harness are available.

### Fallback
Use scenario matrices, explicit target ranges and deterministic specifications now; reserve real balance claims for downstream runtime/QA tasks.

## Agent 4 — The Lamplighter

### Needs
- Image generation for LR-0042 and terrain/asset production.
- Binary asset commit/handling.
- Provenance/manifest capture.
- Browser/device visual inspection for final integration.
- Potential audio sourcing/production capability for LR-0032.

### Current support
Image production has already produced usable parked branches, so the capability path exists. Map canon rules correctly prevent generated labels from silently becoming geography.

### Gaps
1. Image generation is not reproducible from repository commands alone.
2. `docs/ART-PROVENANCE.md` is not currently on `main`; provenance lives with parked art work.
3. Future bespoke audio production may require a sound-asset source/tool not defined by the repository.

### Fallback
- Keep generation/source creation as a separate task from runtime integration.
- Record generation IDs/prompts/provenance with every accepted asset.
- If no legitimate audio creation/source capability is available, complete direction/specification work only and leave production/integration unclaimed rather than fabricating assets.

## Agent 5 — The Wayfinder

### Needs
- Browser/device interaction testing.
- Accessibility inspection.
- Touch, viewport, safe-area and PWA lifecycle testing.
- Android/browser compatibility checks.
- Repository authoring for UX contracts.

### Current support
Strong for authoring and browser-oriented specifications. Multiple real-browser/manual matrices already exist on parked branches.

### Gap
A real physical Android device cannot be substituted by an AI browser when the acceptance criteria explicitly require Josh's device confirmation.

### Fallback
Complete machine/browser evidence, park the task, and hand Josh one concise device checklist. Never self-assert the human result.

## Agent 6 — The Warden

### Needs
- **Mandatory real browser** via Playwright, agent-browser or equivalent.
- Ability to reproduce/save evidence.
- Access to exact build/commit under test.
- Queue search for duplicate findings.

### Current support
The QA contract is clear and the report template is good.

### Gap
Main does not yet provide the canonical LR-0013 browser harness. This is the most important tooling gap for Agent 6.

### Fallback
Use an available real-browser engine externally and record the automation method in the QA report. If no real browser is available in a session, do not claim a black-box task; source inspection can prepare a test plan but cannot satisfy it.

## Agent 7 — The Director

### Needs
- GitHub PR/commit inspection.
- Exact-head comparison.
- Ability to write only the design-review record on specialist branches.
- Vision/decision/terminology access.

### Current support
Strong and well-defined.

### Gap
Not a missing tool: the main issue is discoverability/prioritisation of the review inbox. Many parked tasks require review but the queue's READY count does not expose that standing workload.

### Fallback
A derived AED review-ready report should list parked PRs awaiting Director review without creating another status or approval gate.

## Agent 8 — AED

### Needs
- Queue/claim/PR/commit inspection.
- Deterministic graph/report calculations.
- Repository text/script/test authoring for operational tooling.
- No feature implementation permissions by default.

### Current support
Strong. LR-0118 will turn repeated manual calculations into a local deterministic report.

### Boundary
AED must not use its broad visibility as authority to approve design, merge another role's feature without ownership, or weaken evidence requirements.

## Capability-sensitive task classes

### Real-browser required
Tasks involving black-box QA, service-worker behaviour, mobile interaction, deployed smoke testing, or explicit browser regression must have a browser engine. Source-only completion is invalid.

**Recommended split:** author test matrix/specification separately where useful; execute/close only in a real-browser task.

### Image-generation required
LR-0042 and related source-art production require an actual image generation/source capability.

**Recommended split:** generation/source + provenance first; curation/compression/runtime integration later. This split already exists and should be retained.

### Android human evidence required
Current LR-0011/LR-0013 closure policy requires Josh's explicit Android confirmation. Agents cannot satisfy this capability.

**Recommended split:** technical machine evidence versus human release validation, as LR-0055 proposes. Until that policy change merges, follow the current stricter rule.

### GitHub Actions evidence required
Evidence-gated tasks require an exact candidate SHA, successful workflow run and required unexpired artifact names.

**Fallback:** if Actions access is unavailable, park the task with exact branch/head and do not claim VERIFIED/DONE.

### Service-worker/offline behaviour
Static source validation cannot prove update/offline lifecycle behaviour.

**Fallback:** use Chromium/real browser service-worker scenarios, as LR-0050's parked evidence demonstrates.

## Recommended operational improvements

1. **Merge LR-0013 early.** It is both a product safety gate and a reusable capability provider for Steward/Warden/Wayfinder work.
2. **Expose a "required capability" field in AED reporting, not necessarily the queue schema.** Derive from task text initially to avoid schema churn.
3. **Add review-ready visibility.** Director capacity is a workflow/tooling issue, not an absence of tasks.
4. **Keep human checks explicit and scarce.** Batch concise Android checks only when a candidate is genuinely ready; do not repeatedly interrupt Josh for intermediate builds.
5. **Do not let tool absence degrade acceptance criteria.** Split or park the work instead.
6. **Document canonical commands on main as foundations merge.** A task should not require agents to reverse-engineer old PR notes to learn how to test it.

## Conclusion

No specialist role is fundamentally missing the tools needed for its *authoring* responsibilities. The meaningful capability gaps are at the boundaries:

- the canonical real-browser harness is still parked rather than on main;
- image/audio production depends on session capabilities not reproducible purely from repository scripts;
- Android physical-device evidence is deliberately human-only;
- Director review work is operationally hidden.

The correct efficiency response is explicit fallback/handoff paths and capability-aware task splitting, not lowering the quality bar.
