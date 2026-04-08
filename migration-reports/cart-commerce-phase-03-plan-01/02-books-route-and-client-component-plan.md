## Existing Files To Touch

- `src/app/(frontend)/books/page.tsx`
- `src/app/(frontend)/books/page.module.css`

## New File To Add

- `src/app/(frontend)/books/BooksPageClient.tsx`

## Locked Route / Component Structure

- Keep `page.tsx` as the server data entrypoint.
- Keep `getPublishedBooksData()` as the only data source.
- Move only interactive grid/card rendering into `BooksPageClient.tsx`.
- Do not broaden into a larger client rewrite.
- Do not split into multiple extra client components unless implementation hits a real blocker.

## Locked Server-To-Client Prop Shape

`page.tsx` passes the existing `PublishedBookCardData[]` into `BooksPageClient.tsx`.

The Phase 3 plan relies on the current helper fields:
- `id`
- `slug`
- `title`
- `authorName`
- `price`
- `compareAtPrice`
- `coverImage.url`
- `coverImage.alt`
- `coverImage.width`
- `coverImage.height`
- `typeLabel`

No Phase 3 helper expansion is required because the current helper output already contains the fields needed for cart normalization and card rendering.

## File Responsibility Split

- `page.tsx`: data fetch and page shell only
- `BooksPageClient.tsx`: provider usage, click handlers, pending-state guards, interactive card JSX
- `page.module.css`: overlay, action row, focus states, disabled states, and responsive interaction styling
