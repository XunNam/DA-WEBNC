import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { EB_Garamond, Open_Sans } from 'next/font/google'

import { getPayloadAdminSession } from '@/lib/getPayloadAdminSession'

import { OrderManagementDetailClient, type OrderManagementDetailData } from '../../[id]/OrderManagementDetailClient'
import styles from '../../[id]/page.module.css'

const ebGaramond = EB_Garamond({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '600', '700', '800'],
})

const openSans = Open_Sans({
  subsets: ['latin', 'vietnamese'],
  weight: ['300', '400', '500', '600', '700', '800'],
})

const OBJECT_ID_PATTERN = /^[0-9a-fA-F]{24}$/

type DeliveredOrderManagementDetailPageProps = {
  params: Promise<{
    id: string
  }>
}

export const metadata: Metadata = {
  description: 'Chi tiết đơn hàng đã giao',
  title: 'Bookstore | Chi tiết đơn hàng đã giao',
}

export default async function DeliveredOrderManagementDetailPage({
  params,
}: DeliveredOrderManagementDetailPageProps) {
  const { id } = await params

  const adminSession = await getPayloadAdminSession({
    redirectPath: `/order-management/delivered/${id}`,
  })

  if (!adminSession.user) {
    redirect(adminSession.loginRedirectURL)
  }

  if (!OBJECT_ID_PATTERN.test(id)) {
    notFound()
  }

  const { docs } = await adminSession.payload.find({
    collection: 'deliveredOrders',
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
    deliveredAt: order.deliveredAt,
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
          <h1 className={`${ebGaramond.className} ${styles.heading}`}>Chi tiết đơn hàng đã giao</h1>
          <p className={`${openSans.className} ${styles.intro}`}>
            Xem lại đầy đủ thông tin khách hàng, thời điểm giao hàng và các snapshot sản phẩm đã hoàn tất.
          </p>
        </header>

        <OrderManagementDetailClient
          backHref="/order-management/delivered"
          bodyFontClassName={openSans.className}
          displayFontClassName={ebGaramond.className}
          order={detail}
          viewMode="delivered"
        />
      </div>
    </div>
  )
}
