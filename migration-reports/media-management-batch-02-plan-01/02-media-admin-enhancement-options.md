Current repo state:

- [Media.ts](D:/Đồ án/DA-WEBNC/src/collections/Media.ts) is still minimal and has no `admin` config
- Payload already injects upload base fields for upload collections, including `filename`, `url`, `thumbnailURL`, `mimeType`, `filesize`, `width`, and `height`
- Payload also already defaults upload collections to `filename` as the admin title when `useAsTitle` is not set
- Batch 1 already proved that the existing Media document delete flow removes the backing R2 object

Option A: Reuse the built-in Media admin with one-file config only

- Add explicit `admin.useAsTitle`
- Add `admin.listSearchableFields`
- Add `admin.defaultColumns`

Assessment:

- smallest change
- fully inside the approved scope
- directly improves filename discovery
- keeps preview/edit/delete inside the built-in Media collection flow

Status:

- approved now

Option B: Small admin enhancement beyond config, such as a custom open/preview affordance in the edit view

Assessment:

- only justified if the built-in upload edit view proves insufficient during implementation
- introduces extra component surface and import-map/admin customization work
- no current repo evidence shows this is necessary for Batch 2

Status:

- not approved for the initial Batch 2 implementation
- may be reconsidered later only if the one-file config change proves insufficient in real use

Option C: Custom media-management page

Assessment:

- much broader than needed
- duplicates built-in Payload collection capabilities
- violates the approved architecture direction

Status:

- rejected

Recommended Batch 2 architecture:

- stay inside [Media.ts](D:/Đồ án/DA-WEBNC/src/collections/Media.ts)
- make filename-first list/search improvements only
- rely on the existing built-in upload document UI for preview/edit/delete

Custom page decision:

- still rejected
