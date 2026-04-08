## Structural Placement

Locked placement strategy:
- keep the brand/logo as the left anchor
- add a right-side wrapper inside the navbar for:
  - existing nav links
  - cart summary

Recommended structure:
- `brand`
- `actions`
  - `nav`
  - `cart summary`

This keeps the existing shell recognizable and avoids introducing a new header layout concept.

## Desktop Behavior

Locked requirements:
- nav and cart summary stay in the same right-side cluster
- cart summary is always visible
- cart summary remains compact

Visible contents:
- inline SVG cart icon
- quantity indicator
- formatted total amount

Empty-cart behavior:
- still render the summary
- show visible zero state
  - quantity: `0`
  - amount: `0 VNĐ`

## Mobile / Responsive Guardrails

Locked responsive behavior:
- preserve the current stacked navbar breakpoint behavior
- on smaller widths, the right-side `actions` block may stack under the brand
- cart summary must remain visible and clickable
- cart summary must not overlap the logo
- cart summary must not cause nav links to collapse into an unusable layout

## Visual Guardrail

Do not redesign the navbar.

The cart summary must feel like a careful extension of the current shell:
- same typography language
- same restrained spacing language
- no oversized icon treatment
- no hidden/collapsible summary

Exact microcopy can be finalized conservatively during coding, but the visible information is locked:
- cart icon
- total quantity
- total amount

## Likely Touched Existing Files

- `src/components/site-shell/Navbar.tsx`
- `src/components/site-shell/Navbar.module.css`
- `src/app/(frontend)/layout.tsx`

## New Client Island

Locked choice:
- use `src/components/cart/CartSummary.tsx` as the navbar client island
- do not make the whole navbar client-rendered if a smaller child boundary is sufficient
