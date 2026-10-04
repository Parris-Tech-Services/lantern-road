# Human release validation

This directory records the deliberately human release gate for Lantern Road.

The technical foundation gates LR-0011 and LR-0013 unlock development from machine evidence. LR-0056 is separate so Josh's Android check protects final integration/release without idling specialist agents.

## Rules

- Only Josh's explicit statement that the named checks passed can set `josh_phone_check.confirmed` to `true`.
- Agents may prepare instructions, identify the tested commit, and record Josh's words after he gives them.
- Agents must never infer approval from silence, a successful CI run, screenshots alone, or another agent's statement.
- LR-0056 stays incomplete until the real-device check is actually performed.

## Record schema

```json
{
  "schema_version": 1,
  "task_id": "LR-0056",
  "status": "VERIFIED",
  "tested_commit_sha": "40-character commit SHA",
  "josh_phone_check": {
    "confirmed": true,
    "confirmed_by": "Josh",
    "confirmed_at": "ISO-8601 timestamp",
    "device": "Android phone",
    "checks_passed": [
      "legacy save loaded and remained playable",
      "launch/start-or-resume",
      "map/action interaction",
      "save/reload"
    ],
    "notes": "Josh's actual observations"
  }
}
```
