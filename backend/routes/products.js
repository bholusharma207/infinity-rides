const express = require('express');
const router = express.Router();
const { getProducts, getProduct, autocomplete, createProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const { protect } = require('../middleware/auth');
const adminOnly = require('../middleware/adminOnly');
const upload = require('../middleware/upload');

router.get('/autocomplete', autocomplete);
router.get('/', getProducts);
router.get('/:id', getProduct);
router.post('/', protect, adminOnly, upload.array('images', 5), createProduct);
router.put('/:id', protect, adminOnly, upload.array('images', 5), updateProduct);
router.delete('/:id', protect, adminOnly, deleteProduct);

module.exports = router;
