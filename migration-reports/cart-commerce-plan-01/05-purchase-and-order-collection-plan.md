## `/purchase` Route Plan

New route:
- `src/app/(frontend)/purchase/page.tsx`

Recommended implementation shape:
- server wrapper route
- interactive client component:
  - `src/app/(frontend)/purchase/PurchasePageClient.tsx`
- route styling:
  - `src/app/(frontend)/purchase/page.module.css`

## Checkout Form

Required fields:
- full name
- email
- phone number
- shipping address

Validation rules:
- all fields required
- values trimmed before submit
- email must be valid format
- submit button disabled while request is in flight

## Order Summary Behavior

The purchase summary is required to be collapsible in v1.

Recommended implementation:
- summary open by default
- one lightweight local toggle in the purchase client component
- no complex accordion system

Summary contents:
- all cart items
- quantity per item
- unit price (`price`)
- line total (`price * quantity`)
- total quantity
- total amount

Empty-cart behavior:
- if cart is empty, do not render the checkout form
- show an empty-state view with CTA back to `/books`

## COD Note

Required placement:
- near the submit area / order button

Required scope:
- clearly indicate COD-only checkout
- no payment integration or payment-step UI

## Order Submit Flow

New API route:
- `src/app/api/orders/route.ts`

Client submit flow:
1. client validates required fields
2. client posts only customer fields to `/api/orders`
3. server reads the cart cookie from the request
4. server validates cart presence and customer fields
5. server re-fetches current published books from Payload/Mongo by `bookId`
6. server rebuilds authoritative order items and totals from DB-backed book data
7. server creates the order in MongoDB through Payload Local API
8. server clears the cart cookie in the response
9. client clears provider state
10. client shows success popup/modal

Failure behavior:
- if cart is empty or malformed at submit time, return `400`
- if any book is missing, unpublished, not publicly purchasable, missing usable cover media, or no longer has numeric `price`, return a user-facing review-cart error
- do not create a partial order

## Authoritative Order Item Rebuild

Persisted order records must be built from current DB-backed book data, not from cookie snapshots.

Server-side authoritative fields per order item:
- `bookTitle`
- `bookSlug`
- `coverImageUrl`
- `coverImageAlt`
- `unitPrice`
- `compareAtPrice` if present
- `quantity`
- `lineTotal`

Authoritative rules:
- only current published books are accepted
- totals must be recomputed from current `price`
- cookie values are not the source of truth for persisted pricing or final order snapshot content

## Order Code Generation

Required format:
- `#` + 5 uppercase letters/numbers

Recommended minimal implementation:
- generate random 5-character `[A-Z0-9]`
- prepend `#`
- check uniqueness in `orders`
- retry a small number of times, for example up to `10`
- if uniqueness cannot be achieved after retries, fail the request safely

## Payload `orders` Collection Plan

New collection:
- `src/collections/Orders.ts`
- registered in `src/payload.config.ts`

Access:
- `read`: `usersCollectionOnly`
- `create`: `usersCollectionOnly`
- `update`: `usersCollectionOnly`
- `delete`: `usersCollectionOnly`

Note:
- public order creation still happens through the custom API route, which uses Payload Local API intentionally after server-side validation

Admin config:
- `useAsTitle: 'orderCode'`
- `defaultColumns: ['orderCode', 'fullName', 'totalQuantity', 'totalAmount', 'createdAt']`

Recommended fields:
- `orderCode`: text, required, unique, indexed
- `fullName`: text, required
- `email`: email, required
- `phoneNumber`: text, required
- `shippingAddress`: textarea, required
- `paymentMethod`: select, required, default `'cod'`, single option `'cod'`
- `totalQuantity`: number, required
- `totalAmount`: number, required
- `items`: array, required
  - `book`: relationship to `books`, optional
  - `bookTitle`: text, required
  - `bookSlug`: text, required
  - `coverImageUrl`: text, required
  - `coverImageAlt`: text
  - `unitPrice`: number, required
  - `compareAtPrice`: number
  - `quantity`: number, required
  - `lineTotal`: number, required

## Post-Success Behavior

Required success message:
- `Chúng tôi sẽ sớm liên hệ với bạn để xác nhận thông tin`

Recommended v1 success flow:
- show local success popup/modal inside `/purchase`
- include the created `orderCode`
- clear the cart cookie
- clear client cart state
- keep the user on `/purchase` with a CTA back to `/books`

Reason:
- simplest safe success UX
- avoids immediate redirect races while cart state is being cleared
- no global toast system is needed
