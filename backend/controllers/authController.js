const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const { generateToken } = require('../middleware/auth');

// @desc  Register new user
// @route POST /api/auth/signup
const signup = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Please provide all fields');
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists with this email');
  }

  const user = await User.create({ name, email, password });

  res.status(201).json({
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      addresses: user.addresses,
    },
    token: generateToken(user._id),
  });
});

// @desc  Login user
// @route POST /api/auth/login
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('Please provide email and password');
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  if (user.isBlocked) {
    res.status(403);
    throw new Error('Your account has been blocked. Contact support.');
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  res.json({
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      addresses: user.addresses,
    },
    token: generateToken(user._id),
  });
});

// @desc  Get current user profile
// @route GET /api/auth/me
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  res.json({ user });
});

// @desc  Update profile
// @route PUT /api/auth/me
const updateMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const { name, email } = req.body;

  if (name) user.name = name;
  if (email) user.email = email;

  const updated = await user.save();
  res.json({
    user: {
      _id: updated._id,
      name: updated.name,
      email: updated.email,
      role: updated.role,
      addresses: updated.addresses,
    },
  });
});

// @desc  Change password
// @route PUT /api/auth/password
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id).select('+password');

  const isMatch = await user.matchPassword(currentPassword);
  if (!isMatch) {
    res.status(400);
    throw new Error('Current password is incorrect');
  }

  user.password = newPassword;
  await user.save();
  res.json({ message: 'Password updated successfully' });
});

// @desc  Add address
// @route POST /api/auth/address
const addAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const { fullName, phone, street, city, state, pincode, isDefault } = req.body;

  if (isDefault) {
    user.addresses.forEach(addr => (addr.isDefault = false));
  }

  user.addresses.push({ fullName, phone, street, city, state, pincode, isDefault });
  await user.save();
  res.status(201).json({ addresses: user.addresses });
});

// @desc  Delete address
// @route DELETE /api/auth/address/:addressId
const deleteAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  user.addresses = user.addresses.filter(
    addr => addr._id.toString() !== req.params.addressId
  );
  await user.save();
  res.json({ addresses: user.addresses });
});

module.exports = { signup, login, getMe, updateMe, changePassword, addAddress, deleteAddress };
