// Reusable OpenAPI schemas for swagger-jsdoc.
// Keep these shapes aligned with your actual API response wrapper:
// { success: boolean, message: string, data: object }

const ApiResponse = {
  type: 'object',
  required: ['success', 'message', 'data'],
  properties: {
    success: { type: 'boolean', example: true },
    message: { type: 'string', example: 'OK' },
    data: { type: 'object', additionalProperties: true },
  },
};

const User = {
  type: 'object',
  properties: {
    name: { type: 'string', example: 'Himanshu' },
    userId: { type: 'string', example: 'ADMIN' },
    email: { type: 'string', example: 'university.himanshu@gmail.com' },
    userType: { type: 'string', enum: ['CUSTOMER', 'ADMIN'], example: 'CUSTOMER' },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' },
  },
};

const Product = {
  type: 'object',
  properties: {
    productId: { type: 'string', example: '676a3a2bdc2a7a2f2c6d7c01' },
    name: { type: 'string', example: 'Wireless Mouse' },
    description: { type: 'string', example: 'Ergonomic 2.4GHz wireless mouse' },
    price: { type: 'number', example: 1999.99 },
    categoryId: { type: 'string', example: '676a39a8dc2a7a2f2c6d7bff' },
    stock: { type: 'number', example: 25 },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' },
  },
};

const Order = {
  type: 'object',
  properties: {
    orderId: { type: 'string', example: '676a3b2bdc2a7a2f2c6d7c10' },
    userId: { type: 'string', example: 'CUSTOMER_123' },
    items: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          productId: { type: 'string', example: '676a3a2bdc2a7a2f2c6d7c01' },
          quantity: { type: 'number', example: 2 },
          price: { type: 'number', example: 1999.99 },
        },
      },
    },
    status: {
      type: 'string',
      enum: ['PLACED', 'SHIPPED', 'DELIVERED', 'CANCELLED'],
      example: 'PLACED',
    },
    total: { type: 'number', example: 3999.98 },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' },
  },
};

const Error = {
  allOf: [{ $ref: '#/components/schemas/ApiResponse' }],
  properties: {
    success: { type: 'boolean', example: false },
    message: { type: 'string', example: 'Some Error Happened' },
    data: { type: 'object', additionalProperties: true },
  },
};

// Request bodies (used by routes’ requestBody definitions).
const AuthSignupRequest = {
  type: 'object',
  required: ['name', 'userId', 'email', 'password', 'userType'],
  properties: {
    name: { type: 'string' },
    userId: { type: 'string' },
    email: { type: 'string' },
    password: { type: 'string', format: 'password' },
    userType: { type: 'string', enum: ['CUSTOMER', 'ADMIN'] },
  },
};

const AuthSigninRequest = {
  type: 'object',
  required: ['userId', 'password'],
  properties: {
    userId: { type: 'string' },
    password: { type: 'string', format: 'password' },
  },
};

const ProductCreateRequest = {
  type: 'object',
  required: ['name', 'description', 'price', 'categoryId'],
  properties: {
    name: { type: 'string' },
    description: { type: 'string' },
    price: { type: 'number' },
    categoryId: { type: 'string' },
    stock: { type: 'number', example: 0 },
  },
};

const ProductUpdateRequest = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    description: { type: 'string' },
    price: { type: 'number' },
    categoryId: { type: 'string' },
    stock: { type: 'number', example: 0 },
  },
};

const OrderCreateRequest = {
  type: 'object',
  required: ['items'],
  properties: {
    items: {
      type: 'array',
      minItems: 1,
      items: {
        type: 'object',
        required: ['productId', 'quantity'],
        properties: {
          productId: { type: 'string' },
          quantity: { type: 'number', minimum: 1 },
        },
      },
    },
  },
};

const OrderStatusUpdateRequest = {
  type: 'object',
  required: ['status'],
  properties: {
    status: {
      type: 'string',
      enum: ['PLACED', 'SHIPPED', 'DELIVERED', 'CANCELLED'],
    },
  },
};

module.exports = {
  components: {
    schemas: {
      ApiResponse,
      User,
      Product,
      Order,
      Error,
      AuthSignupRequest,
      AuthSigninRequest,
      ProductCreateRequest,
      ProductUpdateRequest,
      OrderCreateRequest,
      OrderStatusUpdateRequest,
    },
  },
};

