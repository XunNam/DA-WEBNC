# End-To-End Success Flow

## Flow exercised

1. Added books to cart from `/books`
2. Verified navbar summary updated immediately
3. Opened `/cart`
4. Verified increment, decrement, and remove behavior
5. Opened `/purchase`
6. Verified summary rendering and collapse toggle
7. Verified local form validation
8. Submitted a real order through `/api/orders`
9. Verified success modal with a real `orderCode`
10. Verified cart cookie cleared
11. Verified provider state cleared
12. Verified navbar summary reset
13. Verified order appeared in Payload admin list
14. Verified order detail was viewable in admin
15. Verified admin delete still worked

## Observed results

- `/books` add-to-cart updated navbar summary from `0` to `2 sản phẩm` during the audit path.
- `/cart` increment/decrement/remove stayed synchronized with navbar summary.
- `/purchase` summary was open by default and remained collapsible.
- Successful checkout returned a real order code, for example `#9O7E5` during one audit pass.
- Success modal showed the required message:
  - `Chúng tôi sẽ sớm liên hệ với bạn để xác nhận thông tin`
- After success:
  - cart cookie was gone
  - provider state was empty
  - navbar summary reset to zero
  - route stayed on `/purchase`
- Admin list showed the created order row.
- Admin detail showed snapshot fields, including:
  - `orderCode`
  - `fullName`
  - `items.0.bookTitle`
- Admin delete removed the created order and the row disappeared after reload.

## Post-success refresh consistency

This was exercised directly.

- Refreshing `/purchase` after a successful checkout showed the empty-cart state.
- Refreshing `/cart` after the same successful checkout also showed the empty-cart state.
- The cart did not reappear after refresh, so cookie/provider cleanup stayed consistent.
