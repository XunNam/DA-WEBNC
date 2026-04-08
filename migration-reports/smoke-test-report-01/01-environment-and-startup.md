# Environment And Startup

## Environment Assumptions Used

- Local repo run with `pnpm`
- Local MongoDB baseline already present
- `.env` already configured
- Current migrated repo state treated as stable baseline

## Commands Used

Initial attempted startup command:

```powershell
pnpm dev -- --hostname 127.0.0.1 --port 3000
```

Observed result:

- Failed
- `next dev` interpreted `--hostname` as a project directory because the existing script already wraps `next dev`

Actual startup command used for the smoke test:

```powershell
pnpm exec next dev --hostname 127.0.0.1 --port 3000
```

TypeScript verification command:

```powershell
pnpm exec tsc --noEmit
```

## Startup Outcome

- Final startup succeeded
- Local URL: `http://127.0.0.1:3000`
- Ready state reached in `19.9s`

## Relevant Startup Observations

- `.env` was detected by Next
- Route compilation completed successfully for:
  - `/`
  - `/books`
  - `/authors`
  - `/authors/[slug]`
- No unhandled startup error appeared in logs during the successful run

## Environment-Related Notes

- Existing warning observed:
  - `No email adapter provided. Email will be written to console.`
- This warning did not prevent startup and did not break the tested public routes
