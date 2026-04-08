## Commands Run

- `pnpm exec tsc --noEmit`
- `pnpm build`
- production startup check:
  - `next start -p 3004 -H 127.0.0.1`
- production route checks:
  - `/`
  - `/books`
  - `/authors`
  - `/authors/nguyen-nhat-anh`
  - `/admin`

## Results

### Typecheck

- Final result: pass

One nuance appeared during the audit:

- a standalone `tsc --noEmit` run can fail if `.next/types` is stale or partially missing before a fresh build
- after running a fresh production build, `pnpm exec tsc --noEmit` passed cleanly

This did not block deployment because the real production build succeeds and regenerates the required Next types.

### Production Build

- Result: pass

Observed output:

- optimized production build completed successfully
- static and dynamic routes were generated normally

### Production Runtime Smoke Test

- Result: pass

Successful route responses:

- `/`: `200`
- `/books`: `200`
- `/authors`: `200`
- `/authors/nguyen-nhat-anh`: `200`
- `/admin`: `200`

Evidence files:

- [prod-route-checks.json](D:/Đồ án/DA-WEBNC/migration-reports/vercel-deploy-readiness-report-02/prod-route-checks.json)
- [prod-start-stdout.log](D:/Đồ án/DA-WEBNC/migration-reports/vercel-deploy-readiness-report-02/prod-start-stdout.log)
- [prod-start-stderr.log](D:/Đồ án/DA-WEBNC/migration-reports/vercel-deploy-readiness-report-02/prod-start-stderr.log)

## Non-Blocking Warnings

The build still reports a few lint warnings for unused variables:

- `src/app/my-route/route.ts`
- `src/lib/getPublicSiteShellData.ts`
- `src/lib/getPublishedBooksData.ts`

These did not block build or runtime startup.
