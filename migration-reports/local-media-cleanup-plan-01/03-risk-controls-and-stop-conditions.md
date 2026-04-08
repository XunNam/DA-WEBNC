Main risks if cleanup is done carelessly:

1. Breaking live runtime assets

- deleting or moving files from `public/` would break the current homepage award icons immediately

2. Breaking provenance / migration reproducibility

- deleting or moving `legacy/public/` would break the current extraction/normalization/import script assumptions
- it would also remove the most direct historical source tree for legacy asset provenance

3. Reducing recovery options too early

- deleting `media/` removes the easiest filename-matched local copy set for future repair/recovery, even though the live docs are already R2-backed

4. Confusing optional maintenance with required migration

- local file copies still existing on disk does not mean live Media documents still need migration
- forcing deletion “because they look redundant” is not justified by the current live audit

Stop conditions for any future cleanup execution turn:

- if the target directory contains any currently served runtime assets
- if any current scripts still depend on the target directory
- if archive destination/recovery expectations are not agreed first
- if a fresh read-only check shows new local upload behavior depends on the directory being present
- if the cleanup plan starts expanding beyond `media/` into `legacy/public/` or `public/`

What must block cleanup immediately:

- any proposal to touch `public/`
- any proposal to delete `legacy/public/`
- any proposal to permanently delete `media/` without an archive/quarantine step first

Risk-control rule:

- archive or no-op is acceptable
- direct deletion is not the first safe move
