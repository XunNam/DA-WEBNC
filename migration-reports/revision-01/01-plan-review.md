# Revision-01 Plan Review

## Baseline Status
- `migration-reports/` is currently empty, so this review applies to the prior conceptual migration draft rather than to existing markdown files.
- The review is grounded in the verified legacy code under `legacy/`, not in assumed future frontend or schema work.
- Scope remains `catalog + marketing only`.

## What The Earlier Draft Got Right
- It correctly centered the migration around `books`, `authors`, homepage content, and media rather than around React component names.
- It correctly deferred ecommerce work. `legacy/src/app/buyBookPage/page.tsx` and `legacy/src/app/buyBookPage/components/buyBook.tsx` do not contain a real purchase flow, and `legacy/src/app/components/cartMenu/CartMenu.tsx` is only a placeholder state.
- It correctly recognized the homepage as editorial content that should be modeled separately from the global layout.
- It correctly treated suspicious long-form biography copy as unsafe to publish by default.
- It correctly preferred normalized content-driven URLs over preserving JSX route names forever.

## What Was Premature Or Underdefined

### 1. No Explicit Extraction Layer
- The earlier draft jumped too quickly from legacy JSX to proposed Payload entities.
- That is risky because the legacy project has no central data source. Content is embedded directly in:
  - `legacy/src/app/booksPage/page.tsx`
  - `legacy/src/app/components/body/bestSellingBooks/BestSellingBooks.tsx`
  - `legacy/src/app/components/body/newRelease/NewRelease.tsx`
  - `legacy/src/app/authorsPage/page.tsx`
  - `legacy/src/app/authorsPage/*/page.tsx`
  - `legacy/src/app/components/body/bioGraphy/Biography.tsx`
  - `legacy/src/app/components/Footer.tsx`
  - `legacy/src/app/components/NavbarLink.tsx`
- A raw-to-normalized review step is required before any import is safe.

### 2. Speculative Entities Were Too Easy To Keep
- `publishers` had no legacy evidence.
- `tags` had no legacy evidence.
- A `categories` collection was not justified by the observed dataset. The four legacy book labels are too small and too ambiguous to prove a managed taxonomy requirement.
- Those items should not be silently carried into v1.

### 3. Legacy `type` Labels Were Not Resolved
- The legacy site uses exactly four labels:
  - `Tiểu thuyết`
  - `Truyện ngắn`
  - `Truyện dài`
  - `Truyện thơ`
- These appear only as display labels in book cards. They were not proven to be a separate category system, format system, or tag system.
- V1 should preserve them literally in one field, not split them into multiple schema concepts without evidence.

### 4. Price Handling Was Not Deterministic
- All observed prices are localized display strings such as `73.800 VNĐ` and `220.000 VNĐ`.
- The earlier draft did not define how these become numeric database values, how `originPrice` maps to `compareAtPrice`, or what blocks import if a value is malformed.

### 5. Slugs And Redirects Needed Hard Rules
- The earlier draft preferred normalized URLs but did not define:
  - diacritic handling for Vietnamese strings
  - collision rules
  - which legacy routes get redirects
  - which routes are intentionally excluded

### 6. Editorial Safety Needed An Operational Policy
- The draft correctly distrusted long-form author biographies, but it did not specify where those texts should live during migration review.
- Without a separate hold/review artifact, unsafe copy could leak into schema sketches or import scripts.

### 7. Asset Audit Was Too Shallow
- The legacy project contains 28 public assets.
- 27 are referenced by the codebase.
- 1 asset is orphaned: `legacy/public/book-store.png`.
- The earlier draft needed a sharper split between:
  - editor-managed content media
  - static brand/logo/icon assets
  - orphaned or uncertain assets

### 8. Validation Gates Were Missing
- The earlier draft described a direction, not a controlled migration path.
- This revision needs hard counts and hard pass/fail rules before implementation.

## Entity Review

| Entity / Concept | Legacy Evidence | Verdict | Notes |
| --- | --- | --- | --- |
| `books` | Strong. Book cards and hero content appear in `legacy/src/app/booksPage/page.tsx`, `legacy/src/app/components/body/bestSellingBooks/BestSellingBooks.tsx`, and `legacy/src/app/components/body/newRelease/NewRelease.tsx`. | Keep in v1 | Required. Includes 13 unique books after deduping the homepage hero book into the catalog dataset. |
| `authors` | Strong. Author index and detail pages appear in `legacy/src/app/authorsPage/page.tsx` and `legacy/src/app/authorsPage/*/page.tsx`. | Keep in v1 | Required. Includes 8 unique authors. |
| `homepage` global | Strong. Homepage sections are explicitly authored in `legacy/src/app/page.tsx` and section components. | Keep in v1 | Required. Best modeled as one global with structured groups and arrays. |
| `media` | Strong. Book covers, author portraits, and some homepage images are referenced from `legacy/public/`. | Keep existing collection | Required. Used for book covers and portraits in v1. |
| `siteSettings` | Partial. Logos and some nav/footer text exist in code, but there is no proof they need editor control in v1. | Optional, defer by default | Only add if the team wants editor-managed brand or default SEO settings immediately. |
| `publishers` | None. No publisher names or publisher relationships were found in legacy content. | Remove from v1 | If publisher data appears later, start with a temporary text field, not a collection. |
| `tags` | None. No tag-like dataset or repeated tag labels were found. | Remove from v1 | Defer entirely. |
| `categories` collection | Weak. Only four display labels exist, and their semantic meaning is not fully resolved. | Do not add collection in v1 | Preserve literal value in `typeLabel` instead. |
| `awards` collection | Weak as standalone entity. Award cards exist only as one homepage section in `legacy/src/app/components/body/adWards/Adwards.tsx`. | Keep nested inside homepage | Use structured rows inside the homepage global, not a separate collection. |
| `newsletter subscribers` | None. Homepage only shows text in `legacy/src/app/page.tsx`; no form exists. | Remove from v1 | Newsletter CTA remains content-only. |
| `customers`, `orders`, `carts` | None. No working commerce data model exists in legacy. | Remove from v1 | Out of scope for the agreed first phase. |

## Known Legacy Inconsistencies To Preserve In Review Notes
- Metadata typo: `legacy/src/app/authorsPage/nguyenNgocTu/page.tsx` uses `Nguyễn Ngọc Tử` in `title` and `description`, while the displayed author name is `Nguyễn Ngọc Tư`.
- Field-name typo: `dateOfBrith` appears in `legacy/src/app/authorsPage/components/authorPagePlaceHolder.tsx`.
- Component/folder typo: `Adwards` in `legacy/src/app/components/body/adWards/Adwards.tsx`.
- Asset typo: `legacy/public/ultimate-winer.svg`.
- Layout class typo: `felx-row` in `legacy/src/app/components/NavbarLink.tsx`.

## Revision-01 Conclusion
- The earlier conceptual direction was useful, but it was still too broad for safe implementation.
- Revision-01 should keep the migration small and auditable:
  - `books`
  - `authors`
  - `homepage`
  - existing `media`
- Everything else must be either explicitly justified later or explicitly deferred.
