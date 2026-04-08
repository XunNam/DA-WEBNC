# Detail Route And Data Flow Plan

## Route Structure

Create a new public route at:
- `src/app/(frontend)/detail/[slug]/page.tsx`
- `src/app/(frontend)/detail/[slug]/page.module.css`

Add a small route-scoped client island only when commerce buttons arrive:
- `src/app/(frontend)/detail/[slug]/BookDetailActionRow.tsx`

Route structure decision:
- keep `page.tsx` as the server data-entry wrapper
- keep the page mostly server-rendered
- do not turn the whole detail page into a client component

## New Public Helper

Add a dedicated helper:
- `src/lib/getPublishedBookDetailBySlug.ts`

Export:
- `PublishedBookDetailData`
- `getPublishedBookDetailBySlug(slug: string)`

Reason for a dedicated helper instead of reusing `getPublishedBooksData()`:
- `/books` listing logic intentionally filters `catalogVisible = true`
- detail-page lookup must allow published hero-only books with `catalogVisible = false`
- keeping the detail helper separate avoids destabilizing the current listing helper

## Lookup Behavior

Use `payload.find` with:
- `collection: 'books'`
- `depth: 1`
- `draft: false`
- `limit: 1`
- `overrideAccess: false`
- `where.slug.equals = slug`

Do not pass `user`.
Do not filter on `catalogVisible`.

## Expected Detail Data Shape

The route should consume a normalized shape with:
- `id`
- `slug`
- `title`
- `authorName`
- `typeLabel`
- `price`
- `compareAtPrice`
- `coverImage.url`
- `coverImage.alt`
- `coverImage.width`
- `coverImage.height`
- `detailContent`
- `metaTitle`
- `metaDescription`

`detailContent` should be normalized to `null` when the serialized Lexical state has no visible content, following the same empty-content heuristic already used in `src/lib/getPublishedInfoPageData.ts`.

## Not-Found And Public-Read Rules

Behavior for route params and lookup failures:
- missing/blank slug: `notFound()`
- unpublished or non-public book: helper returns `null`, route calls `notFound()`
- valid slug but no matching book: helper returns `null`, route calls `notFound()`

This keeps the public route consistent with the current author detail pattern.

## Metadata Strategy

`page.tsx` should implement `generateMetadata({ params })` and use the same helper:
- if the book exists, use `metaTitle` / `metaDescription` when present
- otherwise fall back to title-based metadata
- if the book is missing, return a generic book-detail title/description instead of throwing

## Important Catalog Visibility Rule

Do not treat `catalogVisible` as a direct-access restriction.

Reason:
- the repo already defines `catalogVisible` as a listing-only flag
- homepage Hero may point to a published book with `catalogVisible = false`
- filtering detail lookup by `catalogVisible` would break the Hero `Đọc thêm` entry point
