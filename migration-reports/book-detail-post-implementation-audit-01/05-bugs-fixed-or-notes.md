# Bugs Fixed Or Notes

## Code Changes During Audit
- None

## Blockers Fixed During Audit
- None

## Non-Blocking Notes

### 1. No Live Published Rich-Text Detail Content
- The current published dataset still contains **zero** books with non-empty `detailContent`.
- Result:
  - fallback rendering is verified
  - real rich-text rendering remains unexercised in live runtime

### 2. Null-Priced Entry-Point Coverage Remains Partial
- The only current published null-priced book is `ngay-xua-co-mot-chuyen-tinh`
- That book is:
  - published
  - `catalogVisible: false`
  - used by Hero
  - not present on `/books`
  - not present in Best Seller
- Result:
  - disabled purchase behavior was verified on Hero and `/detail/[slug]`
  - the same disabled-state runtime path was **not** exercised on `/books` or Best Seller because the live dataset does not expose that case there

### 3. Buy-Now Pending State Is Acceptable
- `useBookCommerceActions()` intentionally does not clear pending state before route push on the buy-now path.
- Observed result:
  - no visible stuck disabled state remained after normal navigation
  - add/increment then navigate behavior stayed correct
  - this is acceptable as implemented

### 4. Detail-Page Loading Indicator Visibility Was Not Deterministic In Headless
- The loading indicator was visibly observed on `/books` and Best Seller buy-now flows.
- On detail-page buy-now, a headless run did not always capture a visible indicator before navigation finished.
- Because:
  - the shared helper still calls `startRouteLoadingIndicator()`
  - the same helper path produced visible indicators on other surfaces
  - no user-visible stuck state or broken navigation occurred
- This remains a note, not a blocker

### 5. Legacy Homepage External CTA Fields Still Exist In Data
- Homepage global data still contains `buyLinkUrl` and `sampleLinkUrl`
- Public Hero behavior no longer uses them
- This matches the intended rollout and is not a bug
