import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { EB_Garamond, Open_Sans } from 'next/font/google'

import { getPayloadAdminSession } from '@/lib/getPayloadAdminSession'
import { buildOrderCodeSearchWhere, normalizeOrderCodeSearchInput } from '@/lib/orders/orderCodeSearch'

import { OrderManagementPageClient, type OrderManagementListEntry } from './OrderManagementPageClient'
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
  description: 'Quản lý đơn hàng',
  title: 'Bookstore | Quản lý đơn hàng',
}

type OrderManagementPageProps = {
  searchParams: Promise<{
    orderCode?: string
  }>
}

export default async function OrderManagementPage({ searchParams }: OrderManagementPageProps) {
  const resolvedSearchParams = await searchParams
  const adminSession = await getPayloadAdminSession({
    redirectPath: '/order-management',
  })

  if (!adminSession.user) {
    redirect(adminSession.loginRedirectURL)
  }

  const normalizedSearchValue = normalizeOrderCodeSearchInput(resolvedSearchParams.orderCode)

  const { docs } = await adminSession.payload.find({
    collection: 'orders',
    depth: 0,
    overrideAccess: false,
    pagination: false,
    sort: '-createdAt',
    user: adminSession.user,
    where: buildOrderCodeSearchWhere(normalizedSearchValue),
  })

  const orders: OrderManagementListEntry[] = docs.map((order) => ({
    createdAt: order.createdAt,
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
          <h1 className={`${ebGaramond.className} ${styles.heading}`}>Quản lý đơn hàng</h1>
          <p className={`${openSans.className} ${styles.intro}`}>
            Xem danh sách đơn hàng mới nhất và mở chi tiết từng đơn bằng dữ liệu snapshot đã lưu.
          </p>
        </header>

        <OrderManagementPageClient
          activeView="pending"
          bodyFontClassName={openSans.className}
          detailHrefBase="/order-management"
          displayFontClassName={ebGaramond.className}
          emptyStateHeading={normalizedSearchValue ? 'Không tìm thấy đơn hàng phù hợp' : 'Chưa có đơn hàng'}
          emptyStateText={
            normalizedSearchValue
              ? `Không có đơn hàng nào khớp với mã #${normalizedSearchValue}.`
              : 'Danh sách quản lý đơn hàng hiện chưa có dữ liệu để hiển thị.'
          }
          orders={orders}
          searchValue={normalizedSearchValue}
          searchViewHref="/order-management"
        />
      </div>
    </div>
  )
}
