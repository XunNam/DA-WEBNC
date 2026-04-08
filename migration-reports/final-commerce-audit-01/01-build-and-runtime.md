# Build And Runtime

## Commands

- `pnpm generate:types`: passed
- `pnpm exec tsc --noEmit`: passed after route types were regenerated
- `pnpm build`: passed
- Production-like startup: passed via `pnpm exec next start -p 3011 -H 127.0.0.1`

## `.next/types` nuance

- Initial `pnpm exec tsc --noEmit` failed because this repo includes `.next/types/**/*.ts` in `tsconfig.json`.
- After `pnpm build` regenerated the Next route types, `pnpm exec tsc --noEmit` passed cleanly.
- This is a repo/tooling nuance, not a commerce blocker.

## Build warnings

`pnpm build` emitted unrelated ESLint warnings in:

- [route.ts](D:/Đồ án/DA-WEBNC/src/app/my-route/route.ts)
- [getPublicSiteShellData.ts](D:/Đồ án/DA-WEBNC/src/lib/getPublicSiteShellData.ts)
- [getPublishedBooksData.ts](D:/Đồ án/DA-WEBNC/src/lib/getPublishedBooksData.ts)

These warnings did not block build output and did not affect the audited commerce flow.

## Runtime note

- `pnpm exec next start ...` worked for production-like smoke.
- `pnpm start -- -p 3011 -H 127.0.0.1` did not forward custom args correctly in this environment. This was a local script-usage nuance, not a release blocker for the commerce flow itself.
