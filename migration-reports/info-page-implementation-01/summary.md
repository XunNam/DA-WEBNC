## Info Page 01

Status: implemented

What was added:
- a new draft-enabled Payload global: `infoPage`
- a new CMS-backed public route: `/info`
- a published-only fail-soft helper for the page data

Important constraints preserved:
- Navbar was left untouched
- no placeholder body content was added
- the public page falls back to the title `Giới thiệu` and otherwise stays empty-safe
- draft-only content is not exposed on the public route

Verification summary:
- `pnpm generate:types`: passed
- `pnpm exec tsc --noEmit`: passed
- `pnpm build`: passed
- production-like route checks returned `200` for `/`, `/books`, `/authors`, `/authors/nguyen-nhat-anh`, `/info`, `/admin`, and `/admin/globals/infoPage`
- `/info` rendered the fallback title `Giới thiệu` successfully with no published content populated yet

Next recommended action:
- open `infoPage` in Payload admin
- add and publish real content for the introduction area and tool sections
- add a Navbar link in a later turn if desired
