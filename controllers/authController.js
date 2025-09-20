const User = require('../models/user');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

// Email transporter configuration
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

class AuthController {
  // Hiển thị trang đăng ký
  static showRegister(req, res) {
    res.render('auth/register', { 
      title: 'Đăng ký',
      error: null 
    });
  }

  // Xử lý đăng ký
  static async register(req, res) {
    try {
      const { username, password, email, phone } = req.body;

      // Kiểm tra user đã tồn tại
      const existingUser = await User.findOne({
        $or: [{ username }, { email }]
      });

      if (existingUser) {
        return res.render('auth/register', {
          title: 'Đăng ký',
          error: 'Tên đăng nhập hoặc email đã tồn tại'
        });
      }

      // Tạo user mới
      const user = new User({
        username,
        password,
        email,
        phone
      });

      await user.save();

      res.redirect('/auth/login?success=Đăng ký thành công! Vui lòng đăng nhập.');
    } catch (error) {
      console.error('Registration error:', error);
      res.render('auth/register', {
        title: 'Đăng ký',
        error: 'Có lỗi xảy ra khi đăng ký'
      });
    }
  }

  // Hiển thị trang đăng nhập
  static showLogin(req, res) {
    const success = req.query.success || null;
    res.render('auth/login', { 
      title: 'Đăng nhập',
      error: null,
      success 
    });
  }

  // Xử lý đăng nhập
  static async login(req, res) {
    try {
      const { username, password } = req.body;

      // Tìm user
      const user = await User.findOne({ username });
      if (!user) {
        return res.render('auth/login', {
          title: 'Đăng nhập',
          error: 'Tên đăng nhập không tồn tại',
          success: null
        });
      }

      // Kiểm tra mật khẩu
      const isValidPassword = await user.comparePassword(password);
      if (!isValidPassword) {
        return res.render('auth/login', {
          title: 'Đăng nhập',
          error: 'Mật khẩu không chính xác',
          success: null
        });
      }

      // Lưu user vào session
      req.session.user = {
        id: user._id,
        username: user.username,
        email: user.email
      };

      res.redirect('/');
    } catch (error) {
      console.error('Login error:', error);
      res.render('auth/login', {
        title: 'Đăng nhập',
        error: 'Có lỗi xảy ra khi đăng nhập',
        success: null
      });
    }
  }

  // Hiển thị trang quên mật khẩu
  static showForgotPassword(req, res) {
    res.render('auth/forgot', { 
      title: 'Quên mật khẩu',
      error: null,
      success: null 
    });
  }

  // Xử lý quên mật khẩu
  static async forgotPassword(req, res) {
    try {
      const { email } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        return res.render('auth/forgot', {
          title: 'Quên mật khẩu',
          error: 'Email không tồn tại trong hệ thống',
          success: null
        });
      }

      // Tạo reset token
      const resetToken = crypto.randomBytes(32).toString('hex');
      user.resetPasswordToken = resetToken;
      user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

      await user.save();

      // Gửi email (chỉ log token trong môi trường development)
      if (process.env.NODE_ENV === 'development') {
        console.log('Reset token for', email, ':', resetToken);
        console.log('Reset URL: http://localhost:3000/auth/reset/' + resetToken);
      } else {
        // Gửi email thực tế trong production
        const mailOptions = {
          to: email,
          subject: 'Đặt lại mật khẩu',
          text: `Vui lòng click vào link sau để đặt lại mật khẩu: http://localhost:3000/auth/reset/${resetToken}`
        };

        await transporter.sendMail(mailOptions);
      }

      res.render('auth/forgot', {
        title: 'Quên mật khẩu',
        error: null,
        success: 'Vui lòng kiểm tra email để đặt lại mật khẩu'
      });
    } catch (error) {
      console.error('Forgot password error:', error);
      res.render('auth/forgot', {
        title: 'Quên mật khẩu',
        error: 'Có lỗi xảy ra',
        success: null
      });
    }
  }

  // Hiển thị trang đặt lại mật khẩu
  static async showResetPassword(req, res) {
    try {
      const { token } = req.params;

      const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() }
      });

      if (!user) {
        return res.render('auth/forgot', {
          title: 'Quên mật khẩu',
          error: 'Token không hợp lệ hoặc đã hết hạn',
          success: null
        });
      }

      res.render('auth/reset', { 
        title: 'Đặt lại mật khẩu',
        token,
        error: null 
      });
    } catch (error) {
      console.error('Show reset password error:', error);
      res.redirect('/auth/forgot');
    }
  }

  // Xử lý đặt lại mật khẩu
  static async resetPassword(req, res) {
    try {
      const { token } = req.params;
      const { password, confirmPassword } = req.body;

      if (password !== confirmPassword) {
        return res.render('auth/reset', {
          title: 'Đặt lại mật khẩu',
          token,
          error: 'Mật khẩu xác nhận không khớp'
        });
      }

      const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() }
      });

      if (!user) {
        return res.render('auth/reset', {
          title: 'Đặt lại mật khẩu',
          token,
          error: 'Token không hợp lệ hoặc đã hết hạn'
        });
      }

      user.password = password;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();

      res.redirect('/auth/login?success=Đặt lại mật khẩu thành công! Vui lòng đăng nhập.');
    } catch (error) {
      console.error('Reset password error:', error);
      res.render('auth/reset', {
        title: 'Đặt lại mật khẩu',
        token: req.params.token,
        error: 'Có lỗi xảy ra'
      });
    }
  }

  // Đăng xuất
  static logout(req, res) {
    req.session.destroy((err) => {
      if (err) {
        console.error('Logout error:', err);
      }
      res.clearCookie('connect.sid');
      res.redirect('/');
    });
  }
}

module.exports = AuthController;