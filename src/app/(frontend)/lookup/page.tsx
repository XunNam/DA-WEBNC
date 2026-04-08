import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { EB_Garamond, Open_Sans } from 'next/font/google'

import { getPayloadAdminSession } from '@/lib/getPayloadAdminSession'

import { LookupPageClient } from './LookupPageClient'
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
  description: 'Tra cứu đơn hàng',
  title: 'Bookstore | Tra cứu đơn hàng',
}

export default async function LookupPage() {
  const adminSession = await getPayloadAdminSession({
    redirectPath: '/order-management',
  })

  if (adminSession.isAuthenticated) {
    redirect('/order-management')
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={`${ebGaramond.className} ${styles.heading}`}>Tra cứu đơn hàng</h1>
        </header>

        <LookupPageClient bodyFontClassName={openSans.className} displayFontClassName={ebGaramond.className} />
      </div>
    </div>
  )
}
