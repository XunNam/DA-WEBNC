# Dry-Run Rigor Plan

## Purpose

This document makes the dry-run stage operationally precise enough for the next code phase to implement it safely.

The dry-run must be:

- config-aware
- non-destructive
- deterministic
- strict enough to catch schema/artifact drift before any real import exists

It must not be a loose “Payload-shaped object” exercise.

## Core rule

The dry-run must validate normalized artifacts against the **real implemented Payload config** without initializing Payload itself against MongoDB and without writing any documents.

## What the dry-run should import

The dry-run should import the actual runtime config module:

- `src/payload.config.ts`

Repo-specific note:

- current test code already shows this config may be imported as an awaited value
- the dry-run should therefore support resolving either a direct config object or an awaited default export

The dry-run should inspect:

- configured collections
- configured globals
- field names
- required fields
- select options
- relationship targets
- upload targets
- draft/global configuration expectations

## What the dry-run must not initialize

The dry-run must not:

- call `getPayload`
- initialize the Local API
- connect to MongoDB
- perform any create/update/delete
- simulate writes by touching live content

This remains a schema-aware validation and import rehearsal, not an API execution step.

## What the dry-run should validate structurally

### Collection and global existence

Confirm that the implemented config contains the expected runtime targets:

- `books`
- `authors`
- `homepage`
- `siteSettings`
- `media`

### Field-shape validation

Validate that normalized artifacts map cleanly onto the actual configured fields.

Examples:

- books contain required `title`, `slug`, `author`, `coverImage`, `typeLabel`, `catalogVisible`
- authors contain required `name`, `slug`, `portrait`
- homepage sections map to the configured group/array structure
- site settings map only to approved fields and exclude `navLinks`

### Select-value validation

Validate that all normalized `typeLabel` values are within the actual configured allowed options:

- `Tiểu thuyết`
- `Truyện ngắn`
- `Truyện dài`
- `Truyện thơ`

### Relation-target validation

Resolve relationships in memory using normalized keys and artifact maps.

Examples:

- each book’s `author` resolves to a normalized author record
- each book’s `coverImage` resolves through the normalized asset map
- homepage hero book resolves to a normalized book
- homepage author spotlight resolves to a normalized author
- homepage best-seller rows resolve to normalized books

### Draft configuration expectations

Confirm that the implemented config matches the approved draft policy:

- drafts enabled for `books`
- drafts enabled for `authors`
- drafts enabled for `homepage`
- no drafts for `siteSettings`

### Editorial safety checks

Confirm that suspicious long-form content remains outside importable normalized public fields and is isolated in:

- `migration-data/editorial-holds.json`

## Import simulation model

The dry-run should simulate the later import plan in memory.

That means it should build candidate operation payloads for:

- `books`
- `authors`
- `homepage`
- `siteSettings`

But those payloads should remain plain in-memory objects paired with validation results.

Recommended mental model:

- “If `import-normalized.ts` later attempted to create these records, would the normalized data structurally fit the actual config?”

It should not try to approximate database IDs or execute Local API calls.

## Failure conditions

The dry-run should fail if any of the following is true:

- required configured field missing from a normalized record
- normalized field not present in the real schema where it is expected
- invalid `typeLabel`
- unresolved author/book/media relationship
- homepage references a missing normalized target
- `catalogVisible` missing on a book record
- hero-only book is missing or not marked `catalogVisible = false`
- normalized content includes text that should only live in `editorial-holds.json`
- `siteSettings` normalized output includes disallowed v1 fields such as `navLinks`
- artifact shape and schema expectations drift out of sync

## Warning conditions

The dry-run may emit warnings, without failing, for:

- weakly evidenced site-wide metadata candidates
- optional values omitted where legacy evidence was absent
- placeholder/manual-review redirect routes that are correctly excluded from runtime redirect output

Warnings should be reflected in `migration-data/qa-report.json`.

## Relation to validation

Validation and dry-run should be separate but complementary:

- validation enforces counts, deterministic rules, redirect integrity, and artifact completeness
- dry-run enforces runtime-schema compatibility using the actual implemented config

Validation answers:

- “Are the artifacts internally correct?”

Dry-run answers:

- “Would these artifacts fit the actual configured Payload runtime objects?”

## Non-destructive posture

The dry-run remains non-destructive because it:

- imports config only
- inspects schema definitions only
- resolves artifact references in memory only
- writes only review output if needed
- never initializes Payload against the database

## Final recommendation

Implement the dry-run as a config-aware validator/import simulator that reads normalized artifacts, imports the actual Payload config, checks structural compatibility in memory, and fails loudly on schema or relation drift without touching MongoDB or live Payload content.
