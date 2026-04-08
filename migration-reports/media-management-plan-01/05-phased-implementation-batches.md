# Phased Implementation Batches

## Recommended batch count

Recommend **2 small batches**.

This keeps the highest-risk concern separate from the admin polish work.

## Batch 1: Delete lifecycle audit / guarantee

Scope:

- verify the current Media delete flow against R2
- confirm whether deleting a Media document removes the backing R2 object
- if and only if that fails, add the smallest Media-only fallback hook

Why this comes first:

- it addresses the main data-lifecycle concern
- it avoids polishing the admin UI before confirming the deletion model is correct

Likely files if a code change is actually needed:

- `src/collections/Media.ts`
- optionally one tiny Media hook file if a fallback hook is necessary

If verification passes with current adapter behavior:

- no lifecycle code change should be made

## Batch 2: Media admin usability enhancement

Scope:

- filename-first admin config only
- list/search/default-column improvements
- optional minimal open/view affordance

Likely file:

- `src/collections/Media.ts`

Why separate:

- lower risk than lifecycle work
- easy to review independently
- avoids mixing “R2 delete guarantee” with “editor convenience”

## Custom page batch

Not recommended now.

A custom page should only be considered after the two smaller batches are complete and only if the built-in Media collection admin still fails the real editorial workflow.
