## Repair Outcome

- Attempted targeted repairs: `21`
- Successful in-place repairs: `21`
- Failures: `0`
- Duplicate Media docs created: `false`
- IDs preserved for repaired docs: `true`

## Post-Repair Object Counts

- `object-present`: `21`
- `object-missing`: `0`
- `manual-review`: `0`

## Identity Preservation

Every repaired Media document kept the same `id` before and after the upload/update operation. Relations from Books, Authors, Homepage, and SiteSettings therefore remained stable without any rewrite.

## Public Read-Back Verification

Cache-busted public checks succeeded for repaired assets:

- `cam-on-nguoi-lon.jpg`: `200`
- `canh-dong-bat-tan.jpg`: `200`

Evidence:

- [public-object-checks.json](D:/Đồ án/DA-WEBNC/migration-reports/r2-object-level-backfill-report-01/public-object-checks.json)

## Runtime Verification

Local startup and route checks after repair:

- `/`: `200`
- `/books`: `200`
- `/authors`: `200`
- `/authors/nguyen-nhat-anh`: `200`

Evidence:

- [route-verification.json](D:/Đồ án/DA-WEBNC/migration-reports/r2-object-level-backfill-report-01/route-verification.json)
- [startup-stdout.log](D:/Đồ án/DA-WEBNC/migration-reports/r2-object-level-backfill-report-01/startup-stdout.log)
- [startup-stdout-3002.log](D:/Đồ án/DA-WEBNC/migration-reports/r2-object-level-backfill-report-01/startup-stdout-3002.log)
