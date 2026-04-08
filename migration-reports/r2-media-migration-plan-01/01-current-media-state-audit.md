Current live Payload media state:

- the `media` collection is an upload collection in [Media.ts](D:/Đồ án/DA-WEBNC/src/collections/Media.ts)
- Cloudflare R2 is wired through the official S3-compatible adapter in [payload.config.ts](D:/Đồ án/DA-WEBNC/src/payload.config.ts)
- live audit of the database shows:
  - `media.totalDocs = 21`
  - all 21 current Media documents have `url` values under the configured R2 public/custom-domain base
  - no current Media documents were classified as local-path or missing-url
- relation audit shows:
  - all 21 Media documents are currently referenced
  - `books.totalDocs = 13`
  - `authors.totalDocs = 8`
  - no unreferenced/orphan Media documents were found in the current live dataset
- current `siteSettings.navbarLogo` is `null`, so SiteSettings does not currently add an extra media relation beyond the shell-safe data already in use

Current local asset/source locations:

1. Legacy provenance source:
- [legacy/public](D:/Đồ án/DA-WEBNC/legacy/public)
- contains the original legacy asset folders:
  - `legacy/public/author`
  - `legacy/public/books`
  - `legacy/public/home`
- also contains static-code-managed SVG/logo assets that were intentionally excluded from Payload media import

2. Local upload-copy directory:
- [media](D:/Đồ án/DA-WEBNC/media)
- contains 21 image files
- those 21 filenames match the 21 current Media document filenames exactly

3. Current runtime public directory:
- [public](D:/Đồ án/DA-WEBNC/public)
- contains only the static code-managed SVG assets still used outside the Media collection

Migration artifact evidence:

- [assets-map.json](D:/Đồ án/DA-WEBNC/migration-data/assets-map.json) contains 28 assets total:
  - 21 `payload-media-candidate`
  - 6 `static-code-managed`
  - 1 `manual-review`
- [import-report.json](D:/Đồ án/DA-WEBNC/migration-data/import-report.json) shows:
  - `candidateAssets = 21`
  - `importedAssets = 21`
  - `media.updated = 21`
  - `media.created = 0`

Important current-state conclusion:

- there is no evidence of any remaining live Media documents that still point at local/pre-R2 URLs
- the live database already appears fully R2-backed for the 21 Payload-managed media assets
- the remaining “local media” in the repo currently appears to be residual source/copy material on disk, not live Media documents still serving local URLs

Implication for planning:

- a future migration execution turn must start with a dry-run audit
- that turn may legitimately end as a no-op if no residual non-R2 Media documents are found
