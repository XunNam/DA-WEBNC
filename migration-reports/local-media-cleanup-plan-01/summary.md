Cleanup is optional.

Current safest classification:

- [public](D:/Đồ án/DA-WEBNC/public): live runtime static assets, do not touch
- [legacy/public](D:/Đồ án/DA-WEBNC/legacy/public): provenance and migration-script source tree, leave untouched
- [media](D:/Đồ án/DA-WEBNC/media): residual local copy set and the only realistic future cleanup candidate

Safest recommendation:

- default to no-op
- if cleanup is desired later, use an archive-first approach for [media](D:/Đồ án/DA-WEBNC/media) only
- do not delete or move [legacy/public](D:/Đồ án/DA-WEBNC/legacy/public) or [public](D:/Đồ án/DA-WEBNC/public) in this phase

Exact next recommended action:

- either keep everything as-is
- or, in a separate future maintenance turn, plan an archive-first execution for [media](D:/Đồ án/DA-WEBNC/media) only with post-archive verification
