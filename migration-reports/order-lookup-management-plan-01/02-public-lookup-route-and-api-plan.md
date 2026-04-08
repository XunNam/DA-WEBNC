# Public Lookup Route And API Plan

## Route Files

- `src/app/(frontend)/lookup/page.tsx`
- `src/app/(frontend)/lookup/LookupPageClient.tsx`
- `src/app/(frontend)/lookup/page.module.css`

## API File

- `src/app/api/orders/lookup/route.ts`

## Route Structure

- `page.tsx` remains a server wrapper following the existing `/cart` and `/purchase` route pattern.
- In Phase 2 it renders the public lookup shell and `LookupPageClient`.
- In Phase 3 it adds the server-side redirect for authenticated admin users.

## Client Component Responsibilities

- own the 4-field form
- own local validation state
- own loading state
- own bottom-corner toast state
- own local non-business error state
- own success result state

## Lookup Form Fields

- `orderCode`
- `fullName`
- `phoneNumber`
- `email`

## Client Validation

- all 4 fields required
- `orderCode` must include `#`
- recommended validation pattern: `^#[A-Z0-9]{5}$`
- basic email format validation
- trim leading/trailing whitespace before validation and submit
- do not lowercase
- do not normalize phone format
- do not collapse internal whitespace

## Request Shape

```ts
{
  orderCode: string
  fullName: string
  phoneNumber: string
  email: string
}
```

## Exact-Match Comparison Rule

Compare `fullName`, `phoneNumber`, and `email` with exact case-sensitive equality after trimming leading/trailing whitespace only.

- do not lowercase
- do not normalize phone format
- do not collapse internal whitespace

## API Algorithm

1. Validate request shape and required fields.
2. Trim leading/trailing whitespace from all 4 incoming fields.
3. Query `orders` by `orderCode` only with exact equality, `limit: 1`, `pagination: false`.
4. If no matching order code exists, return the shared business-failure response.
5. If the code exists, compare stored `fullName`, `phoneNumber`, and `email` against the trimmed request values using exact case-sensitive equality.
6. If any of the 3 fields differ, return the same shared business-failure response.
7. If all 4 values match, return a shaped public-safe order payload.

## Data Access Rules

- this route intentionally uses server-owned Local API access to read `orders`, because public collection read is blocked
- it must not return raw Payload order docs
- it must manually shape the success response

## Success Response Shape

```ts
{
  order: {
    orderCode: string
    fullName: string
    shippingAddress: string
    createdAt: string
    totalAmount: number
    items: Array<{
      coverImageUrl: string
      coverImageAlt: string
      title: string
      quantity: number
      unitPrice: number
    }>
  }
}
```

## Failure Response Rules

Shared business-failure response for the two locked business failure cases only:

```ts
{
  error: 'Không tìm thấy đơn hàng'
}
```

Status mapping:

- `200` success
- `404` for:
  - order code not found
  - order code exists but the other 3 fields do not match
- `400` malformed request shape or missing required fields
- `500` unexpected server failure

## Safe Public Fields

- `orderCode`
- `fullName`
- `shippingAddress`
- `createdAt`
- `totalAmount`
- `items[].coverImageUrl`
- `items[].coverImageAlt`
- `items[].bookTitle` mapped to `title`
- `items[].quantity`
- `items[].unitPrice`

## Internal-Only Fields

- stored `email`
- stored `phoneNumber`
- internal `id`
- `paymentMethod`
- `totalQuantity`
- `compareAtPrice`
- `book` relationship
- `bookSlug`
