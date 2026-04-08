# Production Checks

## Real deployed environment

- Real deployed production smoke was **not** executed.

## Limitation

- No deployed frontend Vercel URL or custom site domain for the application was discoverable from the current repo state or environment context during this audit.
- The only discoverable external domain was the R2 media domain, which is not the storefront deployment URL.

## What was checked instead

- Full local production-like audit using:
  - `pnpm build`
  - `pnpm exec next start -p 3011 -H 127.0.0.1`
- All final route, commerce-flow, API, and admin checks in this audit report came from that local production-like server.
