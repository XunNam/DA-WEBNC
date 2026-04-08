import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { EB_Garamond, Open_Sans } from 'next/font/google'

import { getPayloadAdminSession } from '@/lib/getPayloadAdminSession'
import { buildOrderCodeSearchWhere, normalizeOrderCodeSearchInput } from '@/lib/orders/orderCodeSearch'

import { OrderManagementPageClient, type OrderManagementListEntry } from '../OrderManagementPageClient'
import styles from '../page.module.css'

const ebGaramond = EB_Garamond({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '600', '700', '800'],
})

const openSans = Open_Sans({
  subsets: ['latin', 'vietnamese'],
  weight: ['300', '400', '500', '600', '700', '800'],
})

export const metadata: Metadata = {
  description: 'Đơn hàng đã giao',
  title: 'Bookstore | Đơn hàng đã giao',
}

type DeliveredOrderManagementPageProps = {
  searchParams: Promise<{
    orderCode?: string
  }>
}

export default async function DeliveredOrderManagementPage({ searchParams }: DeliveredOrderManagementPageProps) {
  const resolvedSearchParams = await searchParams
  const adminSession = await getPayloadAdminSession({
    redirectPath: '/order-management/delivered',
  })

  if (!adminSession.user) {
    redirect(adminSession.loginRedirectURL)
  }

  const normalizedSearchValue = normalizeOrderCodeSearchInput(resolvedSearchParams.orderCode)

  const { docs } = await adminSession.payload.find({
    collection: 'deliveredOrders',
    depth: 0,
    overrideAccess: false,
    pagination: false,
    sort: '-deliveredAt',
    user: adminSession.user,
    where: buildOrderCodeSearchWhere(normalizedSearchValue),
  })

  const orders: OrderManagementListEntry[] = docs.map((order) => ({
    createdAt: order.createdAt,
    deliveredAt: order.deliveredAt,
    email: order.email,
    fullName: order.fullName,
    id: order.id,
    orderCode: order.orderCode,
    phoneNumber: order.phoneNumber,
    totalAmount: order.totalAmount,
    totalQuantity: order.totalQuantity,
  }))

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={`${ebGaramond.className} ${styles.heading}`}>Đơn hàng đã giao</h1>
          <p className={`${openSans.className} ${styles.intro}`}>
            Xem lại các đơn hàng đã hoàn tất giao, thời điểm giao hàng và toàn bộ snapshot đã lưu.
          </p>
        </header>

        <OrderManagementPageClient
          activeView="delivered"
          bodyFontClassName={openSans.className}
          detailHrefBase="/order-management/delivered"
          displayFontClassName={ebGaramond.className}
          emptyStateHeading={normalizedSearchValue ? 'Không tìm thấy đơn hàng đã giao phù hợp' : 'Chưa có đơn hàng đã giao'}
          emptyStateText={
            normalizedSearchValue
              ? `Không có đơn hàng đã giao nào khớp với mã #${normalizedSearchValue}.`
              : 'Danh sách đơn hàng đã giao hiện chưa có dữ liệu để hiển thị.'
          }
          orders={orders}
          searchValue={normalizedSearchValue}
          searchViewHref="/order-management/delivered"
        />
      </div>
    </div>
  )
}
