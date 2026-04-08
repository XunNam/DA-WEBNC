## Success Modal Behavior

Use a local success modal inside `PurchasePageClient.tsx`, not a new global notification system.

Modal contents:
- exact message:
  - `Chúng tôi sẽ sớm liên hệ với bạn để xác nhận thông tin`
- show the created `orderCode`
- include one CTA back to `/books`

## Cookie Clear Behavior

On successful order creation:
- API response clears the cart cookie via `Set-Cookie`
- cookie should be expired, not replaced with a stale empty payload

## Provider Clear Behavior

After a successful API response:
- client calls `clearCart()` from the Phase 2 provider
- provider state becomes empty immediately so navbar summary and local UI reset together

## Stay-On-Page Vs Redirect Decision

Lock the Phase 5 success UX to:
- stay on `/purchase`
- replace the checkout form with the success modal/overlay state

Rationale:
- simplest safe cleanup flow
- avoids redirect races while clearing local state
- keeps the success message and order code visible
- does not require inventing a new order-confirmation route

## Post-Success Page State

Once success is shown:
- cart summary area should reflect cleared cart state
- form should no longer be submittable
- if the modal is dismissed, the page may fall back to the empty-cart state with the CTA back to `/books`
