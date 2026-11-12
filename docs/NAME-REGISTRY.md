# Lantern Road — Name Registry Seed

**Status:** Draft for Josh approval. Existing canon is reserved; no rename is authorised.
**Task:** LR-0155. **Machine grammar:** [`voice.json`](../voice.json). **Voice guide:** [`VOICE-BIBLE.md`](VOICE-BIBLE.md).

---

## Decision summary

- **Mira Quickstep, Oren Thale, Garrick Vale, Sister Brindle** are established companions. Keep their names. Do not create a second core character with these names.
- **Rowan Pike, Tessa Reed and Sister Elira** are shared Grey March canon with the Marsh/Grey March material. Keep the shared setting explicit; do not treat the reuse as an accident.
- **Tessa Reed, Alwen Reed and Tobin Reed** are a family. One family, one surname; do not use Reed for an unrelated new character.
- **Existing towns and sites** are protected map canon. New places require a map-canon task.
- New core names must come from `voice.json` and a seed, then pass a human showrunner check.

## Owned canon — people

| Name | Role | Notes |
| --- | --- | --- |
| Mira Quickstep | Scout companion | Reserved; personal arc exists |
| Oren Thale | Scholar companion | Reserved; personal arc exists |
| Mara Kett | Rope guide / Oren's witness | Existing canon; do not create a second unrelated Mara |
| Garrick Vale | Frontline companion | Reserved; personal arc exists |
| Sister Brindle | Priest companion | Reserved; personal arc exists |
| Rowan Pike | Mayor of Hearthwick | Shared Grey March canon |
| Tessa Reed | Innkeeper, Hearthwick | Shared Grey March canon; Reed family |
| Sister Elira | Road Priest | Shared Grey March canon |
| Oswin Marris | Guild Factor | Recurring NPC |
| Halden Crow | Guard Captain | Recurring NPC |
| Joric Pell | Caravan Master | Recurring NPC |
| Sen Marrow | Archivist | Recurring NPC |
| Iven Holt | Magister | Recurring NPC |
| Alwen Reed | Shrine Warden | Reed family |
| Edda Briar | Warden Captain | Recurring NPC |
| Fen Lark | Scout | Recurring NPC |
| Yor Dane | Quartermaster | Recurring NPC |
| Nera Vale | Smuggler Broker | Recurring NPC |
| Tobin Reed | Dockside Host | Reed family |
| Vesk Harran | Ferryman | Recurring NPC |

## Owned canon — places

Hearthwick, Greyfen Market, Candlemere, Alderwatch, Blacksalt Crossing, Watcher's Rest, Saint Rhel's Shrine, Old Barrow Keep, Broken Span, Weeping Stones, Redwater Ferry, Moonmere Tower, Mosslight Ruins, Hollowglass Cavern, Pilgrim Ford and Smuggler's Cache.

These are protected by `world/map-canon.json`. Do not add, rename, move or retire one inside this task.

## Watchlist — do not add without a specific reason

Elara, Elias, Kael, Lyra, Aria, Seraphina, Thorne, Cassian, Isolde, Nova. Mara Kett is existing canon; only a *new, unrelated* Mara would be a watchlist problem.

These are model-default / generic fantasy names. They are not automatically forbidden if a future culture or canon reason justifies one, but a new core character using one needs an explicit note in the PR and showrunner approval.

## New-name procedure

1. Choose the culture/region and role.
2. Draw candidates from `voice.json` with a recorded seed.
3. Reject any reserved name, banlisted name or surname collision.
4. Check the candidate against this registry.
5. Human showrunner approves; record the name, seed, role, culture and source.
6. Only then write the character.

## Provenance

Existing names come from `content.js`, `world/map-canon.json`, the Hearthwick NPC pack, companion packs, the Player-Leader contract and the terminology guide. Naming rules and watchlist are inferred for this draft; Josh may change them.
