## Completion Criteria

Phase 4 is complete only if all of the following are true.

### `/cart` Route Behavior

- `/cart` loads successfully through the new route.
- The route remains a narrow server wrapper around a client cart UI.
- The page stays visually stable on desktop and mobile.

### Item Rendering And Controls

- Valid cart items render with image, title, `compareAtPrice`, `price`, quantity, and line total.
- Increment updates provider state immediately.
- Decrement updates provider state immediately.
- Decrement at quantity `1` removes the item instead of leaving an invalid quantity.
- Remove deletes the item immediately.
- Navbar summary stays synchronized with all cart mutations.

### Totals And Empty State

- Total quantity and total amount update immediately after every change.
- Totals use only `price`.
- Empty or malformed cart renders the empty state cleanly.
- Empty state shows a CTA back to `/books`.
- Checkout CTA is not shown when the cart is empty.

### Checkout CTA Verification Clarification

Phase 4 verification for the checkout CTA should require only:
- the CTA is present when the cart contains at least one valid item
- the CTA points or navigates toward `/purchase`
- the CTA disappears when the cart becomes empty
- cart review/edit behavior remains stable before navigation

Phase 4 verification should **not** require:
- a completed `/purchase` UI
- completed checkout form behavior
- completed purchase summary behavior
- end-to-end order creation

## Verification Checks

- Regenerate route types first if needed.
- `pnpm exec tsc --noEmit` passes.
- Smoke routes still load:
  - `/`
  - `/books`
  - `/authors`
  - `/info`
  - `/cart`

## Stop Conditions

Stop Phase 4 and do not move to Phase 5 if:
- `/cart` requires a broad client rewrite outside the route itself
- cart item controls can desynchronize the navbar summary and the cart page totals
- decrement at quantity `1` leaves an invalid quantity instead of removing the item
- empty cart still shows stale totals or checkout CTA
- malformed cart state can break route rendering
- checkout CTA behavior is being expanded into requiring completed `/purchase` behavior
- the phase is being treated as production-release-ready before `/purchase` exists

Keep the release guardrail:
- do not treat Phase 4 as production-release-ready until `/purchase` exists and the later checkout phase is complete
