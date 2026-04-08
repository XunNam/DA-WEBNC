# Price, Slug, And Redirect Policy

## 1. Price Normalization Policy

### Observed Legacy Pattern
- All observed legacy price strings follow the same display format:
  - `^\d{1,3}(\.\d{3})* VNĐ$`
- Verified examples from `legacy/src/app/booksPage/page.tsx` and `legacy/src/app/components/body/bestSellingBooks/BestSellingBooks.tsx`:
  - `73.800 VNĐ`
  - `220.000 VNĐ`
  - `67.000 VNĐ`
  - `33.600 VNĐ`

### Storage Rule
- Store prices as integer VND amounts.
- Conversion rule:
  1. Validate against `^\d{1,3}(\.\d{3})* VNĐ$`
  2. Remove `.` thousands separators
  3. Remove trailing ` VNĐ`
  4. Parse the remainder as an integer

### Examples

| Legacy String | Parsed Field | Stored Value |
| --- | --- | --- |
| `73.800 VNĐ` | `price` | `73800` |
| `220.000 VNĐ` | `price` | `220000` |
| `67.000 VNĐ` | `compareAtPrice` | `67000` |
| `33.600 VNĐ` | `compareAtPrice` | `33600` |

### `originPrice` Handling
- Legacy `originPrice` becomes `compareAtPrice`.
- Rule: `compareAtPrice` is optional.
- Rule: if both values exist, `compareAtPrice` must be greater than or equal to `price`.
- If the relationship is invalid, the normalized record must be blocked for review.

### Missing Or Malformed Prices
- Missing price is allowed only where legacy content does not provide one.
- Current known case:
  - the hero book in `legacy/src/app/components/body/newRelease/NewRelease.tsx`
- If a price string is malformed:
  - parsed value becomes `null`
  - the record is flagged in `migration-data/qa-report.json`
  - import is blocked until fixed or manually approved

## 2. Slug Generation Policy

### Canonical Route Strategy
- Books:
  - listing route: `/books`
  - detail route: `/books/{slug}`
- Authors:
  - listing route: `/authors`
  - detail route: `/authors/{slug}`

### Normalization Rules
- Lowercase the string.
- Strip Vietnamese diacritics.
- Convert `đ` and `Đ` to `d`.
- Remove punctuation.
- Collapse whitespace to single hyphens.
- Collapse repeated hyphens.
- Trim leading/trailing hyphens.

### Book Slug Examples

| Book Title | Canonical Slug |
| --- | --- |
| `Tôi thấy hoa vàng trên cỏ xanh` | `toi-thay-hoa-vang-tren-co-xanh` |
| `Cho tôi xin một vé đi tuổi thơ` | `cho-toi-xin-mot-ve-di-tuoi-tho` |
| `Tôi là Bêtô` | `toi-la-beto` |
| `Truyện Kiều` | `truyen-kieu` |

### Author Slug Examples

| Author Name | Canonical Slug |
| --- | --- |
| `Nguyễn Nhật Ánh` | `nguyen-nhat-anh` |
| `Vũ Trọng Phụng` | `vu-trong-phung` |
| `Nguyễn Ngọc Tư` | `nguyen-ngoc-tu` |

### Collision Handling
- First attempt: use the base normalized slug.
- If two books collide:
  - append `-{author-slug}`
- If a collision still remains:
  - append `-2`, `-3`, and so on
- If two authors collide:
  - append `-2`, `-3`, and so on to the base author slug
- All candidate and final decisions must be recorded in `migration-data/slug-map.json`.

## 3. Redirect Policy

### Automatically Generated Redirects
- These redirects are deterministic and should be generated from `slug-map.json`:

| Legacy Route | Canonical Route |
| --- | --- |
| `/booksPage` | `/books` |
| `/authorsPage` | `/authors` |
| `/authorsPage/kimLan` | `/authors/kim-lan` |
| `/authorsPage/namCao` | `/authors/nam-cao` |
| `/authorsPage/ngoTatTo` | `/authors/ngo-tat-to` |
| `/authorsPage/nguyenDu` | `/authors/nguyen-du` |
| `/authorsPage/nguyenNgocTu` | `/authors/nguyen-ngoc-tu` |
| `/authorsPage/nguyenNhatAnh` | `/authors/nguyen-nhat-anh` |
| `/authorsPage/nguyenTuan` | `/authors/nguyen-tuan` |
| `/authorsPage/vuTrongPhung` | `/authors/vu-trong-phung` |

### Redirects Not Generated Automatically
- `/buyBookPage` should not receive an automatic redirect in v1.
- Reason:
  - there is no equivalent working commerce page in the agreed first release
  - the legacy implementation is only a placeholder
- This route remains a manual review item.

### What Is Not Part Of Redirect Policy
- The external consulting link in `legacy/src/app/components/NavbarLink.tsx`:
  - `http://127.0.0.1:8501`
- External store and sample links in the homepage hero:
  - Fahasa
  - Google Books
- These remain external URLs, not site redirects.

## 4. Generated vs Manual Decisions

### Generated
- Book candidate slugs
- Author candidate slugs
- Listing-page redirects
- Author-detail redirects

### Manual Review Required
- Any slug collision that needs override
- Any route without a direct canonical equivalent
- Any decision to preserve legacy route names beyond redirects
- Any future introduction of book detail redirects if the legacy site later reveals hidden book-detail pages

## Final Policy
- Slugs are canonical.
- Redirects protect legacy entry points where an equivalent new page exists.
- Price parsing must be deterministic and blocking on error.
- Non-equivalent routes are not auto-redirected just to avoid broken links.
