# Book Schema And Admin Model Plan

## Current State Inspection Result

`src/collections/Books.ts` currently defines:
- `title`
- `slug`
- `author`
- `coverImage`
- `typeLabel` as a fixed `select` with four hard-coded values
- `catalogVisible`
- `price`
- `compareAtPrice`
- SEO fields from `createSEOFields()`

Current conclusion:
- admins cannot safely add new `typeLabel` values in Payload today
- `typeLabel` is display-only in the storefront and is not currently used for filtering or relationships
- existing stored values are plain strings, so a field-type relaxation is possible without data remapping

## Rich-Text Detail Field

Add a new optional field on `books`:
- field name: `detailContent`
- field type: `richText`
- admin label: `Tổng quan về sách`
- storage: on the existing `books` document in MongoDB through Payload

Placement in the admin form:
- keep the existing field order intact through pricing
- insert `detailContent` immediately after `compareAtPrice`
- leave SEO fields last

Reason:
- editors keep the main public-facing book content together in one place
- the SEO block remains untouched
- no new tab/group is required for v1

## `typeLabel` Handling

Current modeling:
- `typeLabel` is a `select`
- options are hard-coded in config
- admins can only choose the four existing legacy values

Smallest safe adjustment:
- keep the field name `typeLabel`
- change the field type from `select` to `text`
- keep it optional
- add a short admin description with the legacy examples so editors still see the previous conventions

Why this is the smallest safe change:
- existing values are already stored as strings
- no migration script is required
- generated TS types widen from a string-literal union to `string | null`
- storefront rendering already treats `typeLabel` as display text only
- this avoids introducing a new collection/global/relationship just to support editor-managed labels

What not to do in this feature:
- do not create a `genres` collection
- do not split `typeLabel` into multiple taxonomy fields
- do not rename the field

## Required Follow-Up After Schema Change

- run `pnpm generate:types`
- re-check `src/payload-types.ts` so `Book['detailContent']` and `Book['typeLabel']` match the new schema
- run `pnpm exec tsc --noEmit`

## Implementation Notes

- keep `catalogVisible` unchanged
- keep `price` and `compareAtPrice` unchanged
- no hook, access-control, or transaction changes are needed for this feature
