## Cart Commerce Phase 04 Plan 01

This planning pack covers only Phase 4 of the approved commerce roadmap:
- new `/cart` route
- cart item rendering from the approved Phase 2 provider/cookie model
- quantity increase/decrease
- item removal
- total quantity and total amount display
- checkout CTA toward `/purchase`
- safe empty/malformed cart handling

Phase 4 does not include:
- `/purchase` implementation
- checkout submit/API work
- `orders` collection
- commerce UI on any route other than `/cart`

Implementation vs release clarification:
- Phase 4 may implement the checkout CTA/navigation intent toward `/purchase` at code level.
- Phase 4 completion does not require `/purchase` to already be production-ready.
- Full checkout behavior remains a later-phase dependency.
- Production release of the `/cart` checkout CTA remains blocked until `/purchase` exists and the later checkout phase is complete.

Exact next recommended action:
- implement **Phase 4 only** after the approved Phase 2 cart foundation and Phase 3 `/books` commerce work are in place
