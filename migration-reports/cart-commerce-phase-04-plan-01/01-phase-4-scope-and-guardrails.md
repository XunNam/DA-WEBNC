## Phase 4 Includes

In scope:
- new `/cart` route
- cart item rendering from the approved Phase 2 provider/cookie model
- quantity increase/decrease
- item removal
- total quantity and total amount display
- checkout CTA toward `/purchase`
- safe empty/malformed cart handling

## Phase 4 Explicitly Excludes

Out of scope:
- `/purchase` implementation
- checkout submit/API work
- `orders` collection
- changes to the approved Phase 2 cart foundation beyond consuming its public API
- new commerce UI on any other route
- site redesign

## Protected Baseline

Do not destabilize:
- approved Phase 2 provider and cookie behavior
- navbar summary synchronization
- `/books`, `/authors`, `/info`, and homepage behavior
- current frontend shell/layout structure
- current site typography, rounded-card language, and restrained shadows

## Locked Commerce Decisions

- guest checkout only
- cart is cookie-backed for client UX only
- totals use only `price`
- `compareAtPrice` is display-only
- cart state is not persisted to MongoDB before checkout submit
- `/cart` is the dedicated cart review/edit page
- checkout CTA from `/cart` goes to `/purchase`
- `/purchase` is still a later-phase dependency

## Release Guardrail

- Phase 4 may implement the `/purchase` navigation code path from `/cart`.
- Phase 4 is not production-release-ready until `/purchase` exists and the later checkout phase is complete.
