Recommended implementation sequence: 2 turns

Batch 1: audit / dry-run only

Goal:

- determine whether any actual document-level local-to-R2 migration work remains

Allowed work in that future turn:

- inspect live Media docs
- inspect local source files in `media/` and `legacy/public/`
- produce a dry-run report with planned actions
- perform zero write operations

Why Batch 1 must come first:

- the current live audit already suggests the dataset is fully R2-backed
- a write pass without a fresh dry-run would risk needless churn
- the safest likely outcome is either:
  - confirmed no-op
  - or a tiny targeted set of residual repairs only

Batch 2: real migration write pass, only if Batch 1 finds residual non-R2 docs

Goal:

- update only the residual non-R2 Media documents in place through Payload

Allowed work in that later turn:

- update-in-place via Payload upload lifecycle
- skip already-R2 docs
- produce a post-write report and read-back verification

Not approved for Batch 2:

- replacing all Media documents from scratch
- deleting and recreating the collection contents
- direct bulk object copy to R2 without Payload
- touching Books / Authors / Homepage / SiteSettings relations unless a truly missing document requires a narrowly reviewed exception

Why 2 turns is safest:

- current evidence strongly suggests there may be nothing left to migrate
- separating audit from writes protects the stable app
- any true residual migration can then be very small and explicit
