# Route Smoke

All route smoke below was exercised against the local production-like server at `http://127.0.0.1:3011`.

| Route | Result |
| --- | --- |
| `/` | `200` |
| `/books` | `200` |
| `/cart` | `200` |
| `/purchase` | `200` |
| `/authors` | `200` |
| `/info` | `200` |
| `/admin` | `200` |

## Admin orders routes

- Orders list route loaded successfully after a real order was created.
- Orders detail route loaded successfully for the created order.
- Orders list returned to a clean state after the audit delete pass.
