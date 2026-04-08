## Audit Basis

This audit did not trust document URL shape alone.

- URL-shape classification used the current `R2_PUBLIC_URL` base.
- Actual object presence was verified with direct R2 `HeadObject` checks against the configured bucket.
- Candidate key resolution preferred the existing document `filename`, with decoded URL-path fallback.

## Pre-Repair Findings

- Total Media docs: `21`
- URL-shape `r2-style`: `21`
- Actual `object-present`: `0`
- Actual `object-missing`: `21`
- `manual-review`: `0`

This confirmed the current problem: the documents looked migrated at the URL level, but the bucket objects were absent.

## Relation Safety Context

- Referenced unique Media IDs: `21`
- Unreferenced Media docs: `0`
- Books relation coverage: `13`
- Authors relation coverage: `8`
- Homepage direct relation coverage: `0`
- SiteSettings direct relation coverage: `0`

## Source Resolution

- `media/` exact filename matches available for all `21` missing docs
- `legacy/public/` provenance fallback was also resolvable, but it was not needed for the repair pass
- Duplicate Media docs by filename: `0`
- Ambiguous source matches requiring manual review: `0`

## Detailed Inventory

Per-document classification is recorded in:

- [object-level-audit.json](D:/Đồ án/DA-WEBNC/migration-reports/r2-object-level-backfill-report-01/object-level-audit.json)

That file includes, for each Media document:

- `id`
- `filename`
- current `url`
- URL-shape classification
- actual object-status classification
- candidate bucket keys checked
- planned action
- local source resolution
