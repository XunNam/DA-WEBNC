## Phase 1: Planning Pack

Goal:
- finalize scope, architecture, cookie model, checkout flow, and order collection plan

Files:
- planning docs only under `migration-reports/cart-commerce-plan-01/`

Stop condition:
- no application code changes

Verification target:
- planning pack is decision-complete for later implementation

## Phase 2: Cart Foundation + Navbar Summary

Goal:
- introduce the smallest shared cart foundation and make the navbar summary always visible

Likely touched files/components:
- `src/lib/cart/cartTypes.ts`
- `src/lib/cart/cartCookie.ts`
- `src/lib/cart/cartMath.ts`
- `src/components/cart/CartProvider.tsx`
- `src/components/cart/CartSummary.tsx`
- `src/app/(frontend)/layout.tsx`
- `src/components/site-shell/Navbar.tsx`
- `src/components/site-shell/Navbar.module.css`

Verification targets:
- sanitized cart parse/serialize works
- malformed cookie becomes empty cart
- navbar shows icon, total quantity, total amount
- navbar summary stays visually stable alongside logo/nav links
- `pnpm exec tsc --noEmit` after route types are generated

Stop conditions:
- if navbar placement destabilizes existing shell layout, stop and tighten the navbar integration before moving on
- do not start `/books` interaction work yet

## Phase 3: `/books` Commerce Actions

Goal:
- add blur + action behavior only to `/books`

Likely touched files/components:
- `src/app/(frontend)/books/page.tsx`
- `src/app/(frontend)/books/BooksPageClient.tsx`
- `src/app/(frontend)/books/page.module.css`

Verification targets:
- hover/focus actions appear on desktop
- actions stay accessible on touch/coarse-pointer devices
- `Thêm vào giỏ hàng` updates navbar summary
- `Mua ngay` adds to cart and routes to `/purchase`
- null-priced books cannot be added or purchased
- existing `/books` card design remains intact

Stop conditions:
- if touch-device accessibility cannot be achieved with the initial hover-only approach, revise the client card action presentation before continuing

## Phase 4: `/cart` Page

Goal:
- add the editable cart review page

Likely touched files/components:
- `src/app/(frontend)/cart/page.tsx`
- `src/app/(frontend)/cart/CartPageClient.tsx`
- `src/app/(frontend)/cart/page.module.css`

Verification targets:
- cart items render from cookie/provider
- increase/decrease/remove update cookie and totals
- navbar summary stays synchronized
- compare-at price is display-only
- empty/malformed cart route is safe and usable

Stop conditions:
- if cart synchronization between page and navbar is not stable, do not proceed to checkout work yet

## Phase 5: `/purchase` + Orders

Goal:
- add checkout form, collapsible summary, order creation route, and admin-visible order persistence

Likely touched files/components:
- `src/app/(frontend)/purchase/page.tsx`
- `src/app/(frontend)/purchase/PurchasePageClient.tsx`
- `src/app/(frontend)/purchase/page.module.css`
- `src/app/api/orders/route.ts`
- `src/collections/Orders.ts`
- `src/payload.config.ts`
- `src/payload-types.ts` via `pnpm generate:types`

Verification targets:
- required fields validate
- collapsible summary is present and lightweight
- authoritative book re-fetch happens on submit
- order created in MongoDB through Payload
- order appears in Payload admin list/detail
- order deletion works in admin
- success popup shows the exact required message
- cart clears after successful submit

Stop conditions:
- if authoritative DB rebuild cannot guarantee valid published book data, do not fall back to trusting the cookie
- if order creation works but cart clear does not, fix state cleanup before considering Phase 5 complete
