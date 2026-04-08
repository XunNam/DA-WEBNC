# Books Hero Best Seller Integration Plan

## `/books` Integration

Current state:
- `src/app/(frontend)/books/BooksPageClient.tsx` already handles add-to-cart and buy-now
- the overlay/action row currently exposes only two purchase actions
- desktop overlay is hidden entirely for `data-purchasable='false'`

Required change:
- expose three actions in both overlay and touch/action-row modes
- order:
  - `Đọc thêm`
  - `Thêm vào giỏ hàng`
  - `Mua ngay`

Important behavioral adjustment:
- overlay availability can no longer depend on `price !== null`
- `Đọc thêm` must stay reachable even when purchase is disabled
- when `price === null`, only the purchase buttons are disabled

Accessibility plan:
- keep hover overlay for fine-pointer devices
- keep `:focus-within` reveal so keyboard users can tab into the actions
- keep the coarse-pointer action row in normal card flow
- use a real `Link` for `Đọc thêm` and real `<button>` elements for purchase actions

## Homepage Hero Integration

Current state:
- homepage Hero is rendered in `src/app/(frontend)/page.tsx`
- both Hero CTAs are currently server-rendered links
- the public Hero currently depends on `buyLinkUrl` for `Mua ngay` and `sampleLinkUrl` for `Đọc thử`

Required change:
- replace `Đọc Thử` text with `Đọc thêm`
- wire it to `/detail/${hero.featuredBook.slug}`
- make `Mua ngay` behave like `/books` buy-now:
  - normalize the featured book into the existing cart item shape
  - call `addOrIncrement(item, 1)`
  - then navigate to `/purchase`
- keep `summaryOverride` rendering unchanged
- keep the current featured-book relationship field and admin dropdown untouched

Safe implementation choice:
- keep `src/app/(frontend)/page.tsx` as the server entrypoint
- move only the Hero action row into a small client component such as `src/app/(frontend)/HomepageHeroActionsClient.tsx`
- pass the existing featured-book record into that client component
- do not remove `buyLinkUrl` or `sampleLinkUrl` from the schema in this feature
- stop consuming `buyLinkUrl` and `sampleLinkUrl` on the public homepage
- reuse the shared commerce helper/hook so Hero does not keep a separate purchase path

## Homepage Best Seller Integration

Current state:
- Best Seller cards are rendered directly inside the server `src/app/(frontend)/page.tsx`
- there is no client-side commerce behavior in this section today

Required change:
- add the same three actions as `/books`
- use the same action order as `/books` for behavioral consistency:
  - `Đọc thêm`
  - `Thêm vào giỏ hàng`
  - `Mua ngay`

Implementation strategy:
- keep `page.tsx` as the server entrypoint
- move only the Best Seller grid into a new small client component such as `src/app/(frontend)/HomepageBestSellersClient.tsx`
- pass the existing `data.bestSellers` records into that client component
- keep the surrounding homepage sections server-rendered

Reuse strategy:
- reuse the shared commerce helper/hook from the detail-page phase
- do not try to reuse the entire `/books` card component or CSS module
- reuse only behavior and data normalization, not page layout

Layout-protection rule:
- preserve current section header, grid rhythm, cover ratios, and typography
- add overlay/action-row behavior as a layered enhancement rather than a new card design
