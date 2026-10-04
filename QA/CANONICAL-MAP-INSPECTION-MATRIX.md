# LR-0120 Canonical Map Inspection QA Matrix

Contract: `docs/CANONICAL-MAP-INSPECTION-UX.md`  
Canon: `world/map-canon.json`

| ID | Scenario | Expected |
|---|---|---|
| M01 | Inspect Hearthwick | Shows Hearthwick · B6; no travel unless Travel activated. |
| M02 | Inspect Greyfen Market | Shows canonical name and E5. |
| M03 | Inspect unnamed terrain | Shows derived grid ref + terrain only; no invented place name. |
| M04 | Pilgrim Ford before discovery | No name/icon/accessibility node/existence hint. |
| M05 | Smuggler's Cache before discovery | No name/icon/accessibility node/existence hint. |
| M06 | Hidden site after discovery | Canonical marker/name/grid ref becomes available normally. |
| M07 | PROPOSED concept label | No PROPOSED regional label appears as gameplay canon. |
| M08 | Overview zoom | Party/current objective/settlements win label priority; low-priority sites declutter. |
| M09 | Detail zoom | More known labels/grid detail may appear without revealing new knowledge. |
| M10 | Label collision | Canonical coordinates unchanged; lower-priority label hides/repositions. |
| M11 | Shared-hex occupancy | Inspection can represent multiple known places in one q/r. |
| M12 | Reachable known target | Reachability is non-colour-only and semantic Travel action exists. |
| M13 | Unreachable inspected target | Inspection allowed; Travel blocked with reason. |
| M14 | Quest marker | Appears only for known destination; does not obscure place identity. |
| M15 | World-state marker | Text-equivalent status available in inspection detail. |
| M16 | Screen reader | Current position/selection/reachable choices announced without reading whole map. |
| M17 | Extra Large phone | Inspection/legend readable; no map/action collision. |
| M18 | Legend open/close | Returns to same camera, selection and responsive-shell state. |

## Canon verification examples

Expected canonical references include:

- Hearthwick — B6
- Greyfen Market — E5
- Candlemere — H3
- Alderwatch — H7
- Blacksalt Crossing — D8
- Moonmere Tower — I5

These are examples for test readability. Runtime/QA must read canonical data rather than hard-code a competing registry.

## Evidence

For LR-0074/LR-0075 execution record:

- build identity;
- viewport/text mode;
- inspected canonical id/grid ref;
- discovery state;
- screenshot for label/declutter issues;
- accessibility label where applicable;
- whether travel occurred;
- pass/fail.
