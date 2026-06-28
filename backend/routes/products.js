const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Product = require('../models/Product');
const { protect, authorize, hasPermission } = require('../middleware/auth');

const storage = multer.diskStorage({
  destination: 'uploads/products/',
  filename: (req, file, cb) => cb(null, `product-${Date.now()}${path.extname(file.originalname)}`)
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Images only'), false);
  }
});

// GET /api/products - Public
router.get('/', async (req, res) => {
  try {
    const { category, search, quality, minPrice, maxPrice, featured, page = 1, limit = 12 } = req.query;
    const query = { isActive: true };
    if (category) query.category = category;
    if (quality) query.qualityLevel = quality;
    if (featured) query.isFeatured = true;
    if (search) query.$text = { $search: search };
    if (minPrice || maxPrice) query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .populate('category', 'name slug')
      .limit(Number(limit)).skip((page - 1) * limit)
      .sort('-createdAt');

    res.json({ success: true, data: products, total, pages: Math.ceil(total / limit), page: Number(page) });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// GET /api/products/:id - Public
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category', 'name slug');
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, data: product });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// POST /api/products - Admin/Employee
router.post('/', protect, authorize('admin', 'employee'), hasPermission('manage_products'),
  upload.array('images', 5), async (req, res) => {
    try {
      const images = req.files?.map(f => `/uploads/products/${f.filename}`) || [];
      const product = await Product.create({ ...req.body, images });
      res.status(201).json({ success: true, data: product });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
  }
);

// PUT /api/products/:id - Admin/Employee
router.put('/:id', protect, authorize('admin', 'employee'), hasPermission('manage_products'),
  upload.array('images', 5), async (req, res) => {
    try {
      const update = { ...req.body };
      if (req.files?.length) update.images = req.files.map(f => `/uploads/products/${f.filename}`);
      const product = await Product.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
      if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
      res.json({ success: true, data: product });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
  }
);

// DELETE /api/products/:id - Admin only
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, message: 'Product deleted' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

module.exports = router;
