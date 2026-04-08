# Package Manager And Command Strategy

## Repo evidence

The package manager strategy should be based on actual repo evidence, not convention.

### Confirmed evidence

- `pnpm-lock.yaml` exists at repo root.
- `package.json` declares:
  - `"pnpm": "^9 || ^10"` in `engines`
- `package.json` already uses `pnpm` inside scripts:
  - `"test": "pnpm run test:int && pnpm run test:e2e"`
- `.yarnrc` exists, but there is no `yarn.lock`.

## Conclusion

`pnpm` is the authoritative package manager for this repo.

`.yarnrc` should be treated as non-authoritative project residue unless stronger evidence appears later.

## Revised command style

The next code phase should use `pnpm` consistently for examples and execution.

### Existing commands

- type generation:
  - `pnpm generate:types`
- import map generation if later needed:
  - `pnpm generate:importmap`
- TypeScript check:
  - `pnpm exec tsc --noEmit`
- tests:
  - `pnpm test:int`
  - `pnpm test:e2e`

### Proposed migration script style

If the next code phase adds script entries to `package.json`, they should be executed as:

- `pnpm migration:extract`
- `pnpm migration:normalize`
- `pnpm migration:redirects`
- `pnpm migration:validate`
- `pnpm migration:dry-run`

## Script-entry safety rules

Any future `package.json` additions should remain:

- manual
- explicit
- non-lifecycle

That means:

- do not add automatic import on `install`
- do not add automatic import on `build`
- do not add automatic import on `dev`
- do not add redirect generation as an implicit boot-time side effect

## Why this matters

Using the repo-proven package manager avoids ambiguity for:

- command documentation
- CI consistency
- local developer execution
- review of new migration scripts

It also keeps the next implementation phase aligned with the current repo’s own script conventions.

## Final recommendation

Lock the command strategy to `pnpm` for this project and keep future migration scripts opt-in through explicit `package.json` entries only.
