## What Is Intentionally Deferred

This fix does not add:

- webhook-based on-demand revalidation
- tag/path revalidation endpoints
- helper-level cache redesign

## Why That Is Deferred

The current issue was correctness, not optimization. The route-group dynamic fix is enough to stop production from serving stale build-time CMS output.

## Possible Future Refinement

If traffic or performance later makes per-request dynamic rendering too expensive, the next refinement can be:

- route-level timed revalidation, or
- Payload-triggered on-demand revalidation

That should be treated as a separate optimization turn, not part of this correctness fix.
