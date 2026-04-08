const orderController = require("../controllers/order.controller");
const authMW = require("../middlewares/auth.mw");

module.exports = (app) => {
  /**
   * @openapi
   * /api/v1/orders:
   *   post:
   *     tags:
   *       - Orders
   *     summary: Create a new order (authenticated)
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/OrderCreateRequest'
   *     responses:
   *       '201':
   *         description: Created
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 message:
   *                   type: string
   *                   example: Order created
   *                 data:
   *                   $ref: '#/components/schemas/Order'
   *               required:
   *                 - success
   *                 - message
   *                 - data
   *       '400':
   *         description: Bad Request
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       '401':
   *         description: Unauthorized
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       '500':
   *         description: Internal Server Error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  app.post("/api/v1/orders", [authMW.verifyToken], orderController.createOrder);

  /**
   * @openapi
   * /api/v1/orders:
   *   get:
   *     tags:
   *       - Orders
   *     summary: List orders (pagination, sorting, filtering by status)
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *           minimum: 1
   *         description: Page number
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           minimum: 1
   *         description: Items per page
   *       - in: query
   *         name: sorting
   *         schema:
   *           type: string
   *           example: createdAt:desc
   *         description: Sorting format field:asc or field:desc
   *       - in: query
   *         name: status
   *         schema:
   *           type: string
   *           enum:
   *             - PLACED
   *             - SHIPPED
   *             - DELIVERED
   *             - CANCELLED
   *         description: Filter by order status
   *     responses:
   *       '200':
   *         description: OK
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 message:
   *                   type: string
   *                   example: Orders fetched
   *                 data:
   *                   type: object
   *                   properties:
   *                     items:
   *                       type: array
   *                       items:
   *                         $ref: '#/components/schemas/Order'
   *                     pagination:
   *                       type: object
   *                       properties:
   *                         page:
   *                           type: integer
   *                         limit:
   *                           type: integer
   *                         total:
   *                           type: integer
   *               required:
   *                 - success
   *                 - message
   *                 - data
   *       '401':
   *         description: Unauthorized
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       '500':
   *         description: Internal Server Error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  app.get("/api/v1/orders", [authMW.verifyToken], orderController.listOrders);

  /**
   * @openapi
   * /api/v1/orders/{orderId}:
   *   get:
   *     tags:
   *       - Orders
   *     summary: Get order by orderId
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: orderId
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       '200':
   *         description: OK
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 message:
   *                   type: string
   *                   example: Order fetched
   *                 data:
   *                   $ref: '#/components/schemas/Order'
   *               required:
   *                 - success
   *                 - message
   *                 - data
   *       '400':
   *         description: Bad Request
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       '401':
   *         description: Unauthorized
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       '500':
   *         description: Internal Server Error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  app.get("/api/v1/orders/:orderId", [authMW.verifyToken], orderController.getOrder);

  /**
   * @openapi
   * /api/v1/orders/{orderId}/status:
   *   patch:
   *     tags:
   *       - Orders
   *     summary: Update order status (Admin)
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: orderId
   *         required: true
   *         schema:
   *           type: string
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/OrderStatusUpdateRequest'
   *     responses:
   *       '200':
   *         description: OK
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ApiResponse'
   *       '400':
   *         description: Bad Request
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       '401':
   *         description: Unauthorized
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       '500':
   *         description: Internal Server Error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  app.patch(
    "/api/v1/orders/:orderId/status",
    [authMW.verifyToken, authMW.isAdmin],
    orderController.updateOrderStatus
  );
};

