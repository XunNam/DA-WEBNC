# Validation Gates

## Purpose
Define the pass/fail checks that must be satisfied before the migration moves from design to extraction, from extraction to normalization, and from normalization to any future import.

## Gate 0: Pre-Implementation Approval

### Must Be Accepted
- The reduced v1 model:
  - `books`
  - `authors`
  - `homepage`
  - existing `media`
- `publishers`, `tags`, and `categories` collection are explicitly deferred.
- The legacy labels are preserved as `typeLabel`, not split into multiple taxonomy concepts.
- Suspicious long-form copy stays out of Payload collections in v1.
- Static logos and award icons stay code-managed in v1.

### Gate Result
- If any of the above is disputed, do not begin schema or extraction work.

## Gate 1: Raw Extraction Checklist

### Required Counts
- `migration-data/books.raw.json` must contain exactly `17` rows.
- `migration-data/authors.raw.json` must contain exactly `17` rows.
- `migration-data/assets-map.json` must contain exactly `28` asset rows.
- The extraction must detect exactly `4` unique legacy `type` labels.

### Required Quality Checks
- Every raw row must include `sourcePath`.
- Every raw asset path must resolve to a file or be explicitly marked missing.
- Every raw book occurrence from:
  - `legacy/src/app/booksPage/page.tsx`
  - `legacy/src/app/components/body/bestSellingBooks/BestSellingBooks.tsx`
  - `legacy/src/app/components/body/newRelease/NewRelease.tsx`
  must be captured.
- Every raw author occurrence from:
  - `legacy/src/app/authorsPage/page.tsx`
  - `legacy/src/app/authorsPage/*/page.tsx`
  - `legacy/src/app/components/body/bioGraphy/Biography.tsx`
  must be captured.

### Gate Result
- If the counts do not match, stop and fix extraction before normalization begins.

## Gate 2: Normalization Checklist

### Required Counts
- `migration-data/books.normalized.json` must contain exactly `13` unique book rows.
- `migration-data/authors.normalized.json` must contain exactly `8` unique author rows.

### Required Deduplication Checks
- Duplicate book references from homepage best sellers and `booksPage` must collapse into single normalized book records.
- The homepage hero book must be represented as a normalized book even though it does not appear in the book grid.
- Duplicate author references from author index, author detail pages, and homepage spotlight must collapse into single normalized author records.

### Required Policy Checks
- All `23` observed price strings must parse successfully.
- All final slugs must be unique.
- All editorial-hold text must be separated from importable public content.
- `migration-data/assets-map.json` must classify all `28` assets.
- `migration-data/slug-map.json` must include redirect sources for every supported legacy route.

### Gate Result
- If any normalized count, price parse, slug uniqueness, or editorial hold separation fails, do not proceed.

## Gate 3: Schema Readiness Checklist

### Required Conditions
- The schema sketch contains only approved v1 entities.
- No speculative collection exists for:
  - publishers
  - tags
  - categories
  - subscribers
  - customers
  - orders
- `books.typeLabel` is implemented as a literal field, not as an unrelated taxonomy design.
- No public author biography field is wired to legacy long-form copy by default.

### Gate Result
- If schema sketches exceed the approved model, pause and reduce scope before coding continues.

## Gate 4: Pre-Import Dry Run

### Recommended Dry Run Checks
- Build Payload-shaped records from `*.normalized.json` without writing to MongoDB.
- Verify each normalized `authorKey` resolves to an author record.
- Verify each normalized `coverAssetPath` resolves to a mapped media file.
- Verify homepage references point only to normalized book/author keys.
- Verify redirect entries are generated for:
  - `/booksPage`
  - `/authorsPage`
  - the 8 legacy author detail routes

### Gate Result
- If the dry run cannot produce complete relationship references, stop before any database import is attempted.

## Gate 5: Post-Import Checklist

### Required Checks
- Book record count matches `books.normalized.json`.
- Author record count matches `authors.normalized.json`.
- Homepage global references valid book and author documents.
- All book covers and portraits resolve to uploaded media.
- No held reference-only copy appears in public fields.
- No unresolved redirect entry remains for supported legacy routes.

### Gate Result
- If any count or relationship mismatches the normalized source, treat the import as failed.

## Gate 6: Frontend Verification Checklist

### Required Checks
- Catalog pages render from Payload data instead of hard-coded legacy data.
- Homepage hero, author spotlight, and best-seller sections render from Payload data.
- Prices display correctly as VND values.
- Author and book slugs resolve to canonical URLs.
- Legacy author routes redirect to canonical author slugs.
- `/booksPage` redirects to `/books`.
- `/authorsPage` redirects to `/authors`.
- No public screen exposes reference-only editorial hold content.

### Manual Review Checks
- Review the `Nguyễn Ngọc Tử` metadata typo decision before author metadata goes live.
- Review whether `book-store.png` remains unused or should be intentionally retained outside Payload.
- Review the handling of `/buyBookPage` so it does not redirect to a misleading destination.

## Blocking Conditions
Any of the following should block progression:
- raw extraction count mismatch
- normalized count mismatch
- malformed or unparsed price string
- slug collision without explicit resolution
- missing asset mapping for an imported record
- editorial hold content leaking into public import records
- unsupported speculative entity added back into schema

## Final Rule
- No gate may be skipped because the dataset is “small”.
- The small dataset is the reason to be strict: every record and every exception is reviewable.
