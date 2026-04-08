# Bugs Fixed Or Notes

## Retained Code Changes

- None

No application source-code fix was retained from this final audit. The repo finished the audit in its original implementation state for this feature.

## Non-Blocking Notes

- `.next/types` nuance:
  - `pnpm exec tsc --noEmit` can fail if route types are stale
  - after `pnpm build` regenerated route types, the typecheck passed
- unrelated build warnings remain in non-feature files
- `pnpm start` emits a Node experimental SQLite warning only

## Audit-Harness Note

- During audit development, checking `body.textContent()` on Next pages proved misleading because inline flight/script payloads can still contain deleted order codes.
- Final delete/list assertions were therefore verified with visible page locators instead of raw `body.textContent()`.
- This was an audit-method note, not a repo bug.

## Temporary Audit Data Cleanup

- temporary local admin account was removed after verification
- temporary audit orders were removed during delete-flow verification
- final database check confirmed no remaining audit orders with the `final.lookup.audit.` email prefix
