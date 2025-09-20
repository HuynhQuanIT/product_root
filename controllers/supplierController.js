const Supplier = require('../models/supplier');

class SupplierController {
  // Hiển thị danh sách nhà cung cấp
  static async index(req, res) {
    try {
      const suppliers = await Supplier.find().sort({ createdAt: -1 });
      res.render('suppliers/index', {
        title: 'Quản lý nhà cung cấp',
        suppliers
      });
    } catch (error) {
      console.error('Supplier index error:', error);
      res.render('error', { error: 'Có lỗi xảy ra khi tải danh sách nhà cung cấp' });
    }
  }

  // Hiển thị form tạo nhà cung cấp mới
  static create(req, res) {
    res.render('suppliers/form', {
      title: 'Thêm nhà cung cấp mới',
      supplier: {},
      action: '/suppliers',
      method: 'POST'
    });
  }

  // Lưu nhà cung cấp mới
  static async store(req, res) {
    try {
      const { name, address, phone } = req.body;
      
      const supplier = new Supplier({
        name,
        address,
        phone
      });

      await supplier.save();
      res.redirect('/suppliers?success=Thêm nhà cung cấp thành công');
    } catch (error) {
      console.error('Supplier store error:', error);
      res.render('suppliers/form', {
        title: 'Thêm nhà cung cấp mới',
        supplier: req.body,
        action: '/suppliers',
        method: 'POST',
        error: 'Có lỗi xảy ra khi thêm nhà cung cấp'
      });
    }
  }

  // Hiển thị chi tiết nhà cung cấp
  static async show(req, res) {
    try {
      const supplier = await Supplier.findById(req.params.id);
      if (!supplier) {
        return res.status(404).render('error', { error: 'Nhà cung cấp không tồn tại' });
      }

      res.render('suppliers/show', {
        title: `Chi tiết nhà cung cấp: ${supplier.name}`,
        supplier
      });
    } catch (error) {
      console.error('Supplier show error:', error);
      res.render('error', { error: 'Có lỗi xảy ra khi tải thông tin nhà cung cấp' });
    }
  }

  // Hiển thị form chỉnh sửa nhà cung cấp
  static async edit(req, res) {
    try {
      const supplier = await Supplier.findById(req.params.id);
      if (!supplier) {
        return res.status(404).render('error', { error: 'Nhà cung cấp không tồn tại' });
      }

      res.render('suppliers/form', {
        title: `Chỉnh sửa nhà cung cấp: ${supplier.name}`,
        supplier,
        action: `/suppliers/${supplier._id}?_method=PUT`,
        method: 'POST'
      });
    } catch (error) {
      console.error('Supplier edit error:', error);
      res.render('error', { error: 'Có lỗi xảy ra khi tải form chỉnh sửa' });
    }
  }

  // Cập nhật nhà cung cấp
  static async update(req, res) {
    try {
      const { name, address, phone } = req.body;
      
      const supplier = await Supplier.findByIdAndUpdate(
        req.params.id,
        { name, address, phone },
        { new: true, runValidators: true }
      );

      if (!supplier) {
        return res.status(404).render('error', { error: 'Nhà cung cấp không tồn tại' });
      }

      res.redirect('/suppliers?success=Cập nhật nhà cung cấp thành công');
    } catch (error) {
      console.error('Supplier update error:', error);
      res.render('suppliers/form', {
        title: 'Chỉnh sửa nhà cung cấp',
        supplier: { _id: req.params.id, ...req.body },
        action: `/suppliers/${req.params.id}?_method=PUT`,
        method: 'POST',
        error: 'Có lỗi xảy ra khi cập nhật nhà cung cấp'
      });
    }
  }

  // Xóa nhà cung cấp
  static async destroy(req, res) {
    try {
      const supplier = await Supplier.findByIdAndDelete(req.params.id);
      if (!supplier) {
        return res.status(404).json({ success: false, message: 'Nhà cung cấp không tồn tại' });
      }

      res.json({ success: true, message: 'Xóa nhà cung cấp thành công' });
    } catch (error) {
      console.error('Supplier destroy error:', error);
      res.status(500).json({ success: false, message: 'Có lỗi xảy ra khi xóa nhà cung cấp' });
    }
  }
}

module.exports = SupplierController;