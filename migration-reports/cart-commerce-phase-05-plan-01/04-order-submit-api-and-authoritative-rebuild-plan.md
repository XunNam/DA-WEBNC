## API Route File

- `src/app/api/orders/route.ts`

## Request Shape

Client POST body should contain only customer-entered checkout fields:

```ts
{
  fullName: string
  email: string
  phoneNumber: string
  shippingAddress: string
}
```

Do not send cart items from the client as authoritative order data.

## Response Shape

Success response:

```ts
{
  orderCode: string
  message: 'Chúng tôi sẽ sớm liên hệ với bạn để xác nhận thông tin'
}
```

Failure response:

```ts
{
  error: string
}
```

Use appropriate HTTP statuses:
- `201` success
- `400` validation/cart-review errors
- `409` order-code collision exhaustion if retries fail
- `500` unexpected server error

## Server-Side Input Sources

- read customer fields from the JSON body
- read the cart cookie from the request headers
- do not trust the cookie as the source of persisted pricing/order snapshot truth

## Server-Side Validation Rules

Validate before creating an order:
- customer fields exist and are non-empty after trimming
- email has valid format
- cart cookie parses into at least one valid item
- each cart item has a usable `bookId`
- no order is created when validation fails

## Authoritative Rebuild Flow

On submit, the API route must:
1. parse and sanitize the cart cookie
2. extract all `bookId`s
3. fetch current books from Payload via Local API using `getPayload({ config })`
4. enforce published-only reads for guest checkout:
   - query only documents with `_status: 'published'`
   - do not rely on cookie snapshots for visibility or pricing
5. verify every cart item resolves to a current usable book
6. rebuild each persisted order item from DB-backed values:
   - `bookTitle`
   - `bookSlug`
   - `coverImageUrl`
   - `coverImageAlt`
   - `unitPrice`
   - `compareAtPrice` if present
   - `quantity`
   - `lineTotal`
7. recompute `totalQuantity` and `totalAmount` from rebuilt items
8. create the order in Payload
9. clear the cart cookie in the response

## Failure Behavior For Invalid Books

If any cart item fails authoritative validation because the book is:
- missing
- unpublished
- no longer has numeric `price`
- missing usable cover relation data or media URL

Then:
- fail the entire submit
- create no partial order
- return a `400` review-cart error message instructing the client to review the cart

Locked conservative default message:
- `Giỏ hàng có sản phẩm không còn hợp lệ. Vui lòng kiểm tra lại trước khi đặt hàng.`

## Payload Local API Usage Guardrail

Because this route is a server-owned checkout endpoint:
- it may use the Local API intentionally for administrative order creation
- when reading current books for guest checkout validation, the route should still constrain the query to published books rather than reading drafts/admin-only content
