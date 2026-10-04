# Technical foundation gate evidence

Priority-zero technical foundation gates such as LR-0011 and LR-0013 do not close on owner assertion.

These records prove that the implementation itself is merged and machine-verified. They intentionally **do not contain Josh's Android sign-off**; human device validation is tracked separately by LR-0056.

## Technical closure flow

1. Merge the implementation under the live review-by-exception policy.
2. Run the required CI suite on the exact merged candidate commit.
3. Keep the task-specific required workflow artifacts.
4. Agent 7 verifies that the referenced machine evidence is coherent and corresponds to the task.
5. Add `.agent-coordination/gate-evidence/<TASK-ID>.json`.
6. Mark the technical gate task `DONE` in the same closure change.
7. CI independently verifies repository, candidate SHA, successful workflow conclusion, artifact names, required repository paths, and the evidence record.
8. Downstream specialist development may now use the technical foundation.

## Evidence schema

```json
{
  "schema_version": 1,
  "task_id": "LR-0011",
  "status": "VERIFIED",
  "candidate_commit_sha": "40-character merged commit SHA",
  "ci": {
    "workflow_run_id": 123456789,
    "conclusion": "success",
    "artifact_names": ["save-migration-results"]
  },
  "director_verification": {
    "agent_number": 7,
    "status": "VERIFIED",
    "verified_at": "2026-10-04T19:00:00+11:00",
    "notes": "Verified task-specific workflow evidence and artifact linkage."
  }
}
```

A valid JSON record is necessary but not sufficient: GitHub Actions independently confirms repository, commit SHA, successful conclusion, required unexpired artifact names, and task-specific required repository paths.

## Human validation is separate

Josh's Android checks are recorded only under `.agent-coordination/human-validation/` for LR-0056. An agent must never copy, infer or fabricate that confirmation into technical evidence.
