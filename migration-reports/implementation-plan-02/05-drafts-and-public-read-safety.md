# Drafts And Public Read Safety

## Purpose

This document defines the minimal safe draft policy for v1 and the public-read defaults that should be preserved when the frontend later starts reading Payload data.

The goal is to gain editorial safety without accidentally exposing drafts to public visitors.

## V1 draft policy by entity

### `books`

- enable drafts

Reason:

- editors need a safe way to review migrated book records before publishing changes
- book records are public-facing and likely to receive incremental cleanup after import

### `authors`

- enable drafts

Reason:

- author records may need editorial cleanup, especially around names, life-date formatting, and withheld long-form copy
- drafts provide a safe buffer for edits without publishing unfinished changes

### `homepage`

- enable drafts

Reason:

- homepage content is high-visibility and likely to need review before publication
- drafts let editors assemble and test homepage changes safely

### `siteSettings`

- do not enable drafts in v1

Reason:

- `siteSettings` is intentionally minimal
- v1 only needs stable global text/link settings
- adding drafts here increases operational complexity without proportional benefit
- the first rollout does not need previewable alternate site-settings states

## Public-read default behavior

When the frontend later starts using Payload data, public runtime reads must default to published-only content.

The intended posture is:

- anonymous or public frontend visitors see only published `books`
- anonymous or public frontend visitors see only published `authors`
- anonymous or public frontend visitors see only published `homepage`
- `siteSettings` can be read normally because it does not use drafts in v1

## Local API safety rule

When later runtime code passes a `user` object to the Local API, it must also set:

- `overrideAccess: false`

This is a Payload security requirement and must remain explicit in the implementation plan.

For public or anonymous reads, the later runtime helper should enforce safe defaults instead of relying on implicit behavior.

Recommended later helper behavior:

- `draft: false`
- `overrideAccess: false`

This keeps public reads intentionally published-only and prevents accidental bypass when authenticated or preview-like flows are added later.

## Minimum safe posture before preview exists

The first frontend refactor should consume only published content.

That means:

- no public draft reads
- no preview route
- no draft query parameter behavior
- no special frontend fallback to draft documents

This is the safest rollout because the first Payload-backed frontend should behave like a normal public site, not a preview tool.

## Why drafts still help even without preview

Drafts are still useful in v1 even if public preview is deferred because they give editors:

- a safe workspace for content cleanup
- controlled publishing for homepage changes
- a way to stage migrated content before it becomes public

This is a small increase in schema complexity with clear editorial value.

## How preview could be added later

A future preview path can be added later as an explicit authenticated feature.

That later addition should:

- be separate from public browsing
- opt into draft reads intentionally
- not change the default public query behavior

This means the current decision does not block future preview work, but also does not require preview complexity now.

## What this means for the first frontend refactor

When the frontend is later switched from hard-coded content to Payload reads:

- homepage uses published `homepage` content only
- catalog listing uses published `books` only
- author listing/detail uses published `authors` only
- `siteSettings` is read directly because it has no drafts

The first refactor should not mix public pages with draft-aware logic.

## Validation expectations

Before public frontend code is allowed to read Payload data, the implementation should be reviewed to confirm:

- drafts are enabled only on `books`, `authors`, and `homepage`
- `siteSettings` has no drafts in v1
- public read helpers default to published-only reads
- any Local API call that passes a `user` also sets `overrideAccess: false`
- no public route is configured to read drafts implicitly

## Final v1 policy

V1 uses drafts for the content entities that benefit from editorial staging, keeps `siteSettings` simple, and requires public frontend reads to consume published content only. Preview, if added later, must be an explicit separate path rather than a side effect of normal public reads.
