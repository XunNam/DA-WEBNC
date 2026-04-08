# Revised Target File Map

## Purpose

This file map converts the approved migration strategy into a concrete code-phase work list grounded in the current repo layout.

The map separates:

- runtime Payload/app code
- migration-tooling code
- test code
- review artifacts

It also records whether each file should be created, modified, or deferred.

## Runtime Payload and app files

| File path | Status | Purpose | Dependency order | Classification |
| --- | --- | --- | --- | --- |
| `src/payload.config.ts` | modify | Register `books`, `authors`, `homepage`, and `siteSettings` in the main Payload config. | 1 | runtime |
| `src/collections/Books.ts` | create | Define the `books` collection, including `typeLabel`, `catalogVisible`, price fields, media relation, author relation, drafts, and minimal SEO. | 1 | runtime |
| `src/collections/Authors.ts` | create | Define the `authors` collection, including `lifeDatesDisplay`, portrait relation, drafts, and minimal SEO. | 1 | runtime |
| `src/collections/Media.ts` | modify | Keep upload behavior minimal and verify it supports book covers and author portraits without broadening media scope. | 1 | runtime |
| `src/globals/Homepage.ts` | create | Define the `homepage` global with hero, author spotlight, best sellers, awards, newsletter CTA, drafts, and minimal SEO. | 1 | runtime |
| `src/globals/SiteSettings.ts` | create | Define minimal `siteSettings` with site-wide SEO defaults, footer legal text, footer links, and social links. | 1 | runtime |
| `src/access/publicPublishedRead.ts` | create | Provide a shared public-read access helper for published-only entities that later frontend runtime can rely on safely. | 1 | runtime |
| `src/fields/seoFields.ts` | create | Provide a minimal reusable SEO field group to avoid repeating `metaTitle` and `metaDescription`. | 1 | runtime |
| `src/app/(frontend)/layout.tsx` | defer modify | Later read `siteSettings` and wire site-wide metadata/footer content after backend confidence exists. | 6 | runtime |
| `src/app/(frontend)/page.tsx` | defer modify | Later replace the template homepage with Payload-driven homepage reads. | 6 | runtime |
| `src/app/(frontend)/books/page.tsx` | defer create | Later add the catalog listing route backed by `books` filtered to `catalogVisible = true`. | 7 | runtime |
| `src/app/(frontend)/authors/page.tsx` | defer create | Later add the authors listing route backed by published `authors`. | 8 | runtime |
| `src/app/(frontend)/authors/[slug]/page.tsx` | defer create | Later add author detail pages backed by published `authors`. | 8 | runtime |
| `src/app/(frontend)/books/[slug]/page.tsx` | defer | Keep deferred in the first frontend refactor. Do not create in the first code phase. | deferred | runtime |
| `next.config.mjs` | defer modify | Later consume `migration-data/redirects.generated.json` with safe fallback to `[]`. Do not change until redirect artifacts are generated and reviewed. | 9 | runtime |

## Migration-tooling files

| File path | Status | Purpose | Dependency order | Classification |
| --- | --- | --- | --- | --- |
| `scripts/migration/extract-legacy.ts` | create | Read the legacy codebase and emit lossless raw migration artifacts. | 2 | migration-tooling |
| `scripts/migration/normalize-legacy.ts` | create | Deduplicate raw data, normalize slugs/prices/assets, assign `catalogVisible`, and emit normalized artifacts plus `slug-map.json`. | 3 | migration-tooling |
| `scripts/migration/generate-redirect-artifact.ts` | create | Generate reviewed redirect artifacts from `slug-map.json` using the redirect policy. | 4 | migration-tooling |
| `scripts/migration/validate-migration-data.ts` | create | Verify counts, slug uniqueness, price conversion, asset mapping, editorial holds, and redirect artifact integrity. | 5 | migration-tooling |
| `scripts/migration/dry-run-import.ts` | create | Simulate import logic against normalized artifacts without mutating production content. | 6 | migration-tooling |
| `scripts/migration/import-normalized.ts` | create | Perform the real import only after dry-run approval. | 7 | migration-tooling |
| `scripts/migration/config/redirect-policy.ts` | create | Centralize which legacy routes are auto-generated and which remain manual-review only. | 3 | migration-tooling |
| `scripts/migration/lib/price.ts` | create | Own deterministic price parsing and formatting normalization logic. | 2 | migration-tooling |
| `scripts/migration/lib/slug.ts` | create | Own slug normalization and collision-resolution helpers. | 2 | migration-tooling |
| `scripts/migration/lib/assets.ts` | create | Own asset classification, mapping, and audit helper logic. | 2 | migration-tooling |
| `scripts/migration/lib/qa.ts` | create | Aggregate validation results into `migration-data/qa-report.json`. | 4 | migration-tooling |

