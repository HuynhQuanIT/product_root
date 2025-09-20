const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/productController');
const { requireAuth, methodOverride } = require('../middleware/auth');

// Áp dụng middleware xác thực cho tất cả routes
router.use(requireAuth);
router.use(methodOverride);

// CRUD routes for products
router.get('/', ProductController.index);
router.get('/create', ProductController.create);
router.post('/', ProductController.store);
router.get('/:id', ProductController.show);
router.get('/:id/edit', ProductController.edit);
router.put('/:id', ProductController.update);
router.delete('/:id', ProductController.destroy);

module.exports = router;