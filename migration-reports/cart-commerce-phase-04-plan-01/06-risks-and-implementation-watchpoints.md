## Repo-Specific Watchpoints

- There is still no broad client-state layer outside the approved Phase 2 provider, so keep the `/cart` client boundary isolated to `CartPageClient.tsx`.
- The approved cart model contains only snapshot UI fields:
  - `bookId`
  - `slug`
  - `title`
  - `price`
  - `compareAtPrice`
  - `coverImageUrl`
  - `coverImageAlt`
  - `quantity`
- `/cart` must not assume richer item metadata than the Phase 2 cookie model provides.
- Route type generation still depends on `.next/types`.
- `/purchase` is not in scope, so do not let checkout-CTA wiring turn into downstream route work.

## Locked Implementation Watchpoints

- no checkout form, COD note, submit logic, or order persistence work in Phase 4
- no new provider API should be added unless Phase 2 proves insufficient during implementation
- no sticky sidebar, coupon UI, promo logic, or authentication work
- no new mini-cart, toast, or modal behavior
- no redesign of the overall site shell

## Conservative Details That May Be Finalized During Coding

These may be resolved conservatively without changing scope:
- exact button labels for quantity/remove controls
- exact summary-card spacing and mobile stacking details
- exact empty-state copy, as long as it clearly routes users back to `/books`
- exact row/card breakpoint behavior, as long as readability is preserved
