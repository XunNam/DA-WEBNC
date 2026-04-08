Final recommendation: GO WITH ADJUSTMENTS

Why:

- the repo already contains a safe Payload-aware in-place media update pattern
- the live audit shows all current Media docs are already R2-backed
- the root `media/` directory and `legacy/public` still provide repo-grounded local source material if a residual repair is ever needed
- there is no evidence right now that a broad write migration is necessary

Required adjustment:

- the first migration execution turn should be audit/dry-run only
- do not start with a write pass

Maximum safe implementation boundary for the first migration execution turn:

- one dry-run/audit script or report-producing command path only
- no database writes
- no media document rewrites
- no relation rewrites

Not approved initially:

- bulk direct copy to R2
- mass document recreation
- frontend/runtime changes
- cleanup/deletion of the local `media/` directory in the same turn

Decision logic after Batch 1 dry-run:

- if residual non-R2 Media docs are found:
  - approve a narrow Batch 2 write pass using Payload-aware in-place updates
- if zero residual non-R2 Media docs are found:
  - treat the migration as complete at the document level
  - any later local-file cleanup becomes a separate maintenance decision, not part of the migration write path
