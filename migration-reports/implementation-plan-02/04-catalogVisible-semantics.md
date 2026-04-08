# CatalogVisible Semantics

## Purpose

This document defines `catalogVisible` precisely so the next code phase can implement it consistently without turning it into an access-control system or a second draft mechanism.

## Definition

`catalogVisible` is a catalog-listing behavior flag on a real `books` record.

Semantic meaning:

- `true` means the book may appear in uncurated catalog-style listing surfaces
- `false` means the book should be excluded from default catalog-style listing surfaces

It does not mean:

- the book is private
- the book is unpublished
- the book cannot be referenced elsewhere
- the book is blocked from direct relationship-based use

## Why this field exists

The legacy homepage hero references a real book that does not belong in the main catalog listing used elsewhere in the old site.

The approved v1 behavior is:

- keep that hero-only book as a real `books` record
- set `catalogVisible = false`
- allow `homepage.hero.featuredBook` to reference it normally

This preserves one source of truth for book data without forcing the homepage to maintain duplicated book content.

## Exact v1 meaning

`catalogVisible` only controls participation in default browse/list queries.

It should be read as:

> Should this published book appear in general catalog listings by default?

That is the entire meaning of the flag in v1.

## Surfaces that must respect `catalogVisible`

The following uncurated or browse-style surfaces must filter to `catalogVisible = true`.

### Required filtering surfaces

- future `/books` catalog listing route
- any future "browse all books" listing query
- any future default catalog widgets that are derived from the full books collection without manual curation

If a surface is intended to show the default discoverable catalog, it must respect `catalogVisible`.

## Surfaces that must not auto-filter on `catalogVisible`

The following curated relationship-driven surfaces must not exclude a book only because `catalogVisible = false`.

### Curated surfaces

- `homepage.hero.featuredBook`
- future manually curated homepage or marketing relationships
- future editor-curated featured-book lists, if added later

Reason:

- curated surfaces exist precisely so editors can choose a record intentionally
- automatic filtering would make `catalogVisible` behave like hidden/private access, which is not its purpose

## Hero-only book behavior

The approved hero-only book behavior in v1 is:

- it exists as a normal book record in `books`
- it has a canonical slug like any other book
- it may have published status like any other book
- it is referenced from `homepage.hero.featuredBook`
- it is imported with `catalogVisible = false`
- it does not appear in the default `/books` listing

This gives the project one reusable book record instead of a one-off homepage-only object.

## Relation to future book detail pages

`catalogVisible` does not forbid future book detail lookup by slug.

If a public route such as `/books/[slug]` is added later, the team may still decide to allow direct access to a published book whose `catalogVisible = false`.

That is acceptable because:

- `catalogVisible` is not an access rule
- direct detail access and catalog discovery are different concerns

This detail page question remains deferred for the first frontend refactor because `/books/[slug]` is not yet part of the approved v1 frontend rollout.

## Relation to drafts

`catalogVisible` is not a draft substitute.

Differences:

- draft status controls whether unpublished changes should be publicly readable
- `catalogVisible` controls whether a published book participates in default catalog listings

Possible combinations later:

- published + `catalogVisible = true`
- published + `catalogVisible = false`
- draft + `catalogVisible = true`
- draft + `catalogVisible = false`

Only published status determines public publication readiness. `catalogVisible` only influences browse behavior.

## Relation to access control

`catalogVisible` is not access control.

It must not be used to:

- deny reads in collection access rules
- hide records from admin users
- create private/public permission tiers

Access control and published/draft rules should remain separate concerns.

## Recommended field behavior in schema planning

For the next code phase, the schema sketch should treat `catalogVisible` as:

- type: boolean
- required: yes
- default: `true`
- admin intent: content manager controls whether the book appears in catalog-style listings

Normalization/import rule:

- the hero-only book is explicitly imported as `catalogVisible = false`

## Validation requirements

Validation should confirm:

- the hero-only book exists in `books.normalized.json`
- the hero-only book has `catalogVisible = false`
- all normal catalog books default to `catalogVisible = true` unless explicitly reviewed otherwise
- dry-run catalog queries later exclude the hero-only book from browse results
- homepage hero relationship still resolves that book correctly

## Alternative considered: separate hero-book-only model

Alternative design:

- keep the hero feature as a separate homepage-only object instead of a real `books` record

Why it was rejected for v1:

- duplicates title/author/image identity data
- makes future promotion from hero to catalog harder
- weakens data integrity between homepage and catalog
- increases normalization complexity because the same legacy book would exist in two incompatible shapes

## Why the current choice is best for v1

Using a real `books` record with `catalogVisible = false` is the smallest clean solution because it:

- preserves a single source of truth
- keeps the schema small
- supports curated homepage references
- supports future evolution into book-detail pages if needed
- avoids inventing a second hero-only content model
