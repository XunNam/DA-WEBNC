# Architecture Options

## Option A: Reuse the built-in Media collection admin

This is the current baseline.

What it already gives:

- upload UI
- list view
- edit view
- delete action
- built-in upload metadata
- built-in upload thumbnail/list behavior from Payload

Pros:

- no new admin architecture
- lowest implementation risk
- works with the current `media` collection and existing relations from `books`, `authors`, and `siteSettings`
- stays aligned with Payload’s native upload/document lifecycle

Cons:

- not yet optimized for filename-first discovery
- not yet explicit enough about “open original image” or R2 deletion expectations

## Option B: Small admin-side enhancement on the existing Media collection

This is the safest recommended path.

Likely improvements:

- set `admin.useAsTitle` to `filename`
- set `admin.defaultColumns` to filename-centric columns
- set `admin.listSearchableFields` to include `filename`
- optionally add a small preview/open affordance on the edit view
- keep delete inside the built-in Media collection flow

Pros:

- still fully Payload-native
- directly solves the user’s stated workflow
- small, reviewable scope
- no custom route or custom admin page required

Cons:

- does not provide a bespoke “asset library” UX
- does not add advanced bulk operations / usage analysis / orphan detection

## Option C: Build a custom admin page/view

This should not be the default recommendation here.

A custom admin page would only be justified if the repo needed capabilities that the built-in Media admin cannot reasonably provide, for example:

- cross-collection “where used” tracing
- orphan detection
- bulk cleanup tools
- custom moderation/review workflow
- advanced asset grouping beyond standard collection list view

None of those are required to satisfy the current ask.

## Recommendation

Recommend **Option B: reuse the existing Media collection admin and add only small admin enhancements**.

Why this is the safest option:

- the current repo already has a working upload collection
- Payload already provides the core CRUD and upload UI
- the user’s required workflow maps cleanly onto collection admin features
- the only confirmed lifecycle concern is delete behavior, and the adapter already integrates at the collection hook level

## Custom page approval status

Custom page is **not approved** at this stage.

The repo should only revisit a custom media-management page later if the native collection admin plus small enhancements proves insufficient after actual use.
