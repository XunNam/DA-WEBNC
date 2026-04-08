## Phase 2 Completion Criteria

Phase 2 is complete only if all of the following are true:

### Cart utility behavior
- cart parse / serialize / sanitize works correctly
- malformed cookie degrades to empty cart
- duplicate item merge works
- invalid item entries are dropped
- quantity clamp works

### Navbar summary behavior
- navbar summary is always visible on frontend routes
- navbar summary shows icon, total quantity, and total amount
- summary renders correctly on first page load from cookie-backed initial state
- summary updates immediately after provider-driven cart changes

### Shell stability
- frontend shell remains visually stable on desktop
- frontend shell remains visually stable on mobile
- logo and nav links remain readable and usable

### Verification commands / checks
- `pnpm exec tsc --noEmit` passes after route types are regenerated
- smoke routes still load:
  - `/`
  - `/books`
  - `/authors`
  - `/info`

## Stop Conditions

Stop Phase 2 and do not move to Phase 3 if:
- `CartProvider` forces the whole frontend shell to become client-rendered
- navbar logo/nav layout becomes unstable
- cart summary is missing on first render and only appears after hydration
- malformed cookie handling can throw into layout render
- provider actions and cookie writes are not deterministic
- navbar summary updates lag behind provider state changes

## Verification Guardrail

Because this repo depends on `.next/types`, Phase 2 verification must account for route type regeneration before relying on `pnpm exec tsc --noEmit`.

Acceptable verification order:
- start `next dev` or regenerate route types first
- then run `pnpm exec tsc --noEmit`

Do not let the known `.next/types` quirk create unnecessary Phase 2 scope changes.
