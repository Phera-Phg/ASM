const Order = require('../models/order');
const Product = require('../models/product');
const User = require('../models/user');

// Tạo đơn hàng mới
exports.createOrder = async (req, res) => {
  try {
    const { customer_id, products, shippingAddress } = req.body;

    if (!customer_id || !products || !shippingAddress) {
      return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin.' });
    }
     const user = await User.findById(customer_id);
     if (!user) {
       return res.status(400).json({ message: 'Người dùng không tồn tại.' });
     }
    let total_price = 0;
    const productsWithPrice = [];

    for (const item of products) {
      const product = await Product.findById(item.product_id);
      if (!product) {
        return res.status(400).json({ message: `Sản phẩm với ID ${item.product_id} không tồn tại.` });
      }
      const price = product.price;
      const itemTotalPrice = price * item.quantity;
      total_price += itemTotalPrice;

      productsWithPrice.push({
        product_id: item.product_id,
        quantity: item.quantity,
        price: price
      });
    }

    const order = new Order({
      customer_id,
      products: productsWithPrice,
      total_price,
      shippingAddress
    });

    const savedOrder = await order.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi tạo đơn hàng.', error: error.message });
  }
};
// Lấy tất cả đơn hàng
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('customer_id products.product_id');
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy danh sách đơn hàng.', error: error.message });
  }
};

// Lấy đơn hàng theo ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('customer_id products.product_id');
    if (!order) {
      return res.status(404).json({ message: 'Đơn hàng không tồn tại.' });
    }
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy thông tin đơn hàng.', error: error.message });
  }
};

// Cập nhật đơn hàng
exports.updateOrder = async (req, res) => {
  try {
    const { status, shippingAddress } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { status, shippingAddress }, { new: true });
    if (!order) {
      return res.status(404).json({ message: 'Đơn hàng không tồn tại.' });
    }
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi cập nhật đơn hàng.', error: error.message });
  }
};

// Xóa đơn hàng
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Đơn hàng không tồn tại.' });
    }
    res.status(200).json({ message: 'Đã xóa đơn hàng thành công.' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi xóa đơn hàng.', error: error.message });
  }
};
