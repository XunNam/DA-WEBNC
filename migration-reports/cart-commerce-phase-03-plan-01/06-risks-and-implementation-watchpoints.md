## Repo-Specific Watchpoints

- The current `/books` page is a pure server component, so keep the client boundary limited to `BooksPageClient.tsx`.
- The current grid is 4/3/2/1 columns with `max-width: 250px` cards, so overlay controls must fit without changing card heights.
- `imageWrap` already owns lift/shadow behavior, so add the overlay inside that wrapper instead of restructuring the card.
- `getPublishedBooksData()` already returns the required fields, so do not widen the helper in Phase 3.
- `Books.price` is optional, so null-priced books must be treated as non-purchasable everywhere in the Phase 3 client layer.
- Repo typecheck still depends on `.next/types`, so verification must account for that.

## Locked Implementation Watchpoints

- no new global cart UX beyond the Phase 2 navbar summary
- no toast, modal, or mini-cart in Phase 3
- no `/cart`, `/purchase`, or order persistence work starts here
- no commerce UI is added to homepage or any route other than `/books`
- use real buttons for actions, not links styled as buttons

## Conservative Details That May Be Finalized During Coding

These may be resolved conservatively without changing scope:
- exact blur amount and overlay opacity
- exact spacing and button height within the overlay/action row
- exact muted disabled colors
- exact per-book pending-state representation, as long as duplicate clicks are prevented
