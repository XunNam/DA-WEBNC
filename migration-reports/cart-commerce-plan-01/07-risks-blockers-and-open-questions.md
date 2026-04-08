## Implementation Risks

### 1. No existing client-state layer
Current public routes and shell are server-rendered. There is no existing client cart/state utility in `src`.

Guardrail:
- keep the new client state isolated to a small cart provider and route-level client islands
- do not convert the whole frontend to client components

### 2. Cookie size pressure
Cart state lives in a cookie, so item snapshots must stay compact.

Guardrail:
- store only the locked minimal fields
- do not add author names, dimensions, or other extra snapshot data

### 3. Cookie cannot be trusted for persistence
Client cookie contents are user-controlled and may be stale or manipulated.

Guardrail:
- never trust cookie pricing or titles for final order persistence
- rebuild authoritative order items from current published DB-backed book data on submit

### 4. `Books.price` is optional
The schema allows `price` to be `null`.

Guardrail:
- treat null-priced books as non-purchasable in `/books`
- reject such items again on server-side order submit if they somehow remain in the cookie

### 5. Navbar layout stability
The navbar currently has only brand + nav links. Adding an always-visible cart summary can easily destabilize spacing, especially on smaller widths.

Guardrail:
- keep the summary small
- preserve existing layout hierarchy
- explicitly verify desktop and mobile shell behavior before moving to later phases

### 6. Existing repo verification quirk
`tsconfig.json` includes `.next/types/**/*.ts`, so `pnpm exec tsc --noEmit` can fail before route types are regenerated.

Guardrail:
- run typecheck after `next dev` or after a successful build/type generation step has recreated `.next/types`

### 7. Existing unrelated build blocker
Recent repo verification surfaced an unrelated `/api/graphql-playground` prerender/build issue.

Guardrail:
- treat that as a separate repo problem unless commerce phases directly touch it
- do not let it force commerce scope creep

## Repo-Specific Blockers To Watch

- no reusable cart icon asset currently exists in `public/`
  - safest choice is inline SVG in navbar/cart UI
- no existing modal/toast/success notification system exists
  - safest choice is a local success modal in `/purchase`
- no existing custom public API pattern other than a sample route
  - safest choice is one narrow `POST /api/orders` route only

## Important Guardrails

- keep public-read safety unchanged
- do not expose `orders` publicly through collection access
- do not add auth or user accounts for checkout
- do not persist cart state in MongoDB before submit
- do not trust cookie snapshots for final order records
- do not widen `/books` commerce actions onto homepage or other routes

## Remaining Open Questions

No blocking product questions remain for Phase 2-5.

Implementation watchpoints only:
- exact responsive placement of the always-visible navbar summary
- exact mobile presentation of `/books` commerce actions where hover is unavailable
- exact inline copy for summary toggle labels on `/purchase`

These are implementation details, not scope questions, and should be resolved conservatively during the later coding phases without changing the approved feature set.
