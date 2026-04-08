# Failure And Edge Cases

## Empty-state checks

- `/cart` with no valid cart items showed the empty-cart state and no checkout CTA.
- `/purchase` with no valid cart items showed the empty-cart state and no submit button.

## Malformed cookie handling

Exercised directly with a malformed `bookstore-cart` cookie.

- `/cart` degraded to the empty-cart state.
- `/purchase` degraded to the empty-cart state.
- No crash or server error was observed.

## Invalid form submission

Exercised directly on `/purchase`.

- Empty submit showed all four expected local validation errors.
- Submit stayed local until fields were valid.

## API invalid-cart rejection

Exercised directly against `POST /api/orders`.

- Malformed/non-usable `bookId` returned `400` with the safe review-cart message.
- Valid-looking but nonexistent `bookId` returned `400` with the same safe message.
- Current published null-price book submission returned `400` with the same safe message.
- No `500` was returned for those user-facing invalid-cart cases.

Locked user-facing message observed:

- `Giỏ hàng có sản phẩm không còn hợp lệ. Vui lòng kiểm tra lại trước khi đặt hàng.`

## Unpublished book coverage

- This path was **not directly exercised** because the current dataset had no unpublished books at audit time.
- It was only reviewed indirectly from the API implementation, which constrains checkout reads to `_status: 'published'`.

## `/purchase` error UI and recovery

Exercised directly with a server-rejected cart payload rendered in the client.

- Error message appeared clearly in the page UI.
- Previously entered form values were preserved.
- No fake success modal appeared.
- Submit button recovered after the error and could be used again after field edits.
