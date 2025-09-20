const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const Supplier = require('../models/supplier');

// Trang chủ
router.get('/', async (req, res) => {
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
      .sort({ createdAt: -1 })
      .limit(20);
    
    const suppliers = await Supplier.find().sort({ name: 1 });

    res.render('index', {
      title: 'Trang chủ - Quản lý sản phẩm',
      products,
      suppliers,
      selectedSupplier: supplier || '',
      searchQuery: search || ''
    });
  } catch (error) {
    console.error('Home page error:', error);
    res.render('error', { error: 'Có lỗi xảy ra khi tải trang chủ' });
  }
});

module.exports = router;