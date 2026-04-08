# Book Detail Plan 01

This planning pack defines the smallest safe rollout for a new public book detail feature at `/detail/[slug]` without changing the existing cart/order architecture, navbar, lookup flow, order-management flow, Payload auth/session behavior, or media pipeline.

Confirmed implementation split:
1. Phase 1: planning pack only
2. Phase 2: `books` schema/admin changes, `typeLabel` admin-safety adjustment, `getPublishedBookDetailBySlug()` helper, `/detail/[slug]` route, base detail UI, rich-text render, fallback content message, `Quay lại`
3. Phase 3: detail-page commerce action row, shared add-to-cart / buy-now behavior reuse, disabled-state parity with `/books`
4. Phase 4: integrate `Đọc thêm` into `/books`, homepage Hero, and homepage Best Seller, then verify all entry points

Key architecture decisions:
- add a new optional `detailContent` rich-text field on `books`
- keep `/detail/[slug]` mostly server-rendered
- add a dedicated public helper that looks up a published book by slug without filtering on `catalogVisible`
- make Hero `Mua ngay` reuse the `/books` buy-now behavior: normalize the featured book into the existing cart item shape, call `addOrIncrement(item, 1)`, then navigate to `/purchase`
- keep `typeLabel` on the book document, but change it from a fixed `select` to a plain `text` field so admins can safely enter new labels without data migration

Exact next recommended action:
- implement **Phase 2 only**
- start with `src/collections/Books.ts`, `pnpm generate:types`, `src/lib/getPublishedBookDetailBySlug.ts`, and the new `src/app/(frontend)/detail/[slug]/` route shell
- do not add detail-page commerce buttons or `/books` / homepage entry-point changes until the base route and data flow are verified
