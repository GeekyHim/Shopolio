const authController = require("../controllers/auth.controller");
const authMW = require("../middlewares/auth.mw");

module.exports = (app) => {
  /**
   * @openapi
   * /api/v1/auth/signup:
   *   post:
   *     tags:
   *       - Auth
   *     summary: Create a new user account
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/AuthSignupRequest'
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
   *                       $ref: '#/components/schemas/User'
   *                   required:
   *                     - data
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
  app.post("/api/v1/auth/signup", [authMW.verifySignUpBody], authController.signup);

  /**
   * @openapi
   * /api/v1/auth/signin:
   *   post:
   *     tags:
   *       - Auth
   *     summary: Sign in and get a JWT token
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/AuthSigninRequest'
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
   *                       additionalProperties: true
   *                   required:
   *                     - data
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
  app.post("/api/v1/auth/signin", [authMW.verifySignInBody], authController.signin);
};

