const Product = require('../models/product');

// Tạo sản phẩm mới
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, category_id, images } = req.body;

    if (!name || !description || !price || !category_id || !images || images.length === 0) {
      return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin.' });
    }

    const product = new Product({ name, description, price, category_id, images });
    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi tạo sản phẩm.', error: error.message });
  }
};

// Lấy tất cả sản phẩm
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('category_id',"name");
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy danh sách sản phẩm.', error: error.message });
  }
};

// Lấy sản phẩm theo ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category_id', "name");
    if (!product) {
      return res.status(404).json({ message: 'Sản phẩm không tồn tại.' });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy thông tin sản phẩm.', error: error.message });
  }
};

// Cập nhật sản phẩm
exports.updateProduct = async (req, res) => {
  try {
    const { name, description, price, category_id, images } = req.body;
    const product = await Product.findByIdAndUpdate(req.params.id, { name, description, price, category_id, images }, { new: true });
    if (!product) {
      return res.status(404).json({ message: 'Sản phẩm không tồn tại.' });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi cập nhật sản phẩm.', error:error.message });
  }
};

// Xóa sản phẩm
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Sản phẩm không tồn tại.' });
    }
    res.status(200).json({ message: 'Đã xóa sản phẩm thành công.' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi xóa sản phẩm.', error:error.message });
  }
};

exports.getPage = async (req, res) => {
  try {
    const {
      name,
      category,
      minPrice,
      maxPrice,
      sortBy = 'createdAt',
      order = 'desc',
      page = 1,
      limit = 10,
    } = req.query;

    const query = {};
    if (name) query.name = new RegExp(name, 'i');
    if (category) query.category = category;
    if (minPrice) query.price = { $gte: minPrice };
    if (maxPrice) query.price = { ...query.price, $lte: maxPrice };

    const products = await Product.find(query)
      .sort({ [sortBy]: order === 'desc' ? -1 : 1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const totalProducts = await Product.countDocuments(query);

    res.json({
      products,
      totalProducts,
      totalPages: Math.ceil(totalProducts / limit),
      currentPage: parseInt(page),
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi máy chủ nội bộ', error });
  }
};
