# Execution Plan Review

## Purpose

This document is the final tightening pass on the current backend/schema/tooling execution plan before real code-writing begins.

It keeps the approved v1 product scope and implementation sequence unchanged:

- `books`
- `authors`
- `homepage`
- existing `media`
- minimal `siteSettings`

It does not reopen deferred scope:

- no `publishers`
- no `tags`
- no taxonomy collections
- no frontend refactor
- no redirect consumption in `next.config.mjs`
- no real import

## What remains strong and should be preserved

The current execution plan is already strong in the following areas and these should remain unchanged:

- the six-phase backend-first sequence
- keeping migration tooling outside runtime app code
- preserving a mandatory raw artifact layer before normalization
- treating normalized artifacts as the only later import source
- keeping `catalogVisible` as a listing flag only
- keeping `navLinks`, logos, and award icons code-managed
- keeping suspicious long-form legacy prose out of public Payload fields
- deferring `/books/[slug]` and all frontend runtime switching

## What was still too implicit or risky

### 1. `publicPublishedRead`

The current execution plan tightened this from generic anonymous/public handling, but it still needed one final repo-specific clarification.

Actual repo evidence:

- `src/collections/Users.ts` has `auth: true`
- there is no roles field
- there is no second auth collection
- `tests/helpers/seedUser.ts` seeds a user directly into `users`
- `tests/e2e/admin.e2e.spec.ts` uses that `users` collection account to log into `/admin`

Risk:

- wording like `authenticated => true` is too broad if read literally because it sounds reusable beyond the current repo state
- that would be unsafe if a future non-admin auth model is added

Required tightening:

- full read should only be granted when `req.user?.collection === 'users'`
- all other cases should stay published-only
- the helper must be documented as repo-specific and not a generic authenticated-read helper

### 2. Site-wide metadata derivation

The current plan correctly proposed using legacy metadata as a normalization source for `siteSettings`, but it needed a stronger distinction between direct evidence and inference.

Actual repo evidence:

- direct evidence:
  - `legacy/src/app/layout.tsx` description: `Bookstore Website`
- inferred/repeated evidence:
  - `Bookstore | Trang chủ`
  - `Bookstore | Sách`
  - `Bookstore | Tác giả`
- weaker counter-signal:
  - author detail pages use `Tác giả | ...`, not `Bookstore | ...`

Risk:

- silently normalizing `siteName` or `defaultMetaTitle` as if they were authoritative would overstate the evidence

Required tightening:

- normalized site-settings output must preserve provenance/review status
- validation must warn about weakly evidenced inferred metadata
- inferred metadata stays acceptable for v1, but only as reviewable normalized output

### 3. Package manager assumptions

The earlier execution plan used `pnpm` examples. That needed to be explicitly justified from repo evidence rather than treated as convention.

Actual repo evidence:

- `pnpm-lock.yaml` exists
- `package.json` declares a `pnpm` engine
- the current `test` script calls `pnpm run`
- `.yarnrc` exists, but there is no `yarn.lock`

Required tightening:

- lock `pnpm` as the authoritative package manager for command examples
- keep script additions manual and explicit
- do not add lifecycle hooks or automatic import behavior

### 4. Dry-run rigor

The earlier execution plan correctly said the dry-run should be non-destructive, but it was still not precise enough operationally.

Risk:

- “Payload-shaped objects” alone is too loose
- that could drift from the real schema/config once implementation starts

Required tightening:

- dry-run must inspect the actual implemented `src/payload.config.ts`
- it must validate against the real collection/global config shape
- it must not call `getPayload`
- it must not initialize MongoDB or perform writes

### 5. `Media.ts` boundary

The earlier execution plan already leaned toward leaving `src/collections/Media.ts` alone, which is correct.

What needed tightening:

- “modify only if needed” must become stricter
- modification requires a concrete type/schema blocker, not preference

## Repo-specific conclusions

This tightening pass confirms:

- the current repo really does support a repo-specific access rule keyed off the `users` collection
- `pnpm` is the repo-proven package manager
- site-wide metadata needs review annotations, not silent authority
- dry-run must be config-aware and DB-free
- `Media.ts` should remain untouched unless a concrete blocker appears during implementation

## Result

After this revision, the execution plan is safer because the remaining ambiguity is concentrated into explicit operational rules rather than left to the implementer.
