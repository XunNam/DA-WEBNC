Current built-in Media admin already covers most of the workflow:

- upload collections have a dedicated upload section in the edit view
- Media documents already carry `url`, `thumbnailURL`, and `filename`
- delete already happens through the built-in Media document flow
- Batch 1 already verified that deleting the Media document removes the backing R2 object

Safest Batch 2 plan for preview:

- rely on the built-in upload edit view for image preview
- do not add a custom preview component in the initial Batch 2 implementation

Safest Batch 2 plan for open/view original image:

- do not add a custom open-link affordance in the initial Batch 2 implementation
- first use the existing Media document view, which already has the upload-specific surface and stored file URL data
- if later manual review proves the original file is not easy enough to open from the built-in document UI, treat that as a separate follow-up, not part of the first Batch 2 patch

Safest Batch 2 plan for delete:

- keep delete behavior unchanged
- deleting a Media document remains the authoritative deletion flow
- do not add hooks
- do not add extra delete buttons or alternate delete paths
- do not change Book or Author deletion behavior

Answer to the key preview/open question:

- for the initial Batch 2 patch, the built-in upload edit view is sufficient
- no custom preview/open component is approved now

Reason:

- the user’s main gap is filename-first discovery in the admin list view
- preview/delete are already fundamentally present in the built-in Media flow
- adding a custom open/preview affordance now would broaden scope beyond the smallest safe fix
