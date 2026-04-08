Approved Batch 2 scope is limited to small Media collection admin usability improvements inside the existing Payload Media collection admin.

Maximum safe implementation boundary:

- [Media.ts](D:/Đồ án/DA-WEBNC/src/collections/Media.ts)

Protected baseline that must not change:

- homepage route behavior
- `/books` route behavior
- `/authors` route behavior
- `/authors/[slug]` route behavior
- Navbar/Footer shell integration
- published-only public read policy
- runtime redirects
- current R2 upload integration
- current verified R2 delete lifecycle on Media deletion
- current Books deletion semantics
- current Authors deletion semantics
- current route helpers and shell helpers

Explicitly out of scope:

- all frontend route files under `src/app/(frontend)/`
- [getPublishedHomepageData.ts](D:/Đồ án/DA-WEBNC/src/lib/getPublishedHomepageData.ts)
- [getPublishedBooksData.ts](D:/Đồ án/DA-WEBNC/src/lib/getPublishedBooksData.ts)
- [getPublishedAuthorsData.ts](D:/Đồ án/DA-WEBNC/src/lib/getPublishedAuthorsData.ts)
- [getPublicSiteShellData.ts](D:/Đồ án/DA-WEBNC/src/lib/getPublicSiteShellData.ts)
- [payload.config.ts](D:/Đồ án/DA-WEBNC/src/payload.config.ts)
- [next.config.mjs](D:/Đồ án/DA-WEBNC/next.config.mjs)
- [Books.ts](D:/Đồ án/DA-WEBNC/src/collections/Books.ts)
- [Authors.ts](D:/Đồ án/DA-WEBNC/src/collections/Authors.ts)
- any custom admin route or page
- any delete lifecycle change
- any orphan cleanup / where-used tracing / bulk media management system

Batch 2 objective stays narrow:

1. find images by uploaded filename
2. identify images more quickly inside the existing Media admin
3. use the existing Media document flow to preview/open/delete
4. leave R2 deletion semantics unchanged
