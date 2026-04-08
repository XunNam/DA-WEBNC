# Media Boundary Confirmation

## Current rule

`src/collections/Media.ts` should remain unchanged in the first code phase unless a concrete blocker appears during implementation.

This is the locked default.

## Why this is the correct default

Actual repo state:

- `src/collections/Media.ts` already exists
- it already uses `upload: true`
- it already has a required `alt` field

That is sufficient for the approved v1 needs:

- book covers in Payload media
- author portraits in Payload media

The current v1 plan does not require:

- media folders
- custom admin UI
- media metadata expansion
- responsive image presets
- logo migration into media
- award icon migration into media

## What does not justify changing `Media.ts`

The following are not sufficient reasons to modify `src/collections/Media.ts` in the first code phase:

- convenience
- cosmetic admin improvements
- speculative future media fields
- anticipation of later frontend needs
- desire for richer asset metadata without a current blocker

## What would justify changing it later

A later change is justified only if there is a concrete, narrow blocker such as:

- generated types or schema validation proves the current media config cannot safely represent required book cover or author portrait relations
- import planning later proves a required asset mapping cannot be expressed with the current upload collection
- a real runtime/schema incompatibility appears during implementation and is reproducible

## Required bar for later modification

If `Media.ts` is changed later, the implementer should document:

- the exact blocker
- why the blocker could not be solved without changing media
- the smallest possible schema change required

Without that justification, `Media.ts` should remain untouched.

## Final recommendation

Keep `src/collections/Media.ts` unchanged in the first code phase. Revisit it only if type generation, schema validation, or a concrete asset-mapping blocker proves the current upload schema is insufficient.
