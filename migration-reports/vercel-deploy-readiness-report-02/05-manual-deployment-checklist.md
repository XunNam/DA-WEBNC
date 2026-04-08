## Vercel Environment Setup

Set these variables in the Vercel project:

- `DATABASE_URL`
- `PAYLOAD_SECRET`
- `R2_MEDIA_STORAGE_ENABLED=true`
- `R2_BUCKET`
- `R2_ACCOUNT_ID`
- `R2_ACCESS_KEY_ID`
- `R2_SECRET_ACCESS_KEY`
- `R2_PUBLIC_URL`

Recommended checks:

- no leading/trailing whitespace
- `DATABASE_URL` includes the correct Atlas database name
- `R2_PUBLIC_URL` has no trailing slash

## Atlas Checklist

Before first deploy:

1. Confirm the Atlas database user in `DATABASE_URL` has access to the target database.
2. Confirm network access allows the Vercel deployment to connect.
3. If you are using Atlas IP allowlists, update them appropriately for Vercel access strategy.
4. Confirm the database name in `DATABASE_URL` is the same one that already works locally.

## R2 Checklist

Before first deploy:

1. Confirm the bucket name matches `R2_BUCKET`.
2. Confirm the account ID matches `R2_ACCOUNT_ID`.
3. Confirm the access key pair has read/write/delete permissions for the bucket.
4. Confirm the public/custom-domain URL in `R2_PUBLIC_URL` serves uploaded objects correctly.
5. Keep `R2_MEDIA_STORAGE_ENABLED=true` in Vercel if production media should continue using R2.

## First Deploy Smoke Checks

After the first real Vercel deploy:

1. Open `/`
2. Open `/books`
3. Open `/authors`
4. Open `/authors/nguyen-nhat-anh`
5. Open `/admin`
6. Log into Payload admin
7. Upload one new media item and confirm:
   - upload succeeds
   - the object appears in R2
   - the public URL resolves
8. Delete that test media item and confirm the R2 object is removed

## What Not To Do In The Deploy Turn

- do not rerun migration/import blindly
- do not recreate Media documents
- do not change Atlas database name again unless you are intentionally switching databases
- do not disable R2 if the production app should continue serving current media from R2
