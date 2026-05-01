const asyncHandler = require('express-async-handler');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// @desc  Get user cart
// @route GET /api/cart
const getCart = asyncHandler(async (req, res) => {
  let cart = await Cart.findOne({ user: req.user._id }).populate('items.product', 'name price images stock isActive discount');

  if (!cart) {
    cart = await Cart.create({ user: req.user._id, items: [] });
  }

  // Remove items where product was deleted or deactivated
  cart.items = cart.items.filter(item => item.product && item.product.isActive);
  await cart.save();

  res.json({ cart });
});

// @desc  Add item to cart
// @route POST /api/cart
const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity = 1, size, color } = req.body;

  const product = await Product.findById(productId);
  if (!product || !product.isActive) {
    res.status(404);
    throw new Error('Product not found or unavailable');
  }

  if (product.stock < quantity) {
    res.status(400);
    throw new Error('Insufficient stock');
  }

  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    cart = new Cart({ user: req.user._id, items: [] });
  }

  const existingIndex = cart.items.findIndex(
    item => 
      item.product.toString() === productId && 
      item.size === size && 
      item.color === color
  );

  if (existingIndex >= 0) {
    cart.items[existingIndex].quantity += quantity;
    cart.items[existingIndex].priceAtAdd = product.finalPrice;
  } else {
    cart.items.push({
      product: productId,
      quantity,
      priceAtAdd: product.finalPrice,
      size,
      color
    });
  }

  await cart.save();
  cart = await Cart.findById(cart._id).populate('items.product', 'name price images stock isActive discount');

  res.json({ cart });
});

// @desc  Update cart item quantity
// @route PUT /api/cart/:productId
const updateCartItem = asyncHandler(async (req, res) => {
  const { quantity } = req.body;
  const { productId } = req.params;

  if (quantity < 1) {
    res.status(400);
    throw new Error('Quantity must be at least 1');
  }

  const product = await Product.findById(productId);
  if (product && quantity > product.stock) {
    res.status(400);
    throw new Error('Not enough stock available');
  }

  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    res.status(404);
    throw new Error('Cart not found');
  }

  const item = cart.items.find(i => i.product.toString() === productId);
  if (!item) {
    res.status(404);
    throw new Error('Item not in cart');
  }

  item.quantity = quantity;
  await cart.save();
  cart = await Cart.findById(cart._id).populate('items.product', 'name price images stock isActive discount');

  res.json({ cart });
});

// @desc  Remove item from cart
// @route DELETE /api/cart/:productId
const removeFromCart = asyncHandler(async (req, res) => {
  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    res.status(404);
    throw new Error('Cart not found');
  }

  cart.items = cart.items.filter(i => i.product.toString() !== req.params.productId);
  await cart.save();
  cart = await Cart.findById(cart._id).populate('items.product', 'name price images stock isActive discount');

  res.json({ cart });
});

// @desc  Clear entire cart
// @route DELETE /api/cart
const clearCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (cart) {
    cart.items = [];
    await cart.save();
  }
  res.json({ message: 'Cart cleared' });
});

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearCart };
