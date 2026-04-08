'use client'

import Link from 'next/link'

import { formatCartCurrency } from '@/lib/cart/cartMath'

import { useCart } from './CartProvider'

type CartSummaryProps = {
  className?: string
}

export function CartSummary({ className }: CartSummaryProps) {
  const { totalAmount, totalQuantity } = useCart()
  const totalLabel = formatCartCurrency(totalAmount)

  return (
    <Link
      aria-label={`Giỏ hàng: ${totalQuantity} sản phẩm, ${totalLabel}`}
      className={className}
      href="/cart"
    >
      <span aria-hidden="true" data-cart-icon>
        <svg fill="none" height="18" viewBox="0 0 24 24" width="18" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M3.5 4.5H5.13637C5.89912 4.5 6.28049 4.5 6.58063 4.65814C6.8452 4.79758 7.06013 5.01251 7.19957 5.27708C7.35771 5.57722 7.35771 5.95859 7.35771 6.72134V7.125M7.35771 7.125L8.70287 15.196C8.82678 15.9395 8.88874 16.3113 9.06662 16.5928C9.22308 16.8405 9.44831 17.0374 9.71475 17.1593C10.0177 17.2979 10.3946 17.2979 11.1483 17.2979H17.1771C17.9308 17.2979 18.3077 17.2979 18.6107 17.1593C18.8771 17.0374 19.1023 16.8405 19.2588 16.5928C19.4367 16.3113 19.4986 15.9395 19.6225 15.196L20.6102 9.26969C20.7341 8.52616 20.7961 8.15439 20.7027 7.85672C20.6209 7.59599 20.4458 7.37448 20.2107 7.23529C19.9425 7.07639 19.5656 7.125 18.8119 7.125H7.35771ZM10.5 20.5C10.5 21.0523 10.0523 21.5 9.5 21.5C8.94772 21.5 8.5 21.0523 8.5 20.5C8.5 19.9477 8.94772 19.5 9.5 19.5C10.0523 19.5 10.5 19.9477 10.5 20.5ZM18.5 20.5C18.5 21.0523 18.0523 21.5 17.5 21.5C16.9477 21.5 16.5 21.0523 16.5 20.5C16.5 19.9477 16.9477 19.5 17.5 19.5C18.0523 19.5 18.5 19.9477 18.5 20.5Z"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.7"
          />
        </svg>
      </span>

      <span data-cart-copy>
        <span data-cart-quantity>{totalQuantity} sản phẩm</span>
        <span data-cart-total>{totalLabel}</span>
      </span>
    </Link>
  )
}
