## Public Route

Added:
- `src/app/(frontend)/info/page.tsx`
- `src/app/(frontend)/info/page.module.css`
- `src/lib/getPublishedInfoPageData.ts`

Public data behavior:
- reads `infoPage` with `draft: false`
- uses `overrideAccess: false`
- reads `siteSettings` only for metadata fallback
- returns a safe empty object if the global is missing, unpublished, malformed, or unreadable

Empty-safe rendering behavior:
- page title falls back to `Giới thiệu`
- no placeholder body copy is rendered
- empty intro blocks are skipped
- empty tool sections are skipped
- missing tool logos and descriptions are skipped cleanly
- invalid or missing tool links never render fake hrefs

Public layout behavior:
- no Navbar changes
- no route structure changes outside `/info`
- uses the existing frontend design language and rich-text renderer
- relies on the current dynamic frontend layout already in place
