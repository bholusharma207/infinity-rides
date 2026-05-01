const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');

// @desc  Get dashboard stats
// @route GET /api/admin/stats
const getStats = asyncHandler(async (req, res) => {
  const [totalOrders, totalUsers, totalProducts, revenueResult] = await Promise.all([
    Order.countDocuments(),
    User.countDocuments({ role: 'user' }),
    Product.countDocuments(),
    Order.aggregate([
      { $match: { isPaid: true } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } },
    ]),
  ]);

  const revenue = revenueResult[0]?.total || 0;
  const recentOrders = await Order.find()
    .populate('user', 'name email')
    .sort({ createdAt: -1 })
    .limit(10);

  const ordersByStatus = await Order.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);

  res.json({ stats: { totalOrders, totalUsers, totalProducts, revenue }, recentOrders, ordersByStatus });
});

// @desc  Get all orders (Admin)
// @route GET /api/admin/orders
const getAllOrders = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;
  let query = {};
  if (req.query.status) query.status = req.query.status;

  const total = await Order.countDocuments(query);
  const orders = await Order.find(query).populate('user', 'name email').sort({ createdAt: -1 }).skip(skip).limit(limit);
  res.json({ orders, page, pages: Math.ceil(total / limit), total });
});

// @desc  Update order status (Admin)
// @route PUT /api/admin/orders/:id
const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) { res.status(404); throw new Error('Order not found'); }
  order.status = req.body.status;
  if (req.body.status === 'Delivered') order.deliveredAt = new Date();
  await order.save();
  res.json({ order });
});

// @desc  Get all users (Admin)
// @route GET /api/admin/users
const getAllUsers = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;
  let query = {};
  if (req.query.search) {
    query.$or = [
      { name: { $regex: req.query.search, $options: 'i' } },
      { email: { $regex: req.query.search, $options: 'i' } },
    ];
  }
  const total = await User.countDocuments(query);
  const users = await User.find(query).select('-password').sort({ createdAt: -1 }).skip(skip).limit(limit);
  res.json({ users, page, pages: Math.ceil(total / limit), total });
});

// @desc  Update user (Admin)
// @route PUT /api/admin/users/:id
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) { res.status(404); throw new Error('User not found'); }
  if (req.body.isBlocked !== undefined) user.isBlocked = req.body.isBlocked;
  if (req.body.role) user.role = req.body.role;
  await user.save();
  res.json({ user });
});

// @desc  Get all products (Admin)
// @route GET /api/admin/products
const getAllProducts = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;
  let query = {};
  if (req.query.category) query.category = req.query.category;
  if (req.query.keyword) query.name = { $regex: req.query.keyword, $options: 'i' };
  const total = await Product.countDocuments(query);
  const products = await Product.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit);
  res.json({ products, page, pages: Math.ceil(total / limit), total });
});

module.exports = { getStats, getAllOrders, updateOrderStatus, getAllUsers, updateUser, getAllProducts };
