## New Collection File

- `src/collections/Orders.ts`

## Config Registration

- add `Orders` to `collections` in `src/payload.config.ts`
- run `pnpm generate:types` after schema changes

## Access Rules

Use the existing repo pattern:
- define `usersCollectionOnly` locally in `Orders.ts`
- access:
  - `read`: `usersCollectionOnly`
  - `create`: `usersCollectionOnly`
  - `update`: `usersCollectionOnly`
  - `delete`: `usersCollectionOnly`

Rationale:
- admin/operators manage orders in Payload
- public checkout does not create orders through public collection access; it goes through the custom API route

## Admin Config

Use conservative admin defaults:
- `useAsTitle: 'orderCode'`
- `defaultColumns: ['orderCode', 'fullName', 'totalQuantity', 'totalAmount', 'createdAt']`

## Locked Collection Fields

Top-level fields:
- `orderCode`: text, required, unique, index
- `fullName`: text, required
- `email`: email, required
- `phoneNumber`: text, required
- `shippingAddress`: textarea, required
- `paymentMethod`: select, required, default `'cod'`, single option `'cod'`
- `totalQuantity`: number, required
- `totalAmount`: number, required
- `items`: array, required

Order item subfields:
- `book`: relationship to `books`, optional
- `bookTitle`: text, required
- `bookSlug`: text, required
- `coverImageUrl`: text, required
- `coverImageAlt`: text
- `unitPrice`: number, required
- `compareAtPrice`: number
- `quantity`: number, required
- `lineTotal`: number, required

Do not add:
- order status workflow
- shipping status
- payment gateway fields
- user relationship/auth ownership

## Order Code Generation

Locked format:
- `#` + 5 uppercase alphanumeric characters

Recommended implementation:
- character set: `A-Z0-9`
- generate 5 random characters
- prepend `#`

## Minimal Uniqueness Guard

Use a short retry loop in the API route:
- attempt generation/check up to `10` times
- on each attempt, query `orders` by `orderCode`
- if unused, proceed
- if all retries collide, fail safely with `409`

Locked fallback behavior on exhaustion:
- return a generic order-creation failure error
- do not create an order with a non-unique code
