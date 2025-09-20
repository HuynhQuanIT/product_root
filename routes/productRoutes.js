const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { isLoggedIn, isAdmin } = require('../middleware/auth');

router.get('/', productController.index); // viewing products is public or require login? - choose public or require isLoggedIn
router.get('/new', isLoggedIn, isAdmin, productController.newForm);
router.post('/', isLoggedIn, isAdmin, productController.create);
router.get('/:id/edit', isLoggedIn, isAdmin, productController.editForm);
router.put('/:id', isLoggedIn, isAdmin, productController.update);
router.delete('/:id', isLoggedIn, isAdmin, productController.delete);

module.exports = router;