const express = require('express');
const router = express.Router();
const { getStats, getAllOrders, updateOrderStatus, getAllUsers, updateUser, getAllProducts } = require('../controllers/adminController');
const { protect } = require('../middleware/auth');
const adminOnly = require('../middleware/adminOnly');

router.use(protect, adminOnly);
router.get('/stats', getStats);
router.get('/orders', getAllOrders);
router.put('/orders/:id', updateOrderStatus);
router.get('/users', getAllUsers);
router.put('/users/:id', updateUser);
router.get('/products', getAllProducts);

module.exports = router;
