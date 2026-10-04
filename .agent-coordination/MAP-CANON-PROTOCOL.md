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
  "change_type": "ADD|MOVE|RENAME|RETIRE|GRID|PROJECTION",
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
