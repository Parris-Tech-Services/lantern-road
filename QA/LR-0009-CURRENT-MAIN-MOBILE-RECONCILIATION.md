# LR-0009 — Current-main phone/mobile reconciliation evidence

Date: 4 October 2026  
Owner: Agent 5 — The Wayfinder  
Task: LR-0009  
Branch: `agent/LR-0009-mobile-ux-64c3f2a1`

## Why this reconciliation was necessary

The original LR-0009 branch was more than 500 commits behind current `main` and still used raw JSON for campaign slots. Since then:

- LR-0011's shared `window.LanternRoadSave` schema/migration implementation merged to `main`;
- LR-0050's network-first service-worker freshness fix merged to `main`;
- other gameplay/coordination work continued.

LR-0009 was therefore rebuilt from current `main` rather than overwriting newer game work with the old branch.

## Current implementation

This branch now includes the LR-0009 phone/mobile package:

- Settings/Accessibility button and modal;
- Standard / Large / Extra Large text;
- High Contrast;
- optional haptic taps;
- visible Version + Build identifier;
- map pan/zoom/centre controls;
- keyboard map zoom/reset shortcuts;
- six large neighbouring travel buttons;
- phone bottom-thumb information tabs;
- phone safe-area/floating-launcher collision handling;
- separate Manual Save and Autosave UX;
- New Campaign confirmation that preserves Manual Save;
- load chooser for Manual Save versus Autosave;
- current `LanternRoadSave` schema-v2 encoding/decoding/migration for both slots;
- legacy Manual Save backup when shared persistence migrates an old raw save;
- current `main` network-first `sw.js` retained unchanged.

## Automated real-browser evidence

GitHub Actions run: **37191895794**  
Artifact: **11299491815** (`lr0009-current-main-result`)  
Tested head: **b5f2cf8cac89dc7b8ec08e034d88cd077f3ab012**

Chromium mobile contexts:

- 320 × 700
- 360 × 780
- 390 × 844
- 430 × 900

The test verified:

- Settings button is visible;
- six nearby travel controls are present;
- map zoom out / centre / zoom in controls are visible;
- simulated shared floating Settings launcher yields on phone;
- Extra Large text and High Contrast can be enabled;
- Settings shows **Version 1.0.0** and **Build 2026.10.04-lr0009-v7**;
- Settings Close remains horizontally and vertically reachable;
- Manual Save writes a schema-v2 `LanternRoadSave` envelope;
- Autosave writes a schema-v2 envelope after travel;
- Autosave does not overwrite Manual Save;
- New Campaign confirmation explicitly protects Manual Save;
- starting a new campaign does not alter Manual Save bytes;
- Load offers Manual Save and Autosave separately;
- loading Manual Save does not mutate its stored bytes during an intact load;
- phone thumb tabs remain inside the viewport;
- no uncaught browser errors were observed.

The branch also passed the repository DOM-contract workflow and `node --check game.js`.

## Remaining gate

This evidence does **not** override the queue's foundation gates.

LR-0009 must remain unmerged/READY until:

- LR-0011 is formally DONE under the foundation evidence policy;
- LR-0013 is formally DONE;
- the final LR-0009 head is reconciled with then-current `main`;
- Agent 7 approves that exact final implementation head.

## Downstream work not owned by LR-0009

The following major UX items remain separate tasks:

- LR-0039 deeper keyboard/screen-reader parity;
- LR-0040 PWA install/offline/mobile lifecycle polish;
- LR-0074 canonical atlas phone navigation/inspection;
- LR-0096 persistent-map responsive play shell.

They remain dependency-gated and should not be folded into this grandfathered PR.
