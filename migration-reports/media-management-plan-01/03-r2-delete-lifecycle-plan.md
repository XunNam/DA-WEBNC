# R2 Delete Lifecycle Plan

## Safe deletion model

### Book deletion

Deleting a `Book` should **not** automatically delete related media.

Reason:

- `src/collections/Books.ts` stores `coverImage` as a relation to `media`
- `src/collections/Authors.ts` stores `portrait` as a relation to `media`
- media is structurally reusable
- automatic cascade deletion from `books` would be unsafe if the same image is reused or manually reassigned later

There are currently no collection hooks in the repo that attempt to cascade from Book deletion into Media deletion, which is the safer baseline.

### Media deletion

Deleting a `Media` document is the correct deletion action for removing a backing object from R2.

Evidence from the installed storage plugin:

- `@payloadcms/plugin-cloud-storage` injects an `afterDelete` hook onto targeted upload collections
- that hook calls `adapter.handleDelete(...)` for:
  - the main filename
  - resized files in `doc.sizes`
- `@payloadcms/storage-s3` implements `handleDelete` by calling `deleteObject(...)` against the configured bucket/key

This means the intended lifecycle is:

1. delete Media document
2. plugin `afterDelete` hook runs
3. backing object is deleted from R2

## Why the user’s observed behavior happened

The reported behavior was:

- deleting a Book or book-related content did not remove the object from R2

That is expected under the current safe model because:

- Book deletion is not Media deletion
- the R2 delete lifecycle is attached to the `media` upload collection, not to `books`

## Safest implementation plan if a fix is still needed

The first implementation batch should be an empirical audit, not an immediate custom hook.

Recommended verification sequence:

1. upload one new media file to the `media` collection
2. confirm the object exists in R2
3. delete the Media document from the Media collection admin
4. confirm the object is deleted from R2

If that passes:

- do not add new delete hooks
- document the correct usage: delete media from Media collection, not from Book deletion

If that fails:

- inspect logs and confirm the `media` collection is actually running through the active R2 adapter
- then add the smallest fallback only on `src/collections/Media.ts`
  - likely a narrow explicit `afterDelete` hook
  - only if a real failure is reproduced

## What should not be implemented

- no automatic media deletion from `books`
- no automatic media deletion from `authors`
- no broad cascade-delete system
- no custom delete logic across unrelated collections
