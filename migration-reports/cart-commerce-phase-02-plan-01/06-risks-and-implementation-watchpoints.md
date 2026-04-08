## Phase 2 Risks

### 1. No existing client-state layer
The current frontend shell and routes are server-rendered.

Watchpoint:
- introduce the smallest possible client layer
- keep it limited to provider + summary island

### 2. Cookie size pressure
Cart data lives in browser cookies.

Watchpoint:
- keep the cookie snapshot compact
- do not add unnecessary display fields in Phase 2

### 3. Cookie is user-controlled
Client cookie contents are non-authoritative and may be stale or malformed.

Watchpoint:
- sanitize aggressively
- never let malformed cookie data break layout render

### 4. Optional `Books.price`
The `books` schema allows `price` to be `null`.

Watchpoint:
- invalid or missing numeric price entries must be dropped in sanitize
- do not preserve non-purchasable cart entries in provider state

### 5. Navbar layout stability
The navbar is currently simple and stable.

Watchpoint:
- cart summary is the main UI risk in Phase 2
- preserve shell hierarchy and responsive behavior before doing later commerce work

### 6. Repo verification quirk
`tsconfig.json` includes `.next/types/**/*.ts`.

Watchpoint:
- route types may need regeneration before typecheck passes
- treat that as a verification detail, not as a reason to widen Phase 2

### 7. Existing unrelated build issue
There is a known unrelated `/api/graphql-playground` build problem in this repo’s broader verification history.

Watchpoint:
- do not widen Phase 2 into fixing unrelated route/build issues unless they directly block cart foundation work

## Locked Implementation Watchpoints

- use inline SVG for the cart icon
- keep the client state layer isolated to provider + summary island
- no cross-tab sync requirement in Phase 2
- no `/books`, `/cart`, or `/purchase` interactions start in Phase 2

## Remaining Conservative Decisions During Coding

These may be resolved conservatively during the coding turn without changing feature scope:
- exact navbar summary spacing inside the current shell
- exact label microcopy around the always-visible summary
- exact zero-state formatting arrangement so long as icon + quantity + amount remain visible

There are no remaining open product questions that should block Phase 2 implementation.
