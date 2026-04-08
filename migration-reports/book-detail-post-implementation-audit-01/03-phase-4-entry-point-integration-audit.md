# Phase 4 Entry-Point Integration Audit

## `/books`

### Runtime Coverage
- Mobile / coarse-pointer action row tested on `/books`
- Desktop hover / focus behavior tested on `/books`

### Results
- Mobile visible action order:
  1. `Đọc thêm`
  2. `Thêm vào giỏ hàng`
  3. `Mua ngay`
- `Đọc thêm` href verified as `/detail/cho-toi-xin-mot-ve-di-tuoi-tho`
- Add-to-cart:
  - navbar summary moved from `0 sản phẩm / 0 VNĐ` to `1 sản phẩm / 73.800 VNĐ`
  - user stayed on `/books`
- Buy-now:
  - navigation landed on `/purchase`
  - loading indicator was visibly observed in headless runtime
- Desktop keyboard / focus:
  - `Đọc thêm` was still visible when focus reached the card controls
- Desktop hover:
  - hover overlay exposed the same 3 actions in the same order

### Null-Priced Coverage Status
- Current live dataset has **no null-priced published book that appears on `/books`**
- The only null-priced published book is `ngay-xua-co-mot-chuyen-tinh`, and it has `catalogVisible: false`
- Therefore:
  - `/books` null-price disabled-state behavior was **not** exercised against a live card during this audit
  - this remains a coverage limitation, not a known bug

## Homepage Hero

### Runtime Coverage
- Hero was exercised on the live homepage dataset

### Results
- `Đọc Thử` text count on the public homepage: `0`
- Hero `Đọc thêm` href verified as `/detail/ngay-xua-co-mot-chuyen-tinh`
- Hero `Đọc thêm` navigated to the shared detail route successfully
- Hero `Mua ngay` state on the live featured book:
  - disabled: `true`
  - navbar summary stayed `0 sản phẩm / 0 VNĐ`
  - URL remained `/`
- Hero summary-override:
  - homepage global still contains a populated `summaryOverride`
  - the live homepage rendered text from that override successfully
- Data note:
  - `buyLinkUrl` and `sampleLinkUrl` still exist in the homepage global data
  - public Hero behavior no longer relies on them

## Homepage Best Seller

### Runtime Coverage
- Mobile / touch-safe action row tested on the homepage Best Seller section
- Desktop hover behavior tested on the homepage Best Seller section

### Results
- Mobile visible action order:
  1. `Đọc thêm`
  2. `Thêm vào giỏ hàng`
  3. `Mua ngay`
- `Đọc thêm` href verified as `/detail/cho-toi-xin-mot-ve-di-tuoi-tho`
- `Đọc thêm` navigated to the shared detail route successfully
- Add-to-cart:
  - navbar summary moved from `0 sản phẩm / 0 VNĐ` to `1 sản phẩm / 73.800 VNĐ`
- Buy-now:
  - navigation landed on `/purchase`
  - loading indicator was visibly observed in headless runtime
- Desktop hover:
  - the hover overlay exposed the same 3 actions in the same order

### Null-Priced Coverage Status
- Current live dataset has **no null-priced published book inside Best Seller**
- Therefore:
  - disabled-state behavior for a null-priced Best Seller card was **not** exercised against a live card during this audit
  - this remains a coverage limitation, not a known bug

## Shared Behavior Consistency
- `/books`, Hero, and Best Seller all route to the same `/detail/[slug]` pattern
- `/books` and Best Seller use the same add-to-cart / buy-now behavior model and produced matching runtime results
- Hero uses the same buy-now helper path but the live Hero record is null-priced, so only the disabled-state branch was exercised there

## Accessibility / Integration Regression Notes
- `/books` keyboard focus path remained usable
- `/books` coarse-pointer row remained usable
- Best Seller preserved both touch-safe and hover-driven access patterns
- Hero action extraction did not destabilize homepage rendering
- No accidental homepage full-client conversion was introduced

## Phase 4 Audit Result
- Phase 4 entry-point integrations are stable.
- Remaining notes are coverage limitations caused by the current live dataset, not by failing functionality.
