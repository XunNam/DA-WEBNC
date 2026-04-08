## Files Changed

- [layout.tsx](D:/Đồ án/DA-WEBNC/src/app/(frontend)/layout.tsx)

## Exact Change

Added this route-segment config:

```ts
export const dynamic = 'force-dynamic'
```

## Why This Was The Smallest Safe Fix

- It fixes the public frontend at the route-group boundary instead of changing each page individually.
- It covers layout-backed CMS content and nested public pages together.
- It preserves the existing CMS data flow and helper structure.
- It avoids broad cache architecture work or webhook/on-demand revalidation in this turn.

## What Was Not Changed

- no helper rewrites
- no schema changes
- no published-only access changes
- no R2/Atlas/config changes
- no on-demand revalidation system
