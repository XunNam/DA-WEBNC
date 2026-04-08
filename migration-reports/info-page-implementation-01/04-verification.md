## Verification

Commands run:
- `pnpm generate:types`
- `pnpm exec tsc --noEmit`
- `pnpm build`

Route checks after production-like startup:
- `/`: `200`
- `/books`: `200`
- `/authors`: `200`
- `/authors/nguyen-nhat-anh`: `200`
- `/info`: `200`
- `/admin`: `200`
- `/admin/globals/infoPage`: `200`

Specific `/info` result:
- the response contained `Giới thiệu`
- the route rendered successfully without published content populated yet
- no fake placeholder body text was added by the implementation

Type and build result:
- Payload types regenerated successfully
- TypeScript check passed
- production build passed

Protected behavior left unchanged:
- Navbar was not modified
- existing homepage/books/authors routes kept working
- published-only public-read safety remained in place
- no Atlas/R2/admin-media behavior was changed
