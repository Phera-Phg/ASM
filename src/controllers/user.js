
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
//Kiểm tra định dạng email
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  //Kiểm tra password
  const isValidPassword = (password) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{6,}$/;
    return passwordRegex.test(password);
  };

// Tạo người dùng mới
exports.createUser = async (req, res) => {
  try {
    const { name, email, password, address, phone} = req.body;

    // Kiểm tra các trường bắt buộc
    if (!name || !email || !password ) {
      return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin.' });
    }
    //Kiểm tra định dạng email
  if (!isValidEmail(email)) {
    return res.status(400).json({
      status: 400,
      message: "Email không hợp lệ",
    });
  }
  //Kiểm tra password
  if (!isValidPassword(password)) {
    return res.status(400).json({
      status: 400,
      message:
        "Mật khẩu phải chứa ít nhất 6 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt",
    });
  }
    // Kiểm tra email đã tồn tại hay chưa
    const checkUser = await User.findOne({ email });
    if (checkUser) {
      return res.status(400).json({ message: 'Email đã tồn tại.' });
    }

    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ name, email, password: hashedPassword, address, phone });
    const savedUser = await user.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi tạo người dùng.', error:error.message });
  }
};




// Hàm login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Kiểm tra các trường bắt buộc
    if (!email || !password) {
      return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin.' });
    }

    // Kiểm tra email hợp lệ
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Email hoặc mật khẩu không đúng.' });
    }

    // Kiểm tra mật khẩu
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Email hoặc mật khẩu không đúng.' });
    }

    // Kiểm tra biến môi trường JWT_SECRET
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET chưa được thiết lập trong biến môi trường.');
      return res.status(500).json({ message: 'Lỗi máy chủ nội bộ.' });
    }

    // Tạo token JWT
    const token = jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    console.error('Lỗi khi đăng nhập:', error);
    res.status(500).json({ message: 'Lỗi khi đăng nhập.', error:error.message });
  }
};

// Lấy tất cả người dùng
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy danh sách người dùng.' });
  }
};

// Lấy người dùng theo ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Người dùng không tồn tại.' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy thông tin người dùng.', error:error.message });
  }
};

// Cập nhật người dùng
exports.updateUser = async (req, res) => {
  try {
    const { name, email, address, phone, role } = req.body;

    const user = await User.findByIdAndUpdate(req.params.id, { name, email, address, phone, role }, { new: true });
    if (!user) {
      return res.status(404).json({ message: 'Người dùng không tồn tại.' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi cập nhật thông tin người dùng.', error:error.message });
  }
};

// Xóa người dùng
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Người dùng không tồn tại.' });
    }
    res.status(200).json({ message: 'Đã xóa người dùng thành công.' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi xóa người dùng.', error:error.message });
  }
};
