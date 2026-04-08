# Revision-01 Executive Summary

## Outcome
- Revision-01 reduces the migration to the smallest stable v1:
  - `books`
  - `authors`
  - `homepage`
  - existing `media`
- It removes speculative entities from the earlier conceptual draft:
  - `publishers`
  - `tags`
  - `categories` collection

## Main Tightening Changes
- Added a mandatory raw-to-normalized extraction layer before any import.
- Locked deterministic rules for:
  - price parsing
  - slug generation
  - slug collision handling
  - redirect generation
- Separated suspicious legacy descriptive prose from publishable content.
- Refined the asset audit:
  - `28` public assets
  - `27` referenced
  - `1` orphan: `legacy/public/book-store.png`
- Added hard validation gates with exact expected counts.

## Final Recommendation
- **GO WITH ADJUSTMENTS**

## Recommended Next Action
- Begin the next phase only after the following are accepted:
  - reduced v1 model
  - `typeLabel` policy
  - slug and redirect policy
  - price normalization policy
  - editorial-hold policy
  - media split between Payload uploads and static code assets

## Important Reminder
- Do not import directly from JSX.
- Do not import suspicious long-form biography copy into public Payload content.
- Do not expand the schema beyond evidenced v1 requirements.
