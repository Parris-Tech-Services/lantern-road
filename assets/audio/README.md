# Lantern Road audio asset contract

This directory is reserved for authored production audio.

The production specification lives in `docs/AUDIO-PRODUCTION-BIBLE.md`.

## Planned structure

```text
assets/audio/
  ambience/
    weather/
    wilderness/
    settlements/
    sites/
  cues/
    ui/
    travel/
    combat/
    status/
  music/
```

Do not commit placeholder silence files or fake audio simply to satisfy filenames.

Until authored assets are ready, Lantern Road's existing procedural Web Audio foundation remains the valid fallback.

## Required metadata for future authored assets

Each accepted file should record:

- asset id;
- category;
- intended state/location;
- duration;
- loop/no-loop;
- codec;
- source/provenance;
- licence/ownership status;
- integrated loudness/peak measurement if available;
- whether a procedural fallback exists.

No asset should be required for gameplay correctness.
