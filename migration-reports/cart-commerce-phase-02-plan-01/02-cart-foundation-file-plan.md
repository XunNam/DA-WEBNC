## New Files Under `src/lib/cart/`

### `cartTypes.ts`
Purpose:
- shared cart interfaces used by utilities, provider, navbar summary, and later `/cart` and `/purchase`

Locked exports:
- `CartCookie`
- `CartCookieItem`
- `CartTotals`

Locked types:

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

type CartTotals = {
  totalAmount: number
  totalQuantity: number
}
```

### `cartCookie.ts`
Purpose:
- cookie constants and pure cart parsing / sanitizing / serialization utilities

Locked exports:
- `CART_COOKIE_NAME = 'bookstore-cart'`
- `parseCartCookie(raw)`
- `sanitizeCartCookie(input)`
- `serializeCartCookie(cart)`
- `mergeDuplicateItems(items)`
- `expireCartCookieString()`

### `cartMath.ts`
Purpose:
- shared pure math / formatting helpers reusable by navbar now and `/cart` + `/purchase` later

Locked exports:
- `getLineTotal(item)`
- `getTotalQuantity(items)`
- `getTotalAmount(items)`
- `formatCartCurrency(value)`

Formatting rule:
- use the current repo style: `new Intl.NumberFormat('vi-VN')` + `VNĐ`

## New Files Under `src/components/cart/`

### `CartProvider.tsx`
Purpose:
- isolated client cart state layer

Locked public API:
- `useCart()`
- provider receives `initialCart`
- public actions:
  - `addOrIncrement(item, delta?)`
  - `setQuantity(bookId, quantity)`
  - `removeItem(bookId)`
  - `clearCart()`

### `CartSummary.tsx`
Purpose:
- client navbar island

Responsibilities:
- render inline cart icon
- render total quantity
- render total amount
- link to `/cart`

## Likely Touched Existing Files

- `src/app/(frontend)/layout.tsx`
- `src/components/site-shell/Navbar.tsx`
- `src/components/site-shell/Navbar.module.css`

## File Responsibility Split

Pure utilities:
- `cartTypes.ts`
- `cartCookie.ts`
- `cartMath.ts`

React client state:
- `CartProvider.tsx`

Display/UI:
- `CartSummary.tsx`

This separation is locked so later phases can reuse the same cart foundation instead of duplicating cookie and totals logic.
