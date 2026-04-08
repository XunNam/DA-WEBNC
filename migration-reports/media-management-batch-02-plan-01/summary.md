Batch 2 can stay extremely small.

Recommended implementation:

- modify only [Media.ts](D:/Đồ án/DA-WEBNC/src/collections/Media.ts)
- keep the built-in Payload Media admin
- add explicit filename-first admin config:
  - `useAsTitle: 'filename'`
  - `listSearchableFields: ['filename', 'alt']`
  - `defaultColumns: ['filename', 'alt', 'updatedAt', 'mimeType']`

Current decision on preview/open/delete:

- built-in upload edit/delete flow is sufficient for the initial Batch 2 patch
- no custom page
- no custom preview component
- no delete lifecycle change

Exact next recommended action:

- implement Batch 2 as a one-file change in [Media.ts](D:/Đồ án/DA-WEBNC/src/collections/Media.ts) only
