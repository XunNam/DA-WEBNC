import type { Access, CollectionConfig } from 'payload'

const usersCollectionOnly: Access = ({ req }) => req.user?.collection === 'users'

const readOnlyFieldAdmin = {
  readOnly: true,
}

export const DeliveredOrders: CollectionConfig = {
  slug: 'deliveredOrders',
  access: {
    read: usersCollectionOnly,
    create: () => false,
    update: () => false,
    delete: usersCollectionOnly,
  },
  disableDuplicate: true,
  admin: {
    useAsTitle: 'orderCode',
    defaultColumns: ['orderCode', 'fullName', 'deliveredAt', 'totalQuantity', 'totalAmount', 'createdAt'],
  },
  fields: [
    {
      name: 'sourceOrderId',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        ...readOnlyFieldAdmin,
        description: 'ID đơn hàng gốc trước khi chuyển sang trạng thái đã giao.',
      },
    },
    {
      name: 'deliveredAt',
      type: 'date',
      required: true,
      admin: {
        ...readOnlyFieldAdmin,
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'orderCode',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: readOnlyFieldAdmin,
    },
    {
      name: 'fullName',
      type: 'text',
      required: true,
      admin: readOnlyFieldAdmin,
    },
    {
      name: 'email',
      type: 'email',
      required: true,
      admin: readOnlyFieldAdmin,
    },
    {
      name: 'phoneNumber',
      type: 'text',
      required: true,
      admin: readOnlyFieldAdmin,
    },
    {
      name: 'shippingAddress',
      type: 'textarea',
      required: true,
      admin: readOnlyFieldAdmin,
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
      admin: readOnlyFieldAdmin,
    },
    {
      name: 'totalQuantity',
      type: 'number',
      required: true,
      admin: readOnlyFieldAdmin,
    },
    {
      name: 'totalAmount',
      type: 'number',
      required: true,
      admin: readOnlyFieldAdmin,
    },
    {
      name: 'items',
      type: 'array',
      required: true,
      admin: readOnlyFieldAdmin,
      fields: [
        {
          name: 'book',
          type: 'relationship',
          relationTo: 'books',
          admin: readOnlyFieldAdmin,
        },
        {
          name: 'bookTitle',
          type: 'text',
          required: true,
          admin: readOnlyFieldAdmin,
        },
        {
          name: 'bookSlug',
          type: 'text',
          required: true,
          admin: readOnlyFieldAdmin,
        },
        {
          name: 'coverImageUrl',
          type: 'text',
          required: true,
          admin: readOnlyFieldAdmin,
        },
        {
          name: 'coverImageAlt',
          type: 'text',
          admin: readOnlyFieldAdmin,
        },
        {
          name: 'unitPrice',
          type: 'number',
          required: true,
          admin: readOnlyFieldAdmin,
        },
        {
          name: 'compareAtPrice',
          type: 'number',
          admin: readOnlyFieldAdmin,
        },
        {
          name: 'quantity',
          type: 'number',
          required: true,
          admin: readOnlyFieldAdmin,
        },
        {
          name: 'lineTotal',
          type: 'number',
          required: true,
          admin: readOnlyFieldAdmin,
        },
      ],
    },
  ],
}
