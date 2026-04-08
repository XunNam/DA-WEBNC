## Changes Made

This audit applied only two narrow readiness fixes.

### 1. `.env.example`

Updated:

- [`.env.example`](D:/Đồ án/DA-WEBNC/.env.example)

Why:

- the previous example was still local-Mongo oriented and not clear enough for Vercel + Atlas + R2 production setup

What changed:

- deployment-oriented `DATABASE_URL` guidance
- clearer `PAYLOAD_SECRET` guidance
- clearer `R2_MEDIA_STORAGE_ENABLED` guidance
- clearer `R2_PUBLIC_URL` guidance

### 2. ESLint compat package

Updated:

- [`package.json`](D:/Đồ án/DA-WEBNC/package.json)
- [`pnpm-lock.yaml`](D:/Đồ án/DA-WEBNC/pnpm-lock.yaml)

Why:

- `eslint.config.mjs` imports `FlatCompat` from `@eslint/eslintrc`
- that package was not declared directly, which caused a build-time warning during `next build`

What changed:

- added `@eslint/eslintrc` as a dev dependency

## Scope Control

No route logic, schema, helper, media behavior, Atlas behavior, or frontend UX behavior was changed.
