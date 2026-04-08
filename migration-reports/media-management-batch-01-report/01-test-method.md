Batch 1 used dedicated disposable test assets only:

- `migration-reports/media-management-batch-01-report/batch-01-test-image.png`
- `migration-reports/media-management-batch-01-report/batch-01-test-image-02.png`

Test method:

1. Create a tiny disposable PNG file locally inside the report folder.
2. Upload it through the real Payload `media` collection lifecycle using the Local API with `filePath`.
3. Record the created Media document `id`, `filename`, and public R2-backed `url`.
4. Confirm object existence before deletion by requesting the public URL.
5. Delete the Media document through the `media` collection using `payload.delete({ collection: 'media', id })`.
6. Confirm the Media document no longer exists by attempting `findByID`.
7. Confirm the backing object is gone by requesting the public URL after deletion.

Verification nuance:

- The first probe reused the plain public URL after deletion and still received `200`.
- A follow-up probe used cache-busting query parameters on the same public URL.
- Those cache-busted requests returned `404` after Media deletion, which indicates the object was removed from R2 and the earlier `200` was a cache artifact rather than a failed delete.

Evidence artifacts written during the test:

- `migration-reports/media-management-batch-01-report/verification-result.json`
- `migration-reports/media-management-batch-01-report/verification-result-cache-busted.json`
- `migration-reports/media-management-batch-01-report/startup-stdout.log`
- `migration-reports/media-management-batch-01-report/startup-stderr.log`
