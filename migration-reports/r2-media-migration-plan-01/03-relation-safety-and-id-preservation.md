Primary safety rule:

- preserve existing Media document IDs whenever possible

Reason:

- Books, Authors, Homepage, and any future SiteSettings media references depend on those Media document IDs
- live relation audit currently shows all 21 Media documents are referenced
- replacing documents unnecessarily would create avoidable relation churn and migration risk

Recommended update model:

- update existing Media documents in place
- do not create replacement documents for already-existing records
- only create a new Media document if a future audit finds a truly missing record that has a verified local source file and no safe in-place document to repair

Recommended matching strategy:

1. Existing Media document ID is the authoritative target for update.
2. Existing Media document `filename` is the primary stable lookup key for locating the local source file.
3. `migration-data/assets-map.json` is the provenance map for resolving legacy `assetPath` when needed.

Recommended local source resolution order:

1. [media](D:/Đồ án/DA-WEBNC/media) by exact filename
2. [assets-map.json](D:/Đồ án/DA-WEBNC/migration-data/assets-map.json) + [legacy/public](D:/Đồ án/DA-WEBNC/legacy/public) path resolution

Why this order is safest:

- the root `media/` directory currently has exact filename parity with the 21 live Media docs
- it is therefore the most direct file source for an in-place repair/migration of current Media records
- `legacy/public` remains the authoritative provenance fallback when a file is not present in `media/`

How the plan avoids breaking relations:

- no document replacement by default
- no ID churn
- no Book / Author / Homepage / SiteSettings relation rewrites when a Media document already exists

How the plan avoids duplicate media:

- skip any Media document already classified as R2-backed
- require filename uniqueness before any write phase
- halt and report if duplicate Media documents or ambiguous source files are found

How the plan handles already-R2-backed media:

- report and skip
- no rewrite
- no re-upload unless an explicit later maintenance need is proven

How the plan handles missing local files:

- record them in the dry-run report
- do not delete or replace the existing Media document automatically
- require manual review before any real migration write is attempted

Current-state implication:

- based on the live audit, the current dataset may already be fully migrated at the document level
- if a future dry-run confirms zero non-R2 Media documents, the correct migration outcome is a no-op report rather than a forced rewrite
