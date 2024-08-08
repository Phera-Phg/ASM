const express = require('express');
const router = express.Router();
const productController = require('../controllers/product');
const auth = require('../middleware/auth');

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - name
 *         - description
 *         - price
 *         - category_id
 *         - images
 *       properties:
 *         id:
 *           type: string
 *           description: ID tự động của sản phẩm
 *         name:
 *           type: string
 *           description: Tên của sản phẩm
 *         description:
 *           type: string
 *           description: Mô tả của sản phẩm
 *         price:
 *           type: number
 *           description: Giá của sản phẩm
 *         category_id:
 *           type: string
 *           description: ID của danh mục sản phẩm
 *         images:
 *           type: array
 *           items:
 *             type: string
 *           description: Các hình ảnh của sản phẩm
 *       example:
 *         name: Điện thoại
 *         description: Điện thoại thông minh
 *         price: 10000000
 *         category_id: d5fE_asz
 *         images: ["image1.jpg", "image2.jpg"]
 */



/**
 * @swagger
 * /products:
 *   post:
 *     summary: Tạo mới sản phẩm
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       201:
 *         description: Sản phẩm đã được tạo thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Vui lòng điền đầy đủ thông tin
 *       500:
 *         description: Có lỗi xảy ra trên máy chủ
 */
router.post('/products',auth([0]), productController.createProduct);

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Lấy danh sách tất cả các sản phẩm
 *     tags: [Product]
 *     responses:
 *       200:
 *         description: Danh sách các sản phẩm
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       500:
 *         description: Lỗi khi lấy danh sách sản phẩm
 */
router.get('/products', productController.getProducts);

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Lấy thông tin sản phẩm theo ID
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID của sản phẩm
 *     responses:
 *       200:
 *         description: Thông tin của sản phẩm theo ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Sản phẩm không tồn tại
 *       500:
 *         description: Lỗi khi lấy thông tin sản phẩm
 */
router.get('/products/:id', productController.getProductById);

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Cập nhật sản phẩm theo ID
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID của sản phẩm
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: Sản phẩm đã được cập nhật
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Vui lòng điền đầy đủ thông tin
 *       404:
 *         description: Sản phẩm không tồn tại
 *       500:
 *         description: Lỗi khi cập nhật sản phẩm
 */
router.put('/products/:id',auth([0]), productController.updateProduct);

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Xóa sản phẩm theo ID
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID của sản phẩm
 *     responses:
 *       200:
 *         description: Sản phẩm đã được xóa
 *       404:
 *         description: Sản phẩm không tồn tại
 *       500:
 *         description: Lỗi khi xóa sản phẩm
 */
router.delete('/products/:id',auth([0]), productController.deleteProduct);

/**
 * @swagger
 * /getPage:
 *   get:
 *     summary: 'Lấy danh sách sản phẩm'
 *     tags: [Product]
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: 'Tìm kiếm sản phẩm theo tên.'
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: 'Tìm kiếm sản phẩm theo category.'
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: 'Lọc sản phẩm với giá tối thiểu.'
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: 'Lọc sản phẩm với giá tối đa.'
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [createdAt, price]
 *         description: 'Sắp xếp theo ngày đăng hoặc giá.'
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: 'Sắp xếp theo thứ tự tăng dần hoặc giảm dần.'
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: 'Số trang.'
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: 'Số lượng sản phẩm trên mỗi trang.'
 *     responses:
 *       200:
 *         description: 'Danh sách sản phẩm.'
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       500:
 *         description: 'Lỗi máy chủ nội bộ.'
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/getPage', productController.getPage);
module.exports = router;
