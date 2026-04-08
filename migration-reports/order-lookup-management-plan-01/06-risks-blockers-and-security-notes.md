# Risks, Blockers, And Security Notes

## Repo Facts To Rely On

- `orders` already stores all snapshot fields needed for public lookup and admin detail
- checkout already trims customer fields before persisting
- current trusted admin auth collection is `users`
- Payload admin login already supports `redirect`
- server-side session detection is available via `payload.auth({ headers })`

## Security And Privacy Notes

- public lookup must not reveal whether only the order code was valid
- both business failure cases must share the same outward message and toast behavior
- public lookup must not return email, phone number, internal IDs, or internal-only fields
- public lookup should manually shape responses
- admin Local API calls must use `overrideAccess: false` when a `user` is provided
- admin delete must re-check auth in the API route
- no public endpoint should return raw order docs

## Locked Comparison Clarification

Compare `fullName`, `phoneNumber`, and `email` with exact case-sensitive equality after trimming leading/trailing whitespace only.

- do not lowercase
- do not normalize phone format
- do not collapse internal whitespace

## UX Boundary Clarification

The shared bottom-corner popup/toast with message `Không tìm thấy đơn hàng` is reserved for the two locked business failure cases only.

Keep these separate:

- malformed request or missing-field handling => local validation or local error state
- unexpected server failure => separate local error state

## Likely Risks

- accidentally lowercasing or normalizing lookup fields and breaking the locked exact-match rule
- using the not-found toast for malformed request or server failure
- leaving stale lookup results visible after a failed request
- implementing admin guard on the client instead of the server
- exposing edit semantics in the new admin frontend flow
- unpaginated admin list may need pagination later if order volume grows

## Non-Blocking Defaults

- no navbar/footer link changes
- no admin pagination in v1
- no global toast system
- no rate limiting in v1 unless a real repo-level hook appears during implementation
