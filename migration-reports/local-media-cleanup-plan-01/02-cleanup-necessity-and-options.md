Cleanup is not necessary for application correctness right now.

Current repo evidence:

- live Media documents are already fully R2-backed
- no current Media documents still point at local URLs
- public runtime assets in `public/` are separate and still required
- `legacy/public/` is still used by migration/provenance scripts

This makes local media cleanup optional maintenance, not required remediation.

## Option A: Keep local copies as-is

Pros:

- zero risk to recovery/provenance
- no chance of breaking hidden maintenance workflows
- no effort required now

Cons:

- leaves redundant-looking files in the repo
- keeps residual clutter around `media/`

Assessment:

- safest default if there is no urgent need to reduce local repo clutter

## Option B: Archive local copies out of active repo/runtime paths

Pros:

- reduces active-path clutter without immediate deletion
- preserves recovery value
- reversible

Cons:

- still requires careful review of which directories are safe to archive
- can break maintenance scripts if the wrong directory is moved

Assessment:

- safest active cleanup option, but only for the right target directory

## Option C: Delete clearly redundant copies

Pros:

- simplest end state

Cons:

- highest irreversible risk
- easy to remove provenance or recovery material prematurely
- too aggressive for the current level of uncertainty

Assessment:

- not recommended now

## Option D: Mixed approach

Recommended mixed approach:

- keep `public/` untouched
- keep `legacy/public/` untouched
- if cleanup is desired at all, archive `media/` first instead of deleting it

Why this is the safest option:

- `public/` is live runtime
- `legacy/public/` still has provenance and script-input value
- `media/` is the only directory that currently looks like pure residual copy material relative to the live R2-backed dataset

Recommended option:

- Option D

Important conclusion:

- cleanup is optional, not necessary
- if no repo-size or housekeeping pressure exists, “keep everything for now” remains a valid conservative choice
