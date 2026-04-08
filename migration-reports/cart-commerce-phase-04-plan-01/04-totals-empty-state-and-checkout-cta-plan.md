## Totals Behavior

- Show total quantity.
- Show total amount.
- Totals must derive only from `price`.
- `compareAtPrice` is display-only and must never affect totals.
- Render totals in a dedicated summary card separate from the item list.

## Empty / Malformed Cart Behavior

If the cart is empty, unreadable, or sanitizes down to zero valid items:
- render a clean empty-state card instead of the cart list
- do not crash the route
- do not render stale totals
- do not render the checkout CTA
- render a single CTA back to `/books`

Locked empty-state CTA default:
- use a conservative continue-shopping link such as `Tiếp tục xem sách`

## Checkout CTA Behavior

For non-empty cart only:
- render a primary checkout CTA in the summary card
- wire it toward `/purchase`
- use a simple navigation control, preferably a normal `Link`, because Phase 4 does not need to mutate state before navigation

## Implementation-Vs-Release Clarification For CTA Wiring

Preserve this distinction explicitly:
- Phase 4 is allowed to implement the checkout CTA/navigation intent toward `/purchase`.
- Phase 4 completion means the `/cart` route, rendering, quantity controls, totals, and CTA wiring are implemented correctly.
- Phase 4 verification must not require `/purchase` to already be a completed, production-ready checkout route.
- Production release of the checkout CTA remains blocked until `/purchase` exists and the later checkout phase is complete.

## Design-Preservation Guardrails

- Keep the page aligned with the site’s current design language.
- Reuse current typography families and restrained spacing.
- Preserve rounded corners and subtle shadow/border treatment.
- Do not introduce a new commerce-specific design system.
