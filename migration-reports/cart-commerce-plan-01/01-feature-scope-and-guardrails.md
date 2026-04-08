## Feature Scope

Planned feature set:
- `/books` hover/focus commerce actions
  - `Thêm vào giỏ hàng`
  - `Mua ngay`
- always-visible navbar cart summary
  - cart icon
  - total quantity
  - total amount
- new `/cart` route
- new `/purchase` route
- new `orders` Payload collection
- one custom order-submit API route

## Protected Baseline

The implementation must not break:
- `/`
- `/books`
- `/authors`
- `/authors/[slug]`
- `/info`
- Payload admin
- navbar/footer shell integration
- published-only public read policy
- runtime redirects
- Atlas connection
- R2 upload integration
- Media admin workflow
- current content model outside the new commerce feature

## Confirmed Locked Decisions

Guest/cart model:
- guest checkout only
- no user login requirement
- cart is stored only in browser cookies
- no MongoDB cart persistence before checkout submit
- losing the cart after cookie clear is acceptable

Pricing:
- all totals are based strictly on `price`
- `compareAtPrice` is display-only reference pricing
- `/cart` still displays `compareAtPrice` with struck-through styling when present

Buy-now behavior:
- `Mua ngay` adds the selected book into the current cart
- then redirects immediately to `/purchase`
- existing cart contents remain in the cart

Navbar behavior:
- cart summary must remain always visible
- it must show cart icon, total quantity, and total amount
- visual placement must be integrated carefully so the current logo/nav layout remains stable

Purchase behavior:
- `/purchase` must include a lightweight expand/collapse order summary in v1
- summary may be open by default
- it must support collapse/expand
- do not turn this into a complex accordion system

Order persistence:
- the cookie is non-authoritative for persisted order content
- on submit, the server route must re-fetch current published books from Payload/Mongo by `bookId`
- authoritative order items and totals must be rebuilt from DB-backed values

Order code:
- format is fixed: `#` + 5 uppercase letters/numbers
- a minimal uniqueness guard is sufficient

Payment:
- COD only
- no payment gateway integration

## Out Of Scope

Do not add in this feature:
- user authentication
- saved carts or account-based cart recovery
- payment gateway integration
- inventory management
- coupon/discount logic
- shipping-fee calculation
- order-status workflow beyond a minimal admin-readable order record
- broad redesign of the public site
