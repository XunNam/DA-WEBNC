Final recommendation: GO WITH ADJUSTMENTS

Interpretation:

- cleanup is optional, not required
- if you choose to do anything, the maximum safe scope is very narrow

Approved maximum safe scope for a future cleanup execution turn:

- optional archive-first handling of `media/` only
- no permanent deletion in the first cleanup pass

Explicitly not approved:

- deleting `public/`
- archiving or deleting `public/`
- deleting `legacy/public/`
- archiving `legacy/public/` in this phase
- any code changes
- any relation or Media document changes

Why this recommendation is not a full GO:

- current app correctness does not require cleanup
- `legacy/public/` still has script/provenance value
- `media/` still has recovery value even if it appears redundant

Practical meaning:

- default safe choice: no-op
- if cleanup pressure exists, archive `media/` first and stop there
