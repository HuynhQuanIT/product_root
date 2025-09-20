const Product = require('../models/product');
const Supplier = require('../models/supplier');

class ProductController {
  // Hiển thị danh sách sản phẩm
  static async index(req, res) {
    try {
      const { supplier, search } = req.query;
      let query = {};
      
      // Lọc theo nhà cung cấp
      if (supplier) {
        query.supplier = supplier;
      }
      
      // Tìm kiếm theo tên sản phẩm
      if (search) {
        query.name = { $regex: search, $options: 'i' };
      }

      const products = await Product.find(query)
        .populate('supplier', 'name')
        .sort({ createdAt: -1 });
      
      const suppliers = await Supplier.find().sort({ name: 1 });

      res.render('products/index', {
        title: 'Quản lý sản phẩm',
        products,
        suppliers,
        selectedSupplier: supplier || '',
        searchQuery: search || ''
      });
    } catch (error) {
      console.error('Product index error:', error);
      res.render('error', { error: 'Có lỗi xảy ra khi tải danh sách sản phẩm' });
    }
  }

  // Hiển thị form tạo sản phẩm mới
  static async create(req, res) {
    try {
      const suppliers = await Supplier.find().sort({ name: 1 });
      res.render('products/form', {
        title: 'Thêm sản phẩm mới',
        product: {},
        suppliers,
        action: '/products',
        method: 'POST'
      });
    } catch (error) {
      console.error('Product create error:', error);
      res.render('error', { error: 'Có lỗi xảy ra khi tải form thêm sản phẩm' });
    }
  }

  // Lưu sản phẩm mới
  static async store(req, res) {
    try {
      const { name, price, quantity, supplier } = req.body;
      
      const product = new Product({
        name,
        price: parseFloat(price),
        quantity: parseInt(quantity),
        supplier
      });

      await product.save();
      res.redirect('/products?success=Thêm sản phẩm thành công');
    } catch (error) {
      console.error('Product store error:', error);
      const suppliers = await Supplier.find().sort({ name: 1 });
      res.render('products/form', {
        title: 'Thêm sản phẩm mới',
        product: req.body,
        suppliers,
        action: '/products',
        method: 'POST',
        error: 'Có lỗi xảy ra khi thêm sản phẩm'
      });
    }
  }

  // Hiển thị chi tiết sản phẩm
  static async show(req, res) {
    try {
      const product = await Product.findById(req.params.id).populate('supplier');
      if (!product) {
        return res.status(404).render('error', { error: 'Sản phẩm không tồn tại' });
      }

      res.render('products/show', {
        title: `Chi tiết sản phẩm: ${product.name}`,
        product
      });
    } catch (error) {
      console.error('Product show error:', error);
      res.render('error', { error: 'Có lỗi xảy ra khi tải thông tin sản phẩm' });
    }
  }

  // Hiển thị form chỉnh sửa sản phẩm
  static async edit(req, res) {
    try {
      const product = await Product.findById(req.params.id);
      const suppliers = await Supplier.find().sort({ name: 1 });
      
      if (!product) {
        return res.status(404).render('error', { error: 'Sản phẩm không tồn tại' });
      }

      res.render('products/form', {
        title: `Chỉnh sửa sản phẩm: ${product.name}`,
        product,
        suppliers,
        action: `/products/${product._id}?_method=PUT`,
        method: 'POST'
      });
    } catch (error) {
      console.error('Product edit error:', error);
      res.render('error', { error: 'Có lỗi xảy ra khi tải form chỉnh sửa' });
    }
  }

  // Cập nhật sản phẩm
  static async update(req, res) {
    try {
      const { name, price, quantity, supplier } = req.body;
      
      const product = await Product.findByIdAndUpdate(
        req.params.id,
        { 
          name, 
          price: parseFloat(price), 
          quantity: parseInt(quantity), 
          supplier 
        },
        { new: true, runValidators: true }
      );

      if (!product) {
        return res.status(404).render('error', { error: 'Sản phẩm không tồn tại' });
      }

      res.redirect('/products?success=Cập nhật sản phẩm thành công');
    } catch (error) {
      console.error('Product update error:', error);
      const suppliers = await Supplier.find().sort({ name: 1 });
      res.render('products/form', {
        title: 'Chỉnh sửa sản phẩm',
        product: { _id: req.params.id, ...req.body },
        suppliers,
        action: `/products/${req.params.id}?_method=PUT`,
        method: 'POST',
        error: 'Có lỗi xảy ra khi cập nhật sản phẩm'
      });
    }
  }

  // Xóa sản phẩm
  static async destroy(req, res) {
    try {
      const product = await Product.findByIdAndDelete(req.params.id);
      if (!product) {
        return res.status(404).json({ success: false, message: 'Sản phẩm không tồn tại' });
      }

      res.json({ success: true, message: 'Xóa sản phẩm thành công' });
    } catch (error) {
      console.error('Product destroy error:', error);
      res.status(500).json({ success: false, message: 'Có lỗi xảy ra khi xóa sản phẩm' });
    }
  }
}

module.exports = ProductController;