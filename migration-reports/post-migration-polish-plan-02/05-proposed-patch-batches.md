# Proposed Patch Batches

The next implementation turn must stay decision-complete and narrow.

## Batch A - Layout Metadata / Language Correction

- Target file:
  - `src/app/(frontend)/layout.tsx`
- Allowed change:
  - metadata defaults
  - `<html lang>`
- Forbidden in this batch:
  - route logic
  - helper changes
  - CSS changes

## Batch B - Redirect Runtime Hardening

- Target file:
  - `next.config.mjs`
- Allowed change:
  - semantic validation around generated redirect entries
- Forbidden in this batch:
  - changing redirect source of truth
  - adding manual-review redirects
  - frontend route changes

## Batch C - Deferred, Not For The Next Implementation Turn

- Target file:
  - `src/app/(frontend)/styles.css`
- Status:
  - explicitly deferred
- Rule:
  - the next implementation turn must not touch `src/app/(frontend)/styles.css`

## Approved Next-Turn Scope

The next implementation turn is limited to Batch A plus Batch B only.
