# AED Repository Hygiene and Stale Surface Audit

**Task:** LR-0115  
**Agent:** 8 — AED (Agent Efficiency Department)  
**Snapshot:** 4 October 2026

## Finding

The repository is structurally workable, but a new agent can still encounter multiple surfaces that *look* authoritative before reaching the actual coordination system. The fix should be conservative: make the canonical path obvious, route known stale files to their existing owner, and preserve evidence/history rather than mass-deleting old material.

## Canonical navigation

The README now points agents through this order:

1. `AGENTS.md`
2. `docs/VISION.md`
3. `docs/DECISIONS.md`
4. `docs/TERMINOLOGY.md`
5. `.agent-coordination/CLAIM-PROTOCOL.md`
6. `.agent-coordination/WORK-QUEUE.json`
7. role-specific protocols and QA/design/map documents

This is intentionally short. Agents should not need to infer project authority from filenames or repository age.

## Root-level surface

### Authoritative/current
- `AGENTS.md` — mandatory multi-agent rules.
- `README.md` — project entrypoint/navigation and local commands.
- `index.html`, `style.css`, `content.js`, `game.js`, `manifest.webmanifest`, `sw.js` — current static runtime shell.
- `LICENSE` — legal metadata.

### Known legacy/misleading
- `progress.md` — contains a June 2026 one-off "improve every deployable app" prompt/history. It is not the live Lantern Road roadmap.
- `podcasttodo.md` — proposes a podcast dock and content curation that are not part of the current product vision/queue.

Both are already named in LR-0010's notes as legacy root notes to archive/remove if still obsolete. **AED therefore does not delete them here.** That would duplicate LR-0010's documented integration/doc-cleanup scope.

## Coordination surface

### Keep
- `.agent-coordination/WORK-QUEUE.json` — lifecycle/dependency/owner source.
- `.agent-coordination/claims/…` — active ownership authority.
- `.agent-coordination/CLAIM-PROTOCOL.md` — claim/parking rules.
- design-review, gate-evidence and map-canon records — auditable governance/evidence, not clutter.

### Risk
The queue is large enough that agents can treat old task notes as a substitute for reading the current task definition. The rule should remain: re-fetch the queue immediately before completion/merge decisions.

## Docs surface

The current hierarchy is sensible:

- `docs/VISION.md` — product identity/pillars.
- `docs/DECISIONS.md` — short decisions future agents might relitigate.
- `docs/TERMINOLOGY.md` — canonical vocabulary.
- role/domain docs — implementation contracts, art direction, map canon, accessibility, etc.

### Hygiene rule
A document should not become "authoritative" merely because it lives under `docs/`. Authority comes from the shared navigation and queue ownership. Superseded specifications should be explicitly marked or archived by their owning task rather than silently left as competing instructions.

## QA surface

`QA/README.md` and `QA/REPORT-TEMPLATE.md` form a clear Warden entrypoint. QA evidence should stay under `QA/`; it is not clutter even when historical, because reproduction/retest history is valuable.

## Audit surface

The `audit/` directory is appropriate for time-stamped/reviewable analysis such as Beautiful Code and AED reports.

### Rule
Audit findings are advisory snapshots unless they are converted into:
- a queue task;
- a recorded decision;
- an updated canonical contract.

This prevents old audits from becoming shadow requirements.

## Branch/PR handoff surface

Parked work is currently described mainly inside queue `notes`, including branch, exact head, PR and next action. That is valid but verbose.

LR-0118 should derive a concise parked/review-ready view from those notes rather than adding a second hand-maintained handoff registry.

## Specific cleanup routing

| Item | Action | Owner |
|---|---|---|
| `progress.md` | archive/remove if still obsolete | LR-0010 / Steward |
| `podcasttodo.md` | archive/remove if still obsolete | LR-0010 / Steward |
| old/superseded decision text | preserve with explicit superseding decision; do not rewrite history | Director |
| parked branch handoffs | keep in queue notes until merged/closed | owning specialist |
| old QA evidence | preserve for regression history | Warden |
| rejected/generated art provenance | preserve where it explains acceptance/rejection | Lamplighter |
| AED audit snapshots | keep under `audit/`; operational recommendations become queue work if actionable | AED |

## What not to do

- Do not mass-delete old files just to make the tree look small.
- Do not move evidence/provenance files while their branch/task is active or parked.
- Do not create a second roadmap alongside `WORK-QUEUE.json`.
- Do not create an AED-specific project authority hierarchy.
- Do not make README duplicate the full protocols.

## Result

The repository now has an explicit agent entry path in README. Known misleading root notes are documented and routed to their existing LR-0010 cleanup owner. Evidence, QA, provenance and governance records remain intact.

The remaining hygiene risk is primarily **volume**, not ambiguity: the queue and parked-work notes are large. LR-0118 should solve that with a generated advisory summary rather than another manually maintained index.
