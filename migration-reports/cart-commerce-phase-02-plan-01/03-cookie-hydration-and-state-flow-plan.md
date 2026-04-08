## Initial Cookie Read Strategy

Locked server-side flow:
1. keep `src/app/(frontend)/layout.tsx` as a server component
2. read the raw cookie with `cookies()` from `next/headers`
3. parse and sanitize that raw value with shared cart utilities
4. pass the resulting `initialCart` into `CartProvider`

Reason:
- the existing frontend layout is already `force-dynamic`
- server-side cookie read allows the navbar summary to render correctly on first page load

## Server / Client Boundary

Locked boundary:
- layout remains server-rendered
- `CartProvider` is the smallest new client boundary
- navbar summary is a client child inside the existing server navbar

Do not do:
- convert the entire frontend layout to a client component
- convert footer or public route pages to client components for cart state
- rework the existing Payload-backed shell helpers

## Provider Initialization Flow

Locked flow:
1. server layout computes sanitized `initialCart`
2. `CartProvider` receives `initialCart` as prop
3. provider initializes internal state directly from `initialCart`
4. `CartSummary` reads provider state immediately

## Cookie Writeback Flow

Locked update rule:
- do not use a generic `useEffect` to mirror state into cookies
- each provider action must:
  1. build next cart state
  2. sanitize it
  3. commit provider state
  4. immediately write the cookie with `document.cookie`

`clearCart()` rule:
- it must expire the cookie
- it must not leave a stale empty payload cookie behind

## Malformed / Invalid Cookie Handling

Locked degradation rules:
- invalid JSON => empty cart
- invalid version => empty cart
- non-array `items` => empty cart
- invalid items => dropped during sanitize
- duplicate `bookId`s => merged
- invalid or missing numeric `price` => item dropped
- quantity => integer clamp `1..99`

The cart parser must never throw into layout render. Any unreadable state degrades to a safe empty cart.

## Hydration Mismatch Prevention

Locked prevention strategy:
- use the same pure parse/sanitize utilities on both server and client
- initialize from server-sanitized `initialCart`
- do not re-read the cookie during the first client render
- do not add cross-tab sync in Phase 2

Result:
- navbar summary should be visible and correct on first render
- provider state should not flash from zero to non-zero after hydration
