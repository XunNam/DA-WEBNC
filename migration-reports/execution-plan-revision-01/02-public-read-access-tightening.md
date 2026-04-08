# Public Read Access Tightening

## Actual repo/user model

This recommendation is based on the current repo state, not on a generic Payload pattern.

### Confirmed facts

- `src/collections/Users.ts` is the only auth collection in the repo.
- `Users` has:
  - `slug: 'users'`
  - `auth: true`
  - no `roles` field
- `tests/helpers/seedUser.ts` creates a user directly in the `users` collection.
- `tests/e2e/admin.e2e.spec.ts` uses that seeded `users` document to access `/admin`.
- There is no second auth collection and no public customer/user model in scope.

## Why generic `authenticated => true` is too broad

The wording `authenticated => true` is unsafe as a general helper contract because it implies:

- any future authenticated principal would see drafts/full reads
- the helper could be reused accidentally if new auth collections are added later

That is broader than what the current repo evidence justifies.

The repo does justify admin/operator-style access through the current `users` collection, but it does not justify a generic “all authenticated users” rule.

## Safest v1 read strategy for `books` and `authors`

The recommended v1 rule for collection read access is:

1. If there is no authenticated user:
   - return published-only filter
2. If `req.user?.collection === 'users'`:
   - return `true`
3. For any other authenticated principal shape:
   - fall back to published-only filter

This preserves the approved public behavior while staying safely aligned with the actual repo.

## Recommended helper contract

The later helper in `src/access/publicPublishedRead.ts` should be documented as:

- a repo-specific helper for draft-enabled public collections
- safe for anonymous public reads
- permissive only for authenticated admin/operator users coming from the current `users` auth collection

It should not be described as a generic authenticated-access helper.

## Why this is acceptable in v1

This is acceptable for v1 because the current repo has:

- one auth collection only
- no public account model
- admin access flowing through that one collection

So the helper can safely treat the `users` collection as the current trusted operator context, while still remaining explicit that this assumption must be revisited if the auth model expands later.

## Interaction with later public frontend reads

Later public frontend reads should still behave as published-only by default.

That means:

- public visitors should normally read anonymously
- public runtime should not depend on draft-capable authenticated reads
- if a later Local API read passes a `user`, it must also pass `overrideAccess: false`

The future-safe model is:

- anonymous visitor => published-only
- admin/operator in admin or internal contexts => full read

## Relation to drafts

This access strategy works with the approved draft policy:

- `books`, `authors`, and `homepage` use drafts
- `siteSettings` does not use drafts

The access helper does not replace draft behavior. It only determines who can read beyond published content.

## What should be documented for future revision

If either of these happens later, the helper must be revisited before reuse:

- a second auth collection is added
- the `users` collection becomes multi-role or customer-facing

At that point, a more explicit role-aware strategy will be required.

## Final recommendation

The safest v1 recommendation is:

- anonymous => published-only
- authenticated full read only when `req.user?.collection === 'users'`
- any other authenticated shape => published-only

This is narrower and safer than `authenticated => true`, while still matching the actual repo today.
