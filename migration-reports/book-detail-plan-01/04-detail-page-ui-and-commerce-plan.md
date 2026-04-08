# Detail Page UI And Commerce Plan

## Page Structure

Recommended render order:
1. top-of-page `Quay lại` link
2. primary detail header block with cover image and core metadata
3. overview section titled `Tổng quan về sách`
4. final commerce action row

Core metadata block contents:
- `Tên sách`
- `Thể loại` from `typeLabel`
- `Tác giả`
- current selling price from `price`
- original price from `compareAtPrice` only when present

## `Quay lại` Placement

Place the `Quay lại` control at the top of the route container, above the media-and-metadata block.

Implementation choice:
- use a normal `Link` to `/books`

Reason:
- keeps the page mostly server-rendered
- avoids adding a second client-only navigation control
- gives a stable destination even when the user lands on a shared detail URL directly

## Rich-Text Rendering

Render `detailContent` with:
- `RichText` from `@payloadcms/richtext-lexical/react`

Styling approach:
- mirror the existing info-page rich-text treatment instead of inventing a new renderer
- use route-scoped CSS in `page.module.css`

Fallback behavior:
- if `detailContent` is `null`, render the exact message `Nội dung đang được cập nhật`
- keep the overview section visible even when content is empty

## Pricing Rules

Display rules:
- show the current selling price row only when `price !== null`
- show the original crossed-out row only when `compareAtPrice !== null`
- do not invent replacement copy for missing values

Disabled-state rule:
- if `price === null`, purchase buttons are disabled
- `Đọc thêm` and `Quay lại` remain usable

## Commerce Action Row

Final row placement:
- directly below the overview section
- two equal-width horizontal actions:
  - `Thêm vào giỏ hàng`
  - `Mua sách`

Implementation shape:
- keep the page shell server-rendered
- mount a small client island for the action row only

## Commerce Reuse Strategy

Reuse the existing `/books` behavior, not the visual markup.

Shared behavior to centralize:
- normalize book data into the existing `CartCookieItem` shape
- `addOrIncrement(item, 1)`
- pending-action guard
- `startRouteLoadingIndicator()`
- buy-now ordering: add to cart first, navigate to `/purchase` second

Recommended shared abstraction:
- add a narrow shared client helper or hook for book commerce actions
- use it from the detail-page action row first
- reuse the same helper in `/books`, homepage Hero, and homepage Best Seller during Phase 4

Do not change:
- cart cookie shape
- navbar cart summary behavior
- `/purchase` route contract
- `/api/orders/submit` flow

Hero alignment note:
- the same shared buy-now behavior used by the detail page must also power Hero `Mua ngay` in the later integration phase
- the public Hero must not keep a separate external-link purchase path

## Detail-Page Button Behavior

`Thêm vào giỏ hàng`:
- enabled only when `price !== null`
- stays on the detail page
- relies on navbar cart summary update as confirmation

`Mua sách`:
- enabled only when `price !== null`
- adds/increments the item in the cart first
- then navigates to `/purchase`
- uses the same disabled and pending rules as `/books`
