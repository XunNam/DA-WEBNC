## What Was Stale

The stale production surfaces were the CMS-backed public frontend surfaces:

- layout/site shell via `getPublicSiteShellData`
- homepage via `getPublishedHomepageData`
- books listing via `getPublishedBooksData`
- authors listing via `getPublishedAuthorsData`
- author detail via `getPublishedAuthorBySlug`

This matches the user-visible symptom that both layout-level content such as nav links and page-level content such as authors were stale after Payload updates.

## Why Local Differed From Production

Local dev did not reproduce the issue because Next dev mode does not behave like a production prerendered build. Production was serving build-time output for the public route group.

## Evidence

Before the fix:

- no `dynamic`, `revalidate`, or `fetchCache` segment exports were present under `src/app`
- current production build output marked these public routes as static:
  - `/`
  - `/books`
  - `/authors`

After the fix:

- build output marks these same routes as dynamic (`ƒ`)

## Affected Files / Surfaces

The stale behavior was rooted in the public route group boundary:

- [layout.tsx](D:/Đồ án/DA-WEBNC/src/app/(frontend)/layout.tsx)

The helpers themselves were not the source of the bug; they were simply being executed inside a route group that Next could prerender statically.
