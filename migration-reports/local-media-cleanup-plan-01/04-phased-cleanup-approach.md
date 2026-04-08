Safest phased cleanup approach:

## Phase 0: No-op is acceptable

If there is no operational reason to reduce local file clutter now:

- do nothing
- keep `media/`
- keep `legacy/public/`
- keep `public/`

This is a valid conservative outcome.

## Phase 1: Optional archive-first review for `media/` only

If cleanup is still desired:

- treat `media/` as the only initial candidate
- do not delete it directly
- archive or quarantine it out of the active root path first
- preserve a manifest of filenames before any move

Why `media/` only:

- it mirrors the current 21 R2-backed Media docs
- it is not referenced by current app code
- unlike `legacy/public/`, it is not a known migration-script input tree

## Phase 2: Post-archive verification

After an archive-first move of `media/` in a future execution turn:

- verify app still starts
- verify Media admin still loads
- verify one existing Media document still resolves publicly from R2
- verify no current workflow unexpectedly relied on the local directory

If anything regresses:

- restore the archive immediately

## Directories that should stay untouched in this cleanup plan

- `public/`
- `legacy/public/`

Reason:

- `public/` is live runtime
- `legacy/public/` remains provenance/history and script-input material

Recommended phased strategy:

- no-op or archive-first for `media/`
- no direct deletion
- no `legacy/public/` cleanup in this phase
- no `public/` cleanup in this phase
