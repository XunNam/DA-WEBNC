import type { Metadata } from 'next'
import { EB_Garamond, Open_Sans } from 'next/font/google'

import { CartPageClient } from './CartPageClient'
import styles from './page.module.css'

const ebGaramond = EB_Garamond({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '600', '700', '800'],
})

const openSans = Open_Sans({
  subsets: ['latin', 'vietnamese'],
  weight: ['300', '400', '500', '600', '700', '800'],
})

export const metadata: Metadata = {
  description: 'Giỏ hàng',
  title: 'Bookstore | Giỏ hàng',
}

export default function CartPage() {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={`${ebGaramond.className} ${styles.heading}`}>Giỏ hàng</h1>
        </header>

        <CartPageClient bodyFontClassName={openSans.className} displayFontClassName={ebGaramond.className} />
      </div>
    </div>
  )
}
