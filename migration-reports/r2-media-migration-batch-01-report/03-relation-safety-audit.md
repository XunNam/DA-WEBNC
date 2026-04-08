Relation safety audit completed in dry-run mode.

Referenced vs unreferenced:

- total Media docs: `21`
- referenced unique Media docs: `21`
- unreferenced Media docs: `0`

Relation coverage summary:

- Books: `13`
- Authors: `8`
- Homepage: `0`
- SiteSettings: `0`

Interpretation:

- Books and Authors account for all current Media relations
- Homepage currently does not directly reference Media docs in the live dataset
- SiteSettings currently does not directly reference Media docs in the live dataset
  - consistent with the current baseline where `navbarLogo` is `null`

Safety checks:

- duplicate Media docs by filename: `0`
- ambiguous local source matches: `0`

Relation safety conclusion:

- the current live relation graph is clean
- there is no evidence of relation churn risk from duplicate Media docs
- because every current Media doc is both referenced and already R2-backed, a write migration would add risk without benefit
