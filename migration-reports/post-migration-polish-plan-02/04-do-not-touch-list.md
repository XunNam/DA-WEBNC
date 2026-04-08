# Do-Not-Touch List

The next patch turn must stay narrow. The following should not be changed unless a true bug is discovered in a later turn.

## Stable Route Behavior

Do not touch merged route behavior for:

- homepage
- `/books`
- `/authors`
- `/authors/[slug]`

## Stable Published-Only Helpers

Do not touch these helpers unless a true bug is found later:

- `src/lib/getPublishedHomepageData.ts`
- `src/lib/getPublishedBooksData.ts`
- `src/lib/getPublishedAuthorsData.ts`

Do not consolidate them in the next patch turn.

## Global CSS

Do not touch global CSS in the next patch turn:

- `src/app/(frontend)/styles.css`

Even if some selectors look starter-specific, this is not worth the risk in the immediate next step.

## Metadata Scope

Do not broaden metadata work beyond:

- `src/app/(frontend)/layout.tsx`

That means:

- no route-level metadata refactors
- no siteSettings-driven metadata centralization
- no helper rewiring for metadata reuse

## Migration / Runtime Boundaries

Do not touch:

- schemas under `src/collections` or `src/globals`
- migration tooling
- import tooling
- redirect generation artifacts
- validation or dry-run behavior

## Protected Content Policies

Do not revisit:

- hero-only book policy
- withheld biography policy
- published-only public read policy
