# Phase 2 Data And Route Audit

## Schema Checks
- Source inspection of [src/collections/Books.ts](D:/Đồ%20án/DA-WEBNC/src/collections/Books.ts) confirms:
  - `typeLabel` remains the same field name and is now `type: 'text'`
  - the admin description for legacy examples is present
  - `detailContent` exists as optional `type: 'richText'` with label `Tổng quan về sách`
  - `detailContent` remains placed after `compareAtPrice`
  - SEO fields remain last
- Source inspection of [src/payload-types.ts](D:/Đồ%20án/DA-WEBNC/src/payload-types.ts) confirms:
  - `Book['typeLabel']` is widened to `string | null`
  - `Book['detailContent']` exists

## `typeLabel` Admin Safety
- Verified in live Payload admin using the existing test admin account `dev@payloadcms.com`.
- Existing record open check:
  - Opened `/admin/collections/books/69c955aeceeeeece73e68b4f`
  - Page title resolved as `Editing - Book - Payload`
  - Existing `typeLabel` value loaded correctly as `Tiểu thuyết`
  - The help text `Ví dụ nhãn cũ: Tiểu thuyết, Truyện ngắn, Truyện dài, Truyện thơ.` was visible
- New value entry check:
  - Changed `typeLabel` to `Kiểm thử thể loại audit`
  - Published the change from Payload admin successfully
  - Verified `/detail/tat-den` rendered `Kiểm thử thể loại audit`
- Restore check:
  - Restored `typeLabel` to `Tiểu thuyết`
  - Re-published successfully
  - Verified `/detail/tat-den` rendered `Tiểu thuyết` again
- Result:
  - Existing records still open correctly in admin
  - New `typeLabel` values can be entered and published safely
  - Public rendering reflects updated values correctly
  - Legacy values still display normally after restore

## Live `detailContent` Coverage
- Public data inspection used `GET /api/books?limit=200&depth=1`.
- Current published dataset result:
  - `13` published books returned
  - `0` published books currently have non-empty `detailContent`
  - Every published book in the current dataset still falls back to the empty-content path
- Runtime implication:
  - Live runtime coverage for a real populated rich-text book-detail document is still **not available**
  - Live runtime coverage remains limited to the fallback message path
- Verified fallback path:
  - `/detail/tat-den` rendered `Nội dung đang được cập nhật`
  - `/detail/ngay-xua-co-mot-chuyen-tinh` rendered `Nội dung đang được cập nhật`

## `/detail/[slug]` Route And Helper
- Source inspection of [src/lib/getPublishedBookDetailBySlug.ts](D:/Đồ%20án/DA-WEBNC/src/lib/getPublishedBookDetailBySlug.ts) confirms:
  - `payload.find({ collection: 'books', depth: 1, draft: false, limit: 1, overrideAccess: false })`
  - lookup is by `where.slug.equals`
  - there is no `user` passed
  - there is no `catalogVisible` filter
  - empty / visually-empty Lexical content normalizes to `null`
- Source inspection of [src/app/(frontend)/detail/[slug]/page.tsx](D:/Đồ%20án/DA-WEBNC/src/app/(frontend)/detail/[slug]/page.tsx) confirms:
  - missing / blank slug calls `notFound()`
  - helper returning `null` calls `notFound()`
  - page remains server-rendered and only mounts the small action-row client island
- Runtime route checks:
  - `/detail/tat-den` -> `200`
  - `/detail/ngay-xua-co-mot-chuyen-tinh` -> `200`
  - `/detail/slug-khong-ton-tai` -> `404`
  - `/detail/%20` -> `404`
- Catalog visibility rule:
  - The live Hero book `ngay-xua-co-mot-chuyen-tinh` is published with `catalogVisible: false`
  - `/detail/ngay-xua-co-mot-chuyen-tinh` still resolves publicly
  - This confirms the detail route is not incorrectly restricted by `catalogVisible`

## Phase 2 Audit Result
- Phase 2 implementation is stable.
- No blocker-level issue was found.
- The only remaining Phase 2 note is the lack of live published rich-text content for non-fallback runtime coverage.
