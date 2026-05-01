const asyncHandler = require('express-async-handler');
const crypto = require('crypto');
const Razorpay = require('razorpay');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Cart = require('../models/Cart');

const getRazorpayInstance = () => {
  if (!process.env.RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID.includes('xxxx')) {
    return null;
  }
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
};

// @desc  Get Razorpay key
// @route GET /api/payment/key
const getKey = asyncHandler(async (req, res) => {
  res.json({ key: process.env.RAZORPAY_KEY_ID });
});

// @desc  Create Razorpay order
// @route POST /api/payment/create
const createRazorpayOrder = asyncHandler(async (req, res) => {
  const { orderId } = req.body;
  const order = await Order.findById(orderId);

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  const razorpay = getRazorpayInstance();
  if (!razorpay) {
    // Demo mode - mark as paid directly
    order.isPaid = true;
    order.paidAt = new Date();
    order.status = 'Processing';
    order.paymentInfo = { method: 'demo', razorpayPaymentId: 'demo_' + Date.now() };

    // Deduct stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } });
    }
    // Clear cart
    await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });

    await order.save();
    return res.json({ demoMode: true, order });
  }

  const options = {
    amount: Math.round(order.totalPrice * 100),
    currency: 'INR',
    receipt: order.orderNumber,
  };

  const razorpayOrder = await razorpay.orders.create(options);
  order.paymentInfo.razorpayOrderId = razorpayOrder.id;
  await order.save();

  res.json({ razorpayOrder, orderId: order._id });
});

// @desc  Verify payment
// @route POST /api/payment/verify
const verifyPayment = asyncHandler(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

  const body = razorpay_order_id + '|' + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest('hex');

  if (expectedSignature !== razorpay_signature) {
    res.status(400);
    throw new Error('Payment verification failed');
  }

  const order = await Order.findById(orderId);
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  order.isPaid = true;
  order.paidAt = new Date();
  order.status = 'Processing';
  order.paymentInfo.razorpayPaymentId = razorpay_payment_id;
  order.paymentInfo.razorpaySignature = razorpay_signature;

  // NOW deduct stock (only after confirmed payment)
  for (const item of order.items) {
    await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } });
  }

  // NOW clear cart
  await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });

  await order.save();

  res.json({ message: 'Payment verified', order });
});

module.exports = { getKey, createRazorpayOrder, verifyPayment };
