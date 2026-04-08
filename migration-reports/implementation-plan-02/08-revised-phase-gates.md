# Revised Phase Gates

## Purpose

This document updates the implementation gates so the real code-writing phase cannot skip critical approvals or operational safeguards.

The goal is to make the next phase executable without allowing risky shortcuts.

## Gate 0: planning baseline approval

Before code-writing begins, the team must approve `migration-reports/implementation-plan-02/` as the final on-disk implementation baseline.

This gate specifically includes approval of:

- redirect artifact lifecycle
- `siteSettings` boundary
- `navLinks` remaining code-managed in v1
- `catalogVisible` semantics
- draft/public-read safety
- continued separation of runtime code, migration tooling, and review artifacts

If any of those points is reopened, code-writing should pause until the change is documented.

## Gate 1: schema boundary approval

Before schema code is written, the team must confirm the exact v1 scope:

- `books`
- `authors`
- `homepage`
- existing `media`
- minimal `siteSettings`

And confirm the exclusions:

- no `publishers`
- no `tags`
- no taxonomy collection
- no long-form biography copy in public author fields

This gate also includes approval of:

- `books.typeLabel`
- `books.catalogVisible`
- `books.price`
- `books.compareAtPrice`
- `authors.lifeDatesDisplay`
- `homepage.hero.featuredBook`
- `homepage.authorSpotlight.featuredAuthor`
- `siteSettings.defaultMetaTitle`
- `siteSettings.defaultMetaDescription`

## Gate 2: extraction plan approval

Before extraction tooling is written, the team must approve the raw artifact set.

Required raw artifacts:

- `migration-data/books.raw.json`
- `migration-data/authors.raw.json`
- `migration-data/homepage.raw.json`
- `migration-data/site-settings.raw.json`

This gate blocks implementation if there is any attempt to:

- import directly from TSX into Payload
- skip the raw artifact layer
- mix raw extracted data with normalized import inputs

## Gate 3: normalization and policy approval

Before normalization tooling is written, the team must approve:

- slug normalization policy
- price normalization policy
- asset classification policy
- `catalogVisible` assignment rules
- `siteSettings` normalization rules
- redirect policy ownership in `scripts/migration/config/redirect-policy.ts`

This gate also confirms that:

- `navLinks` stay out of normalized `siteSettings`
- footer links are only the stable subset
- social links start empty unless real URLs are approved

## Gate 4: redirect lifecycle approval

Before any redirect-consuming runtime code is written, the team must approve the redirect artifact lifecycle.

That means agreeing to:

- `scripts/migration/generate-redirect-artifact.ts` as the owning generator
- `migration-data/slug-map.json` as the source mapping artifact
- `migration-data/redirects.generated.json` as the only runtime-consumed redirect output
- `migration-data/redirects.manual-review.json` as the manual-review artifact
- commit reviewed redirect artifacts to the repo
- do not generate redirects during `dev`, `build`, or `start`
- `next.config.mjs` later falls back to `[]` if the artifact is missing

If this lifecycle is not approved, `next.config.mjs` must remain untouched.

## Gate 5: validation gate approval

Before dry-run code is written, the team must approve the validation rules and hard counts inherited from Revision-01.

Required checks:

- `books.raw.json = 17`
- `authors.raw.json = 17`
- `books.normalized.json = 13`
- `authors.normalized.json = 8`
- `assets-map.json = 28`
- 4 unique `typeLabel` values only
- 23 observed price strings parse successfully
- slug uniqueness across normalized entities
- hero-only book present with `catalogVisible = false`
- editorial holds separated from importable content
- redirect artifacts exist and match `slug-map.json`

## Gate 6: dry-run approval

Before the real import script is executed, the dry-run stage must pass and be reviewed.

Dry-run approval requires:

- no unresolved validation failures
- relationship targets resolvable
- media mappings complete for required book covers and author portraits
- `siteSettings` normalized output matches the approved boundary
- no held editorial content appears in importable records
- generated redirects reviewed and accepted

## Gate 7: import approval

Before real import execution, the team must explicitly approve:

- normalized artifacts as the only import source
- the current dry-run output
- the current `qa-report.json`
- the current redirect artifacts

If there are unresolved manual-review routes or editorial holds, they must be documented and accepted as deferred rather than silently ignored.

## Gate 8: frontend refactor approval

Before frontend code changes begin, all prior gates must pass.

Then the frontend rollout must follow the approved order:

1. homepage
2. catalog listing
3. author listing and author detail

And it must preserve the boundaries:

- keep `/books/[slug]` deferred
- keep current frontend untouched until backend confidence exists
- do not mix partial Payload reads with still-hard-coded sections in the same surface

## What blocks implementation

The following should block real code-writing until resolved:

- disagreement about redirect artifact lifecycle
- disagreement about `siteSettings` scope
- any attempt to move `navLinks` into `siteSettings` without new repo-driven evidence
- ambiguity about `catalogVisible` behavior
- ambiguity about whether public frontend reads may see drafts
- any plan that skips raw or normalized artifacts
- any attempt to add deferred entities into v1

## Final gate rule

The next code phase can begin only if all planning decisions above are accepted as locked implementation rules, not as open questions.
