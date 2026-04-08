# Summary

The safest solution is **not** a custom page.

Use the existing Payload Media collection admin and add only small admin enhancements:

- filename-first title/search/list columns
- optional explicit open/view affordance
- keep delete inside the Media collection flow

Deletion model:

- deleting a Book should **not** delete media
- deleting a Media document **should** delete the backing R2 object
- the installed cloud-storage plugin already wires Media `afterDelete` into the adapter delete path, so the first next step should be verification before adding any fallback hook

## Exact next recommended action

Implement **Batch 1 first**:

- verify that deleting a Media document removes the R2 object
- only add a Media-only fallback hook if that real test fails

Then implement **Batch 2**:

- small Media admin improvements in `src/collections/Media.ts`
- no custom admin page unless those improvements still prove insufficient later
