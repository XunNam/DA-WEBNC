# Build And Runtime

## Typecheck

- `pnpm exec tsc --noEmit`: passed
- Repo/tooling nuance:
  - when `.next/types` is stale or missing, `tsc --noEmit` can fail on App Router route types
  - after `pnpm build` regenerated route types, `tsc --noEmit` passed cleanly

## Build

- `pnpm build`: passed
- Non-blocking warnings during build:
  - [route.ts](D:/Đồ án/DA-WEBNC/src/app/my-route/route.ts): unused variables
  - [getPublicSiteShellData.ts](D:/Đồ án/DA-WEBNC/src/lib/getPublicSiteShellData.ts): unused import
  - [getPublishedBooksData.ts](D:/Đồ án/DA-WEBNC/src/lib/getPublishedBooksData.ts): unused import
- These warnings are unrelated to the lookup/order-management feature and did not block the build.

## Production-Like Startup

- `pnpm start`: passed
- App served successfully at `http://localhost:3000`
- Runtime stderr note:
  - Node emitted an experimental SQLite warning only
- No lookup/order-management runtime startup failure was observed

## Route Smoke

Unauthenticated route sweep:

- `/` -> `200`
- `/books` -> `200`
- `/cart` -> `200`
- `/purchase` -> `200`
- `/lookup` -> `200`
- `/order-management` -> `307` to `/admin/login?redirect=%2Forder-management`
- `/order-management/69cc08c10887c682f917dcb1` -> `307` to `/admin/login?redirect=%2Forder-management%2F69cc08c10887c682f917dcb1`
- `/authors` -> `200`
- `/info` -> `200`
- `/admin` -> `200`

Authenticated route checks were exercised in-browser and are documented in the admin sections below.
