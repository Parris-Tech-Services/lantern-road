# LR-0110 Back-Navigation QA Matrix

Contract: `docs/MOBILE-BACK-NAVIGATION-CONTRACT.md`

| ID | Surface | Input | Expected |
|---|---|---|---|
| N01 | Settings | Android/browser Back | Close Settings before page exit where supported; restore opener focus. |
| N02 | Settings | Escape | Close Settings; no browser navigation. |
| N03 | Map expanded | Back | Return to prior shell state; camera preserved. |
| N04 | Load chooser | Back | Close chooser; no load/write. |
| N05 | New Campaign confirmation | Back/Escape | Cancel destructive action. |
| N06 | Required dialogue | Back/Escape | Cannot bypass required choice. |
| N07 | Active combat | Back/Escape | Combat remains active; no undo/exit. |
| N08 | Shop | Back | Close shop; completed transactions remain completed. |
| N09 | PEEK/STANDARD/EXPANDED snapping | Back | No history chain created by snap states. |
| N10 | Context/Journal/Party/Log switching | Back | No traversal through every tab visit. |
| N11 | Root core play | Browser/system Back | User can leave normally; no Back trap. |
| N12 | Unsaved/unconfirmed progress | Explicit reload/exit flow | Truthful warning where supported; no false saved status. |
| N13 | PWA standalone | Back | Reversible in-game layer closes first where supported; root remains escapable. |
| N14 | Focus restoration | Keyboard/screen reader | Closed layer returns focus to opener/logical parent. |

## Evidence

When runtime implementation exists, record:

- device/browser/PWA mode;
- tested build identity;
- whether the browser exposed reliable history/popstate behaviour;
- observed Back result;
- whether any unload prompt appeared;
- focus destination;
- pass/fail.

Do not mark a browser globally supported based on one device result.
