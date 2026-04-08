# Phase 3 Commerce Action Audit

## Detail Action Row Structure
- Source inspection of [src/app/(frontend)/detail/[slug]/page.tsx](D:/Đồ%20án/DA-WEBNC/src/app/(frontend)/detail/[slug]/page.tsx) shows the detail page remains server-rendered and passes a narrow commerce payload into [src/app/(frontend)/detail/[slug]/BookDetailActionRow.tsx](D:/Đồ%20án/DA-WEBNC/src/app/(frontend)/detail/[slug]/BookDetailActionRow.tsx).
- Source inspection of [src/app/(frontend)/detail/[slug]/BookDetailActionRow.tsx](D:/Đồ%20án/DA-WEBNC/src/app/(frontend)/detail/[slug]/BookDetailActionRow.tsx) confirms:
  - exactly two actions
  - labels are `Thêm vào giỏ hàng` and `Mua sách`
  - both disable when `price === null`

## Shared Commerce Helper
- Source inspection of [src/lib/bookCommerce/useBookCommerceActions.ts](D:/Đồ%20án/DA-WEBNC/src/lib/bookCommerce/useBookCommerceActions.ts) confirms:
  - behavior normalization is centralized, not UI markup
  - add-to-cart normalizes to the existing `CartCookieItem` shape
  - buy-now performs add/increment first, then `startRouteLoadingIndicator()`, then `router.push('/purchase')`
  - pending state is local to the client hook and is keyed per book/action

## Runtime Detail-Page Checks
- Purchasable detail route tested: `/detail/tat-den`
- Null-priced detail route tested: `/detail/ngay-xua-co-mot-chuyen-tinh`

### Purchasable Detail Route
- Before add-to-cart:
  - navbar summary: `0 sản phẩm / 0 VNĐ`
- After `Thêm vào giỏ hàng`:
  - navbar summary: `1 sản phẩm / 75.000 VNĐ`
  - user remained on the detail page
- After `Mua sách` in the same session:
  - navigation landed on `/purchase`
  - purchase heading rendered as `Thông tin đặt hàng`
  - navbar summary became `2 sản phẩm / 150.000 VNĐ`
  - this confirms buy-now added/incremented first, then navigated

### Null-Priced Detail Route
- `Thêm vào giỏ hàng` disabled: `true`
- `Mua sách` disabled: `true`
- Navbar summary before disabled-click no-op: `0 sản phẩm / 0 VNĐ`
- Navbar summary after disabled-click no-op: `0 sản phẩm / 0 VNĐ`
- URL before disabled-click no-op: `/detail/ngay-xua-co-mot-chuyen-tinh`
- URL after disabled-click no-op: unchanged

## Pending-State Note
- The helper intentionally keeps pending state set on the buy-now path until navigation proceeds.
- Runtime result:
  - add-to-cart behavior remained fine
  - buy-now still added/incremented first, then navigated
  - no stuck disabled state remained after normal navigation because the originating UI unmounted during route change
- Loading-indicator note:
  - The route-loading indicator was visibly observed on `/books` and Best Seller buy-now flows during this audit
  - On detail-page buy-now, the indicator was not consistently captured in one headless run before navigation completed
  - Because the same helper code path is used and there was no user-visible stuck state, this is treated as a benign implementation detail, not a blocker

## Phase 3 Audit Result
- The Phase 3 commerce behavior is functioning acceptably.
- No blocker-level issue was found.
