Final recommendation: GO

Why:

- Batch 1 already validated the delete lifecycle
- the approved Batch 2 need is now purely admin usability
- the current repo supports a very small, reviewable solution in [Media.ts](D:/Đồ án/DA-WEBNC/src/collections/Media.ts)
- no custom page is required
- no delete semantics need to change

Maximum safe implementation boundary:

- [Media.ts](D:/Đồ án/DA-WEBNC/src/collections/Media.ts) only

Approved initial change set:

- `admin.useAsTitle = 'filename'`
- `admin.listSearchableFields = ['filename', 'alt']`
- `admin.defaultColumns = ['filename', 'alt', 'updatedAt', 'mimeType']`

Not approved in the initial Batch 2 implementation:

- custom media-management page
- Media-specific admin component work
- delete lifecycle changes
- Book or Author deletion changes
- any frontend/runtime change

If the built-in upload edit view later proves insufficient for opening the original file:

- treat that as a separate follow-up decision
- do not expand the initial Batch 2 patch automatically
