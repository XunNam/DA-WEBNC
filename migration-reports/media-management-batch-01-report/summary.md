PASS

Batch 1 verification passed.

Current adapter behavior already works for the approved deletion model:
- deleting a `media` document removes the backing object from Cloudflare R2
- no fallback lifecycle code was required

Important nuance from the verification:
- a plain repeated request to the same public URL can briefly return a cached `200`
- cache-busted requests to the same deleted object returned `404`, which is the reliable confirmation that the R2 object was removed

Code change required:
- no

Exact next recommended action:
- proceed to Batch 2 only if desired, limited to Media admin usability improvements
- do not add any Media delete fallback hook now, because Batch 1 proved the current adapter lifecycle is already sufficient
