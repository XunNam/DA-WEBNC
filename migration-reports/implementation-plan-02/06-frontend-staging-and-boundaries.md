# Frontend Staging And Boundaries

## Purpose

This document defines the strict frontend boundaries for the next code phase and the later staged rollout order for replacing hard-coded content with Payload reads.

The goal is to avoid unstable hybrid states while the backend content model and migration tooling are still becoming reliable.

## Files that must stay untouched until backend confidence exists

The following files must remain untouched until all of these backend stages pass:

- schema sketch implementation
- raw extraction
- normalization
- validation
- dry-run import

Untouched files:

- `src/app/(frontend)/layout.tsx`
- `src/app/(frontend)/page.tsx`
- `src/app/(frontend)/styles.css`
- `next.config.mjs`
- `tests/e2e/frontend.e2e.spec.ts`

Reason:

- changing these files earlier would couple frontend behavior to incomplete migration data
- redirect consumption should not land before redirect artifacts are reviewed
- the first frontend switch should happen only after the data model is stable enough to support it

## Frontend rollout sequence

### Stage 1: keep current frontend as-is

Before backend confidence exists, do not attempt partial Payload reads in frontend runtime code.

That means:

- do not switch a single homepage section early
- do not add half-finished catalog queries
- do not introduce redirect consumption in `next.config.mjs`
- do not introduce book or author route changes yet

### Stage 2: switch the homepage as one coherent unit

The first frontend surface to switch should be the homepage.

Why homepage first:

- its data model is tightly defined by the approved `homepage` global
- it proves hero, spotlight, best-sellers, awards, newsletter CTA, and `siteSettings` integration together
- it exercises curated relationships without requiring broad catalog browsing logic

Important boundary:

- switch the homepage as a complete surface
- do not replace it section-by-section with a fragile mix of old hard-coded and new Payload-driven sections

### Stage 3: switch catalog listing

The second surface should be the catalog listing route:

- `src/app/(frontend)/books/page.tsx`

Requirements before switching:

- `books` collection exists
- `catalogVisible` behavior is implemented and validated
- book covers are available in Payload media
- price normalization is validated

This route is where `catalogVisible = true` filtering becomes operationally important.

### Stage 4: switch authors listing and detail

The third switched surfaces should be:

- `src/app/(frontend)/authors/page.tsx`
- `src/app/(frontend)/authors/[slug]/page.tsx`

Requirements before switching:

- normalized author slugs validated
- author portraits available in Payload media
- long-form unsafe copy still excluded from public fields
- author summaries and metadata are available in approved publishable form

## Routes that remain deferred

### `/books/[slug]`

This route should remain deferred in the first frontend refactor.

Reason:

- the legacy site does not provide a mature book-detail route to migrate directly
- the approved v1 plan does not require it to complete the first content migration
- adding it early increases scope and introduces detail-page decisions that are not required for the first safe rollout

### Other non-approved routes

Also defer:

- any checkout/cart/account behavior
- any blog-like route additions
- any preview route
- any frontend route that depends on deferred entities

## How to avoid unstable hybrid states

The main rollout risk is mixing partial Payload reads with still-hard-coded UI in a way that hides integration errors.

To avoid that:

- migrate one surface at a time
- switch each surface coherently
- do not leave a single page split between two different content sources unless there is a strong reason
- keep data dependencies small and explicit for each stage

Recommended practical rule:

- a surface is not switched until its primary content dependencies are already validated by the dry-run stage

## Why the homepage goes first

Switching the homepage first is safer than switching catalog or author routes first because:

- its structure is already modeled as a single global with curated relations
- it avoids exposing broad collection queries too early
- it validates the core relationship flow between `homepage`, `books`, `authors`, and `siteSettings`

## Why catalog goes second

Catalog listing depends on more operational pieces:

- collection query behavior
- `catalogVisible`
- normalized prices
- cover-image media relationships

That makes it the correct second surface rather than the first one.

## Why authors go third

Author pages depend on:

- canonical slugs
- author portraits
- safe public copy
- redirect coverage for legacy author routes

That is a larger dependency set than the homepage and should come after the catalog and redirect groundwork is ready.

## Final frontend boundary for this planning phase

This planning pass does not implement frontend changes. It only defines the order and the stop conditions so the next code phase does not begin refactoring runtime UI before backend migration confidence exists.
