The first migration execution turn should be audit/dry-run first, not a write pass.

Required pre-migration report contents:

1. Live Media document inventory
- total Media docs
- count by URL category:
  - R2-backed
  - local-path
  - missing-url
  - other

2. Local source availability
- count of candidate filenames found in [media](D:/Đồ án/DA-WEBNC/media)
- count of candidate assets resolvable through [assets-map.json](D:/Đồ án/DA-WEBNC/migration-data/assets-map.json) + [legacy/public](D:/Đồ án/DA-WEBNC/legacy/public)
- missing local source files, if any

3. Safety checks
- duplicate Media documents by filename
- duplicate candidate source files / ambiguous matches
- referenced vs unreferenced Media counts
- relation coverage across Books, Authors, Homepage, and SiteSettings

4. Planned action summary
- `skip-already-r2`
- `update-in-place`
- `create-missing`
- `manual-review`

Required post-migration report contents for a later real write pass:

1. counts
- updated documents
- created documents
- skipped documents
- failed documents

2. per-document results
- document ID
- filename
- previous URL category
- resulting URL
- source file used
- operation outcome

3. post-write verification
- fresh read-back of Media docs
- count of remaining non-R2 docs
- optional public URL spot checks for changed assets

Success criteria:

- every intended migration candidate ends with an R2-backed `url`
- no relation IDs change for updated-in-place docs
- no unexpected duplicate Media documents are introduced
- homepage/books/authors/site shell continue to resolve their related media through the same document IDs

Partial-failure detection:

- any missing local source file
- any duplicate filename collision
- any document still left in a non-R2 state after attempted migration
- any relation mismatch after write phase

Important current-state note:

- because the live audit already shows 21/21 Media docs are R2-backed, the first dry-run report may conclude:
  - no remaining document-level migration work required
- that is a valid and desirable outcome
