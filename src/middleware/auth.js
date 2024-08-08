// middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Hàm phân quyền
const auth = (requiredRoles = []) => {
  return async (req, res, next) => {
    try {
      // Lấy token từ header
      const token = req.header('Authorization')?.replace('Bearer ', '');
      if (!token) {
        return res.status(401).json({ message: 'Chưa đăng nhập: Không có token' });
      }

      // Xác minh token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded._id);

      if (!user) {
        return res.status(401).json({ message: 'Chưa đăng nhập 1: Token không hợp lệ' });
      }

      // Kiểm tra vai trò
      if (requiredRoles.length && !requiredRoles.includes(user.role)) {
        return res.status(403).json({ message: 'Cấm truy cập: Bạn không có quyền' });
      }

      // Gán user vào req
      req.user = user;
      next();
    } catch (error) {
      res.status(401).json({ message: 'Lỗi' });
    }
  };
};

module.exports = auth;
