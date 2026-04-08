The safest Batch 2 implementation is to add explicit admin config in [Media.ts](D:/Đồ án/DA-WEBNC/src/collections/Media.ts) for filename-first discovery.

Planned config:

```ts
admin: {
  useAsTitle: 'filename',
  listSearchableFields: ['filename', 'alt'],
  defaultColumns: ['filename', 'alt', 'updatedAt', 'mimeType'],
}
```

Why `useAsTitle: 'filename'` is approved:

- Payload already defaults upload collections to `filename` internally
- setting it explicitly is still useful because it makes the intent visible in repo code
- it keeps the first document title / first list column aligned with the actual uploaded file name

Why `listSearchableFields: ['filename', 'alt']` is approved:

- `filename` directly supports the user’s primary workflow of finding uploaded images by file name
- `alt` is the only custom Media field in the repo and provides useful secondary search context
- it is narrow and does not change any runtime or deletion semantics

Why `defaultColumns: ['filename', 'alt', 'updatedAt', 'mimeType']` is approved:

- `filename`: primary discovery field
- `alt`: secondary human-readable context
- `updatedAt`: useful for locating recent uploads/changes
- `mimeType`: low-risk extra operational context that helps distinguish file variants without widening scope

Why not add more columns now:

- `url` and `thumbnailURL` are noisy in list view and better handled in the document view
- `filesize`, `width`, and `height` can be useful later, but they are not required for the smallest safe Batch 2 improvement
- keeping the column set short preserves list readability

Small but important note:

- `useAsTitle: 'filename'` is largely declarative because Payload already treats upload collections that way by default
- the real functional gain in Batch 2 comes from `listSearchableFields` and the tighter `defaultColumns`
