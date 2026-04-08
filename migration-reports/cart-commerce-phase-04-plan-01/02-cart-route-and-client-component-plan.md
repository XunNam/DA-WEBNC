## New Files To Add

- `src/app/(frontend)/cart/page.tsx`
- `src/app/(frontend)/cart/CartPageClient.tsx`
- `src/app/(frontend)/cart/page.module.css`

## Existing Files Touched

- none required outside the new `/cart` route, assuming Phase 2 is already in place

## Locked Route / Component Structure

- Keep `page.tsx` as a server wrapper.
- Do not fetch cart state in the route with a new server data helper.
- Rely on the existing frontend layout/provider hydration from Phase 2.
- Render the interactive cart UI inside `CartPageClient.tsx`.
- Do not introduce more client components unless implementation hits a real blocker.

## Locked Server / Client Boundary

- `page.tsx` remains server-rendered and provides the route shell.
- `CartPageClient.tsx` is the only new client boundary for the cart page.
- No broad client conversion of the route tree or shell.

## File Responsibility Split

- `page.tsx`: route shell, page heading, page-level wrapper
- `CartPageClient.tsx`: `useCart()` consumption, item list, quantity/remove handlers, totals display, empty state, checkout CTA wiring
- `page.module.css`: cart list, item rows/cards, controls, summary card, empty state, responsive layout

## Layout Choice To Lock

- Use a two-column desktop layout:
  - left: cart items list
  - right: totals/checkout summary card
- Stack to a single column on narrower widths.
- Do not add sticky behavior in Phase 4.
