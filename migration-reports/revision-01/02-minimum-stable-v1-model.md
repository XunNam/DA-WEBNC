# Minimum Stable V1 Model

## Goal
Define the smallest Payload content model that can replace the legacy hard-coded catalog and homepage content without inventing unsupported entities.

## Required Now

### 1. `books` collection

| Area | Recommendation |
| --- | --- |
| Why it is required | Books are the main catalog content. Legacy evidence appears in `legacy/src/app/booksPage/page.tsx`, `legacy/src/app/components/body/bestSellingBooks/BestSellingBooks.tsx`, and `legacy/src/app/components/body/newRelease/NewRelease.tsx`. |
| Required fields | `title`, `slug`, `author` (relationship to `authors`), `coverImage` (relationship to `media`), `typeLabel` |
| Optional but supported | `price`, `compareAtPrice`, `metaTitle`, `metaDescription` |
| Deferred | `publisher`, `tags`, `gallery`, `stock`, `ISBN`, `rating`, `language`, `format`, `publishYear`, `featured` flags |
| Notes | `typeLabel` preserves the literal legacy label. The homepage hero summary and CTA URLs do not belong on the base book record in v1. |

### 2. `authors` collection

| Area | Recommendation |
| --- | --- |
| Why it is required | Authors drive both the author index and author spotlight content. Legacy evidence appears in `legacy/src/app/authorsPage/page.tsx`, `legacy/src/app/authorsPage/*/page.tsx`, and `legacy/src/app/components/body/bioGraphy/Biography.tsx`. |
| Required fields | `name`, `slug`, `portrait` (relationship to `media`) |
| Optional but supported | `lifeDatesDisplay`, `metaTitle`, `metaDescription` |
| Deferred | Structured birth year, death year, public biography rich text, external-source-derived long-form copy |
| Notes | Do not import the legacy long-form biography paragraphs into public author fields in v1. |

### 3. `homepage` global

| Area | Recommendation |
| --- | --- |
| Why it is required | The homepage is built from fixed editorial sections in `legacy/src/app/page.tsx` and section components. |
| Required groups / arrays | `hero`, `authorSpotlight`, `bestSellers`, `awards`, `newsletterCta` |
| Hero group | `eyebrow`, `featuredBook` (relationship to `books`), `reviewedShortCopy`, `buyLinkUrl`, `sampleLinkUrl` |
| Author spotlight group | `eyebrow`, `featuredAuthor` (relationship to `authors`), `reviewedShortCopy` |
| Best sellers section | curated array of book relationships |
| Awards section | structured array with `iconKey`, `title`, `body` |
| Newsletter CTA | `heading`, `body` only |
| Notes | This is the agreed hybrid approach: fixed major sections plus structured nested content, not a free-form page builder. |

### 4. Existing `media` collection

| Area | Recommendation |
| --- | --- |
| Why it is required | Book covers and author portraits should be managed as uploads rather than left as path-only references. |
| Required now | Keep the existing `media` collection and use it for book covers and portraits. |
| Optional but supported | Additional descriptive metadata if needed later, but not required to start migration planning. |
| Deferred | Making static logos and award icons editor-managed in v1 |

## Optional But Supported

### `siteSettings` global
- Status: optional and deferred by default.
- Add only if the team explicitly wants non-developers to control:
  - default site SEO values
  - brand name
  - footer legal text
- Do not add it just because the legacy layout contains static logos and footer text.

## Deferred For Later

| Deferred Item | Why It Is Deferred |
| --- | --- |
| `publishers` collection | No publisher evidence exists in legacy content. |
| `tags` | No tag data exists in legacy content. |
| `categories` collection | The four legacy labels are too small and too ambiguous to justify a managed taxonomy collection in v1. |
| Blog, testimonials, partner logos, promotions collections | No corresponding content was found in the legacy site. |
| Newsletter subscribers | The legacy homepage includes CTA copy only, not a real form or subscriber data flow. |
| Carts, orders, customers, checkout | Explicitly out of scope and unsupported by legacy evidence. |
| Public author biographies from legacy paragraphs | Editorial-safety issue. These texts require manual review and should not be trusted as publishable content. |

## Relationships

| Relationship | Purpose |
| --- | --- |
| `books.author -> authors` | Connect each book to its author. |
| `books.coverImage -> media` | Replace path-only image references with managed uploads. |
| `homepage.hero.featuredBook -> books` | Let the homepage hero feature a catalog book. |
| `homepage.authorSpotlight.featuredAuthor -> authors` | Let the homepage spotlight one author. |
| `homepage.bestSellers.items[] -> books` | Curate homepage best sellers by book relationship instead of repeating book data. |

## Why This Is The Minimum Safe Set
- It is large enough to replace the real content-bearing parts of the legacy site.
- It is small enough to avoid speculative admin complexity.
- It matches the verified legacy evidence:
  - 13 unique books
  - 8 unique authors
  - one structured homepage
  - managed images for books and authors
- It defers everything that is not proven by the legacy source.
