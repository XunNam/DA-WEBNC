# Public Lookup Flow

## Success Path

Actually tested in-browser on `/lookup`:

- route loads for non-admin users
- all 4 required fields render:
  - `orderCode`
  - `fullName`
  - `phoneNumber`
  - `email`
- empty submit shows local inline validation errors
- missing `#` in `orderCode` is handled locally
- exact-match lookup succeeds for a real existing order
- exact-match lookup also succeeded for a freshly created audit order before that order was deleted
- success result renders inline below the form

Displayed success fields verified:

- order code
- customer name
- shipping address
- created date/time
- total amount
- item list with image, title, quantity, unit price

## Failure Rules

Actually tested:

- nonexistent order code -> shared not-found result
- existing order code + wrong `fullName` -> same shared not-found result
- existing order code + wrong `phoneNumber` -> same shared not-found result
- existing order code + wrong `email` -> same shared not-found result

Toast behavior verified:

- appears only for the locked business failure cases above
- appears in the bottom corner
- auto-hides after 5 seconds
- repeated business failures reset the 5-second timer
- manual close works

## Non-Business Errors

Actually tested by intercepting the lookup request in-browser:

- forced `400` response stayed local in the page error UI and did not use the not-found toast
- forced `500` response stayed local in the page error UI and did not use the not-found toast

## State Behavior

Actually tested:

- stale success result is cleared before a later failed submit is shown
- field validation remains local
- no redirect occurs on success
- no modal is used for public lookup

## Privacy And Response Shaping

Actually tested by calling `/api/orders/lookup` directly after a successful lookup and inspecting response keys.

Returned top-level order keys:

- `createdAt`
- `fullName`
- `items`
- `orderCode`
- `shippingAddress`
- `totalAmount`

Returned item keys:

- `coverImageAlt`
- `coverImageUrl`
- `quantity`
- `title`
- `unitPrice`

Not exposed in the success payload:

- `email`
- `phoneNumber`
- internal `id`
- `paymentMethod`
- `totalQuantity`
- `compareAtPrice`
- `book`
- `bookSlug`
