## Cart Item Shape

Recommended cookie item shape:

```ts
type CartCookie = {
  version: 1
  items: CartCookieItem[]
}

type CartCookieItem = {
  bookId: string
  slug: string
  title: string
  price: number
  compareAtPrice: number | null
  coverImageUrl: string
  coverImageAlt: string
  quantity: number
}
```

Why this is the safest practical shape:
- compact enough for cookie storage
- sufficient to render navbar summary, `/cart`, and `/purchase` review client-side
- avoids storing unnecessary fields such as author name, media dimensions, type labels, or full book objects

## Cookie Design

Cookie name:
- `bookstore-cart`

Serialization:
- `encodeURIComponent(JSON.stringify(cart))`

Cookie options:
- `path=/`
- `sameSite=lax`
- `max-age=2592000`

Do not use:
- `HttpOnly`
  - client-side cart updates need write access

## Sanitize And Merge Rules

Parsing rules:
- malformed JSON => empty cart
- missing `version` or unsupported version => empty cart
- non-array `items` => empty cart

Per-item sanitize rules:
- `bookId`, `slug`, `title`, `coverImageUrl`, `coverImageAlt` must be trimmed strings
- invalid or empty `bookId` drops the item
- invalid or missing `price` drops the item
- `compareAtPrice` becomes `null` when missing or invalid
- `quantity` is coerced to integer
- quantity is clamped to `1..99`

Duplicate merge rules:
- duplicate `bookId` entries are merged into one item
- merged quantity = summed quantity, then clamped to `99`

Practical cookie-size rule:
- keep the cookie snapshot minimal
- do not add extra display fields beyond the locked item shape
- if future implementation needs a size guard, reject the write rather than silently corrupting cart state

## Quantity Rules

Rules:
- minimum quantity: `1`
- maximum quantity: `99`
- decrement from `1` removes the item
- add-to-cart on an existing `bookId` increments quantity by `1`, then clamps

## Pricing And Totals Rules

Client/cart totals:
- line total = `price * quantity`
- total quantity = sum of item quantities
- total amount = sum of line totals

Display behavior:
- `compareAtPrice` is visual-only
- `compareAtPrice` never participates in total calculations

## Snapshot vs Authoritative Data

Cookie data is only a client-side cart snapshot.

Cookie is trusted for:
- rendering navbar summary
- rendering `/cart`
- rendering the checkout review UI before submit
- local cart UX updates

Cookie is not trusted for:
- final order item content
- final totals
- final persisted pricing

Authoritative order submission rule:
- on checkout submit, the server route must read the cookie, extract `bookId`s, re-fetch current published books from Payload/Mongo, and rebuild final order items from DB-backed fields
- persisted order item fields must come from current DB data, at minimum:
  - `bookTitle`
  - `bookSlug`
  - `coverImageUrl`
  - `coverImageAlt`
  - `unitPrice`
  - `compareAtPrice` if present
  - `quantity`
  - `lineTotal`

If a cart item no longer resolves to a valid current published book with numeric `price`, submission must fail and require the user to review the cart.
