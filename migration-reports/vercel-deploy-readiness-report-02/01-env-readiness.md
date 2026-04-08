## Required Production Environment Variables

The current runtime code reads exactly these environment variables:

- `DATABASE_URL`
- `PAYLOAD_SECRET`
- `R2_MEDIA_STORAGE_ENABLED`
- `R2_BUCKET`
- `R2_ACCOUNT_ID`
- `R2_ACCESS_KEY_ID`
- `R2_SECRET_ACCESS_KEY`
- `R2_PUBLIC_URL`

## `.env.example` Assessment

Before this audit, `.env.example` was still biased toward a local MongoDB example and did not clearly explain the production/Vercel intent for the R2 flag.

After the audit, `.env.example` now:

- uses a deployment-oriented Atlas placeholder pattern for `DATABASE_URL`
- makes `PAYLOAD_SECRET` expectation explicit
- explains when `R2_MEDIA_STORAGE_ENABLED` should be `true`
- clarifies that `R2_PUBLIC_URL` should be the public/custom-domain base URL without a trailing slash

## Accuracy Assessment

`.env.example` is now accurate enough for production setup.

## Remaining Manual Env Work

The user still needs to set these exact values in Vercel:

- `DATABASE_URL`
- `PAYLOAD_SECRET`
- `R2_MEDIA_STORAGE_ENABLED=true`
- `R2_BUCKET`
- `R2_ACCOUNT_ID`
- `R2_ACCESS_KEY_ID`
- `R2_SECRET_ACCESS_KEY`
- `R2_PUBLIC_URL`

## Notes

- `NODE_ENV` is handled by Vercel.
- `PORT` is handled by Vercel.
- No additional `NEXT_PUBLIC_*` variables are currently required by the repo.
