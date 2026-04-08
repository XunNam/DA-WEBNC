Current local file-state classification:

## `media/`

Observed state:

- contains `21` image files
- filenames match the current `21` live Media documents exactly
- those live Media documents are already fully R2-backed
- current code search found no active frontend/runtime source references to the `media/` directory itself

Classification:

- residual local upload/source copies
- not current live runtime assets for the public site
- retains short-term recovery value because it mirrors the current Media document filenames exactly

Important nuance:

- the S3 storage plugin marks upload collections with `disableLocalStorage: true`, which supports the conclusion that live Media delivery is no longer meant to come from local upload storage
- even so, `media/` should still be treated cautiously because it is the collection’s conventional local upload/static directory name and remains a convenient repair/recovery copy set

## `legacy/public/`

Observed state:

- contains the original legacy asset tree:
  - `legacy/public/author`
  - `legacy/public/books`
  - `legacy/public/home`
- also contains legacy shell/static assets such as:
  - `site-logo.svg`
  - `site-logo-white.svg`
  - `hyper-best.svg`
  - `mega.svg`
  - `ultra.svg`
  - `ultimate-winer.svg`
  - `book-store.png`

Classification:

- provenance/history source tree
- migration-script input
- mixed content:
  - 21 Payload-managed source assets
  - static-code-managed legacy assets
  - one manual-review orphan asset (`book-store.png`)

Why it is not just “redundant media”:

- the current migration scripts explicitly reference `legacy/public`
- `assets-map.json` is built from and interpreted against this legacy source tree
- even files not used by the current runtime still retain provenance and recovery value

## `public/`

Observed state:

- currently contains:
  - `hyper-best.svg`
  - `mega.svg`
  - `ultra.svg`
  - `ultimate-winer.svg`
- these are actively referenced by the current frontend homepage route

Classification:

- live runtime static code-managed assets
- must not be deleted or archived as part of local media cleanup

## Summary classification

- `media/`: residual local source/copy directory and the only realistic cleanup candidate
- `legacy/public/`: provenance + migration-input + legacy static asset source; leave untouched in this phase
- `public/`: active runtime static asset directory; never delete in this phase
