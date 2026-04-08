import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { EB_Garamond, Open_Sans } from 'next/font/google'

import { getPayloadAdminSession } from '@/lib/getPayloadAdminSession'

import { OrderManagementDetailClient, type OrderManagementDetailData } from './OrderManagementDetailClient'
import styles from './page.module.css'

const ebGaramond = EB_Garamond({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '600', '700', '800'],
})

const openSans = Open_Sans({
  subsets: ['latin', 'vietnamese'],
  weight: ['300', '400', '500', '600', '700', '800'],
})

const OBJECT_ID_PATTERN = /^[0-9a-fA-F]{24}$/

type OrderManagementDetailPageProps = {
  params: Promise<{
    id: string
  }>
}

export const metadata: Metadata = {
  description: 'Chi tiết đơn hàng',
  title: 'Bookstore | Chi tiết đơn hàng',
}

export default async function OrderManagementDetailPage({ params }: OrderManagementDetailPageProps) {
  const { id } = await params

  const adminSession = await getPayloadAdminSession({
    redirectPath: `/order-management/${id}`,
  })

  if (!adminSession.user) {
    redirect(adminSession.loginRedirectURL)
  }

  if (!OBJECT_ID_PATTERN.test(id)) {
    notFound()
  }

  const { docs } = await adminSession.payload.find({
    collection: 'orders',
    depth: 0,
    limit: 1,
    overrideAccess: false,
    pagination: false,
    user: adminSession.user,
    where: {
      id: {
        equals: id,
      },
    },
  })

  const order = docs[0]

  if (!order) {
    notFound()
  }

  const detail: OrderManagementDetailData = {
    createdAt: order.createdAt,
    email: order.email,
    fullName: order.fullName,
    items: order.items.map((item) => ({
      coverImageAlt: item.coverImageAlt ?? '',
      coverImageUrl: item.coverImageUrl,
      lineTotal: item.lineTotal,
      quantity: item.quantity,
      title: item.bookTitle,
      unitPrice: item.unitPrice,
    })),
    orderCode: order.orderCode,
    paymentMethod: order.paymentMethod,
    phoneNumber: order.phoneNumber,
    shippingAddress: order.shippingAddress,
    totalAmount: order.totalAmount,
    totalQuantity: order.totalQuantity,
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={`${ebGaramond.className} ${styles.heading}`}>Chi tiết đơn hàng</h1>
          <p className={`${openSans.className} ${styles.intro}`}>
            Theo dõi thông tin khách hàng và các snapshot sản phẩm đã được lưu tại thời điểm đặt hàng.
          </p>
        </header>

        <OrderManagementDetailClient
          backHref="/order-management"
          bodyFontClassName={openSans.className}
          displayFontClassName={ebGaramond.className}
          order={detail}
          viewMode="pending"
        />
      </div>
    </div>
  )
}
