# Implementation Plan Review

## Baseline status

This document tightens the approved implementation-planning baseline before any code-writing starts.

- `migration-reports/revision-01/` exists on disk and remains the approved migration-analysis baseline.
- `migration-reports/implementation-plan-01/` does not exist on disk. For this reason, this revision treats the previously approved implementation-plan discussion as the draft baseline and makes `migration-reports/implementation-plan-02/` the first on-disk code-phase plan.
- The current runtime codebase is still the fresh Payload template:
  - `src/payload.config.ts`
  - `src/collections/Media.ts`
  - `src/collections/Users.ts`
  - `src/app/(frontend)/layout.tsx`
  - `src/app/(frontend)/page.tsx`
  - `src/app/(frontend)/styles.css`
- The current repo does not yet contain:
  - `src/globals/`
  - `src/access/`
  - `src/fields/`
  - `migration-data/`
- `scripts/` exists and is currently empty.
- `next.config.mjs` does not yet contain redirect artifact logic.

## What remains strong from the prior plan

The following parts of the prior implementation-plan discussion remain correct and should be preserved for the code phase:

- Keep the v1 content model intentionally small:
  - `books`
  - `authors`
  - `homepage`
  - existing `media`
  - minimal `siteSettings`
- Keep `publishers`, `tags`, and taxonomy collections deferred.
- Preserve legacy book labels in a single `typeLabel` field rather than expanding into a category collection.
- Keep suspicious long-form biography or descriptive prose out of public Payload content in v1.
- Keep logos and award icons static and code-managed in v1.
- Keep migration tooling outside runtime app code.
- Keep frontend refactoring staged after schema, extraction, normalization, validation, and dry-run confidence.
- Keep the hero-only book as a real `books` record instead of inventing a separate hero-only data model.

## What was still too implicit

The draft implementation plan was directionally correct, but the following areas were still too operationally loose for a safe code-writing phase.

### Redirect artifact lifecycle

The earlier plan said redirects should later be consumed from `next.config.mjs` by reading a generated artifact such as `migration-data/redirects.generated.json`. That was not yet enough to start coding safely.

The missing pieces were:

- which script owns redirect generation
- when the redirect artifact is generated
- whether it is committed or build-generated
- what happens if the file does not exist yet
- how generated redirects are reviewed
- how supported redirects are separated from unsupported manual-review routes
- how the redirect artifact is validated against `migration-data/slug-map.json`

This revision fixes that by defining a dedicated redirect generation step, dedicated artifact files, a validation requirement, and a safe fallback behavior in `next.config.mjs`.

### `siteSettings` scope boundary

The earlier plan correctly introduced `siteSettings`, but it needed a sharper boundary between editor-managed settings and code-managed site chrome.

What was underdefined:

- whether `navLinks` belong in `siteSettings`
- whether footer links are fully editor-managed or only the stable subset is
- how social links should behave when legacy icons exist but URLs do not
- whether logos and award icons remain static

This revision locks the v1 boundary:

- `navLinks` stay code-managed
- `footerLinks` are editor-managed only for stable real destinations
- `socialLinks` exist but start empty
- logos and award icons remain static/code-managed

### `catalogVisible` semantics

The earlier plan introduced `catalogVisible`, but the distinction between catalog behavior and content access still needed to be explicit.

The prior ambiguity was:

- whether `catalogVisible` hides a book from all public reads
- whether it behaves like draft/private access
- whether curated homepage references should automatically exclude hidden catalog items

This revision fixes that by defining `catalogVisible` as a listing-behavior flag only. It is not access control and not draft status.

### Draft and public-read safety

The earlier plan correctly preferred drafts for `books`, `authors`, and `homepage`, but the public-read behavior needed to be made safer and more explicit.

The missing decisions were:

- which entities use drafts in v1
- whether `siteSettings` should also use drafts
- whether public frontend code reads drafts by accident
- how preview could be added later without changing the public default

This revision locks a minimal safe posture:

- drafts enabled for `books`, `authors`, and `homepage`
- no drafts for `siteSettings` in v1
- public frontend reads published content only
- future preview, if added later, becomes an explicit authenticated opt-in

### Frontend sequencing

The prior plan correctly deferred most frontend changes, but the order and untouched boundaries still needed to be stronger.

The remaining weakness was the risk of unstable partial rollout, for example:

- switching a single homepage section to Payload while the rest of the page remains hard-coded
- adding redirect consumption before redirect artifacts exist
- introducing frontend catalog queries before `catalogVisible` logic is validated

This revision makes the boundaries explicit:

- leave the current frontend untouched until backend confidence exists
- switch the homepage as one coherent unit
- switch catalog listing second
- switch author listing/detail third
- defer `/books/[slug]` entirely in the first frontend refactor

## Decisions this revision preserves

The following are not reopened in this revision:

- no taxonomy collection in v1
- no `publishers` or `tags`
- no frontend refactor yet
- no import-from-TSX directly into Payload
- no one-shot migration
- no moving logos or award icons into Payload media

## Result of this tightening pass

After this revision, the implementation plan should be strong enough for the next phase to start writing code in a safe order because it now has:

- a deterministic redirect artifact lifecycle
- a strict `siteSettings` boundary
- explicit `catalogVisible` semantics
- a safe public-read draft policy
- stronger frontend staging boundaries
- a file map that clearly separates runtime code, migration tooling, and review artifacts
