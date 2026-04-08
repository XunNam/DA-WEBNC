## Root Cause

The public frontend route group was being prerendered statically in production. CMS-backed data was read through direct Payload Local API helpers, but there was no App Router segment config to stop build-time freezing. That made layout data like nav links and page data like homepage/books/authors content stay stale until the next redeploy.

## Exact Fix

Added:

- `export const dynamic = 'force-dynamic'`

to:

- [layout.tsx](D:/Đồ án/DA-WEBNC/src/app/(frontend)/layout.tsx)

## Expected Production Effect

The public frontend route group now renders dynamically in production, so CMS updates from Payload should appear without requiring a full redeploy for each content change.
