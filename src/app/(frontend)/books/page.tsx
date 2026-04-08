import type { Metadata } from 'next'
import { EB_Garamond, Open_Sans } from 'next/font/google'

import { getPublishedBooksData } from '@/lib/getPublishedBooksData'

import { BooksPageClient } from './BooksPageClient'
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
  description: 'Trang bán sách',
  title: 'Bookstore | Sách',
}

export default async function BooksPage() {
  const books = await getPublishedBooksData()

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={`${ebGaramond.className} ${styles.heading}`}>Sách</h1>

        <BooksPageClient
          bodyFontClassName={openSans.className}
          books={books}
          displayFontClassName={ebGaramond.className}
        />
      </div>
    </div>
  )
}
