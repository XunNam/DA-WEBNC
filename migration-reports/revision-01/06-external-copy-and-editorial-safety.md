# External Copy And Editorial Safety

## Goal
Prevent potentially external-source-derived copy from being imported into public Payload content by default.

## Why This Matters
- Several legacy texts look adapted from external sources or third-party summaries.
- The legacy code already links outward to likely source pages:
  - Wikipedia author pages from `legacy/src/app/authorsPage/*/page.tsx`
  - a Wikipedia link in `legacy/src/app/components/body/bioGraphy/ReadMore.tsx`
  - a Fahasa product link in `legacy/src/app/components/body/newRelease/BuyNow.tsx`
  - a Google Books link in `legacy/src/app/components/body/newRelease/ReadSample.tsx`
- That does not prove copyright status by itself, but it is enough to require a safer migration posture.

## Content Classification

### Publishable Trusted Content
This is safe to migrate as ordinary content because it is either factual identity data or generic site-authored UI copy:
- book titles
- author names
- legacy `type` labels
- price strings and normalized prices
- image references
- nav labels such as `Trang chủ`, `Sách`, `Tác giả`
- section headings such as `SÁCH MỚI`, `TÁC GIẢ`, `Sách Bán Chạy`
- newsletter CTA heading/body from `legacy/src/app/page.tsx`
- award card titles and bodies from `legacy/src/app/components/body/adWards/Adwards.tsx`

### Draft / Review-Only Reference Material
This should not be imported into public Payload fields by default:
- long-form author biographies in:
  - `legacy/src/app/authorsPage/kimLan/page.tsx`
  - `legacy/src/app/authorsPage/namCao/page.tsx`
  - `legacy/src/app/authorsPage/ngoTatTo/page.tsx`
  - `legacy/src/app/authorsPage/nguyenDu/page.tsx`
  - `legacy/src/app/authorsPage/nguyenNgocTu/page.tsx`
  - `legacy/src/app/authorsPage/nguyenNhatAnh/page.tsx`
  - `legacy/src/app/authorsPage/nguyenTuan/page.tsx`
  - `legacy/src/app/authorsPage/vuTrongPhung/page.tsx`
- the short Nguyễn Nhật Ánh summary in `legacy/src/app/components/body/bioGraphy/Biography.tsx`
- the hero book summary in `legacy/src/app/components/body/newRelease/NewRelease.tsx`

Reason:
- These texts are descriptive prose, not just identity data.
- Some read like encyclopedia-style biography copy.
- Some read like adapted retail or publisher-style descriptions.
- Their provenance should be preserved for review, but they should not become public editorial content automatically.

### Reference-Only Extraction Artifacts
These should be preserved in review artifacts, not in publishable schema fields:
- raw biography paragraphs
- raw hero summary paragraph
- raw metadata strings that merely say `Tiểu sử ...`
- outbound source links
- source-path provenance

## Safe Handling Options

| Approach | Advantages | Risks | Recommendation |
| --- | --- | --- | --- |
| Keep out of Payload entirely and store only in review artifacts | Safest. Prevents accidental publication. Keeps public schema clean. | Editors must manually rewrite publishable summaries later. | Recommended for v1 |
| Store in a non-public review field inside Payload | Convenient for editors to see inside admin. | Risk of accidental exposure or later misuse. Requires extra access-control design. | Not recommended for first implementation |
| Store as draft/reference-only content inside public collections | Keeps all material in one place. | Highest risk of accidental surfacing. Blurs trusted vs untrusted content. | Do not use in v1 |

## Recommended V1 Policy
- Keep suspicious long-form copy out of Payload collections entirely.
- Preserve it only in:
  - `migration-data/authors.raw.json`
  - `migration-data/homepage.raw.json`
  - `migration-data/editorial-holds.json`
- Require editors to author new, trusted summaries manually for:
  - homepage hero short copy
  - homepage author spotlight short copy
  - any future public author biography field

## Suggested `editorial-holds.json` Shape
Each hold record should include:
- `recordType`
- `recordKey`
- `sourcePath`
- `fieldName`
- `rawText`
- `suspectedOrigin`
- `linkedExternalUrl`
- `recommendedAction`
- `status`

Example statuses:
- `review-required`
- `rewrite-required`
- `approved-for-reference-only`

## What Should Not Be Blocked By This Policy
- factual identity fields such as `title`, `name`, and `lifeDatesDisplay`
- numeric price data
- asset references
- route mappings
- literal `typeLabel` values

## Final Safety Rule
- If descriptive prose is not clearly trusted and site-authored, do not import it into a public Payload field in v1.
- Review artifacts may preserve it for comparison, but editors should write new publishable copy manually.
