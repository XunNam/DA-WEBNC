## Route Shape

New route:
- `src/app/(frontend)/cart/page.tsx`

Recommended implementation shape:
- keep the route as a server wrapper
- render the interactive cart UI in:
  - `src/app/(frontend)/cart/CartPageClient.tsx`
- styling in:
  - `src/app/(frontend)/cart/page.module.css`

## Data Flow

Source of UI state:
- client cart provider hydrated from the cart cookie

Rendering behavior:
- render all items currently in the sanitized cart
- for each item show:
  - book title
  - cover image
  - `price`
  - struck-through `compareAtPrice` if present
  - quantity
  - line total (`price * quantity`)

## Controls

Required controls:
- increase quantity
- decrease quantity
- remove item

Behavior:
- increase => quantity + 1, clamp to `99`
- decrease => quantity - 1
- if quantity would fall below `1`, remove the item
- remove => delete item immediately

Each update must:
- update provider state
- write sanitized cart back to cookie
- update navbar summary immediately

## Totals

Show:
- total quantity
- total amount

Rules:
- totals use only `price`
- `compareAtPrice` is display-only

## Checkout Action

Required CTA:
- button to navigate to `/purchase`

Behavior:
- CTA is enabled only when the cart contains at least one valid item

## Empty / Malformed Cart Behavior

If cookie is empty or malformed:
- treat cart as empty
- show an empty-state card/section
- do not crash the route
- include CTA back to `/books`

If sanitized cart removes all invalid entries:
- same empty-state behavior applies

## Design Guardrail

Keep the page visually aligned with the existing site:
- same typography families
- same rounded card language
- same price styling approach already used on `/books`
- no broad redesign
