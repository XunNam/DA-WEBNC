# Phase By Phase Implementation Batches

## Phase 1: Planning Pack

Goal:
- finalize scope, schema decisions, route architecture, commerce reuse strategy, and rollout order

Files:
- planning docs only under `migration-reports/book-detail-plan-01/`

Stop condition:
- no storefront or Payload source changes

Verification target:
- the planning pack is decision-complete for later implementation

## Phase 2: Book Schema + Detail Route Base

Goal:
- add the book-detail content model and ship a public read-only `/detail/[slug]` page shell

Likely touched files:
- `src/collections/Books.ts`
- `src/payload-types.ts` via `pnpm generate:types`
- `src/lib/getPublishedBookDetailBySlug.ts`
- `src/app/(frontend)/detail/[slug]/page.tsx`
- `src/app/(frontend)/detail/[slug]/page.module.css`

Implementation scope:
- add `detailContent`
- relax `typeLabel` to admin-editable text
- add slug lookup helper
- render title, type label, author, price block, overview section, fallback message, and `Quay lại`
- add route metadata

Verification targets:
- existing book documents still load in admin after the schema change
- editors can type a new `typeLabel` value safely
- `detailContent` is editable in admin
- published book detail page resolves by slug
- hero-only books with `catalogVisible = false` still resolve by slug
- draft/unpublished/missing slugs return 404
- empty rich-text content shows `Nội dung đang được cập nhật`
- `pnpm generate:types`
- `pnpm exec tsc --noEmit`

Stop conditions:
- if changing `typeLabel` breaks existing book data in admin, stop before route work
- if detail lookup accidentally depends on `catalogVisible`, stop and correct that before continuing

## Phase 3: Detail-Page Commerce Actions

Goal:
- add the action row at the bottom of the detail page and reuse the existing cart/purchase behavior safely

Likely touched files:
- `src/app/(frontend)/detail/[slug]/BookDetailActionRow.tsx`
- `src/app/(frontend)/detail/[slug]/page.tsx`
- `src/app/(frontend)/detail/[slug]/page.module.css`
- one new shared client commerce helper or hook

Implementation scope:
- normalize detail-page book data into the cart item shape
- add `Thêm vào giỏ hàng`
- add `Mua sách`
- keep both disabled when `price === null`
- keep the page shell server-rendered and isolate the buttons in a client island

Verification targets:
- add-to-cart updates navbar summary immediately
- buy-now adds/increments the item first and then routes to `/purchase`
- the action row stays horizontal
- `price === null` disables both buttons consistently
- no changes to `/cart`, `/purchase`, or `/api/orders/submit`
- `pnpm exec tsc --noEmit`

Stop conditions:
- if the shared helper changes `/books` behavior unexpectedly, keep detail-page reuse isolated and delay broader reuse to Phase 4

## Phase 4: Entry-Point Integrations

Goal:
- add `Đọc thêm` discovery and align `/books`, Hero, and Best Seller with the new detail route

Likely touched files:
- `src/app/(frontend)/books/BooksPageClient.tsx`
- `src/app/(frontend)/books/page.module.css`
- `src/app/(frontend)/page.tsx`
- `src/app/(frontend)/page.module.css`
- `src/app/(frontend)/HomepageHeroActionsClient.tsx`
- `src/app/(frontend)/HomepageBestSellersClient.tsx`

Implementation scope:
- `/books` overlay/action-row becomes three actions
- Hero secondary CTA becomes `Đọc thêm` to the featured-book detail page
- Hero `Mua ngay` is moved onto the shared client-side buy-now path
- Best Seller gains a client-rendered three-action overlay/action-row
- reuse the shared book-commerce behavior from Phase 3

Verification targets:
- `/books` action order is `Đọc thêm`, `Thêm vào giỏ hàng`, `Mua ngay`
- `Đọc thêm` stays enabled even when `price === null`
- Hero `Mua ngay` adds/increments the featured book first and then routes to `/purchase`
- Hero `Đọc thêm` routes to `/detail/[slug]`
- Best Seller keeps the existing grid layout and typography
- all three entry points reach the same detail route
- `pnpm exec tsc --noEmit`

Stop conditions:
- if Hero buy-now cannot be added with a narrow client action component, stop and re-scope before converting more of the homepage to client code
- if homepage Best Seller requires a full-page client conversion, stop and re-scope to a smaller section client island
- if `/books` overlay changes break keyboard or coarse-pointer accessibility, stop before release
