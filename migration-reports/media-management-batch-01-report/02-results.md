Initial probe result:

- test asset: `batch-01-test-image.png`
- created Media document:
  - `id`: `69ca5f9ada66f562abbb17c4`
  - `filename`: `batch-01-test-image.png`
  - `url`: `https://da-webnc-bookstore-media.xuannam.xyz/batch-01-test-image.png`
- before deletion:
  - plain URL returned `200` on three checks
- after Media deletion:
  - Media document was removed successfully
  - `findByID` returned `Not Found`
  - plain URL still returned `200` on five checks

Interpretation of the initial probe:

- the document delete itself worked
- the remaining plain-URL `200` response was suspicious, but not yet enough to prove R2 delete failure because the public custom-domain path can serve cached responses

Decisive cache-busted probe result:

- test asset: `batch-01-test-image-02.png`
- created Media document:
  - `id`: `69ca606ac0e2b6f594e302f6`
  - `filename`: `batch-01-test-image-02.png`
  - `url`: `https://da-webnc-bookstore-media.xuannam.xyz/batch-01-test-image-02.png`
- before deletion with cache-busting query strings:
  - `200`
  - `200`
- after Media deletion with cache-busting query strings:
  - `404`
  - `404`
  - `404`
- after deletion on the plain URL in the second probe:
  - `404`

Exact conclusion:

- deleting a Media document did remove the backing object from R2
- no fallback deletion hook is needed
- the only misleading result came from a cached plain-URL response in the first probe

Additional verification:

- `pnpm exec tsc --noEmit`: passed
- local startup check:
  - Next dev server started successfully
  - `GET /` returned `200`
  - evidence captured in `startup-stdout.log`
