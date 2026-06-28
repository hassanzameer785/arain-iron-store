const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { generateTokens, protect } = require('../middleware/auth');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });
  next();
};

// @POST /api/auth/register
router.post('/register', [
  body('name').trim().notEmpty().withMessage('Name required').isLength({ max: 100 }).withMessage('Name must be under 100 characters'),
  body('email').isEmail().withMessage('Valid email required').isLength({ max: 150 }).withMessage('Email must be under 150 characters'),
  body('password').isLength({ min: 6, max: 100 }).withMessage('Password must be between 6 and 100 characters'),
  validate
], async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ success: false, message: 'Email already registered' });

    const user = await User.create({ name, email, password, phone });
    const { accessToken, refreshToken } = generateTokens(user._id);
    user.refreshToken = refreshToken;
    await user.save();

    res.status(201).json({ success: true, data: { user, accessToken, refreshToken } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @POST /api/auth/login
router.post('/login', [
  body('email').isEmail().isLength({ max: 150 }).withMessage('Email must be under 150 characters'),
  body('password').notEmpty().isLength({ max: 100 }).withMessage('Password must be under 100 characters'),
  validate
], async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user || !await user.comparePassword(password)) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    if (!user.isActive) return res.status(401).json({ success: false, message: 'Account disabled' });

    const { accessToken, refreshToken } = generateTokens(user._id);
    user.refreshToken = refreshToken;
    await user.save();

    res.json({ success: true, data: { user, accessToken, refreshToken } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @POST /api/auth/refresh
router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(401).json({ success: false, message: 'Refresh token required' });

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({ success: false, message: 'Invalid refresh token' });
    }

    const tokens = generateTokens(user._id);
    user.refreshToken = tokens.refreshToken;
    await user.save();
    res.json({ success: true, data: tokens });
  } catch (err) {
    res.status(401).json({ success: false, message: 'Invalid refresh token' });
  }
});

// @GET /api/auth/me
router.get('/me', protect, (req, res) => {
  res.json({ success: true, data: req.user });
});

// @POST /api/auth/logout
router.post('/logout', protect, async (req, res) => {
  req.user.refreshToken = null;
  await req.user.save();
  res.json({ success: true, message: 'Logged out successfully' });
});

module.exports = router;
