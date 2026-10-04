# Foundation gate evidence

Priority-zero foundation gates such as LR-0011 and LR-0013 do not close on owner assertion.

The normal implementation PR may merge while the task remains `READY`. After the merged candidate is available for CI and phone testing:

1. Run the required CI suite on the exact candidate commit.
2. Keep the generated workflow artifacts.
3. Josh performs the task's required Android phone check.
4. Agent 7 verifies that the referenced machine evidence exists and matches the candidate.
5. Add `.agent-coordination/gate-evidence/<TASK-ID>.json`.
6. Mark the task `DONE` in the same closure change.
7. CI verifies the evidence record and independently queries GitHub Actions for the referenced successful run and artifacts.

Agents must **not** fill in `josh_phone_check.confirmed: true` unless Josh has explicitly reported that phone check as passed.

## Evidence schema

```json
{
  "schema_version": 1,
  "task_id": "LR-0011",
  "status": "VERIFIED",
  "candidate_commit_sha": "40-character commit SHA tested by CI and Josh",
  "ci": {
    "workflow_run_id": 123456789,
    "conclusion": "success",
    "artifact_names": ["save-migration-results"]
  },
  "josh_phone_check": {
    "confirmed": true,
    "confirmed_by": "Josh",
    "confirmed_at": "2026-10-04T15:30:00+11:00",
    "device": "Android phone",
    "notes": "What was actually checked."
  },
  "director_verification": {
    "agent_number": 7,
    "status": "VERIFIED",
    "verified_at": "2026-10-04T15:31:00+11:00",
    "notes": "Verified workflow run/artifacts and task-specific evidence."
  }
}
```

A valid JSON record is necessary but not sufficient: GitHub Actions also queries the referenced workflow run and confirms its repository, commit SHA, conclusion and artifact names.
