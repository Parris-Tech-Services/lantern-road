# AED Critical Path and Dependency Fan-out Audit

**Task:** LR-0112  
**Agent:** 8 — AED (Agent Efficiency Department)  
**Snapshot:** 4 October 2026, ~19:00 AEDT

## Executive finding

Lantern Road's bottleneck is not a shortage of READY work. It is a small set of high-fan-out foundations combined with a large parked-review backlog.

The most important distinction is:

- **technical dependency** — downstream work genuinely needs an API/schema/runtime foundation;
- **integration dependency** — authoring can proceed but final runtime merge must wait;
- **review dependency** — implementation is already useful/complete and is waiting for exact-head Director review or fresh merge ownership;
- **human evidence dependency** — a release/closure check only Josh can perform;
- **queue visibility problem** — work is available or completed, but the raw READY/BLOCKED counts obscure its real state.

Do not fix this by removing dependencies indiscriminately. The current gates mostly exist for good reasons. Fix the *waiting path* around them.

## Fan-out ranking

Transitive fan-out counts every unfinished downstream task reachable through `depends_on`.

| Rank | Task | Owner | Status | Direct fan-out | Transitive fan-out | Interpretation |
|---:|---|---:|---|---:|---:|---|
| 1 | LR-0009 Phone-native interaction/accessibility | 5 | READY, parked | 10 | **45** | Large first-wave gate; implementation already preserved |
| 2 | LR-0005 World/faction consequences | 2 | READY | 11 | **41** | First-wave content/runtime gate |
| 3 | LR-0006 Progression/builds | 3 | READY, parked | 10 | **41** | First-wave systems gate; preserved branch exists |
| 4 | LR-0010 Architecture modularisation | 1 | BLOCKED | 29 | **40** | Central next-wave runtime gate |
| 5 | LR-0013 Browser regression harness | 1 | READY, parked | 32 | **38** | Largest direct technical/testing gate |
| 6 | LR-0011 Save versioning/migration | 1 | READY, parked | 24 | **30** | Shared persistence contract |
| 7 | LR-0103 Leader mechanical role | 3 | READY, parked | 6 | **14** | New four-person roster contract |
| 8 | LR-0094 Action economy spec | 3 | READY, parked | 3 | **14** | Combat/repeatability design input |
| 9 | LR-0106 Roster check viability | 3 | READY | 1 | **14** | Content viability gate for Leader transition |
| 10 | LR-0125 Leader actor/runtime foundation | 3 | BLOCKED | 5 | **13** | Future runtime convergence point |

The apparent ranking needs context: LR-0009 and LR-0006 have higher *transitive* reach than LR-0013 because they sit earlier in long chains, but LR-0013 is the most important **shared machine-confidence gate** because 32 unfinished tasks depend on it directly.

## Longest unfinished chains

The longest unfinished dependency chains are currently seven edges deep and originate from LR-0005, LR-0006 and LR-0009. LR-0010, LR-0011 and LR-0013 sit on chains up to six edges deep.

This means delays at the first-wave + foundation layer amplify through almost the entire roadmap. Conversely, completing small leaf authoring tasks improves local progress but does not materially shorten project lead time unless their Director-review backlog is also cleared.

## What is genuinely technical

These dependencies should remain hard gates unless the owning specialist deliberately changes the contract:

### LR-0011 — save versioning
Downstream systems that change persisted state genuinely need one save schema/migration policy. Removing this dependency would recreate parallel persistence assumptions.

### LR-0013 — regression harness
Shared runtime integrations need a repeatable real-browser safety net. Removing it would trade queue speed for integration risk.

### LR-0010 — architecture modularisation
The queue shows 29 direct dependents and the collision audit already points to `game.js`/`content.js` concentration. Second-wave runtime work should not pile into the monolith before the extraction/integration plan lands.

### LR-0005 / LR-0006 / LR-0009
These are grandfathered first-wave changes that later content, systems and UX assume. They must be reconciled against the final save/browser foundations rather than bypassed.

## What is avoidable process waiting

### 1. Parked work waiting on Director review

A large number of READY tasks are not "unstarted". Their notes contain complete authored/implemented branches and a next action of exact-head Agent 7 review followed by a fresh merge claim.

