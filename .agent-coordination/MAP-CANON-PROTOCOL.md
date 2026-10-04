# Lantern Road Map Canon Change Protocol

Version: 1.0  
Owner: **Agent 7 — The Director**

This protocol protects canonical geography from accidental drift while allowing deliberate evolution.

## Source of truth

Canonical map identity lives in:

- `world/map-canon.json`
- `docs/WORLD-MAP-CANON.md`

Gameplay content must agree with the canonical registry.

The illustrated terrain atlas is a rendering asset, not a source of gameplay coordinates.

## Changes that require a map-canon change

A dedicated map-canon change is required to:

- add a CANON settlement, site or region with gameplay identity;
- rename a CANON place;
- move a CANON place to another q/r or human grid reference;
- change a canonical place type in a way that alters world identity;
- retire/remove a CANON place;
- resize the canonical grid;
- change the meaning of q/r, the A–I/1–8 mapping or the projection contract.

Ordinary content, art, mechanics, UX and QA tasks must not make those changes opportunistically.

## Changes that do not require canon mutation

These may happen in their owning specialist tasks when they leave canonical identity/coordinates untouched:

- repainting or replacing the terrain atlas;
- visual label layout/collision fixes;
- changing a settlement illustration;
- changing fog/discovery presentation;
- new quest text that references an already-CANON place correctly;
- balance changes to travel cost;
- adding a PROPOSED regional label to a proposal/lore file;
- QA reports about mismatches.

## Proposal workflow

1. Check `world/map-canon.json`.
2. Describe the requested geography change and why existing canon cannot satisfy the need.
3. Record affected ids, names, q/r, grid references, save/story references and rendering implications.
4. Keep the proposed geography `PROPOSED` until approved.
5. Agent 7 reviews for product/lore/map coherence.
6. Escalate to Josh when the change is a genuine creative-direction decision rather than a mechanical correction.
7. Only after approval, implement the registry/docs change and any required migration/integration work.
8. Agent 1's LR-0070 enforcement must verify that protected changes use this workflow.

## Approval record

Map-canon mutations should carry a small record under:

```text
.agent-coordination/map-canon-reviews/<TASK-ID>.json
```

Recommended shape:

```json
{
  "schema_version": 1,
  "task_id": "LR-xxxx",
  "reviewer_agent_number": 7,
  "status": "APPROVED",
  "reviewed_head_sha": "FULL_SHA",
  "change_type": "ADD|MOVE|RENAME|RETIRE|IDENTITY|GRID|PROJECTION",
  "affected_place_ids": ["example_id"],
  "josh_approval_required": false,
  "notes": "Why this change preserves Grey March coherence."
}
```

LR-0070 owns the exact automated enforcement mechanics.

## Stable coordinate rule

For Map Canon v1:

- `q = 0…8` maps to columns `A…I`;
- `r = 0…7` maps to rows `1…8`;
- the grid ref is derived, never independently authored.

A place can be referred to naturally as:

> Greyfen Market (E5)

But dialogue should normally say “Greyfen Market”, not “E5”, unless characters are explicitly discussing maps/navigation.

## Generated-art rule

Text or symbols produced by image generation are visual suggestions.

They do not become canon by appearing convincingly in an image.

Agent 4 may deliberately generate a label-free terrain atlas. If labels are generated during concept work, classify them as PROPOSED until reconciled.

## Save compatibility

Persisted geography is sensitive.

Do not change canonical ids or q/r semantics merely to make the illustrated map easier to fit.

If a deliberate canon change affects existing saves, coordinate with the Steward's save/versioning contract before merge.

## Shared-hex rule

More than one authored location may intentionally occupy the same canonical gameplay hex.

Validators must therefore enforce:

- unique place ids;
- valid q/r bounds;
- correct derived grid refs;
- agreement with gameplay data;

but must **not** blindly enforce one place per hex.


## Automated enforcement

LR-0070 adds two independent checks.

### Registry/gameplay validator

`node scripts/validate-map-canon.mjs` verifies:

- the canonical coordinate model and bounds;
- unique stable place ids;
- recognised CANON / PROPOSED / RETIRED statuses;
- derived human grid references;
- settlement/site place types;
- registry agreement with `content.js` ids, names, kinds and q/r coordinates;
- the canonical starting location;
- that PROPOSED/RETIRED places are not active gameplay geography.

Multiple canonical places in the same q/r hex are explicitly allowed.

### Protected-change approval guard

On pull requests, `node scripts/verify-map-canon-change.mjs` compares the PR base and head.

Changes to PROPOSED concept labels or explanatory text do not by themselves count as protected geography mutation.

A change to protected canonical identity requires a **final review-only commit** containing exactly:

```text
.agent-coordination/map-canon-reviews/<TASK-ID>.json
```

That record must:

- be authored/reviewed by Agent 7;
- have `status: "APPROVED"`;
- name the exact preceding commit in `reviewed_head_sha`;
- use an allowed `change_type`: `ADD`, `MOVE`, `RENAME`, `RETIRE`, `IDENTITY`, `GRID` or `PROJECTION`;
- list every changed canonical place id in `affected_place_ids`;
- explicitly state whether Josh approval was required.

If `josh_approval_required` is true, the record must also contain `josh_approved: true`.

Any later code/canon commit after approval makes that approval stale.

Deleting an existing protected id outright is rejected. Retire it so ids remain reserved for saves and historical references.
