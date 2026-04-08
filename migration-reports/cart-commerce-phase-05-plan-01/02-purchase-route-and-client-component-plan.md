## New Files To Add

- `src/app/(frontend)/purchase/page.tsx`
- `src/app/(frontend)/purchase/PurchasePageClient.tsx`
- `src/app/(frontend)/purchase/page.module.css`

## Existing Files Touched

- `src/payload.config.ts`
- `src/payload-types.ts` after type generation
- no earlier-phase route files should need behavior changes if the approved pack assumptions hold

## Locked Route / Component Structure

- keep `page.tsx` as a server wrapper
- do not add a new server data helper for checkout state
- rely on the existing Phase 2 provider hydration for cart state
- render the interactive checkout UI inside `PurchasePageClient.tsx`
- do not add more client components unless blocked

## Locked Server / Client Boundary

- `page.tsx` remains server-rendered
- `PurchasePageClient.tsx` is the main client boundary for:
  - summary toggle
  - form state
  - submit flow
  - success modal state
- do not convert the frontend shell or shared layout into client components

## File Responsibility Split

- `page.tsx`: route shell, heading, page wrapper
- `PurchasePageClient.tsx`: `useCart()` consumption, collapsible summary, form, submit handler, error state, success modal, provider cleanup
- `page.module.css`: purchase layout, summary card, form layout, modal styling, responsive behavior

## Layout Choice To Lock

- use a two-column desktop layout:
  - left: checkout form
  - right: order summary card
- stack to one column on narrower widths
- summary card is not sticky in v1
