## `/books` Interaction Plan

Affected existing surface:
- [`D:\Đồ án\DA-WEBNC\src\app\(frontend)\books\page.tsx`](D:/Đồ án/DA-WEBNC/src/app/(frontend)/books/page.tsx)
- [`D:\Đồ án\DA-WEBNC\src\app\(frontend)\books\page.module.css`](D:/Đồ án/DA-WEBNC/src/app/(frontend)/books/page.module.css)

Recommended implementation shape:
- keep the route as the server data-entry surface
- move the interactive card rendering into a small client component:
  - `src/app/(frontend)/books/BooksPageClient.tsx`

Behavior on desktop/fine pointer:
- when hovering a book card/image
  - blur the book image
  - reveal two action buttons:
    - `Thêm vào giỏ hàng`
    - `Mua ngay`

Behavior on mobile/coarse pointer:
- do not rely on hover-only discovery
- render the same actions in a touch-accessible way within the card

Button behavior:
- `Thêm vào giỏ hàng`
  - add the selected book to the cookie-backed cart
  - keep the user on `/books`
- `Mua ngay`
  - add the selected book to the cookie-backed cart
  - preserve existing cart items
  - immediately navigate to `/purchase`

Null-price rule:
- books with `price === null` are non-purchasable
- both commerce actions must be disabled for those cards
- disabled state must be visually clear but not redesign the card

## Navbar Cart Summary Plan

Affected existing surface:
- [`D:\Đồ án\DA-WEBNC\src\components\site-shell\Navbar.tsx`](D:/Đồ án/DA-WEBNC/src/components/site-shell/Navbar.tsx)
- [`D:\Đồ án\DA-WEBNC\src\components\site-shell\Navbar.module.css`](D:/Đồ án/DA-WEBNC/src/components/site-shell/Navbar.module.css)
- [`D:\Đồ án\DA-WEBNC\src\app\(frontend)\layout.tsx`](D:/Đồ án/DA-WEBNC/src/app/(frontend)/layout.tsx)

Required summary contents:
- cart icon
- total quantity
- total amount

Visibility rule:
- cart summary remains always visible on frontend pages
- it is not collapsible

Placement/layout guardrail:
- integrate the summary carefully so the current logo and nav links remain visually stable
- preferred placement is as a right-side companion element within the existing navbar inner row
- mobile layout must still stack/flow cleanly with the current responsive navbar structure

Recommended implementation shape:
- keep `Navbar` as the shell component
- add a small client island for the cart summary:
  - `src/components/cart/CartSummary.tsx`
- mount a shared cart provider in frontend layout so navbar state stays synchronized across routes

## Likely Phase 2/3 Files

Cart foundation:
- `src/lib/cart/cartTypes.ts`
- `src/lib/cart/cartCookie.ts`
- `src/lib/cart/cartMath.ts`
- `src/components/cart/CartProvider.tsx`
- `src/components/cart/CartSummary.tsx`
- `src/app/(frontend)/layout.tsx`

Books interaction:
- `src/app/(frontend)/books/page.tsx`
- `src/app/(frontend)/books/BooksPageClient.tsx`
- `src/app/(frontend)/books/page.module.css`
- optionally one very small local cart action helper component if needed, but avoid a broad new component system
