# Hệ thống Quản lý Sản phẩm và Nhà cung cấp

Đây là một ứng dụng web quản lý sản phẩm và nhà cung cấp được xây dựng bằng Node.js, Express.js, MongoDB và EJS.

## Tính năng chính

### 🔐 Hệ thống xác thực người dùng
- Đăng ký tài khoản mới
- Đăng nhập/Đăng xuất
- Quên mật khẩu (gửi email reset)
- Bảo mật với session và cookie

### 👥 Quản lý người dùng
- Thông tin: username, password, email, phone
- Xác thực bằng session
- Bảo vệ các trang quản trị

### 🏭 Quản lý nhà cung cấp
- **CRUD đầy đủ**: Thêm, Sửa, Xóa, Xem chi tiết
- Thông tin: Tên, Địa chỉ, Số điện thoại
- Yêu cầu đăng nhập để thao tác

### 📦 Quản lý sản phẩm
- **CRUD đầy đủ**: Thêm, Sửa, Xóa, Xem chi tiết
- Thông tin: Tên, Giá, Số lượng, Mã tham chiếu nhà cung cấp
- Tìm kiếm theo tên sản phẩm
- Lọc theo nhà cung cấp
- Yêu cầu đăng nhập để thao tác

### 🏠 Trang chủ công cộng
- Xem danh sách sản phẩm (không cần đăng nhập)
- Menu chọn sản phẩm theo nhà cung cấp
- Thanh tìm kiếm sản phẩm theo tên
- Giao diện responsive

## Công nghệ sử dụng

- **Backend**: Node.js, Express.js
- **Database**: MongoDB với Mongoose
- **Template Engine**: EJS
- **Authentication**: Express-session, bcryptjs
- **Frontend**: Bootstrap 5, Font Awesome
- **Email**: Nodemailer (cho quên mật khẩu)

## Cài đặt và chạy dự án

### 1. Yêu cầu hệ thống
- Node.js (version 14.0 trở lên)
- MongoDB (local hoặc MongoDB Atlas)
- npm hoặc yarn

### 2. Cài đặt dependencies

```bash
cd project-root
npm install
```

### 3. Cấu hình môi trường

Tạo file `.env` và cập nhật các thông tin sau:

```env
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/supplier_product_db
SESSION_SECRET=your-super-secret-session-key

# Email configuration (cho chức năng quên mật khẩu)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-email-password
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
```

### 4. Khởi động MongoDB

Đảm bảo MongoDB đang chạy trên máy của bạn:

```bash
# Nếu cài đặt local
mongod

# Hoặc sử dụng MongoDB Atlas (cloud)
```

### 5. Chạy ứng dụng

```bash
# Chế độ development (tự động restart khi có thay đổi)
npm run dev

# Hoặc chế độ production
npm start
```

### 6. Truy cập ứng dụng

Mở trình duyệt và truy cập: `http://localhost:3000`

## Cấu trúc thư mục

```
project-root/
├── app.js                 # File chính của ứng dụng
├── package.json           # Dependencies và scripts
├── .env                   # Biến môi trường
├── config/
│   └── session.js         # Cấu hình session
├── controllers/
│   ├── authController.js  # Xử lý authentication
│   ├── productController.js # Xử lý CRUD sản phẩm
│   └── supplierController.js # Xử lý CRUD nhà cung cấp
├── middleware/
│   └── auth.js           # Middleware xác thực
├── models/
│   ├── user.js           # Model người dùng
│   ├── product.js        # Model sản phẩm
│   └── supplier.js       # Model nhà cung cấp
├── routes/
│   ├── index.js          # Routes trang chủ
│   ├── auth.js           # Routes authentication
│   ├── products.js       # Routes sản phẩm
│   └── suppliers.js      # Routes nhà cung cấp
├── views/
│   ├── partials/
│   │   ├── header.ejs    # Header chung
│   │   └── footer.ejs    # Footer chung
│   ├── auth/             # Trang authentication
│   ├── products/         # Trang quản lý sản phẩm
│   ├── suppliers/        # Trang quản lý nhà cung cấp
│   ├── index.ejs         # Trang chủ
│   └── error.ejs         # Trang lỗi
└── public/
    ├── css/
    │   └── style.css     # CSS tùy chỉnh
    └── js/
        └── main.js       # JavaScript tùy chỉnh
```

## API Routes

### Authentication Routes
- `GET /auth/register` - Trang đăng ký
- `POST /auth/register` - Xử lý đăng ký
- `GET /auth/login` - Trang đăng nhập
- `POST /auth/login` - Xử lý đăng nhập
- `POST /auth/logout` - Đăng xuất
- `GET /auth/forgot` - Trang quên mật khẩu
- `POST /auth/forgot` - Xử lý quên mật khẩu
- `GET /auth/reset/:token` - Trang reset mật khẩu
- `POST /auth/reset/:token` - Xử lý reset mật khẩu

### Product Routes (yêu cầu đăng nhập)
- `GET /products` - Danh sách sản phẩm
- `GET /products/create` - Form thêm sản phẩm
- `POST /products` - Lưu sản phẩm mới
- `GET /products/:id` - Chi tiết sản phẩm
- `GET /products/:id/edit` - Form sửa sản phẩm
- `PUT /products/:id` - Cập nhật sản phẩm
- `DELETE /products/:id` - Xóa sản phẩm

### Supplier Routes (yêu cầu đăng nhập)
- `GET /suppliers` - Danh sách nhà cung cấp
- `GET /suppliers/create` - Form thêm nhà cung cấp
- `POST /suppliers` - Lưu nhà cung cấp mới
- `GET /suppliers/:id` - Chi tiết nhà cung cấp
- `GET /suppliers/:id/edit` - Form sửa nhà cung cấp
- `PUT /suppliers/:id` - Cập nhật nhà cung cấp
- `DELETE /suppliers/:id` - Xóa nhà cung cấp

### Public Routes
- `GET /` - Trang chủ (có tìm kiếm và lọc)

## Tính năng bảo mật

- Mật khẩu được hash bằng bcryptjs
- Session được bảo vệ bằng secret key
- Middleware xác thực cho các trang quản trị
- Validation dữ liệu đầu vào
- CSRF protection (có thể thêm)

## Hướng dẫn sử dụng

1. **Đăng ký tài khoản**: Truy cập `/auth/register`
2. **Đăng nhập**: Sử dụng tài khoản vừa tạo
3. **Thêm nhà cung cấp**: Vào menu "Quản lý nhà cung cấp"
4. **Thêm sản phẩm**: Vào menu "Quản lý sản phẩm"
5. **Tìm kiếm**: Sử dụng thanh tìm kiếm ở trang chủ

## Phát triển thêm

- [ ] Thêm phân quyền admin/user
- [ ] Upload hình ảnh sản phẩm
- [ ] Xuất báo cáo Excel/PDF
- [ ] Dashboard thống kê
- [ ] API REST cho mobile app
- [ ] Realtime notifications
- [ ] Đa ngôn ngữ

## Liên hệ

Nếu có thắc mắc hoặc góp ý, vui lòng tạo issue trong repository này.

## License

MIT License