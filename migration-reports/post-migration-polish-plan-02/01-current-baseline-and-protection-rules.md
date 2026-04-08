# Current Baseline And Protection Rules

## Locked Baseline

The migrated repo state after Parts 1-8.4 is the current stable baseline. The next patch turn must preserve all of the following:

- Homepage route behavior
- `/books` listing behavior
- `/authors` listing behavior
- `/authors/[slug]` detail behavior
- Published-only public read policy
- Hero-only book policy:
  - the record remains real
  - `catalogVisible = false`
  - `typeLabel = null`
- Runtime redirect consumption through `migration-data/redirects.generated.json`
- Current import, validation, dry-run, and reporting baseline

## What Counts As A Small Safe Fix

For the immediate next patch turn, a small safe fix means:

- shell-level metadata and document language correction only
- config-level redirect artifact hardening only
- no route behavior changes
- no data-loading changes
- no schema changes
- no helper architecture changes
- no visual redesign

## Too Risky Or Out Of Scope

The following are not approved as part of the next patch turn:

- global CSS cleanup
- helper consolidation
- route metadata centralization beyond shell-level layout correction
- frontend redesign
- schema or migration-tool changes
- route behavior refactors
- changes to import, validation, dry-run, or reporting behavior

## Explicit Scope Boundary For The Next Patch Turn

The next implementation turn must be extremely narrow and limited to exactly these two files:

- `src/app/(frontend)/layout.tsx`
- `next.config.mjs`

Everything else is protected unless a real bug is discovered in a later turn.
