# Feature Scope And Guardrails

## Goal

Add a public book detail page at `/detail/[slug]` and wire new `Đọc thêm` entry points from:
- `/books`
- homepage Hero featured-book CTA
- homepage Best Seller cards

The detail page must reuse the existing commerce flow safely for:
- `Thêm vào giỏ hàng`
- `Mua sách`

## Locked Product Rules

- Do not add the detail page to the Navbar.
- Use `/detail/[slug]`, never `/detail-<slug>`.
- Keep pricing semantics unchanged:
  - `price` is the current selling price
  - `compareAtPrice` is the original crossed-out price
- Add book-detail content as a Payload `richText` field stored on the `books` document in MongoDB.
- If detail content is empty, still render the detail page and show `Nội dung đang được cập nhật`.
- The detail page ends with two horizontal actions:
  - `Thêm vào giỏ hàng`
  - `Mua sách`
- Keep the same disabled rule as `/books`: purchase actions are disabled when `price === null`.
- The displayed `Thể loại` value comes from `typeLabel`.
- Homepage Hero changes are limited to:
  - `Đọc thử` -> `Đọc thêm`
  - the new CTA goes to the selected featured book detail page
  - `Mua ngay` follows the `/books` buy-now model:
    - normalize the featured book into the existing cart item shape
    - `addOrIncrement(item, 1)`
    - then navigate to `/purchase`
  - current featured-book relationship and summary override behavior stay intact
- Homepage Best Seller gains the same three actions as `/books` without a structural redesign.
- `/books` gains a three-action overlay without changing the underlying grid/card layout.

## Protected Baseline

Do not destabilize:
- `src/app/(frontend)/books`
- `src/app/(frontend)/page.tsx`
- `src/components/cart/CartProvider.tsx`
- `src/components/cart/CartSummary.tsx`
- `src/app/(frontend)/cart`
- `src/app/(frontend)/purchase`
- `src/app/api/orders/submit/route.ts`
- `src/app/(frontend)/lookup`
- `src/app/(frontend)/order-management`
- Payload admin auth/session
- MongoDB / Atlas and R2-backed media

## Out Of Scope

- site redesign
- new taxonomy system beyond the smallest `typeLabel` admin-safe adjustment
- checkout architecture changes
- order lookup/order management changes
- media storage or image delivery changes
- navigation changes
- preview/draft workflow redesign
- cleanup of unused homepage `sampleLinkUrl` / `buyLinkUrl` admin fields

## Repo-Specific Guardrails

- Keep public book-detail reads published-only with `overrideAccess: false`.
- Do not use `catalogVisible` as a detail-page access rule.
- Keep the new work additive and phase-gated.
- Prefer route-scoped server components plus very small client islands instead of large client rewrites.
