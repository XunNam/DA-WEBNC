## Phase 2 Includes

In scope:
- cart cookie model
- cart parse / serialize / sanitize utilities
- cart math / currency-format helpers
- minimal client cart provider and hook
- initial cart hydration in the existing frontend layout
- always-visible navbar cart summary

## Phase 2 Explicitly Excludes

Out of scope:
- `/books` hover / blur / action button behavior
- `/cart` route
- `/purchase` route
- checkout submission logic
- `orders` collection
- order API route
- success popup flow
- any payment or COD implementation details beyond later dependencies

## Protected Baseline

Do not destabilize:
- `/`
- `/books`
- `/authors`
- `/authors/[slug]`
- `/info`
- Payload admin
- navbar/footer shell integration
- published-only public read behavior
- current frontend shell structure

## Locked Product Decisions

These Phase 2 plans must obey the approved commerce decisions:
- guest checkout only
- cookie-backed cart only
- no MongoDB persistence for cart state before checkout submit
- cart summary is always visible in the navbar
- summary shows icon, total quantity, and total amount
- totals use only `price`
- `compareAtPrice` is display-only
- no broad client conversion of the frontend shell

## Architecture Guardrails

- keep `src/app/(frontend)/layout.tsx` server-rendered
- keep the new client layer isolated to the cart provider and the cart summary island
- do not convert `Footer`, route pages, or public helpers to client components
- keep navbar/logo/nav layout stable on desktop and mobile