Examples include:
- LR-0011, LR-0013
- LR-0044, LR-0045, LR-0046, LR-0047
- LR-0050, LR-0051, LR-0052, LR-0053, LR-0055, LR-0057
- LR-0077 through LR-0088 across multiple specialist lanes
- LR-0092, LR-0094, LR-0095
- LR-0102, LR-0103, LR-0107, LR-0108, LR-0110
- newer asset/tooling tasks such as LR-0121, LR-0123 and LR-0124

The parking protocol is correct: agents should release their locks. The inefficiency is that **review-ready work is not surfaced as a review inbox**, so the Director's highest-leverage work is hidden inside notes.

**Recommendation:** LR-0118 should report a derived "parked/review-ready" count and list, without introducing a new lifecycle status.

### 2. Foundation policy itself is parked

LR-0055 is specifically intended to decouple technical foundation completion from Josh-only release validation. Its implementation is parked awaiting Director review.

Until LR-0055 lands, current repository rules still say LR-0011/LR-0013 need Josh's Android confirmation to close. That can make machine-complete development gates remain open for human evidence.

**Recommendation:** Director should prioritise LR-0055 alongside LR-0011/LR-0013 because it clarifies whether downstream development waits on technical confidence or release validation.

### 3. Merge ownership reacquisition is necessary but repetitive

Fresh ownership before reconciliation/merge is a useful safety guarantee. The avoidable part is the amount of manual state reconstruction each time. LR-0117 should identify which verification/reconciliation steps can be scripted without weakening ownership.

## Dependency edits: what AED recommends now

### Do not remove
AED recommends **no immediate deletion** of LR-0010, LR-0011 or LR-0013 dependencies. They encode real architecture, persistence and verification boundaries.

### Do not reassign live scopes
No live feature claim should move merely to make the workload chart look balanced. Parked branches also do not grant AED authority to merge specialist code.

### Prefer these safe sequencing changes
1. Prioritise Director review of **LR-0055 → LR-0013 → LR-0011** and other high-fan-out parked foundations.
2. As those foundations merge, let owners freshly reconcile **LR-0005/LR-0006/LR-0009** against them.
3. Complete **LR-0099** before LR-0010 implementation; use AED's collision evidence as input, not as a competing architecture plan.
4. Continue pure authoring/assets/specification work only where it produces durable inputs and does not increase shared-runtime collision.
5. Avoid adding more runtime-dependent tasks until the first-wave/foundation layer starts turning DONE.

## Critical-path operational order

The current highest-leverage operational order is:

1. **Director/review queue:** LR-0055, LR-0013, LR-0011 and other parked foundations/tooling.
2. **Steward closure:** merge/close technical foundations under fresh claims once approvals are current.
3. **First-wave reconciliation:** LR-0005, LR-0006, LR-0009 against the merged foundations.
4. **Architecture:** LR-0099 then LR-0010.
5. **Second-wave integrations:** unlock the broad BLOCKED runtime queue.
6. **Warden passes:** execute the appropriate QA waves after their owning foundations are actually on main.

This order attacks fan-out rather than simply maximising the number of concurrently active branches.

## Queue-health metrics worth automating

LR-0118 should compute at least:

- per-agent total / READY / BLOCKED / DONE;
- active claims by agent;
- direct incomplete dependency fan-out;
- transitive incomplete dependency fan-out;
- longest downstream chain length;
- READY tasks whose notes indicate `PARKED`;
- parked tasks that mention Director review/approval;
- BLOCKED tasks whose listed dependencies are all DONE (queue inconsistency);
- READY tasks with incomplete normal dependencies (queue inconsistency);
- agents with no READY task but standing parked-review responsibilities should be reported separately, not labelled idle.

## Conclusion

The dependency graph is strict but mostly rational. The biggest efficiency gain is not weakening it; it is **turning already-completed parked foundations into merged foundations faster**, making the review queue visible, and then shortening the monolithic runtime collision surface through LR-0099/LR-0010.

The project's true critical path is therefore both technical and procedural: **review/merge the machine-ready foundations, reconcile the grandfathered first wave, then modularise before the next runtime wave.**
