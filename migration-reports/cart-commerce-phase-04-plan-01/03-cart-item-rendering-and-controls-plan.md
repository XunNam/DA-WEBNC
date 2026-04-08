## Locked Item Fields To Render

For each cart item show:
- cover image
- book title
- `compareAtPrice` if present, styled struck through
- `price`
- quantity
- line total based on `price * quantity`

Do not add:
- book-detail links
- author line
- extra merchandising UI

The title should remain plain text because there is no approved public book-detail route in scope.

## Presentation Plan

- Render each item inside a rounded card/row using the existing site card language.
- Keep the cover image in a fixed portrait frame similar to `/books`.
- Place pricing and quantity controls in a clean review/edit layout.
- On mobile, allow controls and totals to stack rather than forcing a cramped row.

## Quantity Controls

Lock the quantity UI to button steppers, not a free-form text input:
- decrement button
- current quantity display
- increment button

Provider integration:
- increment: `setQuantity(bookId, quantity + 1)`
- decrement:
  - if current quantity is greater than `1`, call `setQuantity(bookId, quantity - 1)`
  - if current quantity is `1`, call `removeItem(bookId)` instead of allowing `0`
- remove: `removeItem(bookId)`

## Malformed-Item Handling

- Phase 2 sanitization should prevent malformed items from surviving into provider state.
- `/cart` should treat the provider state as the source of truth for valid UI items.
- If sanitized state contains no valid items, render the empty state.
- Do not add a second cart-repair system in the `/cart` page.

## Shared Helpers To Use

The page must reuse Phase 2 shared helpers rather than duplicating logic:
- `getLineTotal(item)`
- `getTotalQuantity(items)`
- `getTotalAmount(items)`
- `formatCartCurrency(value)`
