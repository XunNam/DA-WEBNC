# Bugs Fixed Or Notes

## Code changes during this audit

- None.

## Non-blocking notes

- `.next/types` freshness affects `pnpm exec tsc --noEmit`; build regeneration resolved it.
- `pnpm build` produced unrelated ESLint warnings outside the commerce flow.
- No frontend production URL was discoverable for live deployment smoke.
- Unpublished-book submit rejection was not directly exercised because the dataset had no unpublished books during the audit.

## Order-code collision coverage

- Status: **reviewed logically only**
- Runtime collision handling was **not** practically exercised in this audit.
- The implementation was inspected through behavior and code path expectations only:
  - retry loop up to `10`
  - duplicate lookup by `orderCode`
  - `409` on exhaustion
