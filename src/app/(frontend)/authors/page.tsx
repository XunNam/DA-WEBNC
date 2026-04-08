import type { Metadata } from 'next'
import { EB_Garamond, Open_Sans } from 'next/font/google'
import Image from 'next/image'
import Link from 'next/link'

import { getPublishedAuthorsData } from '@/lib/getPublishedAuthorsData'

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
  description: 'Tác giả sách',
  title: 'Bookstore | Tác giả',
}

export default async function AuthorsPage() {
  const authors = await getPublishedAuthorsData()

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={`${ebGaramond.className} ${styles.heading}`}>Tác giả</h1>

        <div className={styles.grid}>
          {authors.map((author) => (
            <article className={styles.card} key={author.id}>
              <div className={styles.portraitWrap}>
                <Image
                  alt={author.portrait.alt}
                  className={styles.portrait}
                  height={author.portrait.height}
                  src={author.portrait.url}
                  unoptimized
                  width={author.portrait.width}
                />
              </div>

              <div className={styles.textGroup}>
                <h2 className={`${ebGaramond.className} ${styles.name}`}>{author.name}</h2>

                {author.lifeDatesDisplay && (
                  <p className={`${openSans.className} ${styles.lifeDates}`}>
                    {author.lifeDatesDisplay}
                  </p>
                )}
              </div>

              <Link className={`${openSans.className} ${styles.linkButton}`} href={`/authors/${author.slug}`}>
                Đọc thêm
              </Link>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}
