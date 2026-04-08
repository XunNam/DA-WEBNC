## Phase 3 Includes

In scope:
- `/books` hover/focus commerce UI
- `Thêm vào giỏ hàng`
- `Mua ngay`
- Phase 2 cart-provider integration
- disabled handling for `price === null`

## Phase 3 Explicitly Excludes

Out of scope:
- `/cart`
- `/purchase` implementation
- checkout API
- `orders` collection
- homepage or any other route commerce UI
- navbar foundation work already defined in Phase 2
- any redesign of the books listing

## Protected Baseline

Do not destabilize:
- `/books` route and existing server data entrypoint
- published-only `getPublishedBooksData()` flow
- current books grid rhythm
- current image sizing, title clamp, and price row structure
- other frontend routes
- navbar/footer shell stability

## Locked Commerce Decisions

- `/books` remains the only page with hover commerce UI
- `Thêm vào giỏ hàng` adds the selected book and stays on `/books`
- `Mua ngay` adds the selected book, preserves existing cart contents, then navigates to `/purchase`
- `price` is the only pricing source for cart math
- `compareAtPrice` is display-only
- if `price === null`, both actions are disabled with no cart write and no navigation

## Release Guardrail

- Phase 3 may implement the `Mua ngay` navigation code path.
- Phase 3 is not production-release-ready until `/purchase` exists and the later checkout phase is complete.
