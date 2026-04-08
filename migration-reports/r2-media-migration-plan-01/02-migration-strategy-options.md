Option A: Payload-aware in-place update / upsert

Description:

- inspect existing Media documents first
- for each document that is still local-backed or missing a correct R2 URL, re-upload the local file through Payload using the existing upload lifecycle
- update the existing Media document in place when possible
- use `overwriteExistingFiles: true`

Why this is the safest option:

- preserves existing Media document IDs
- preserves all current relationships from Books, Authors, Homepage, and any future SiteSettings media references
- reuses the already-working Payload upload + R2 adapter path
- reuses the already-verified Media delete lifecycle
- avoids bypassing hooks/storage integration

Repo-grounded evidence supporting this path:

- the historical importer in [import-normalized.ts](D:/Đồ án/DA-WEBNC/scripts/migration/import-normalized.ts) already uses this pattern
- that importer matches by unique filename and updates the existing Media document in place with `filePath`
- [import-report.json](D:/Đồ án/DA-WEBNC/migration-data/import-report.json) shows `media.updated = 21`, which confirms the repo already has a stable rerun-safe in-place update pattern

Status:

- recommended

Option B: Direct object copy to R2 without going through Payload

Description:

- copy files straight from local disk to R2
- patch or rely on existing Media documents afterward

Why this is riskier:

- bypasses the Payload upload lifecycle
- increases the chance of object-key / document-state mismatch
- makes it easier to drift away from the currently verified delete lifecycle assumptions
- creates extra reconciliation work for URLs, filenames, and document metadata

Status:

- not recommended

Option C: Hybrid approach

Description:

- use direct file-copy for some files, but still patch documents through Payload

When it could be considered:

- only as a recovery path if a future audit finds local files that cannot be reliably reprocessed through the normal Payload upload path
- or if a subset of files exists only outside the known repo-grounded sources

Why it is still riskier than Option A:

- combines two state-management paths
- harder to review
- easier to introduce partial inconsistency

Status:

- not approved as the default migration strategy

Recommended strategy:

- use Option A only
- keep the migration Payload-aware and in-place
- skip any document that is already R2-backed
- do not replace documents unless a future audit proves a specific document cannot be repaired in place
