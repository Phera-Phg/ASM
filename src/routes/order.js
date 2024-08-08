const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order');
const auth = require('../middleware/auth');

/**
 * @swagger
 * components:
 *   schemas:
 *     Order:
 *       type: object
 *       required:
 *         - customer_id
 *         - products
 *         - shippingAddress
 *       properties:
 *         _id:
 *           type: string
 *           description: ID tự động của đơn hàng
 *         customer_id:
 *           type: string
 *           description: ID của khách hàng
 *         products:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               product_id:
 *                 type: string
 *                 description: ID của sản phẩm
 *               quantity:
 *                 type: integer
 *                 description: Số lượng sản phẩm
 *               price:
 *                 type: number
 *                 description: Giá của sản phẩm (lấy từ cơ sở dữ liệu)
 *         total_price:
 *           type: number
 *           description: Tổng giá của đơn hàng
 *         status:
 *           type: integer
 *           description: Trạng thái đơn hàng 
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Thời điểm tạo đơn hàng
 *         shippingAddress:
 *           type: string
 *           description: Địa chỉ giao hàng

 */

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Tạo mới đơn hàng
 *     tags: [Order]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               customer_id:
 *                 type: string
 *                 description: ID của khách hàng
 *               products:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     product_id:
 *                       type: string
 *                       description: ID của sản phẩm
 *                     quantity:
 *                       type: number
 *                       description: Số lượng sản phẩm
 *               shippingAddress:
 *                 type: string
 *                 description: Địa chỉ giao hàng
 *     responses:
 *       201:
 *         description: Đơn hàng đã được tạo thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       400:
 *         description: Yêu cầu không hợp lệ
 *       500:
 *         description: Có lỗi xảy ra trên máy chủ
 */
router.post('/orders', orderController.createOrder);

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Lấy danh sách tất cả các đơn hàng
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách các đơn hàng
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *       500:
 *         description: Có lỗi xảy ra trên máy chủ
 */
router.get('/orders',auth([0]), orderController.getOrders);

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Lấy thông tin đơn hàng theo ID
 *     tags: [Order]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID của đơn hàng
 *     responses:
 *       200:
 *         description: Thông tin của đơn hàng theo ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       404:
 *         description: Đơn hàng không tồn tại
 *       500:
 *         description: Có lỗi xảy ra trên máy chủ
 */
router.get('/orders/:id', orderController.getOrderById);

/**
 * @swagger
 * /orders/{id}:
 *   put:
 *     summary: Cập nhật đơn hàng theo ID
 *     tags: [Order]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID của đơn hàng
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               customer_id:
 *                 type: string
 *                 description: ID của khách hàng
 *               products:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     product_id:
 *                       type: string
 *                       description: ID của sản phẩm
 *                     quantity:
 *                       type: number
 *                       description: Số lượng sản phẩm
 *               shippingAddress:
 *                 type: string
 *                 description: Địa chỉ giao hàng
 *     responses:
 *       200:
 *         description: Đơn hàng đã được cập nhật
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       404:
 *         description: Đơn hàng không tồn tại
 *       500:
 *         description: Có lỗi xảy ra trên máy chủ
 */
router.put('/orders/:id', orderController.updateOrder);

/**
 * @swagger
 * /orders/{id}:
 *   delete:
 *     summary: Xóa đơn hàng theo ID
 *     tags: [Order]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID của đơn hàng
 *     responses:
 *       200:
 *         description: Đơn hàng đã được xóa
 *       404:
 *         description: Đơn hàng không tồn tại
 *       500:
 *         description: Có lỗi xảy ra trên máy chủ
 */
router.delete('/orders/:id', orderController.deleteOrder);

module.exports = router;
