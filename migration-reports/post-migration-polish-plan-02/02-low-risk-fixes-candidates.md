# Low-Risk Fix Candidates

This list keeps the same evidence-backed candidates from the prior draft, but separates what is approved now from what is explicitly deferred.

## Approved Now

### 1. Frontend Shell Metadata / Language Correction

- Why it matters:
  - `src/app/(frontend)/layout.tsx` still contains starter metadata and `lang="en"`
- Exact affected file:
  - `src/app/(frontend)/layout.tsx`
- Risk level:
  - Low
- Why it is safe now:
  - shell metadata only
  - no content changes
  - no helper changes
  - no route behavior changes
- Recommended tiny patch shape:
  - replace starter metadata with the stable migrated shell defaults
  - change the document language to Vietnamese
  - keep the layout structure unchanged
  - keep the global stylesheet import unchanged

### 2. Redirect Runtime Hardening

- Why it matters:
  - `next.config.mjs` already validates redirect JSON types, but not semantic safety
- Exact affected file:
  - `next.config.mjs`
- Risk level:
  - Low
- Why it is safe now:
  - config-local guard only
  - no runtime behavior change when the generated artifact is already valid
  - keeps the current artifact-driven redirect model intact
- Recommended tiny patch shape:
  - keep `migration-data/redirects.generated.json` as the only runtime redirect source
  - add fail-fast checks for:
    - duplicate `source`
    - `source` must start with `/`
    - `destination` must start with `/`
  - continue excluding `migration-data/redirects.manual-review.json` from runtime

## Deferred

### 3. Starter CSS Cleanup

- Why it matters:
  - `src/app/(frontend)/styles.css` still appears to contain starter-only selectors
- Exact affected file:
  - `src/app/(frontend)/styles.css`
- Risk level:
  - Low-to-moderate only because it touches global CSS
- Why it is not approved now:
  - even unused-looking global CSS is not worth touching in the immediate next step
  - the current migrated baseline is already stable
  - this cleanup is optional and not required for correctness
- Recommended status:
  - document only
  - explicitly exclude from the next implementation turn
