## Cart Commerce Plan 01

This planning pack defines a lightweight guest cart and COD checkout flow for the existing bookstore site without changing the current CMS/public-read architecture.

Confirmed rollout:
1. Phase 1: planning pack only
2. Phase 2: cart foundation, cookie model, navbar summary
3. Phase 3: `/books` hover actions, add-to-cart, buy-now
4. Phase 4: `/cart` page
5. Phase 5: `/purchase`, order submit API, Payload `orders` collection

Locked implementation direction:
- guest checkout only
- cart is cookie-backed for client UX only
- navbar cart summary is always visible
- `/purchase` includes a simple collapsible summary in v1
- persisted orders are rebuilt authoritatively from current DB-backed book data on submit

Exact next recommended action:
- implement **Phase 2 only**
- do not start `/books`, `/cart`, `/purchase`, or `orders` collection work until the cart foundation and navbar summary are in place
