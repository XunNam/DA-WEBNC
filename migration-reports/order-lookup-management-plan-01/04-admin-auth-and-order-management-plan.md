# Admin Auth And Order Management Plan

## Shared Auth Helper

Add:

- `src/lib/getPayloadAdminSession.ts`

Responsibilities:

- call `getPayload({ config })`
- call `payload.auth({ headers: await headers() })`
- treat `user?.collection === 'users'` as authenticated admin/operator session
- expose a helper to build admin login redirect URLs using existing Payload config routes

## Admin Route Files

- `src/app/(frontend)/order-management/page.tsx`
- `src/app/(frontend)/order-management/OrderManagementPageClient.tsx`
- `src/app/(frontend)/order-management/page.module.css`
- `src/app/(frontend)/order-management/[id]/page.tsx`
- `src/app/(frontend)/order-management/[id]/OrderManagementDetailClient.tsx`
- `src/app/(frontend)/order-management/[id]/page.module.css`

## Admin Delete API File

- `src/app/api/order-management/[id]/route.ts`

## `/lookup` Redirect Rule

- `src/app/(frontend)/lookup/page.tsx` checks for authenticated Payload admin session on the server
- if present, redirect immediately to `/order-management`
- do not render the public form first and redirect later on the client

## `/order-management` Guard Rule

- both list and detail routes guard on the server
- if no authenticated `users` session exists, redirect to Payload admin login with `redirect=/order-management...`
- do not rely on client-side guard logic

## Admin List Data Flow

- `page.tsx` stays a server wrapper
- fetch orders via Local API with:
  - `user`
  - `overrideAccess: false`
  - `sort: '-createdAt'`
  - `pagination: false` in v1
- pass a serializable summary list into `OrderManagementPageClient.tsx`

## Admin List UI

- newest-first cards or rows
- each entry shows:
  - `orderCode`
  - `fullName`
  - `phoneNumber`
  - `email`
  - `totalQuantity`
  - `totalAmount`
  - `createdAt`
- each entry links to `/order-management/[id]`
- no inline edit controls
- no inline delete in list view for v1

## Admin Detail Data Flow

- `[id]/page.tsx` authenticates on the server
- fetch one order by internal `id` with:
  - `user`
  - `overrideAccess: false`
  - `depth: 0`
- missing order uses `notFound()`

## Admin Detail UI

- read-only only
- show:
  - order code
  - createdAt
  - fullName
  - email
  - phoneNumber
  - shippingAddress
  - paymentMethod
  - totalQuantity
  - totalAmount
  - item snapshots with image, title, quantity, unit price, line total
- do not expose edit/update UI
- do not link into Payload edit views
- include one delete entry point on this page

## Delete Flow

- `DELETE /api/order-management/[id]`
- route re-checks auth using request headers
- delete uses Local API with:
  - `user`
  - `overrideAccess: false`
- success returns small JSON success response
- client shows a lightweight local confirm state before delete
- after success, navigate back to `/order-management`
- on failure, stay on detail page and show local error
- no edit API is added
