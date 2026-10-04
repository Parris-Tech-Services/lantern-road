# LR-0145 Service-Worker Save-Shell Hotfix Verification

Date: 4 October 2026  
Owner: Agent 5 — The Wayfinder  
Task: LR-0145

## Defect

`index.html` loads `save-system.js` before `game.js`, but `sw.js` did not include `./save-system.js` in its `APP_SHELL` precache list.

That left a first-install offline-start gap: the page could install the service worker online, then fail to have the required save runtime available on an immediate offline reload.

## Fix

Added:

```js
"./save-system.js",
```

to the existing service-worker `APP_SHELL` list.

No other service-worker behaviour changed:

- cache name remains `lantern-road-shell`;
- network-first fetch behaviour is unchanged;
- successful online responses still refresh the cache;
- navigation offline fallback is unchanged;
- `skipWaiting()` remains;
- `clients.claim()` remains;
- no existing app-shell entry was removed.

## Real-browser verification

GitHub Actions run: **37192950307**  
Artifact: **11300275338** — `lr0145-offline-shell-result`  
Temporary workflow tested head: **c9bfe6b1c2cd6bd628820cf2e3761b5b2c4d8f47**

Chromium viewport: **390×844**

Observed:

- PASS sw.js lists ./save-system.js
- PASS app shell contains save-system.js
- PASS first-install offline reload initialises LanternRoadSave and the game
- PASS offline campaign location: Hearthwick
- LR-0145 OFFLINE APP-SHELL TEST: PASS

No uncaught page errors were observed by the test.

## Scenario

1. Serve the current static game.
2. Load `index.html` online.
3. Verify `window.LanternRoadSave` and `window.render_game_to_text` exist.
4. Wait for service-worker installation/activation and controller claim.
5. Inspect `lantern-road-shell` and verify `./save-system.js` is present.
6. Put browser context offline.
7. Reload.
8. Verify `LanternRoadSave` still initialises.
9. Verify the game starts a playable campaign.

The temporary Playwright workflow/script were removed after evidence capture.

## LR-0107 handoff

This hotfix exists specifically so Steward LR-0107's static-runtime integrity validator can remain strict. After LR-0145 lands, LR-0107 should rerun its current-main validator unchanged and confirm the prior missing-`save-system.js` APP_SHELL failure is resolved.


## Exact LR-0107 validator replay

The exact `scripts/validate-static-runtime.mjs` logic from Steward branch `agent/LR-0107-static-runtime-current-7e6b2f39` was replayed unchanged against LR-0145.

GitHub Actions run: **37193123865**

Observed:

```text
Static runtime integrity OK: 5 local HTML resources, 9 service-worker cache entries, 17 first-party JavaScript files syntax-checked.
```

This confirms the prior LR-0107 failure for missing `save-system.js` in `APP_SHELL` is resolved without weakening the validator.


## Current-main rebuild verification

The hotfix was rebuilt from the then-current `main` after stale PR #90 was closed.

GitHub Actions run: **37193340901**  
Artifact: **11300176435** — `lr0145-current-main-verification`  
Tested workflow head: **24b978b935e21680e802c6e335a96c7de8aa197f**

Observed:

```text
Static runtime integrity OK: 5 local HTML resources, 9 service-worker cache entries, 18 first-party JavaScript files syntax-checked.
PASS app shell contains save-system.js
PASS first-install offline reload initialises LanternRoadSave and the game
PASS offline campaign location: Hearthwick
LR-0145 CURRENT-MAIN OFFLINE APP-SHELL TEST: PASS
```

This is the authoritative current-main replay for LR-0145.