## Test files

| File path | Status | Purpose | Dependency order | Classification |
| --- | --- | --- | --- | --- |
| `tests/int/api.int.spec.ts` | defer modify | Later extend integration coverage for collections/globals and safe public reads. Keep untouched until schema/runtime work exists. | 10 | test |
| `tests/e2e/admin.e2e.spec.ts` | defer modify | Later validate admin access to new collections/globals after schema implementation lands. | 10 | test |
| `tests/e2e/frontend.e2e.spec.ts` | defer modify | Later verify homepage/catalog/author routes only after frontend refactor begins. Keep untouched for now. | 11 | test |
| `tests/helpers/login.ts` | defer | Reuse later if authenticated admin or preview-path testing needs it. | deferred | test |
| `tests/helpers/seedUser.ts` | defer | Reuse later if schema tests require seeded users. | deferred | test |

## Review artifact files

These are generated data artifacts or review outputs, not runtime application code.

| File path | Status | Purpose | Dependency order | Classification |
| --- | --- | --- | --- | --- |
| `migration-data/books.raw.json` | create | One row per raw book occurrence extracted from legacy sources. | 2 | review artifact |
| `migration-data/authors.raw.json` | create | One row per raw author occurrence extracted from legacy sources. | 2 | review artifact |
| `migration-data/homepage.raw.json` | create | Raw homepage content extracted from fixed legacy sections. | 2 | review artifact |
| `migration-data/site-settings.raw.json` | create | Raw site-wide chrome/settings data extracted from legacy navbar/footer sources. | 2 | review artifact |
| `migration-data/books.normalized.json` | create | Unique normalized book records ready for later dry-run/import. | 3 | review artifact |
| `migration-data/authors.normalized.json` | create | Unique normalized author records ready for later dry-run/import. | 3 | review artifact |
| `migration-data/homepage.normalized.json` | create | Normalized homepage structure referencing normalized books/authors. | 3 | review artifact |
| `migration-data/site-settings.normalized.json` | create | Normalized `siteSettings` seed data with stable footer links and empty initial social links. | 3 | review artifact |
| `migration-data/assets-map.json` | create | Asset inventory with usage, handling, and review status. | 3 | review artifact |
| `migration-data/slug-map.json` | create | Canonical slug and route mapping source for redirect generation. | 3 | review artifact |
| `migration-data/editorial-holds.json` | create | Suspicious long-form or review-only content withheld from import. | 3 | review artifact |
| `migration-data/redirects.generated.json` | create | Runtime-safe reviewed redirects generated from slug-map and policy rules. | 4 | review artifact |
| `migration-data/redirects.manual-review.json` | create | Unsupported or ambiguous redirect candidates that require manual decisions. | 4 | review artifact |
| `migration-data/qa-report.json` | create | Machine-readable validation report covering counts, failures, and pass/fail gates. | 5 | review artifact |

## Dependency order summary

### Stage 1: schema and runtime foundations

- `src/collections/Books.ts`
- `src/collections/Authors.ts`
- `src/globals/Homepage.ts`
- `src/globals/SiteSettings.ts`
- `src/access/publicPublishedRead.ts`
- `src/fields/seoFields.ts`
- `src/collections/Media.ts`
- `src/payload.config.ts`

### Stage 2: extraction tooling

- `scripts/migration/extract-legacy.ts`
- `scripts/migration/lib/price.ts`
- `scripts/migration/lib/slug.ts`
- `scripts/migration/lib/assets.ts`

### Stage 3: normalization and route policy

- `scripts/migration/normalize-legacy.ts`
- `scripts/migration/config/redirect-policy.ts`

### Stage 4: redirect artifact generation

- `scripts/migration/generate-redirect-artifact.ts`
- `migration-data/redirects.generated.json`
- `migration-data/redirects.manual-review.json`

### Stage 5: validation

- `scripts/migration/validate-migration-data.ts`
- `scripts/migration/lib/qa.ts`
- `migration-data/qa-report.json`

### Stage 6: dry-run and import

- `scripts/migration/dry-run-import.ts`
- `scripts/migration/import-normalized.ts`

### Stage 7: frontend and runtime consumption

- `src/app/(frontend)/page.tsx`
- `src/app/(frontend)/layout.tsx`
- `src/app/(frontend)/books/page.tsx`
- `src/app/(frontend)/authors/page.tsx`
- `src/app/(frontend)/authors/[slug]/page.tsx`
- `next.config.mjs`

## Boundary reminder

This file map is implementation-oriented, but it is still only a plan. No runtime files, migration scripts, or artifact generators are created in this planning phase.
