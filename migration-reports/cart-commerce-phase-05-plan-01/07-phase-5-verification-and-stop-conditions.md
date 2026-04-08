## Completion Criteria

Phase 5 is complete only if all of the following are true.

### `/purchase` Route Behavior

- `/purchase` loads successfully through the new route
- route remains a narrow server wrapper around a client checkout UI
- purchase summary is collapsible and open by default
- empty cart renders a safe empty state instead of the form

### Checkout Form Behavior

- all required fields render
- client validation blocks empty or malformed submissions
- submit button disables during request
- COD note is visible near the submit area

### API And Authoritative Rebuild Behavior

- API reads customer fields from body and cart from cookie
- API rejects empty or malformed cart
- API re-fetches current published books by `bookId`
- persisted order items are rebuilt from DB-backed values
- totals are recomputed from current `price`
- invalid/unpublished/non-purchasable books fail the order safely
- successful submit creates an order in MongoDB through Payload

### Orders Admin Behavior

- new order appears in Payload admin list
- order detail view shows customer fields and item snapshot fields
- order can be deleted in Payload admin

### Success And Cleanup Behavior

- success modal shows the exact required message
- order code is shown
- cart cookie is cleared
- provider state is cleared
- navbar summary resets
- user remains on `/purchase` in the success state

## End-To-End Verification Targets

Before the commerce flow is considered complete:
- `/books` add-to-cart works
- navbar summary stays synchronized
- `/cart` renders and edits cart state correctly
- `/purchase` renders current cart, validates form, submits successfully, and clears cart
- order is persisted and visible in Payload admin

## Verification Checks

- `pnpm generate:types`
- `pnpm exec tsc --noEmit`
- route smoke checks:
  - `/`
  - `/books`
  - `/cart`
  - `/purchase`
  - `/authors`
  - `/info`
  - `/admin`
- admin smoke check for `orders` list and order detail

## Stop Conditions

Stop Phase 5 and do not call the commerce flow complete if:
- `/purchase` requires a broad client rewrite outside the route itself
- empty cart can still reach a live submit path
- API trusts cookie snapshot values as persisted order truth
- invalid/unpublished/missing-price books can still create an order
- order code uniqueness handling is unstable
- cart cookie and provider state do not clear together after success
- success UX requires a new global notification system to function
- orders do not appear correctly in Payload admin
