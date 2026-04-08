const productController = require("../controllers/product.controller");
const authMW = require("../middlewares/auth.mw");

module.exports = (app) => {
  /**
   * @openapi
   * /api/v1/products:
   *   get:
   *     tags:
   *       - Products
   *     summary: List products (pagination, sorting, filtering)
   *     parameters:
   *       - in: query
   *         name: page
   *         schema: { type: integer, minimum: 1 }
   *         description: Page number
   *       - in: query
   *         name: limit
   *         schema: { type: integer, minimum: 1 }
   *         description: Items per page
   *       - in: query
   *         name: sorting
   *         schema: { type: string, example: "createdAt:desc" }
   *         description: "Sorting format: field:asc or field:desc"
   *       - in: query
   *         name: categoryId
   *         schema: { type: string }
   *         description: Filter by categoryId
   *       - in: query
   *         name: minPrice
   *         schema: { type: number }
   *         description: Filter by minimum price
   *       - in: query
   *         name: maxPrice
   *         schema: { type: number }
   *         description: Filter by maximum price
   *       - in: query
   *         name: q
   *         schema: { type: string }
   *         description: Search by product name (case-insensitive)
   *     responses:
   *       '200':
   *         description: OK
   *         content:
   *           application/json:
   *             schema:
   *               allOf:
   *                 - $ref: '#/components/schemas/ApiResponse'
   *                 - type: object
   *                   properties:
   *                     data:
   *                       type: object
   *                       properties:
   *                         items:
   *                           type: array
   *                           items:
   *                             $ref: '#/components/schemas/Product'
   *                         pagination:
   *                           type: object
   *                           properties:
   *                             page: { type: integer }
   *                             limit: { type: integer }
   *                             total: { type: integer }
   *                   required: [data]
   *       '400':
   *         description: Bad Request
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
  app.get("/api/v1/products", productController.listProducts);

  /**
   * @openapi
   * /api/v1/products/{productId}:
   *   get:
   *     tags:
   *       - Products
   *     summary: Get product by productId
   *     parameters:
   *       - in: path
   *         name: productId
   *         required: true
   *         schema: { type: string }
   *     responses:
   *       '200':
   *         description: OK
   *         content:
   *           application/json:
   *             schema:
   *               allOf:
   *                 - $ref: '#/components/schemas/ApiResponse'
   *                 - type: object
   *                   properties:
   *                     data:
   *                       $ref: '#/components/schemas/Product'
   *                   required: [data]
   *       '400':
   *         description: Bad Request
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
  app.get("/api/v1/products/:productId", productController.getProduct);

  /**
   * @openapi
   * /api/v1/products:
   *   post:
   *     tags:
   *       - Products
   *     summary: Create a new product (Admin)
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/ProductCreateRequest'
   *     responses:
   *       '201':
   *         description: Created
   *         content:
   *           application/json:
   *             schema:
   *               allOf:
   *                 - $ref: '#/components/schemas/ApiResponse'
   *                 - type: object
   *                   properties:
   *                     data:
   *                       $ref: '#/components/schemas/Product'
   *                   required: [data]
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
  app.post(
    "/api/v1/products",
    [authMW.verifyToken, authMW.isAdmin],
    productController.createProduct
  );

  /**
   * @openapi
   * /api/v1/products/{productId}:
   *   put:
   *     tags:
   *       - Products
   *     summary: Update a product (Admin)
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: productId
   *         required: true
   *         schema: { type: string }
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/ProductUpdateRequest'
   *     responses:
   *       '200':
   *         description: OK
   *         content:
   *           application/json:
   *             schema:
   *               allOf:
   *                 - $ref: '#/components/schemas/ApiResponse'
   *                 - type: object
   *                   properties:
   *                     data:
   *                       $ref: '#/components/schemas/Product'
   *                   required: [data]
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
  app.put(
    "/api/v1/products/:productId",
    [authMW.verifyToken, authMW.isAdmin],
    productController.updateProduct
  );

  /**
   * @openapi
   * /api/v1/products/{productId}:
   *   delete:
   *     tags:
   *       - Products
   *     summary: Delete a product (Admin)
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: productId
   *         required: true
   *         schema: { type: string }
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
  app.delete(
    "/api/v1/products/:productId",
    [authMW.verifyToken, authMW.isAdmin],
    productController.deleteProduct
  );
};

