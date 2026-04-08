# Risks Blockers And Open Questions

## Highest-Risk Implementation Areas

- `catalogVisible` must stay a listing-only flag. If the new slug helper reuses the listing helper or copies its filter, Hero-only books will fail to resolve.
- `/books` overlay logic is currently gated by `data-purchasable='true'`. That must change because `Đọc thêm` should remain available even when `price === null`.
- homepage Hero and Best Seller are server-rendered today. Adding cart behavior there requires narrow client islands; converting the entire homepage to client would be unnecessary risk.
- `typeLabel` currently generates a literal-union TS type. Changing it to `text` will widen generated types and needs a full type-regeneration pass before any later implementation phase proceeds.
- empty Lexical documents must normalize to `null`; otherwise the detail page may render an empty rich-text shell instead of the required fallback message.

## Repo-Specific Watchpoints

- the current automated tests are placeholder-level and do not cover this feature path, so manual verification gates are required in every implementation phase
- Hero still stores `buyLinkUrl` and `sampleLinkUrl`; this feature should leave those fields in place even though the public Hero CTAs will stop using them
- `/books` currently contains its own local add/buy handlers; shared reuse should centralize behavior only, not force a shared card layout
- the worktree is not a clean tracked baseline, so implementation must be careful to touch only the intended files

## Resolved Planning Decisions

- no new taxonomy collection is needed for this feature
- `typeLabel` should stay on `books` as a single display field
- the smallest safe admin-editability fix is `select` -> `text`
- the detail page should be accessible for published books even when they are hidden from `/books`
- the detail page stays mostly server-rendered with a single client island for the final action row

## Prompt Inconsistency To Handle Deliberately

The prompt lists Best Seller actions in a different order than the explicit `/books` order, but it also requires Best Seller behavior to stay consistent with `/books`.

Implementation resolution:
- standardize both `/books` and Best Seller to the same order:
  - `Đọc thêm`
  - `Thêm vào giỏ hàng`
  - `Mua ngay`

## True Blockers Found

None.

The repo already has:
- a published-only public-read pattern
- a slug-based public detail pattern for authors
- existing rich-text rendering on public routes
- an existing cart provider and buy-now flow to reuse

## Open Questions Only If A Blocker Appears During Implementation

- if product later insists on browser-history back behavior instead of a stable `/books` link, that can be changed with a tiny client control, but it is not required for this rollout
- if the team later wants controlled genre taxonomy with validation, that should be handled as a separate feature after this detail-page rollout
