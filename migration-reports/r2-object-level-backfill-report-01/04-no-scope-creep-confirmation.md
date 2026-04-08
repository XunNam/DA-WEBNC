## Scope Confirmation

This turn stayed within the approved object-level audit + targeted backfill boundary.

## What Changed

- Database/storage state for the existing `media` collection was updated in place for missing bucket objects only.
- Report artifacts were written under:
  - [r2-object-level-backfill-report-01](D:/Đồ án/DA-WEBNC/migration-reports/r2-object-level-backfill-report-01)

## What Did Not Change

- No frontend route files
- No shell files
- No route helpers
- No `Books.ts`
- No `Authors.ts`
- No `next.config.mjs`
- No deletion lifecycle semantics
- No relation rewrites
- No bulk re-import
- No local-file cleanup

## Broad Rewrite Confirmation

- Existing Media docs were not recreated
- Existing Media IDs were preserved
- Existing relations were not rewritten
- Already-approved R2 delete lifecycle behavior was left untouched
