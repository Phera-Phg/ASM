const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category');
const auth = require('../middleware/auth');

/**
 * @swagger
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         id:
 *           type: string
 *           description: ID tự động của danh mục
 *         name:
 *           type: string
 *           description: Tên của danh mục
 *       example:
 *         name: Điện tử
 */


/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Tạo mới danh mục
 *     tags: [Category]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Category'
 *     responses:
 *       201:
 *         description: Danh mục đã được tạo thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       500:
 *         description: Có lỗi xảy ra trên máy chủ
 */
router.post('/categories',auth([0]), categoryController.createCategory);

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Lấy danh sách tất cả các danh mục
 *     tags: [Category]
 *     responses:
 *       200:
 *         description: Danh sách các danh mục
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 */
router.get('/categories', categoryController.getCategories);

/**
 * @swagger
 * /categories/{id}:
 *   get:
 *     summary: Lấy thông tin danh mục theo ID
 *     tags: [Category]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID của danh mục
 *     responses:
 *       200:
 *         description: Thông tin của danh mục theo ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       404:
 *         description: Danh mục không tồn tại
 */
router.get('/categories/:id', categoryController.getCategoryById);

/**
 * @swagger
 * /categories/{id}:
 *   put:
 *     summary: Cập nhật danh mục theo ID
 *     tags: [Category]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID của danh mục
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Category'
 *     responses:
 *       200:
 *         description: Danh mục đã được cập nhật
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       404:
 *         description: Danh mục không tồn tại
 *       500:
 *         description: Có lỗi xảy ra
 */
router.put('/categories/:id',auth([0]), categoryController.updateCategory);

/**
 * @swagger
 * /categories/{id}:
 *   delete:
 *     summary: Xóa danh mục theo ID
 *     tags: [Category]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID của danh mục
 *     responses:
 *       200:
 *         description: Danh mục đã được xóa
 *       404:
 *         description: Danh mục không tồn tại
 */
router.delete('/categories/:id',auth([0]), categoryController.deleteCategory);

module.exports = router;
