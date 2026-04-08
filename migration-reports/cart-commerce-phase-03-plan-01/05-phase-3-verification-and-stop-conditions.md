## Completion Criteria

Phase 3 is complete only if all of the following are true.

### `/books` Interaction Behavior

- `/books` still loads from the existing server route.
- Desktop/fine-pointer cards show blur and overlay on hover.
- Keyboard focus reveals the same actions through `:focus-within`.
- Touch/coarse-pointer devices expose the actions without hover.
- The existing grid/card layout remains visually stable.

### Cart Action Behavior

- `Thêm vào giỏ hàng` updates the Phase 2 provider state.
- Navbar summary updates immediately after add-to-cart.
- Existing cart contents are preserved.
- Null-priced books never write to cart.
- Null-priced books never navigate.

### `Mua ngay` Verification Clarification

Phase 3 verification for `Mua ngay` should require only:
- the selected book is normalized correctly into the cart item shape
- the provider action runs first
- cart state/navbar summary update is triggered from that action
- navigation intent toward `/purchase` is triggered only after the provider action
- duplicate-click/race guards prevent repeated adds or repeated navigation attempts

Phase 3 verification should **not** require:
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

## Stop Conditions

Stop Phase 3 and do not move to Phase 4 if:
- implementing the books UI requires a broad client rewrite of the route
- the `/books` layout/grid/card rhythm becomes unstable
- touch devices cannot reach the actions without hover
- keyboard users cannot reveal or operate the actions
- navbar summary does not update immediately after provider-driven add actions
- `Mua ngay` can navigate before cart state is updated
- repeated clicks can duplicate cart writes or navigation attempts
- null-priced books can trigger cart writes or navigation
- Phase 3 verification is being expanded into requiring completed `/purchase` behavior

Keep the release guardrail:
- do not treat Phase 3 as production-release-ready until `/purchase` exists and the later checkout phase is complete
