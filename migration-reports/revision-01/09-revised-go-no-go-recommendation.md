# Revised Go / No-Go Recommendation

## Recommendation
**GO WITH ADJUSTMENTS**

## Rationale
- The legacy dataset is small, bounded, and understandable:
  - `13` unique books after normalization
  - `8` unique authors
  - one structured homepage
  - `28` public assets with only one orphaned file
- That makes the migration feasible.
- However, the earlier draft was still too loose in four important areas:
  - speculative entities
  - missing extraction layer
  - editorial-safety handling
  - validation rigor

## Why This Is Not A Full `GO`
- `publishers`, `tags`, and a category collection were not actually justified by legacy evidence.
- The taxonomy meaning of `Truyện dài` is still ambiguous.
- Long-form legacy biography copy should not be treated as trusted content.
- The migration path is only safe if raw extraction and normalization are approved as mandatory steps before import.

## Exact Prerequisites Before Implementation Begins
- Approve the reduced v1 model:
  - `books`
  - `authors`
  - `homepage`
  - existing `media`
- Approve `typeLabel` as the v1 field for legacy book labels.
- Approve the decision to defer:
  - `publishers`
  - `tags`
  - `categories` collection
  - commerce entities
- Approve the price normalization rule for VND integer storage.
- Approve canonical normalized slugs with redirects from supported legacy routes.
- Approve the editorial-hold policy that keeps suspicious long-form copy out of Payload collections.
- Approve the media split:
  - book covers and author portraits into Payload `media`
  - logos and award icons kept static in code

## If These Adjustments Are Accepted
- The project is ready to move to:
  - schema sketches
  - extraction scripts
  - normalized review artifacts
  - dry-run validation
- It is **not** ready to jump straight to MongoDB import.

## If These Adjustments Are Not Accepted
- The recommendation becomes **HOLD**.
- Reason: any attempt to implement the migration without agreement on model boundaries, editorial safety, and normalization rules will reintroduce the same ambiguity this revision is meant to remove.
