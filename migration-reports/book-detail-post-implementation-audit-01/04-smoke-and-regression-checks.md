# Smoke And Regression Checks

## Route Smoke
- `/` -> `200`
- `/books` -> `200`
- `/detail/tat-den` -> `200`
- `/detail/ngay-xua-co-mot-chuyen-tinh` -> `200`
- `/cart` -> `200`
- `/purchase` -> `200`
- `/lookup` -> `200`
- `/authors` -> `200`
- `/info` -> `200`
- `/detail/slug-khong-ton-tai` -> `404`
- `/detail/%20` -> `404`

## Core Surface Checks
- Hero `Đọc thêm` -> detail route: verified
- Hero `Mua ngay` disabled no-op on live null-priced record: verified
- `/books` `Đọc thêm`: verified
- `/books` add-to-cart: verified
- `/books` buy-now: verified
- Detail-page add-to-cart: verified
- Detail-page buy-now: verified
- Best Seller `Đọc thêm`: verified
- Best Seller add-to-cart: verified
- Best Seller buy-now: verified

## Regression Summary
- Navbar cart summary still updates immediately after add-to-cart
- `/purchase` still receives cart state after buy-now flows
- `/lookup` still loads normally
- `/authors` still loads normally
- `/info` still loads normally
- No evidence of regression was found in `/cart`, `/purchase`, `/lookup`, `/authors`, or `/info`

## Server / Client Boundary Check
- Source inspection confirms:
  - [src/app/(frontend)/detail/[slug]/page.tsx](D:/Đồ%20án/DA-WEBNC/src/app/(frontend)/detail/[slug]/page.tsx) remains a server component and only mounts [BookDetailActionRow.tsx](D:/Đồ%20án/DA-WEBNC/src/app/(frontend)/detail/[slug]/BookDetailActionRow.tsx) as a client island
  - [src/app/(frontend)/page.tsx](D:/Đồ%20án/DA-WEBNC/src/app/(frontend)/page.tsx) remains a server component and only mounts [HomepageHeroActionsClient.tsx](D:/Đồ%20án/DA-WEBNC/src/app/(frontend)/HomepageHeroActionsClient.tsx) and [HomepageBestSellersClient.tsx](D:/Đồ%20án/DA-WEBNC/src/app/(frontend)/HomepageBestSellersClient.tsx) as narrow client islands
- No accidental broad client conversion was found

## Schema / Business-Logic Drift Check
- No code change was applied during this audit
- No schema drift beyond the already-implemented Phase 2 book-detail rollout was found
- No change was made to `/cart`, `/purchase`, `/api/orders/submit`, `/lookup`, or `/order-management`
