## Local-Only Assumptions Audit

### MongoDB

No production runtime code is hardcoded to local MongoDB.

Localhost-specific Mongo assumptions still appear only in migration tooling:

- `scripts/migration/import-normalized.ts`

That is not part of deployed runtime behavior.

### Media Storage

Current deployed-runtime assumption is R2-backed media through the official S3-compatible adapter path in `src/payload.config.ts`.

Important audit conclusion:

- current live Media documents are object-backed in R2
- runtime media is not relying on local `media/` files
- residual local media folders are not an active deployment dependency

### Static Assets

Static assets under `public/` are handled correctly by Next/Vercel.

The current frontend uses static public assets for homepage award icons, which is deployment-safe.

## Payload / Next / R2 Readiness

### Payload / Next

The current setup is compatible with Vercel-style deployment:

- Next app router
- Payload integrated with `withPayload`
- MongoDB Atlas adapter
- Node runtime-compatible `@payloadcms/storage-s3`

### R2

The current R2 setup is compatible with Vercel expectations:

- endpoint derived from `R2_ACCOUNT_ID`
- `region: 'auto'`
- `forcePathStyle: true`
- public file URLs generated from `R2_PUBLIC_URL`

## Remaining Deployment Risks

These are manual infrastructure/runtime risks, not repo-code blockers:

- Atlas network access may still block Vercel if IP/network rules are too restrictive
- `R2_MEDIA_STORAGE_ENABLED` must be `true` in Vercel if production should use R2
- `R2_PUBLIC_URL` must match the real public/custom-domain path used to serve media
- Vercel env values must be set exactly and without whitespace mistakes

## Overall Risk Assessment

No code-level runtime assumption currently looks unsafe for Vercel deployment after this audit.
