const express = require('express');
const router = express.Router();
const supplierController = require('../controllers/supplierController');
const { isLoggedIn, isAdmin } = require('../middleware/auth');

router.get('/', isLoggedIn, supplierController.index);
router.get('/new', isLoggedIn, isAdmin, supplierController.newForm);
router.post('/', isLoggedIn, isAdmin, supplierController.create);
router.get('/:id/edit', isLoggedIn, isAdmin, supplierController.editForm);
router.put('/:id', isLoggedIn, isAdmin, supplierController.update);
router.delete('/:id', isLoggedIn, isAdmin, supplierController.delete);

module.exports = router;