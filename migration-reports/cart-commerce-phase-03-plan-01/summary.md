## Cart Commerce Phase 03 Plan 01

This planning pack covers only Phase 3 of the approved commerce roadmap:
- `/books` hover/focus commerce UI
- `Thêm vào giỏ hàng`
- `Mua ngay`
- Phase 2 cart-provider integration
- disabled handling for `price === null`

Phase 3 does not include:
- `/cart`
- `/purchase` implementation
- checkout API
- `orders` collection
- commerce UI on any route other than `/books`

Implementation vs release clarification:
- Phase 3 may implement `Mua ngay -> add to cart -> navigate to /purchase` at code level.
- Phase 3 completion does not require `/purchase` to already be production-ready.
- Full end-to-end purchase behavior remains a later-phase dependency.
- Production release of `Mua ngay` remains blocked until `/purchase` exists and the later checkout phase is complete.

Exact next recommended action:
- implement **Phase 3 only** after the approved Phase 2 cart foundation is in place
