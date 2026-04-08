# Failure Toast And Result UX Plan

## Failure Toast Behavior

- keep the toast local to `LookupPageClient.tsx`
- do not add a global toast system
- render as a fixed bottom-right card
- include a close button
- include `role="alert"`
- auto-hide after 5 seconds
- reset the timer on repeated business failures

## Locked Identical Failure Messaging Rule

The shared bottom-corner popup/toast with message:

- `Không tìm thấy đơn hàng`

applies only to these two locked business failure cases:

- order code not found
- order code exists but the other 3 fields do not match

The server may still internally perform the checks in order, but the outward business-failure result must stay identical.

## Non-Business Failure Handling

Malformed request or missing-field handling stays local:

- client-side field validation where possible
- local submit error state if the API returns `400`

Unexpected server failure stays separate:

- local non-toast error state for `500`

The client must not use the shared not-found toast for validation failures or unexpected server failures.

## Success Rendering Behavior

Render success results inline on `/lookup`, below the form.

Show:

- order code
- customer name
- shipping address
- created date/time
- total amount
- item list with image, title, quantity, unit price

Formatting:

- use the shared VNĐ currency formatter for price fields
- format `createdAt` locally with `Intl.DateTimeFormat('vi-VN', ...)`

## Page States

- initial: form only
- loading: submit disabled, loading label shown
- success: render shaped order result below the form
- business failure: toast only
- malformed request: local validation/local error only
- server failure: local error only

## Stale-State Rule

A new submit must clear any previous success result before awaiting the next response so stale order data never remains visible after a failed lookup.
