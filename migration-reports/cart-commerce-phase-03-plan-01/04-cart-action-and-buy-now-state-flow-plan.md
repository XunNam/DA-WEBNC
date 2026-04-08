## Locked Cart Item Mapping

When `price !== null`, normalize the clicked book into the Phase 2 cart item shape:

```ts
{
  bookId: book.id,
  slug: book.slug,
  title: book.title,
  price: book.price,
  compareAtPrice: book.compareAtPrice,
  coverImageUrl: book.coverImage.url,
  coverImageAlt: book.coverImage.alt,
  quantity: 1,
}
```

Do not write items with `price === null`.

## Provider Integration

Use the approved Phase 2 hook:

```ts
const { addOrIncrement } = useCart()
```

## `Thêm vào giỏ hàng` Flow

- Guard `price !== null`.
- Call `addOrIncrement(item, 1)`.
- Remain on `/books`.
- Rely on the immediate navbar summary update as the user-visible confirmation.
- Do not add toast, modal, or mini-cart behavior in Phase 3.

## Revised `Mua ngay` Flow

- `Mua ngay` must guard `price !== null`.
- It must first call the Phase 2 cart provider action to add or increment the selected book.
- Only after that provider action returns should it trigger navigation intent to `/purchase`.
- The Phase 3 requirement is to implement and verify this ordering correctly:
  - cart action first
  - navigation intent second
- Duplicate-click protection must prevent repeated adds or repeated navigation attempts while the action is in flight.
- Phase 3 does not require the destination `/purchase` page to already deliver completed checkout behavior.
- The `/purchase` page remains a later-phase dependency, but the Phase 3 code path may still navigate toward that route as part of the intended flow.
- Release guardrail:
  - even if the code path is implemented in Phase 3, it must not be treated as production-ready until `/purchase` exists and the downstream checkout flow is complete

## Duplicate-Click / Race Guard Expectations

- Use a narrow local pending state in `BooksPageClient.tsx`.
- Track the currently active book/action id.
- Disable repeated clicks for that active card while the action is being processed.
- For add-to-cart, clear pending immediately after the synchronous provider action returns.
- For buy-now, keep the active control guarded through the immediate navigation trigger.

## Sync Expectations

Because Phase 2 locks provider actions to update provider state and cookie deterministically:
- navbar summary should update immediately after add
- `Mua ngay` navigation intent should fire only after the provider action returns
- no timeout-based sequencing or generic effect-based cookie mirror should be introduced

## Release Dependency Note

Phase 3 implementation completeness and production release readiness are different:
- Phase 3 is complete when the `/books` interaction logic and state ordering are implemented correctly.
- Phase 3 is not ready for production release until `/purchase` exists and the later checkout phase is complete.
