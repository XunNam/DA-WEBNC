Local source availability was checked using the approved source-resolution order:

1. [media](D:/Đồ án/DA-WEBNC/media)
2. [assets-map.json](D:/Đồ án/DA-WEBNC/migration-data/assets-map.json) + [legacy/public](D:/Đồ án/DA-WEBNC/legacy/public)

Results for `media/`:

- directory exists: yes
- files present: `21`
- candidate filenames found for current Media docs: `21`
- missing filenames for current Media docs: `0`

Results for `assets-map.json` + `legacy/public/` fallback:

- payload-media-candidate assets in `assets-map.json`: `21`
- resolvable candidate assets on disk in `legacy/public`: `21`
- missing fallback asset paths: `0`

Ambiguity checks:

- duplicate or ambiguous asset-map filename matches: `0`
- missing source files for the current 21 Media docs: `0`

Conclusion:

- if a future residual repair were ever needed, every current Media filename is available from both approved local source paths
- no missing local source files block a future in-place repair path
