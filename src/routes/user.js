// routes/user.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const auth = require('../middleware/auth');

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *       properties:
 *         _id:
 *           type: string
 *           description: ID tự động của người dùng
 *         name:
 *           type: string
 *           description: Tên người dùng
 *         email:
 *           type: string
 *           description: Email người dùng
 *         password:
 *           type: string
 *           description: Mật khẩu người dùng
 *         address:
 *           type: string
 *           description: Địa chỉ người dùng
 *         phone:
 *           type: string
 *           description: Số điện thoại người dùng
 *         role:
 *           type: integer
 *           description: Vai trò của người dùng
 *         created_at:
 *           type: date
 *           description: Thời điểm tạo người dùng
 */

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Tạo người dùng mới
 *     description: Tạo một người dùng mới với các thông tin như tên, email, mật khẩu, địa chỉ và số điện thoại. Đảm bảo email hợp lệ và mật khẩu phải bao gồm ít nhất 6 ký tự, có chữ hoa, chữ thường, số và ký tự đặc biệt.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
  *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               address:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       201:
 *         description: Người dùng được tạo thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Yêu cầu không hợp lệ
 *       500:
 *         description: Lỗi khi đăng ký
 */
router.post('/register', userController.createUser);

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Đăng nhập
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
  *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "phera231@gmail.com"
 *               password:
 *                 type: string
 *                 example: "Ph1234."
 *     responses:
 *       200:
 *         description: Đăng nhập thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Email hoặc mật khẩu không đúng hoặc thiếu thông tin
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Email hoặc mật khẩu không đúng."
 *       500:
 *         description: Lỗi khi đăng nhập
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Lỗi khi đăng nhập."
 * 
 */
router.post('/login', userController.login);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: 'Lấy danh sách tất cả người dùng'
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 'Danh sách người dùng.'
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       500:
 *         description: 'Lỗi lấy danh sách người dùng.'
 */
router.get('/users', auth([0]), userController.getUsers); // Chỉ cho phép người dùng với vai trò admin (0)

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: 'Lấy thông tin người dùng theo ID'
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 'ID của người dùng.'
 *     responses:
 *       200:
 *         description: 'Thông tin người dùng.'
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: 'Người dùng không tồn tại.'
 *       500:
 *         description: 'Lỗi lấy thông tin người dùng.'
 
 */
router.get('/users/:id', auth([0, 1]), userController.getUserById); // Cho phép người dùng với vai trò admin (0) và user (1)

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: 'Cập nhật thông tin người dùng'
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 'ID của người dùng.'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: 'Người dùng được cập nhật thành công.'
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: 'Người dùng không tồn tại.'
 
 *       500:
 *         description: 'Lỗi cập nhật người dùng.'
 
 */
router.put('/users/:id', auth([0]), userController.updateUser); // Chỉ cho phép người dùng với vai trò admin (0)

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: 'Xóa người dùng'
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 'ID của người dùng.'
 *     responses:
 *       200:
 *         description: 'Người dùng được xóa thành công.'
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: 'Người dùng không tồn tại.'
 
 *       500:
 *         description: 'Lỗi xoá người dùng.'

 */
router.delete('/users/:id', auth([0]), userController.deleteUser); // Chỉ cho phép người dùng với vai trò admin (0)



module.exports = router;
