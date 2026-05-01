const express = require('express');
const router = express.Router();
const { getKey, createRazorpayOrder, verifyPayment } = require('../controllers/paymentController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.get('/key', getKey);
router.post('/create', createRazorpayOrder);
router.post('/verify', verifyPayment);

module.exports = router;
