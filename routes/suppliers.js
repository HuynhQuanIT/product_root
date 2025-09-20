const express = require('express');
const router = express.Router();
const SupplierController = require('../controllers/supplierController');
const { requireAuth, methodOverride } = require('../middleware/auth');

// Áp dụng middleware xác thực cho tất cả routes
router.use(requireAuth);
router.use(methodOverride);

// CRUD routes for suppliers
router.get('/', SupplierController.index);
router.get('/create', SupplierController.create);
router.post('/', SupplierController.store);
router.get('/:id', SupplierController.show);
router.get('/:id/edit', SupplierController.edit);
router.put('/:id', SupplierController.update);
router.delete('/:id', SupplierController.destroy);

module.exports = router;