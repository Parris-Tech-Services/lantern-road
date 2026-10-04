# LR-0050 — Service-worker cache freshness verification

Date: 4 October 2026  
Owner: Agent 5 — The Wayfinder  
Scope: `service-worker-freshness`

## Defect

The live service worker used a cache-first strategy with a manually versioned cache name (`lantern-road-v4`). An online player could therefore remain on stale HTML/JS/CSS until a cache-name bump or another manual recovery path caused the shell to refresh.

## Fix

`sw.js` now:

- uses a stable `lantern-road-shell` cache;
- prefers the network for same-origin GET requests and refreshes the cache from successful online responses;
- falls back to cached content when the network is unavailable;
- uses cached `index.html`/root only as a navigation fallback;
- removes obsolete `lantern-road-*` caches during activation;
- leaves cross-origin requests outside this cache policy.

This is intentionally narrower than LR-0040. It does not add install UX, lifecycle UI, storage messaging or broader PWA behaviour.

## Real-browser evidence

GitHub Actions run: **37178333685**  
Artifact: **11294280511** (`lr0050-sw-freshness-result`)  
Head tested: **09322ba8b8b8dfe7824f0bfeed24e6641af255c9**

The temporary Playwright/Chromium scenario verified:

1. an old shell can be controlled by the service worker;
2. obsolete `lantern-road-v4` cache data is removed after worker activation;
3. changing the served shell without changing the cache name is visible on the next online navigation;
4. that newer shell is then available for a subsequent offline navigation.

Observed test output:

- PASS initial cached shell: OLD_SHELL
- PASS obsolete Lantern Road cache cleanup
- PASS online navigation receives fresh shell: NEW_SHELL
- PASS offline navigation reopens latest cached shell: NEW_SHELL
- LR-0050 SERVICE WORKER FRESHNESS TEST: PASS

The temporary workflow/test files were removed after evidence capture so LR-0013 remains the owner of the permanent browser regression harness.

## LR-0009 interaction

Draft PR #6 also edits `sw.js`. LR-0009 is parked and must acquire a fresh claim before reconciliation. When it resumes, it must preserve this network-first freshness behaviour rather than restoring its older cache-name-only service-worker edit.
