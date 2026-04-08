# Redirect Artifact Lifecycle Plan

## Purpose

This document defines the redirect artifact lifecycle precisely enough for the next code phase to implement it without reopening design questions.

The redirect system is needed because the legacy app uses route names such as `/booksPage`, `/authorsPage`, and author-detail routes that do not match the future canonical Payload-driven routes.

## Lifecycle overview

Redirects are not runtime-discovered and they are not build-time side effects. They are reviewed generated artifacts produced by migration tooling and committed to the repo.

This keeps redirects:

- deterministic
- reviewable in pull requests
- independent from `next dev` or `next build`
- aligned with the normalized slug output

## Owning files

### Migration-tooling files

- `scripts/migration/generate-redirect-artifact.ts`
  - Generates redirect artifacts from normalized slug data and policy rules.
- `scripts/migration/config/redirect-policy.ts`
  - Owns the explicit supported-route policy and the unsupported/manual-review route policy.
- `scripts/migration/validate-migration-data.ts`
  - Verifies that generated redirect artifacts remain in sync with `migration-data/slug-map.json` and the redirect policy.

### Input artifact

- `migration-data/slug-map.json`
  - Canonical source of normalized slugs and legacy-to-canonical route mappings.

### Output artifacts

- `migration-data/redirects.generated.json`
  - Runtime-safe redirect list for later consumption by `next.config.mjs`.
- `migration-data/redirects.manual-review.json`
  - Unsupported or ambiguous redirect candidates that must not be applied automatically.

## Generation stage

Redirect artifact generation belongs to its own explicit step after normalization and before validation closes.

Recommended execution order:

1. `scripts/migration/extract-legacy.ts`
2. `scripts/migration/normalize-legacy.ts`
3. `scripts/migration/generate-redirect-artifact.ts`
4. `scripts/migration/validate-migration-data.ts`
5. `scripts/migration/dry-run-import.ts`
6. `scripts/migration/import-normalized.ts`

Reasoning:

- extraction discovers raw legacy paths
- normalization produces canonical slugs and `slug-map.json`
- redirect generation depends on that normalized slug map
- validation must verify the final redirect artifacts, not just the slug map

## Automatic redirect scope

Only the following redirect classes are auto-generated in v1.

### Stable route-level redirects

- `/booksPage` -> `/books`
- `/authorsPage` -> `/authors`

### Stable author-detail redirects

The 8 legacy author detail routes are auto-generated to their canonical `/authors/{slug}` equivalents using `migration-data/slug-map.json`.

These are supported because:

- the legacy routes are known
- the destination route family is known
- the author slug generation policy is deterministic

## Manual-review-only scope

The following must not be auto-generated:

- `/buyBookPage`
- placeholder routes such as legacy links that point to `/` but do not represent the homepage
- any unsupported route without a clear canonical v1 destination
- any redirect candidate whose target slug is unresolved or blocked by normalization errors

These entries belong in `migration-data/redirects.manual-review.json` instead.

## Structure of `slug-map.json`

`migration-data/slug-map.json` should remain the canonical mapping source for slug-related decisions. Redirect generation must derive from it rather than recomputing independent route logic.

At minimum, each mapping row should support:

- entity type
- source identifier
- candidate slug
- final slug
- legacy route or legacy path
- canonical route
- collision notes, if any

The redirect generator should only transform this mapping into redirect artifacts according to the explicit route policy.

## Structure of `redirects.generated.json`

This file should be designed for direct runtime consumption later by `next.config.mjs`.

Recommended shape:

```json
[
  {
    "source": "/booksPage",
    "destination": "/books",
    "permanent": true
  }
]
```

Operational rules:

- store only supported automatic redirects
- keep order stable for review diffs
- sort by `source`
- avoid duplicates
- make output deterministic from the same `slug-map.json`

## Structure of `redirects.manual-review.json`

This file should not be consumed by runtime. It exists for review, triage, and future manual decisions.

Recommended shape:

```json
[
  {
    "source": "/buyBookPage",
    "reason": "No approved canonical v1 destination",
    "suggestedAction": "manual-review"
  }
]
```

Recommended fields:

- `source`
- `reason`
- `suggestedAction`
- optional `notes`

## Commit policy

Both redirect artifacts should be committed to the repo.

Reasons:

- reviewers can inspect exact redirect behavior before deployment
- runtime behavior does not depend on migration tooling running during `dev` or `build`
- changes to redirects become visible in pull requests
- validation can treat missing or stale artifacts as a clear state mismatch

Redirect artifacts should not be generated:

- during `next dev`
- during `next build`
- during `next start`
- as an implicit side effect of app boot

## Runtime consumption later

In a later runtime phase, `next.config.mjs` should read `migration-data/redirects.generated.json` if it exists.

Safe behavior if the file is missing:

- do not fail app startup
- do not guess redirect values
- fall back to `[]`

Reasoning:

- the app must stay bootable before redirect-consuming runtime code lands
- redirect generation is a reviewed artifact step, not a required boot-time dependency
- missing artifact should be visible in validation and code review, not cause an opaque runtime crash

Recommended later runtime pattern:

- attempt to read `migration-data/redirects.generated.json`
- if missing, use an empty array
- optionally log a development-only warning, but do not make boot depend on it

## Validation requirements

`scripts/migration/validate-migration-data.ts` should fail if:

- `slug-map.json` exists but redirect artifacts are missing
- `redirects.generated.json` contains entries outside the supported policy
- `redirects.generated.json` omits required supported redirects
- `redirects.manual-review.json` omits known unsupported/manual-review routes
- duplicate redirect sources exist
- redirect destinations conflict with canonical slug routes

Validation should also confirm:

- supported automatic redirects are deterministic from `slug-map.json`
- unsupported routes are kept out of runtime redirect output
- manual-review routes do not leak into `redirects.generated.json`

## Review workflow

Before redirect-consuming runtime code is merged, reviewers should check:

1. `migration-data/slug-map.json`
2. `migration-data/redirects.generated.json`
3. `migration-data/redirects.manual-review.json`

Review questions:

- Are all supported legacy routes mapped correctly?
- Are unsupported routes correctly excluded from runtime redirects?
- Are any placeholder or ambiguous routes being redirected too aggressively?
- Do canonical destinations match the approved route plan?

## Final operational rule

Redirects are a reviewed migration artifact generated from normalized slug data by a dedicated script before validation closes. Runtime later consumes only the reviewed generated artifact and safely falls back to an empty redirect list if the artifact is absent.
