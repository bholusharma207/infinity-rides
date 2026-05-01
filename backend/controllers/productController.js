const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');

// @desc  Get all products with search, filter, sort, pagination
// @route GET /api/products
const getProducts = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 12;
  const skip = (page - 1) * limit;

  let query = { isActive: true };

  // Search by keyword
  if (req.query.keyword) {
    query.$or = [
      { name: { $regex: req.query.keyword, $options: 'i' } },
      { description: { $regex: req.query.keyword, $options: 'i' } },
      { brand: { $regex: req.query.keyword, $options: 'i' } },
    ];
  }

  // Filter by category
  if (req.query.category) {
    query.category = req.query.category;
  }

  // Filter by brand
  if (req.query.brand) {
    query.brand = { $regex: req.query.brand, $options: 'i' };
  }

  // Filter by price range
  if (req.query.minPrice || req.query.maxPrice) {
    query.price = {};
    if (req.query.minPrice) query.price.$gte = Number(req.query.minPrice);
    if (req.query.maxPrice) query.price.$lte = Number(req.query.maxPrice);
  }

  // Sort
  let sortObj = { createdAt: -1 };
  if (req.query.sort) {
    switch (req.query.sort) {
      case 'price_asc': sortObj = { price: 1 }; break;
      case 'price_desc': sortObj = { price: -1 }; break;
      case 'rating': sortObj = { rating: -1 }; break;
      case 'newest': sortObj = { createdAt: -1 }; break;
      case 'name_asc': sortObj = { name: 1 }; break;
      default: sortObj = { createdAt: -1 };
    }
  }

  const total = await Product.countDocuments(query);
  const products = await Product.find(query)
    .sort(sortObj)
    .skip(skip)
    .limit(limit);

  res.json({
    products,
    page,
    pages: Math.ceil(total / limit),
    total,
  });
});

// @desc  Get single product
// @route GET /api/products/:id
const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  res.json({ product });
});

// @desc  Autocomplete search
// @route GET /api/products/autocomplete
const autocomplete = asyncHandler(async (req, res) => {
  const { q } = req.query;
  if (!q || q.length < 2) {
    return res.json({ suggestions: [] });
  }

  const products = await Product.find({
    isActive: true,
    name: { $regex: q, $options: 'i' },
  })
    .select('name category price images')
    .limit(8);

  res.json({ suggestions: products });
});

// @desc  Create product (Admin)
// @route POST /api/products
const createProduct = asyncHandler(async (req, res) => {
  const { name, description, price, category, brand, stock, discount, sizes, colors } = req.body;

  const images = req.files ? req.files.map(f => `/uploads/${f.filename}`) : [];

  const product = await Product.create({
    name,
    description,
    price,
    category,
    brand,
    stock,
    discount: discount || 0,
    sizes: sizes ? (typeof sizes === 'string' ? JSON.parse(sizes) : sizes) : [],
    colors: colors ? (typeof colors === 'string' ? JSON.parse(colors) : colors) : [],
    images,
  });

  res.status(201).json({ product });
});

// @desc  Update product (Admin)
// @route PUT /api/products/:id
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const fields = ['name', 'description', 'price', 'category', 'brand', 'stock', 'discount', 'isActive'];
  fields.forEach(field => {
    if (req.body[field] !== undefined) {
      product[field] = req.body[field];
    }
  });

  if (req.body.sizes) {
    product.sizes = typeof req.body.sizes === 'string' ? JSON.parse(req.body.sizes) : req.body.sizes;
  }
  if (req.body.colors) {
    product.colors = typeof req.body.colors === 'string' ? JSON.parse(req.body.colors) : req.body.colors;
  }

  // Add new images if uploaded
  if (req.files && req.files.length > 0) {
    const newImages = req.files.map(f => `/uploads/${f.filename}`);
    product.images = [...product.images, ...newImages];
  }

  const updated = await product.save();
  res.json({ product: updated });
});

// @desc  Delete product (Admin)
// @route DELETE /api/products/:id
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  await product.deleteOne();
  res.json({ message: 'Product deleted' });
});

module.exports = { getProducts, getProduct, autocomplete, createProduct, updateProduct, deleteProduct };
