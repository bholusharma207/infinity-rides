const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// @desc  Place new order
// @route POST /api/orders
const placeOrder = asyncHandler(async (req, res) => {
  const { shippingAddress } = req.body;

  if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.phone ||
      !shippingAddress.street || !shippingAddress.city || !shippingAddress.state || !shippingAddress.pincode) {
    res.status(400);
    throw new Error('Please provide a complete shipping address');
  }

  // Get user's cart
  const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');

  if (!cart || cart.items.length === 0) {
    res.status(400);
    throw new Error('Cart is empty');
  }

  // Validate stock and build order items (do NOT deduct stock yet)
  const orderItems = [];
  let itemsPrice = 0;

  for (const item of cart.items) {
    const product = item.product;
    if (!product || !product.isActive) {
      res.status(400);
      throw new Error(`Product "${item.product?.name || 'Unknown'}" is no longer available`);
    }
    if (product.stock < item.quantity) {
      res.status(400);
      throw new Error(`"${product.name}" only has ${product.stock} items in stock`);
    }

    const price = product.finalPrice;
    orderItems.push({
      product: product._id,
      name: product.name,
      image: product.images[0] || '',
      price,
      quantity: item.quantity,
    });
    itemsPrice += price * item.quantity;
  }

  // Calculate totals
  const taxPrice = Math.round(itemsPrice * 0.18 * 100) / 100;
  const shippingPrice = itemsPrice > 999 ? 0 : 99;
  const totalPrice = Math.round((itemsPrice + taxPrice + shippingPrice) * 100) / 100;

  const order = await Order.create({
    user: req.user._id,
    items: orderItems,
    shippingAddress,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  });

  // NOTE: Cart is cleared and stock is deducted only AFTER payment verification

  res.status(201).json({ order });
});

// @desc  Get logged in user orders
// @route GET /api/orders
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json({ orders });
});

// @desc  Get order by ID
// @route GET /api/orders/:id
const getOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  // Only allow the order owner or admin to view
  if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to view this order');
  }

  res.json({ order });
});

module.exports = { placeOrder, getMyOrders, getOrder };
