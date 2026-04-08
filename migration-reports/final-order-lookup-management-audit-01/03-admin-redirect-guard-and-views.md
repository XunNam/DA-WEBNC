# Admin Redirect Guard And Views

## Authenticated Redirect From `/lookup`

Actually tested with a temporary local Payload `users` account:

- authenticated visit to `/lookup` redirected to `/order-management`
- redirect was observed after direct navigation to `/lookup` in an authenticated browser context

Code inspection also confirmed the redirect is implemented in the server wrapper, not in the client lookup component.

## Unauthenticated Guard

Actually tested:

- unauthenticated `/order-management` returns `307` to Payload admin login with `redirect=/order-management`
- unauthenticated `/order-management/[id]` returns `307` to Payload admin login with the detail path preserved

Code inspection confirmed the guard lives in the server route wrappers and is not a client-only guard.

## Admin List

Actually tested with authenticated runtime:

- `/order-management` loads for authenticated admin users
- list entries render as read-only cards
- each entry links to `/order-management/[id]`
- detail links use the internal order `id`
- newly created audit orders appeared in the frontend admin list
- a fresh audit order was observed at the top of the list before delete, matching newest-first behavior

Displayed list fields verified:

- `orderCode`
- `fullName`
- `phoneNumber`
- `email`
- `totalQuantity`
- `totalAmount`
- `createdAt`

## Admin Detail

Actually tested:

- valid existing internal `id` loads the detail page
- invalid id format returns safe `404` for authenticated admin
- valid-looking but missing id returns safe `404` for authenticated admin

Displayed detail fields verified:

- order code
- created date/time
- full name
- email
- phone number
- shipping address
- payment method
- total quantity
- total amount
- item snapshots with image, title, quantity, unit price, line total

No edit/update UI appeared during audit:

- no save button
- no update button
- no edit form
- no link into Payload admin edit screens from this frontend flow
