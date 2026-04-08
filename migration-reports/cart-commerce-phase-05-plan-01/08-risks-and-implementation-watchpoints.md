## Repo-Specific Watchpoints

- there is no existing form library in the repo, so Phase 5 should use a small local controlled-form approach instead of introducing a large new dependency
- there is no existing custom frontend API pattern besides a sample route, so `src/app/api/orders/route.ts` should stay minimal and explicit
- the approved cart model only carries snapshot UI fields; persisted order truth must come from the authoritative book rebuild, not the cookie
- `Books.price` is optional, so missing or invalid numeric price must hard-fail checkout
- `Media.alt` is required in the collection, but the API should still defensively handle cover media that no longer resolves to usable URL/alt data
- route type generation still depends on `.next/types`

## Locked Implementation Watchpoints

- no payment gateway logic
- no auth/account flows
- no order-status workflow
- no order-confirmation route
- no global toast system
- no changes to earlier-phase provider contracts unless implementation proves them insufficient

## Conservative Details That May Be Finalized During Coding

These may be resolved conservatively without changing scope:
- exact summary-toggle label text
- exact modal layout and close behavior
- exact inline field error copy
- exact failure-message wording, as long as the user is clearly told to review the cart when authoritative validation fails
