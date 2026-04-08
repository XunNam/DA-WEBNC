# Errors And Root-Cause Hypotheses

## Failures

No route or redirect failures occurred during the successful smoke-test run.

## Non-Blocking Issues Observed

### Startup command nuance

- Observation:
  - `pnpm dev -- --hostname 127.0.0.1 --port 3000` failed before the successful smoke-test run
- Exact observed behavior:
  - `next dev` treated `--hostname` as an invalid project directory because the existing `dev` script already wraps `next dev`
- Impact:
  - Non-blocking for the smoke test
  - Did not affect the successful runtime verification once the equivalent direct command was used

## Ranked Root-Cause Hypotheses

### 1. Script argument passthrough mismatch

- Confidence: High
- Why:
  - The `dev` script is `cross-env NODE_OPTIONS=--no-deprecation next dev`
  - Passing `-- --hostname ...` through `pnpm dev` resulted in the literal `--` being forwarded to `next dev`

## Smallest Likely Fix Direction

- If this nuance needs cleanup later, prefer a very small follow-up that documents or standardizes the local smoke-test startup command
- Do not treat this as a runtime route regression

## Explicit Confirmation

- No code was changed in response to the startup-command nuance
- No runtime repair was attempted in this turn
