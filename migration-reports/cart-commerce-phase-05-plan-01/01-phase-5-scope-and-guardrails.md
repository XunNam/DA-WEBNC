## Phase 5 Includes

In scope:
- new `/purchase` route
- checkout review UI from the approved cart provider
- simple expand/collapse order summary
- required checkout form fields:
  - full name
  - email
  - phone number
  - shipping address
- COD-only note near submit
- custom order-submit API route
- authoritative server-side order rebuild from current published books
- new Payload `orders` collection
- random order code generation with minimal uniqueness guard
- success modal and post-submit cart cleanup

## Phase 5 Explicitly Excludes

Out of scope:
- payment gateway integration
- authentication/account checkout
- account order history
- coupon/shipping/inventory systems
- global notification system
- redesign of the site
- changes to earlier-phase cart foundations beyond consuming their public API

## Protected Baseline

Do not destabilize:
- approved Phase 2 provider/cookie/navbar behavior
- approved Phase 3 `/books` commerce behavior
- approved Phase 4 `/cart` behavior
- existing public routes and shell integration
- Payload admin
- current Atlas/R2/media behavior

## Locked Checkout / Order Decisions

- guest checkout only
- cart is cookie-backed for client UX only
- cart is not persisted before successful submit
- totals use only `price`
- `compareAtPrice` is display-only
- COD only
- `/purchase` summary must be collapsible in v1
- cookie is non-authoritative for persisted order content
- on submit, the server re-fetches current published books by `bookId`
- persisted order items must be rebuilt from DB-backed values
- order code format is `#` + 5 uppercase letters/numbers
- minimal uniqueness guard is sufficient

## Final Delivery Guardrails

- keep the purchase UI local and self-contained
- prefer one local success modal over a new global notification system
- preserve the current site design language
