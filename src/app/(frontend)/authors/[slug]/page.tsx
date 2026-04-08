import type { Metadata } from 'next'
import { Crimson_Pro, Open_Sans, Varela_Round } from 'next/font/google'
import Image from 'next/image'
import { notFound } from 'next/navigation'

import { getPublishedAuthorBySlug } from '@/lib/getPublishedAuthorsData'

import styles from './page.module.css'

const crimsonPro = Crimson_Pro({
  subsets: ['latin', 'vietnamese'],
  weight: ['200', '300', '400', '500', '600', '700', '800', '900'],
})

const openSans = Open_Sans({
  subsets: ['latin', 'vietnamese'],
  weight: ['300', '400', '500', '600', '700', '800'],
})

const varelaRound = Varela_Round({
  subsets: ['latin', 'vietnamese'],
  weight: ['400'],
})

type AuthorDetailPageProps = {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({ params }: AuthorDetailPageProps): Promise<Metadata> {
  const { slug } = await params
  const author = await getPublishedAuthorBySlug(slug)

  if (!author) {
    return {
      description: 'Tác giả',
      title: 'Bookstore | Tác giả',
    }
  }

  return {
    description: author.metaDescription || `Tác giả ${author.name}`,
    title: author.metaTitle || `Tác giả | ${author.name}`,
  }
}

export default async function AuthorDetailPage({ params }: AuthorDetailPageProps) {
  const { slug } = await params
  const author = await getPublishedAuthorBySlug(slug)

  if (!author) {
    notFound()
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={`${crimsonPro.className} ${styles.sectionTitle}`}>Tiểu sử tác giả</h1>

        <div className={styles.content}>
          <aside className={`${crimsonPro.className} ${styles.sidebar}`}>
            <Image
              alt={author.portrait.alt}
              className={styles.portrait}
              height={author.portrait.height}
              src={author.portrait.url}
              unoptimized
              width={author.portrait.width}
            />

            <h2 className={styles.name}>{author.name}</h2>

            {author.lifeDatesDisplay && (
              <p className={`${openSans.className} ${styles.lifeDates}`}>
                {author.lifeDatesDisplay}
              </p>
            )}
          </aside>

          <section className={styles.metaBlock}>
            {author.metaTitle && (
              <p className={`${openSans.className} ${styles.metaTitle}`}>{author.metaTitle}</p>
            )}

            {author.metaDescription && (
              <p className={`${varelaRound.className} ${styles.metaDescription}`}>
                {author.metaDescription}
              </p>
            )}

            <div className={styles.emptyState}>
              <h3 className={`${crimsonPro.className} ${styles.emptyTitle}`}>
                Nội dung tiểu sử công khai
              </h3>
              <p className={`${varelaRound.className} ${styles.emptyBody}`}>
                Trang này hiện chỉ hiển thị những thông tin tác giả đã được xuất bản công khai. Phần
                tiểu sử này được lấy từ nhiều nguồn chính thống khác nhau (Wikipedia, VNExpress,
                Fahasa, NXB Trẻ,...).
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
