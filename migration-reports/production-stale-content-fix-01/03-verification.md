## Typecheck

- `pnpm exec tsc --noEmit`: pass

## Production Build

- `pnpm build`: pass

Important build change after the fix:

- `/` changed from static to dynamic
- `/books` changed from static to dynamic
- `/authors` changed from static to dynamic
- `/authors/[slug]` remained dynamic

## Production-Like Start

- `next start -p 3006 -H 127.0.0.1`: pass

## Route Checks

Successful responses:

- `/`: `200`
- `/books`: `200`
- `/authors`: `200`
- `/authors/nguyen-nhat-anh`: `200`
- `/admin`: `200`

Evidence:

- [prod-route-checks.json](D:/Đồ án/DA-WEBNC/migration-reports/production-stale-content-fix-01/prod-route-checks.json)
- [prod-start-stdout.log](D:/Đồ án/DA-WEBNC/migration-reports/production-stale-content-fix-01/prod-start-stdout.log)
- [prod-start-stderr.log](D:/Đồ án/DA-WEBNC/migration-reports/production-stale-content-fix-01/prod-start-stderr.log)

## Published-Only Safety

Published-only public-read safety was preserved.

The existing public helpers still use `overrideAccess: false`:

- [getPublicSiteShellData.ts](D:/Đồ án/DA-WEBNC/src/lib/getPublicSiteShellData.ts)
- [getPublishedHomepageData.ts](D:/Đồ án/DA-WEBNC/src/lib/getPublishedHomepageData.ts)
- [getPublishedBooksData.ts](D:/Đồ án/DA-WEBNC/src/lib/getPublishedBooksData.ts)
- [getPublishedAuthorsData.ts](D:/Đồ án/DA-WEBNC/src/lib/getPublishedAuthorsData.ts)
