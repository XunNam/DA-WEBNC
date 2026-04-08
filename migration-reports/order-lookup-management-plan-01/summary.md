# Order Lookup + Admin Order Management Plan

## Overview

This pack plans two additions on top of the completed bookstore commerce flow:

- public `/lookup` for single-order lookup
- authenticated admin-only `/order-management` for order list, detail, and delete

The existing commerce flow, `orders` collection, Payload admin auth, frontend shell, and order creation flow remain protected.

## Proposed Phase Split

1. Planning pack only
2. Public lookup only
3. Admin auth redirect/guard plus admin list/detail
4. Admin delete flow plus final verification

## Key Decisions

- `/lookup` remains a public route, but authenticated Payload admin users are redirected server-side to `/order-management`.
- Public lookup uses a dedicated API route and manually shaped response data. It does not expose raw `orders` documents.
- Public lookup compares `fullName`, `phoneNumber`, and `email` with exact case-sensitive equality after trimming leading/trailing whitespace only.
- The shared bottom-corner failure toast with message `Không tìm thấy đơn hàng` applies only to the two locked business failure cases:
  - order code not found
  - order code exists but the other 3 fields do not match
- Malformed request or missing-field handling stays local to the page as validation/local error state.
- Unexpected server failure also stays local to the page as a separate local error state.
- `/order-management` is a frontend operator view, not a replacement for Payload admin.
- Delete is allowed from the new admin frontend flow, but edit/update is not exposed.

## Exact Next Recommended Action

Implement Phase 2 only first:

- `src/app/(frontend)/lookup/page.tsx`
- `src/app/(frontend)/lookup/LookupPageClient.tsx`
- `src/app/(frontend)/lookup/page.module.css`
- `src/app/api/orders/lookup/route.ts`

Phase 2 should stop after public lookup, public success rendering, and the identical bottom-corner toast for the two locked business failure cases only.
