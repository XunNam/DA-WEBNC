import type { Access, CollectionAfterChangeHook, CollectionBeforeChangeHook, CollectionConfig } from 'payload'

import { transitionOrderToDelivered } from '@/lib/orders/transitionOrderToDelivered'

const usersCollectionOnly: Access = ({ req }) => req.user?.collection === 'users'
const DELIVERY_TRANSITION_CONTEXT_KEY = 'deliveryTransitionRequested'

const normalizeDeliveryTriggerField: CollectionBeforeChangeHook = ({ context, data, operation }) => {
  if (operation === 'update' && data.markAsDelivered === true) {
    context[DELIVERY_TRANSITION_CONTEXT_KEY] = true
  }

  if (data.markAsDelivered === true) {
    return {
      ...data,
      markAsDelivered: false,
    }
  }

  return data
}

const runDeliveryTransitionAfterChange: CollectionAfterChangeHook = async ({ context, doc, operation, req }) => {
  if (operation !== 'update' || context[DELIVERY_TRANSITION_CONTEXT_KEY] !== true || typeof doc.id !== 'string') {
    return doc
  }

  await transitionOrderToDelivered({
    orderId: doc.id,
    req,
    user: req.user ?? null,
  })

  return doc
}

export const Orders: CollectionConfig = {
  slug: 'orders',
  access: {
    read: usersCollectionOnly,
    create: usersCollectionOnly,
    update: usersCollectionOnly,
    delete: usersCollectionOnly,
  },
  admin: {
    useAsTitle: 'orderCode',
    defaultColumns: ['orderCode', 'fullName', 'totalQuantity', 'totalAmount', 'createdAt'],
  },
  hooks: {
    beforeChange: [normalizeDeliveryTriggerField],
    afterChange: [runDeliveryTransitionAfterChange],
  },
  fields: [
    {
      name: 'orderCode',
      type: 'text',
      required: true,
      unique: true,
      index: true,
    },
    {
      name: 'fullName',
      type: 'text',
      required: true,
    },
    {
      name: 'email',
      type: 'email',
      required: true,
    },
    {
      name: 'phoneNumber',
      type: 'text',
      required: true,
    },
    {
      name: 'shippingAddress',
      type: 'textarea',
      required: true,
    },
    {
      name: 'paymentMethod',
      type: 'select',
      required: true,
      defaultValue: 'cod',
      options: [
        {
          label: 'COD',
          value: 'cod',
        },
      ],
    },
    {
      name: 'totalQuantity',
      type: 'number',
      required: true,
    },
    {
      name: 'totalAmount',
      type: 'number',
      required: true,
    },
    {
      name: 'markAsDelivered',
      type: 'checkbox',
      label: 'Đã giao?',
      defaultValue: false,
      admin: {
        description: 'Chọn rồi lưu để chuyển đơn sang danh sách đơn hàng đã giao.',
      },
    },
    {
      name: 'items',
      type: 'array',
      required: true,
      fields: [
        {
          name: 'book',
          type: 'relationship',
          relationTo: 'books',
        },
        {
          name: 'bookTitle',
          type: 'text',
          required: true,
        },
        {
          name: 'bookSlug',
          type: 'text',
          required: true,
        },
        {
          name: 'coverImageUrl',
          type: 'text',
          required: true,
        },
        {
          name: 'coverImageAlt',
          type: 'text',
        },
        {
          name: 'unitPrice',
          type: 'number',
          required: true,
        },
        {
          name: 'compareAtPrice',
          type: 'number',
        },
        {
          name: 'quantity',
          type: 'number',
          required: true,
        },
        {
          name: 'lineTotal',
          type: 'number',
          required: true,
        },
      ],
    },
  ],
}
