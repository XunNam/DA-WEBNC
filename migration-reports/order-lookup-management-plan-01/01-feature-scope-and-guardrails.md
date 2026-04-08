# Feature Scope And Guardrails

## In Scope

- public `/lookup`
- public lookup API
- identical failure toast for the two locked business failure cases
- admin-only `/order-management`
- admin-only order detail route
- admin-only delete flow
- Payload-session-based redirect and guard behavior

## Protected Baseline

Do not break:

- existing `/books`, `/cart`, `/purchase`, and `/api/orders`
- existing `orders` collection structure and order creation flow
- existing frontend shell, navbar, footer, and cart provider
- existing Payload admin auth/session behavior
- existing Atlas, R2, and media behavior
- existing route structure outside the new feature

## Explicitly Out Of Scope

- account-based order history
- editing orders from the new frontend route
- replacing Payload admin
- changing order creation behavior
- changing `orders` schema unless a true blocker appears
- redesigning the site
- adding global notification infrastructure

## Locked Product Rules

- `/lookup` requires all 4 fields:
  - `orderCode`
  - `fullName`
  - `phoneNumber`
  - `email`
- order code must include `#`
- server checks order code first, then the other 3 fields
- public failure message for the two locked business failure cases must remain identical
- authenticated admin users visiting `/lookup` redirect to `/order-management`
- unauthenticated `/order-management` access is blocked server-side
- `/order-management` allows delete but not edit/update

## Locked Defaults

- no navbar/footer link changes in v1
- admin detail route uses internal order `id`
- public lookup and admin detail use stored order snapshots, not live book data
- delete entry point lives on the admin detail page, not the list page
- no pagination in admin list v1

## Non-Negotiable UX Guardrail

The shared bottom-corner popup/toast with message `Không tìm thấy đơn hàng` applies only to:

- order code not found
- order code exists but the other 3 fields do not match

It does not apply to malformed request handling or unexpected server failures.
