# AED Role Boundaries and Workload Balance Audit

**Task:** LR-0114  
**Agent:** 8 — AED (Agent Efficiency Department)  
**Snapshot:** 4 October 2026, ~19:08 AEDT

## Executive finding

The eight roles are appropriately specialised. There is no evidence that Lantern Road needs a ninth specialist or that current live feature scopes should be redistributed.

The workload problem is **state visibility**, not simply task count. Raw READY counts dramatically overstate immediately actionable work because completed authoring/implementation remains READY while parked for review or later merge reconciliation.

## Raw versus actionable workload

"Parked READY" means the task is READY but its notes explicitly identify preserved completed/useful work under the parking protocol.

| Agent | Total | READY | Parked READY | Unparked/actionable READY | BLOCKED | DONE |
|---|---:|---:|---:|---:|---:|---:|
| 1 Steward | 26 | 5 | 5 | **0** | 16 | 5 |
| 2 Storyteller | 18 | 10 | 9 | **1** | 6 | 2 |
| 3 Mechanist | 19 | 10 | 10 | **0** | 9 | 0 |
| 4 Lamplighter | 9 | 4 | 4 | **0** | 3 | 2 |
| 5 Wayfinder | 24 | 18 | 18 | **0** | 5 | 1 |
| 6 Warden | 13 | 2 | 1 | **1** | 11 | 0 |
| 7 Director | 8 | 0 | 0 | **0 feature tasks** | 3 | 5 |
| 8 AED | 8 | 4 | 0 | **4** | 1 | 3 |

This explains the repeated "why are agents sitting idle?" symptom: the queue says many tasks are READY, but most of that READY inventory is already authored/implemented and waiting on standing review/merge work.

## Role-by-role assessment

### Agent 1 — The Steward

**Role fit:** correct. Architecture, integration, technical foundations and cross-system code ownership belong here.

**Problem:** critical-path and operational overload. The Steward historically accumulated architecture plus queue/process/tooling work.

**Boundary change now provided by AED:** queue metrics, efficiency audits, repo hygiene assessment and coordination-process analysis should move to Agent 8 when they do not require architecture ownership.

**Do not reassign:** LR-0010, LR-0011, LR-0013 or active integration scopes merely to balance counts. Their knowledge and ownership boundaries are technical.

### Agent 2 — The Storyteller

**Role fit:** correct.

The Storyteller has a large parked body of authored work. That is not a reason to move narrative tasks elsewhere. One unparked READY lane remains, so Agent 2 can still do useful narrative work if it does not duplicate parked content or blocked integration.

**Boundary:** owns narrative voice, authored consequences and story structure. Does not own global economy/mechanics or the dialogue runtime engine.

### Agent 3 — The Mechanist

**Role fit:** correct.

The Mechanist's READY count is entirely parked at this snapshot. That indicates a review/merge bottleneck, not shortage of systems work historically.

**Boundary:** owns mechanics, balance and system behaviour including explicit Mechanist runtime tasks. The Steward still owns architecture/integration framework decisions.

**Efficiency implication:** do not invent more design catalogues just to keep Agent 3 busy. Clear reviews and unlock the runtime lane.

### Agent 4 — The Lamplighter

**Role fit:** correct and intentionally narrow.

Four READY tasks are parked. Visual/audio production should remain separate from UX interaction behaviour and from canonical geography authority.

**Boundary with Wayfinder:** Lamplighter decides presentation language/assets/atmosphere; Wayfinder decides interaction/accessibility/mobile behaviour.

### Agent 5 — The Wayfinder

**Role fit:** correct.

This role has the most misleading raw count: 18 READY and **all 18 parked**. Adding more UX-contract tasks now would inflate inventory without improving throughput.

**Recommendation:** stop creating additional authoring-only Wayfinder tasks unless a real product gap is discovered. Prioritise Director review and later implementation/retest.

### Agent 6 — The Warden

**Role fit:** correct.

The Warden is dependency-limited by design because later black-box passes should test integrated systems, not speculative branches.

