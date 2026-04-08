# Normalized Extraction Layer

## Goal
Create an explicit intermediate data layer between `legacy/` JSX content and any future Payload import. No import should read directly from TSX files.

## Why This Layer Is Required
- The legacy site has no central data source.
- Content is mixed with presentation and duplicated across multiple components.
- Some legacy copy is not trusted editorial material.
- Path-only image references must be converted into managed media records.
- Slugs, prices, redirects, and deduplication need reviewable artifacts before any database write happens.

## Core Principle
- `raw` artifacts are lossless extraction outputs.
- `normalized` artifacts are reviewed, deduplicated, and policy-applied outputs.
- Only `normalized` artifacts are eligible to become import inputs later.

## Recommended Intermediate Files

| File | Purpose | Record Granularity | Notes |
| --- | --- | --- | --- |
| `migration-data/books.raw.json` | Every book occurrence extracted exactly as found in JSX | One row per legacy occurrence | Expected count: `17` |
| `migration-data/authors.raw.json` | Every author occurrence extracted exactly as found in JSX | One row per legacy occurrence | Expected count: `17` |
| `migration-data/homepage.raw.json` | Raw homepage section content | One object containing fixed homepage sections | Includes hero, spotlight, awards, best sellers, newsletter CTA |
| `migration-data/books.normalized.json` | Unique book records after dedupe and policy application | One row per unique book | Expected count: `13` |
| `migration-data/authors.normalized.json` | Unique author records after dedupe and editorial filtering | One row per unique author | Expected count: `8` |
| `migration-data/homepage.normalized.json` | Homepage data rewritten to reference normalized books and authors | One object | Payload-ready shape, but still reviewable before import |
| `migration-data/assets-map.json` | Full asset audit | One row per public asset | Expected count: `28` |
| `migration-data/slug-map.json` | Candidate slug, final slug, collisions, and redirect sources | One row per entity slug | Includes both books and authors |
| `migration-data/editorial-holds.json` | Unsafe or uncertain copy held out of import | One row per held text block | This is where suspicious long-form copy lives during review |
| `migration-data/qa-report.json` | Machine-readable validation results | One object | Used to gate extraction and normalization completeness |

## Raw Extraction Rules

### `books.raw.json`
Each raw book row should preserve:
- `sourcePath`
- `sourceSection`
- `sourceRoute`
- `rawTitle`
- `rawAuthorName`
- `rawTypeLabel`
- `rawPrice`
- `rawCompareAtPrice`
- `rawImagePath`
- `rawHeroSummary`
- `rawBuyLinkUrl`
- `rawSampleLinkUrl`

Notes:
- Most book occurrences come from card components without descriptive copy.
- The hero book in `legacy/src/app/components/body/newRelease/NewRelease.tsx` is the only verified book occurrence with summary text and external CTA URLs.
- Raw extraction should not guess missing fields.

### `authors.raw.json`
Each raw author row should preserve:
- `sourcePath`
- `sourceSection`
- `sourceRoute`
- `rawName`
- `rawLegacyRoute`
- `rawPortraitPath`
- `rawLifeDatesDisplay`
- `rawMetaTitle`
- `rawMetaDescription`
- `rawShortSummary`
- `rawLongFormParagraphs`
- `rawExternalLink`

Notes:
- Author index cards provide `name`, `page`, and portrait only.
- Author detail pages provide portrait, display life-dates string, metadata, long-form paragraphs, and Wikipedia link.
- `legacy/src/app/components/body/bioGraphy/Biography.tsx` provides a short summary for `Nguyễn Nhật Ánh`; this should still be treated as raw reference material, not as trusted publishable copy.

### `homepage.raw.json`
Preserve the raw homepage sections as fixed content groups:
- `hero`
- `authorSpotlight`
- `awards`
- `bestSellers`
- `newsletterCta`

This file should keep:
- raw section headings such as `SÁCH MỚI` and `TÁC GIẢ`
- raw CTA URLs
- raw award card titles and bodies
- raw best-seller book references
- raw newsletter heading/body copy

## Normalization Rules

### Book Deduplication
- Deduplicate by normalized `(title, authorName)`.
- Normalization should:
  - trim whitespace
  - preserve original display text for storage
  - use a comparison-safe normalized key for dedupe only
- Expected outcome:
  - `17` raw book occurrences
  - `13` unique normalized books

### Author Deduplication
- Deduplicate by normalized `name`.
- Expected outcome:
  - `17` raw author occurrences
  - `8` unique normalized authors

### Asset Path Normalization
- Convert asset paths to forward-slash form without changing filenames.
- Example:
  - raw `/author/nguyen-nhat-anh.jpg`
  - normalized `author/nguyen-nhat-anh.jpg`
- Do not rename or move legacy assets during extraction.

### Price Normalization
- Preserve raw strings in raw files.
- Parse numeric values only in normalized files.
- If parsing fails, keep the parsed field `null` and create a blocking issue in `qa-report.json`.

### Slug Normalization
- Generate candidate slugs in normalized files only.
- Final slug approval is recorded in `slug-map.json`.

### Editorial Hold Handling
- Do not copy suspicious long-form text into normalized public content fields.
- Instead:
  - preserve raw text in `authors.raw.json`
  - register the hold in `editorial-holds.json`
  - keep public-facing normalized author records free of that text by default

## What The Normalized Files Should Contain

### `books.normalized.json`
Each row should contain:
- `sourceKey`
- `title`
- `authorKey`
- `typeLabel`
- `coverAssetPath`
- `price`
- `compareAtPrice`
- `candidateSlug`
- `finalSlug`
- `provenance[]`

### `authors.normalized.json`
Each row should contain:
- `sourceKey`
- `name`
- `portraitAssetPath`
- `lifeDatesDisplay`
- `candidateSlug`
- `finalSlug`
- `metaTitle`
- `metaDescription`
- `editorialHold`
- `provenance[]`

### `homepage.normalized.json`
This object should contain:
- `hero.featuredBookKey`
- `hero.reviewedShortCopy`
- `hero.buyLinkUrl`
- `hero.sampleLinkUrl`
- `authorSpotlight.featuredAuthorKey`
- `authorSpotlight.reviewedShortCopy`
- `bestSellers.bookKeys[]`
- `awards[]`
- `newsletterCta.heading`
- `newsletterCta.body`

## Manual Review Checkpoints Before Any Import
- Confirm raw extraction counts:
  - `books.raw.json = 17`
  - `authors.raw.json = 17`
- Confirm normalized counts:
  - `books.normalized.json = 13`
  - `authors.normalized.json = 8`
- Review all `editorial-holds.json` entries and ensure none leak into normalized public content.
- Review `slug-map.json` for collisions and redirect completeness.
- Review `assets-map.json` for orphaned and static-only assets.
- Review the metadata typo in `legacy/src/app/authorsPage/nguyenNgocTu/page.tsx`.
- Review the ambiguous `Truyện dài` label before any taxonomy expansion.

## Non-Negotiable Rule
- Future import scripts must read from `*.normalized.json` only.
- Reading directly from `legacy/src/**/*.tsx` during import should be treated as a process failure, not as a shortcut.
