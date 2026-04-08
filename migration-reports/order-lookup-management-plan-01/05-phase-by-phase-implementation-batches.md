# Phase-By-Phase Implementation Batches

## Phase 1: Planning Only

- deliver this planning pack

## Phase 2: Public Lookup

Likely files:

- `src/app/(frontend)/lookup/page.tsx`
- `src/app/(frontend)/lookup/LookupPageClient.tsx`
- `src/app/(frontend)/lookup/page.module.css`
- `src/app/api/orders/lookup/route.ts`

Verification targets:

- `/lookup` loads
- field validation blocks empty inputs and missing `#`
- success returns one shaped order result
- order-code-not-found and field-mismatch both show the same bottom-corner toast
- malformed request and server failure stay in local error state, not the shared toast
- no sensitive fields leak publicly

Stop conditions:

- stale success result remains visible after failed lookup
- API returns different outward business-failure messages
- implementation starts exposing raw order docs publicly

## Phase 3: Admin Redirect/Guard Plus Admin List/Detail

Likely files:

- `src/lib/getPayloadAdminSession.ts`
- `src/app/(frontend)/lookup/page.tsx`
- `src/app/(frontend)/order-management/page.tsx`
- `src/app/(frontend)/order-management/OrderManagementPageClient.tsx`
- `src/app/(frontend)/order-management/page.module.css`
- `src/app/(frontend)/order-management/[id]/page.tsx`
- `src/app/(frontend)/order-management/[id]/OrderManagementDetailClient.tsx`
- `src/app/(frontend)/order-management/[id]/page.module.css`

Verification targets:

- authenticated admin visit to `/lookup` redirects to `/order-management`
- unauthenticated `/order-management` redirects to admin login with `redirect=...`
- list renders newest-first
- detail renders read-only order data
- no edit UI appears

Stop conditions:

- guard logic requires converting the frontend shell to client rendering
- Local API calls pass `user` without `overrideAccess: false`

## Phase 4: Delete Flow Plus Final Verification

Likely files:

- `src/app/api/order-management/[id]/route.ts`
- `src/app/(frontend)/order-management/[id]/OrderManagementDetailClient.tsx`
- `src/app/(frontend)/order-management/[id]/page.module.css`

Verification targets:

- delete requires explicit local confirmation
- delete succeeds only for authenticated admin users
- list refresh shows order removed
- delete failure stays local
- public lookup still works after admin route additions

Stop conditions:

- delete works without auth re-check
- delete flow starts requiring edit semantics
- admin list/detail diverges from Payload admin state

## Global Verification After Phase 4

- `pnpm exec tsc --noEmit`
- `pnpm build`
- route smoke:
  - `/`
  - `/books`
  - `/cart`
  - `/purchase`
  - `/lookup`
  - `/order-management`
  - `/order-management/[id]`
  - `/authors`
  - `/info`
  - `/admin`
- end-to-end:
  - purchase flow still creates orders
  - public lookup can retrieve a created order
  - admin list/detail/delete remain consistent with Payload admin