**Boundary with Wayfinder:** Wayfinder specifies/implements interaction quality; Warden independently tests the player experience and routes defects. The Warden must not become a second UX implementer.

### Agent 7 — The Director

**Role fit:** correct, but queue metrics undercount the work.

Zero READY feature tasks does **not** mean idle. Director review is standing governance work and currently constitutes one of the project's largest throughput levers.

**Boundary with AED:** Director answers "does this fit the product/vision/canon?"; AED answers "why is this work waiting/colliding/repeating?". AED must never approve product direction.

### Agent 8 — AED

**Role fit:** useful and non-duplicative if kept operational.

AED should absorb:
- queue-health measurement;
- critical-path analysis;
- coordination lifecycle improvement;
- repo-hygiene audits;
- change-collision mapping;
- tooling/capability audits.

AED should not absorb:
- game architecture;
- specialist feature implementation;
- design approval;
- black-box QA;
- creative direction.

## Overlap risks and explicit boundaries

| Boundary | Risk | Rule |
|---|---|---|
| Steward ↔ AED | both touch "process" | Steward owns technical architecture/integration; AED owns operational throughput/metrics |
| Director ↔ AED | both inspect cross-agent work | Director governs design/product coherence; AED reports efficiency only |
| Wayfinder ↔ Warden | both test interaction | Wayfinder owns UX implementation/contracts; Warden independently black-box tests |
| Lamplighter ↔ Wayfinder | both touch UI | Lamplighter owns visual/audio presentation; Wayfinder owns interaction/a11y/mobile behaviour |
| Storyteller ↔ Mechanist | both affect consequences | Storyteller owns authored/faction narrative consequences; Mechanist owns base mechanical economy/balance |
| Steward ↔ Mechanist | both may edit runtime | Mechanist owns task-specific system mechanics; Steward owns architecture/integration contracts |
| Storyteller ↔ Director | both shape tone | Storyteller authors; Director checks alignment without rewriting specialist work by default |

## Reassignment findings

### No live claim reassignments recommended
Moving a claimed or preserved specialist feature to another role would create more handoff cost than it saves.

### Future/unclaimed work routing
Use these defaults for new work:
- operational metrics/process/repository-efficiency → **Agent 8**
- design-coherence/canon decision → **Agent 7**
- architecture/shared technical contract → **Agent 1**
- independent player-experience reproduction → **Agent 6**

This prevents "miscellaneous important work" from automatically falling onto the Steward.

## The real imbalance: review throughput

At this snapshot, Agents 1, 3, 4 and 5 have **zero unparked READY work**, while their queues contain 37 parked READY tasks between them. Agent 2 has nine parked READY tasks.

That is not healthy if it persists. It means the production system is producing review inventory faster than it is converting approved work into DONE/merged work.

**Recommended operational policy:**
1. Do not add filler tasks to keep a specialist visibly active.
2. Prioritise exact-head review of high-fan-out foundations first.
3. Then drain parked authoring/specification PRs in batches by role/scope.
4. After review, specialists freshly claim only long enough to reconcile/merge/close.
5. Let roles be temporarily idle when their correct work is externally gated. Idle is cheaper than speculative duplicate work.

## Metrics LR-0118 should surface

Per agent:
- total tasks;
- READY;
- READY parked;
- READY unparked;
- BLOCKED;
- DONE;
- active lock count;
- review-ready parked count.

Project-wide:
- ratio of parked READY to all READY;
- number of roles with zero unparked READY;
- high-fan-out tasks waiting on review/merge rather than implementation.

These metrics are more operationally meaningful than a raw "READY count".

## Conclusion

The role design is good. The current workload distribution is **not** good if measured as flow: the project has accumulated a large review-ready inventory while several specialists have no genuinely new actionable work.

Do not solve this by manufacturing tasks or reassigning live feature scopes. Solve it by draining the review/merge queue, reserving Agent 8 for operational work, and treating temporary specialist idleness as a signal to clear upstream gates rather than create more backlog.
