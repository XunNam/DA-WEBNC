## Cart Commerce Phase 05 Plan 01

This planning pack covers only Phase 5 of the approved commerce roadmap:
- new `/purchase` route
- checkout review UI from the approved cart provider
- simple expand/collapse order summary
- required checkout form fields
- COD-only note near submit
- custom order-submit API route
- authoritative server-side order rebuild from current published books
- new Payload `orders` collection
- random order code generation with minimal uniqueness guard
- success modal and post-submit cart cleanup

This is the first phase that completes the end-to-end checkout/order flow.

Locked architecture:
- cart remains cookie-backed for client UX only
- final persisted order content is rebuilt authoritatively from current published books on submit
- checkout is COD-only
- `/purchase` summary is collapsible in v1

Exact next recommended action:
- implement **Phase 5 only** after the approved Phase 2, 3, and 4 work is in place
