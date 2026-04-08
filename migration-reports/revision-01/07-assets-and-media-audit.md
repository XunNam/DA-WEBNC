# Assets And Media Audit

## Summary
- Total public assets in `legacy/public/`: `28`
- Unique referenced assets: `27`
- Orphaned asset: `1`
- Orphan path: `legacy/public/book-store.png`

## Asset Groups

| Group | Asset Count | Status | Recommendation |
| --- | --- | --- | --- |
| Author portraits | 8 | Referenced | Migrate to Payload `media` |
| Book cover images | 13 | Referenced | Migrate to Payload `media` |
| Logos | 2 | Referenced | Keep static/code-managed in v1 |
| Award SVG icons | 4 | Referenced | Keep static/code-managed in v1 |
| Orphan asset | 1 | Unreferenced | Manual review before deciding keep/archive |

## Referenced Author Portraits

| Asset Path | Reference Count | Used In | Recommendation |
| --- | --- | --- | --- |
| `author/kim-lan.jpg` | 2 | `legacy/src/app/authorsPage/page.tsx`, `legacy/src/app/authorsPage/kimLan/page.tsx` | Migrate to `media` |
| `author/nam-cao.jpg` | 2 | `legacy/src/app/authorsPage/page.tsx`, `legacy/src/app/authorsPage/namCao/page.tsx` | Migrate to `media` |
| `author/ngo-tat-to.jpg` | 2 | `legacy/src/app/authorsPage/page.tsx`, `legacy/src/app/authorsPage/ngoTatTo/page.tsx` | Migrate to `media` |
| `author/nguyen-du.jpg` | 2 | `legacy/src/app/authorsPage/page.tsx`, `legacy/src/app/authorsPage/nguyenDu/page.tsx` | Migrate to `media` |
| `author/nguyen-ngoc-tu.jpg` | 2 | `legacy/src/app/authorsPage/page.tsx`, `legacy/src/app/authorsPage/nguyenNgocTu/page.tsx` | Migrate to `media` |
| `author/nguyen-nhat-anh.jpg` | 3 | `legacy/src/app/authorsPage/page.tsx`, `legacy/src/app/authorsPage/nguyenNhatAnh/page.tsx`, `legacy/src/app/components/body/bioGraphy/Biography.tsx` | Migrate to `media` |
| `author/nguyen-tuan.jpg` | 2 | `legacy/src/app/authorsPage/page.tsx`, `legacy/src/app/authorsPage/nguyenTuan/page.tsx` | Migrate to `media` |
| `author/vu-trong-phung.jpg` | 2 | `legacy/src/app/authorsPage/page.tsx`, `legacy/src/app/authorsPage/vuTrongPhung/page.tsx` | Migrate to `media` |

## Referenced Book Cover Assets

| Asset Path | Reference Count | Used In | Recommendation |
| --- | --- | --- | --- |
| `books/tat-den.webp` | 1 | `legacy/src/app/booksPage/page.tsx` | Migrate to `media` |
| `books/vo-nhat.webp` | 1 | `legacy/src/app/booksPage/page.tsx` | Migrate to `media` |
| `books/chi-pheo.webp` | 1 | `legacy/src/app/booksPage/page.tsx` | Migrate to `media` |
| `books/truyen-kieu.jpg` | 1 | `legacy/src/app/booksPage/page.tsx` | Migrate to `media` |
| `books/so-do.webp` | 1 | `legacy/src/app/booksPage/page.tsx` | Migrate to `media` |
| `books/canh-dong-bat-tan.jpg` | 1 | `legacy/src/app/booksPage/page.tsx` | Migrate to `media` |
| `books/doi-thua.jpg` | 1 | `legacy/src/app/booksPage/page.tsx` | Migrate to `media` |
| `books/vang-bong-mot-thoi.webp` | 1 | `legacy/src/app/booksPage/page.tsx` | Migrate to `media` |
| `home/cho-toi-xin-mot-ve-di-tuoi-tho.jpg` | 2 | `legacy/src/app/booksPage/page.tsx`, `legacy/src/app/components/body/bestSellingBooks/BestSellingBooks.tsx` | Migrate to `media` |
| `home/cam-on-nguoi-lon.jpg` | 2 | `legacy/src/app/booksPage/page.tsx`, `legacy/src/app/components/body/bestSellingBooks/BestSellingBooks.tsx` | Migrate to `media` |
| `home/toi-la-beto.jpg` | 2 | `legacy/src/app/booksPage/page.tsx`, `legacy/src/app/components/body/bestSellingBooks/BestSellingBooks.tsx` | Migrate to `media` |
| `home/toi-thay-hoa-vang-tren-co-xanh.jpg` | 2 | `legacy/src/app/booksPage/page.tsx`, `legacy/src/app/components/body/bestSellingBooks/BestSellingBooks.tsx` | Migrate to `media` |
| `home/ngay-xua-co-mot-chuyen-tinh.webp` | 1 | `legacy/src/app/components/body/newRelease/NewRelease.tsx` | Migrate to `media` |

## Static Brand And Decorative Assets

| Asset Path | Used In | Recommendation | Reason |
| --- | --- | --- | --- |
| `site-logo.svg` | `legacy/src/app/components/Navbar.tsx` | Keep static in code for v1 | Brand asset, not proven to need editor management |
| `site-logo-white.svg` | `legacy/src/app/components/Footer.tsx` | Keep static in code for v1 | Brand asset, not proven to need editor management |
| `ultra.svg` | `legacy/src/app/components/body/adWards/Adwards.tsx` | Keep static in code for v1 | Decorative icon mapped by `iconKey` |
| `mega.svg` | `legacy/src/app/components/body/adWards/Adwards.tsx` | Keep static in code for v1 | Decorative icon mapped by `iconKey` |
| `hyper-best.svg` | `legacy/src/app/components/body/adWards/Adwards.tsx` | Keep static in code for v1 | Decorative icon mapped by `iconKey` |
| `ultimate-winer.svg` | `legacy/src/app/components/body/adWards/Adwards.tsx` | Keep static in code for v1, flag typo for review | Decorative icon plus naming inconsistency |

## Orphan And Uncertain Asset

| Asset Path | Status | Notes |
| --- | --- | --- |
| `legacy/public/book-store.png` | Orphaned / manual review | No reference was found in `legacy/src/**/*.ts*`. Review whether this is an abandoned design asset or a future brand image. |

## Important Distinctions

### Repeated References Are Not The Same As Duplicate Files
- Several assets are reused in multiple legacy components.
- This does not prove duplicate binary files.
- The audit only proves repeated path references.

### No Missing Referenced Assets Were Found
- Every referenced asset path found in JSX matched a file in `legacy/public/`.
- That means the media audit can proceed from known files, not guessed assets.

## Migration Recommendations

### Payload-Managed In V1
- all book cover images
- all author portraits

### Keep Static In Code In V1
- logos
- award SVG icons

### Manual Review Items
- `legacy/public/book-store.png`
- naming typo `ultimate-winer.svg`
- whether any future design change should move logos into a `siteSettings` global
