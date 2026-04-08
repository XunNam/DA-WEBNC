## Order Summary Rendering

Render from the provider’s current sanitized cart state.

Per item show:
- cover image
- title
- quantity
- unit price based on `price`
- line total based on `price * quantity`

Do not show:
- author line
- extra merchandising UI
- `compareAtPrice` in final calculations

Optional display rule:
- `compareAtPrice` may be omitted entirely on `/purchase` to keep the checkout summary focused on the effective sale price, since the locked requirement only mandates final calculations use `price`

## Expand / Collapse Behavior

- summary is open by default
- one lightweight local toggle inside `PurchasePageClient.tsx`
- toggle controls only the visibility of itemized summary details
- overall order total block remains visible even when collapsed
- do not implement a multi-panel accordion system

## Totals Display

Always show:
- total quantity
- total amount

Totals must derive only from `price`.

## Required Form Fields

- full name
- email
- phone number
- shipping address

## Client-Side Validation Rules

- all fields required
- trim all values before submit
- email must match a basic valid-email format
- phone number must be non-empty trimmed text
- shipping address must be non-empty trimmed text
- submit button disabled while request is in flight

Do not add complex formatting, masking, or schema libraries in v1.

## COD Note Placement

- place the COD note directly above or directly below the submit button area
- keep it visually secondary but clearly readable
- no payment-step UI

## Empty-Cart Handling

If the cart is empty or sanitizes down to zero valid items:
- do not render the checkout form
- render a clean empty-state card
- provide a single CTA back to `/books`
- do not render the submit button
- do not render stale summary totals
