# Delete Flow And Consistency

## Delete UX

Actually tested on `/order-management/[id]`:

- delete entry point exists only on the detail page
- delete uses an inline local confirmation UI
- no global modal system was introduced
- no global toast system was introduced for delete

## Failure Path

Actually tested by intercepting the delete request and forcing a `500` response:

- delete stayed on the same detail page
- local error UI rendered on the page
- the page remained usable after the failure

## Success Path

Actually tested end-to-end on a fresh audit order:

- confirm delete triggers one authenticated `DELETE` request
- repeated delete clicks are guarded while the request is in flight
- button switches to the loading state and becomes disabled
- successful delete navigates back to `/order-management`
- deleted order disappears from the frontend admin list
- deleted order detail frontend route returns `404`
- repeated delete against the same deleted id returns safe `404`

## Payload Admin Consistency

Actually tested:

- a fresh audit order appeared in Payload admin orders list before delete
- after delete, that same order no longer appeared in Payload admin orders list

## Public Lookup Consistency

Actually tested:

- a fresh audit order was publicly retrievable via `/lookup` before delete
- after delete, the same order returned the shared not-found result via `/lookup`

## Purchase Flow Cross-Check

Actually tested:

- the existing `/purchase` UI still created real orders successfully when supplied with a valid seeded cart cookie and submitted through the real form
- the resulting fresh orders were then visible in:
  - public `/lookup`
  - frontend `/order-management`
  - Payload admin orders list
