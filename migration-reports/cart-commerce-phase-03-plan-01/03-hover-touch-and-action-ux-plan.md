## Desktop / Fine-Pointer Behavior

- Use a hover-capable media query such as `@media (hover: hover) and (pointer: fine)`.
- Keep the existing card structure intact.
- Place commerce UI inside the existing `imageWrap`.
- On hover and `:focus-within` for purchasable books:
  - blur the cover image
  - preserve the existing lift/shadow language
  - reveal a centered overlay with two stacked buttons:
    - `Thêm vào giỏ hàng`
    - `Mua ngay`

## Keyboard Accessibility

- The overlay must also appear on `:focus-within`, not hover only.
- Actions must be real `<button>` elements.
- Users must be able to tab to both actions without relying on pointer hover.
- Focus styles must remain clearly visible against the overlay.

## Touch / Coarse-Pointer-Safe Behavior

- Do not rely on hover-only discovery.
- On coarse-pointer or no-hover devices, render the same two actions as a compact action row in normal card flow below the price row.
- Keep the rest of the card unchanged.
- Avoid introducing a tap-to-reveal interaction model.

## Disabled-State Treatment For `price === null`

- Keep both actions visible so card structure stays consistent.
- Render them as disabled buttons.
- Use muted styling only:
  - reduced contrast
  - no active hover affordance
  - no click behavior
- Do not add banners, extra messaging, fake links, or placeholder CTAs.
- Do not present misleading purchasable affordances.

## Design-Preservation Guardrails

- Preserve the current books grid rhythm.
- Preserve current image sizing and title/price typography.
- Keep the commerce UI as a layered extension of the existing card, not a redesign.
