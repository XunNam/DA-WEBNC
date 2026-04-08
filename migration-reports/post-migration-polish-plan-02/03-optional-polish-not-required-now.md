# Optional Polish Not Required Now

These items may be reasonable later, but they are safer to defer than to mix into the next tiny patch turn.

## Deferred Items

### Starter CSS cleanup in `src/app/(frontend)/styles.css`

- Not required now because the current frontend surfaces are already stable
- Safer to defer because global CSS cleanup can create unintended styling drift outside the immediate fix scope

### Helper deduplication across published-only data helpers

Files:

- `src/lib/getPublishedHomepageData.ts`
- `src/lib/getPublishedBooksData.ts`
- `src/lib/getPublishedAuthorsData.ts`

Why defer:

- Not required now because these helpers are already working and protect the current public-read policy
- Safer to defer because consolidating them would touch stable route dependencies without clear bug-fix value

### Route metadata centralization beyond the shell-level layout fix

- Not required now because route metadata is not currently a correctness blocker
- Safer to defer because centralization would broaden the scope beyond the approved shell-level correction

### VND formatting extraction

- Not required now because duplicated formatting is a maintenance concern, not a correctness issue
- Safer to defer because shared formatting extraction would touch stable migrated route code without operational benefit

### Extra smoke checks or light verification additions

- Not required now because the current migrated baseline is already verified enough for the immediate tiny patch
- Safer to defer because extra verification work is not needed to implement the next two-file safety patch
