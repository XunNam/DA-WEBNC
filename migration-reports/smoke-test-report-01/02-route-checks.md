# Route Checks

## `/`

- Status: `200`
- Outcome: PASS
- Key evidence:
  - Response succeeded at `http://127.0.0.1:3000/`
  - HTML included `Sách Bán Chạy`
  - HTML included `Ngày xưa có một chuyện tình`
  - HTML included `Nguyễn Nhật Ánh`
  - HTML did not include `Payload Blank Template`
- Assessment:
  - The route is serving the migrated homepage surface, not starter-template content
  - No obvious draft-only or withheld editorial content leak was observed

## `/books`

- Status: `200`
- Outcome: PASS
- Key evidence:
  - Response succeeded at `http://127.0.0.1:3000/books`
  - HTML included the books surface heading `Sách`
  - HTML included visible catalog content such as `Cảm ơn người lớn`
  - HTML included resolved author content such as `Nguyễn Nhật Ánh`
  - HTML did not include the hero-only book `Ngày xưa có một chuyện tình`
- Assessment:
  - The migrated books listing is rendering from the public catalog surface
  - The hero-only book remains excluded from the public listing as required
  - No obvious book/media/author resolution crash occurred

## `/authors`

- Status: `200`
- Outcome: PASS
- Key evidence:
  - Response succeeded at `http://127.0.0.1:3000/authors`
  - HTML included the authors surface heading `Tác giả`
  - HTML included `Nguyễn Nhật Ánh`
  - HTML included the expected public author link `/authors/nguyen-nhat-anh`
- Assessment:
  - The migrated authors listing is rendering successfully
  - Portrait/media resolution did not trigger an obvious runtime failure

## `/authors/nguyen-nhat-anh`

- Status: `200`
- Outcome: PASS
- Key evidence:
  - Response succeeded at `http://127.0.0.1:3000/authors/nguyen-nhat-anh`
  - HTML included `Tiểu sử tác giả`
  - HTML included `Nguyễn Nhật Ánh`
  - HTML included the safe placeholder `Nội dung tiểu sử công khai đang được cập nhật`
  - HTML did not include the internal marker string `editorial-holds`
- Assessment:
  - The author detail page resolved correctly by slug
  - The page is using the safe public empty-state behavior
  - No obvious long-form withheld biography prose leak was observed
