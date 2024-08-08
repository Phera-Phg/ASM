const Category = require('../models/category');

// Tạo danh mục mới
exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    // Kiểm tra trường bắt buộc
    if (!name) {
      return res.status(400).json({ message: 'Tên danh mục là bắt buộc.' });
    }

    const category = new Category({ name });
    const savedCategory = await category.save();
    res.status(201).json(savedCategory);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi tạo danh mục.', error: error.message });
  }
};

// Lấy tất cả danh mục
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy danh sách danh mục.', error: error.message });
  }
};

// Lấy danh mục theo ID
exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Danh mục không tồn tại.' });
    }
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy thông tin danh mục.', error: error.message });
  }
};

// Cập nhật danh mục
exports.updateCategory = async (req, res) => {
  try {
    const { name } = req.body;

    // Kiểm tra trường bắt buộc
    if (!name) {
      return res.status(400).json({ message: 'Tên danh mục là bắt buộc.' });
    }

    const category = await Category.findByIdAndUpdate(req.params.id, { name }, { new: true });
    if (!category) {
      return res.status(404).json({ message: 'Danh mục không tồn tại.' });
    }
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi cập nhật danh mục.', error: error.message });
  }
};

// Xóa danh mục
exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Danh mục không tồn tại.' });
    }
    res.status(200).json({ message: 'Đã xóa danh mục thành công.' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi xóa danh mục.', error: error.message });
  }
};
