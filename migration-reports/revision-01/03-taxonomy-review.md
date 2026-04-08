# Taxonomy Review

## Scope
- This review covers the legacy `type` labels used on book cards.
- Source files:
  - `legacy/src/app/booksPage/page.tsx`
  - `legacy/src/app/components/body/bestSellingBooks/BestSellingBooks.tsx`
- No separate taxonomy files, constants, or config objects were found elsewhere in `legacy/src/`.

## Decision Summary
- Do not create a `categories` collection in v1.
- Do not split the legacy labels into `category`, `format`, and `tag` fields yet.
- Preserve the literal legacy label in a single book field named `typeLabel`.
- If editor control should stay constrained, make `typeLabel` a `select` field with the four observed values only.

## Observed Labels

| Observed Label | Source File Path(s) | Where / How It Is Used | Likely Semantic Meaning | Recommended Payload Mapping | Confidence |
| --- | --- | --- | --- | --- | --- |
| `Tiểu thuyết` | `legacy/src/app/booksPage/page.tsx`, `legacy/src/app/components/body/bestSellingBooks/BestSellingBooks.tsx` | Used as the display label for `Tắt đèn`, `Số đỏ`, `Cánh đồng bất tận`, and `Tôi thấy hoa vàng trên cỏ xanh` | Most likely a genre-ish or literary work-type label meaning “novel” | Keep as literal `books.typeLabel = "Tiểu thuyết"` | High |
| `Truyện ngắn` | `legacy/src/app/booksPage/page.tsx`, `legacy/src/app/components/body/bestSellingBooks/BestSellingBooks.tsx` | Used for `Vợ nhặt`, `Chí Phèo`, `Đời thừa`, `Cho tôi xin một vé đi tuổi thơ`, `Tôi là Bêtô`, and `Vang bóng một thời` | Most likely a literary work-type label meaning “short fiction / short story”, but still only proven as display copy | Keep as literal `books.typeLabel = "Truyện ngắn"` | High |
| `Truyện thơ` | `legacy/src/app/booksPage/page.tsx` | Used only for `Truyện Kiều` | Most likely a literary-form label meaning “verse narrative / poetic tale” | Keep as literal `books.typeLabel = "Truyện thơ"` | Medium-High |
| `Truyện dài` | `legacy/src/app/booksPage/page.tsx`, `legacy/src/app/components/body/bestSellingBooks/BestSellingBooks.tsx` | Used only for `Cảm ơn người lớn` | Ambiguous. Could mean long-form fiction, a sub-type of novel, or simply a marketing/editorial label | Keep as literal `books.typeLabel = "Truyện dài"` and flag for later taxonomy review | Medium |

## Label Usage By Book

| Book | Author | Legacy Label | Source Path |
| --- | --- | --- | --- |
| `Tắt đèn` | `Ngô Tất Tố` | `Tiểu thuyết` | `legacy/src/app/booksPage/page.tsx` |
| `Số đỏ` | `Vũ Trọng Phụng` | `Tiểu thuyết` | `legacy/src/app/booksPage/page.tsx` |
| `Cánh đồng bất tận` | `Nguyễn Ngọc Tư` | `Tiểu thuyết` | `legacy/src/app/booksPage/page.tsx` |
| `Tôi thấy hoa vàng trên cỏ xanh` | `Nguyễn Nhật Ánh` | `Tiểu thuyết` | `legacy/src/app/booksPage/page.tsx`, `legacy/src/app/components/body/bestSellingBooks/BestSellingBooks.tsx` |
| `Vợ nhặt` | `Kim Lân` | `Truyện ngắn` | `legacy/src/app/booksPage/page.tsx` |
| `Chí Phèo` | `Nam Cao` | `Truyện ngắn` | `legacy/src/app/booksPage/page.tsx` |
| `Đời thừa` | `Nam Cao` | `Truyện ngắn` | `legacy/src/app/booksPage/page.tsx` |
| `Cho tôi xin một vé đi tuổi thơ` | `Nguyễn Nhật Ánh` | `Truyện ngắn` | `legacy/src/app/booksPage/page.tsx`, `legacy/src/app/components/body/bestSellingBooks/BestSellingBooks.tsx` |
| `Tôi là Bêtô` | `Nguyễn Nhật Ánh` | `Truyện ngắn` | `legacy/src/app/booksPage/page.tsx`, `legacy/src/app/components/body/bestSellingBooks/BestSellingBooks.tsx` |
| `Vang bóng một thời` | `Nguyễn Tuân` | `Truyện ngắn` | `legacy/src/app/booksPage/page.tsx` |
| `Truyện Kiều` | `Nguyễn Du` | `Truyện thơ` | `legacy/src/app/booksPage/page.tsx` |
| `Cảm ơn người lớn` | `Nguyễn Nhật Ánh` | `Truyện dài` | `legacy/src/app/booksPage/page.tsx`, `legacy/src/app/components/body/bestSellingBooks/BestSellingBooks.tsx` |

## Why A Separate Taxonomy Collection Is Not Recommended In V1
- Only four distinct values exist.
- They are embedded as display labels, not as linked records.
- One of them, `Truyện dài`, is semantically ambiguous.
- There is no evidence that editors need to manage, expand, reorder, or localize this taxonomy in v1.
- A simple constrained field is safer than forcing an early taxonomy design that may later need to be undone.

## Deferred Review Item
- Revisit taxonomy only after there is real evidence for at least one of the following:
  - more labels from a larger dataset
  - a requirement for filter pages
  - a requirement to distinguish genre from literary form
  - a requirement for editor-managed taxonomy terms
