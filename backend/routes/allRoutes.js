const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const { Order, Category, Review } = require('../models/index');
const User = require('../models/User');
const Product = require('../models/Product');

// ─── CATEGORIES ─────────────────────────────────────────────────────────────
const catRouter = express.Router();
catRouter.get('/', async (req, res) => {
  try {
    const cats = await Category.find({ isActive: true }).sort('order');
    res.json({ success: true, data: cats });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});
catRouter.post('/', protect, authorize('admin'), async (req, res) => {
  try {
    const cat = await Category.create(req.body);
    res.status(201).json({ success: true, data: cat });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});
catRouter.put('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const cat = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: cat });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});
catRouter.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Category deleted' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// ─── ORDERS ──────────────────────────────────────────────────────────────────
const orderRouter = express.Router();
orderRouter.post('/', protect, async (req, res) => {
  try {
    const { items, shippingAddress, notes } = req.body;
    let totalAmount = 0;
    const orderItems = [];
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) return res.status(404).json({ success: false, message: `Product ${item.product} not found` });
      if (product.stock < item.quantity) return res.status(400).json({ success: false, message: `Insufficient stock for ${product.name}` });
      totalAmount += product.price * item.quantity;
      orderItems.push({ product: product._id, name: product.name, price: product.price, quantity: item.quantity, unit: product.unit });
      await Product.findByIdAndUpdate(product._id, { $inc: { stock: -item.quantity } });
    }
    const order = await Order.create({ customer: req.user._id, items: orderItems, totalAmount, shippingAddress, notes });
    res.status(201).json({ success: true, data: order });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});
orderRouter.get('/my', protect, async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.user._id }).populate('items.product', 'name images').sort('-createdAt');
    res.json({ success: true, data: orders });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});
orderRouter.get('/', protect, authorize('admin', 'employee'), async (req, res) => {
  try {
    const orders = await Order.find().populate('customer', 'name email phone').sort('-createdAt');
    res.json({ success: true, data: orders });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});
orderRouter.put('/:id/status', protect, authorize('admin', 'employee'), async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status, paymentStatus: req.body.paymentStatus }, { new: true });
    res.json({ success: true, data: order });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// ─── USERS (Admin) ───────────────────────────────────────────────────────────
const userRouter = express.Router();
userRouter.get('/', protect, authorize('admin'), async (req, res) => {
  try {
    const users = await User.find().sort('-createdAt');
    res.json({ success: true, data: users });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});
userRouter.post('/employee', protect, authorize('admin'), async (req, res) => {
  try {
    const emp = await User.create({ ...req.body, role: 'employee' });
    res.status(201).json({ success: true, data: emp });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});
userRouter.put('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: user });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});
userRouter.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'User removed' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// ─── REVIEWS ─────────────────────────────────────────────────────────────────
const reviewRouter = express.Router();
reviewRouter.get('/', async (req, res) => {
  try {
    const filter = req.query.general === 'true' ? { isGeneral: true, isApproved: true } : { isApproved: true };
    const reviews = await Review.find(filter).populate('user', 'name avatar').sort('-createdAt').limit(20);
    res.json({ success: true, data: reviews });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});
reviewRouter.post('/', protect, async (req, res) => {
  try {
    const review = await Review.create({ ...req.body, user: req.user._id, name: req.user.name });
    res.status(201).json({ success: true, data: review });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});
reviewRouter.put('/:id/approve', protect, authorize('admin'), async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(req.params.id, { isApproved: true }, { new: true });
    res.json({ success: true, data: review });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// ─── DASHBOARD ───────────────────────────────────────────────────────────────
const dashRouter = express.Router();
dashRouter.get('/stats', protect, authorize('admin', 'employee'), async (req, res) => {
  try {
    const [totalProducts, totalOrders, totalUsers, orders] = await Promise.all([
      Product.countDocuments({ isActive: true }),
      Order.countDocuments(),
      User.countDocuments({ role: 'customer' }),
      Order.find({ status: { $ne: 'cancelled' } })
    ]);
    const totalRevenue = orders.reduce((sum, o) => sum + (o.paymentStatus === 'paid' ? o.totalAmount : 0), 0);
    const lowStock = await Product.find({ stock: { $lte: 10 }, isActive: true }).select('name stock');
    const recentOrders = await Order.find().populate('customer', 'name').sort('-createdAt').limit(5);
    res.json({ success: true, data: { totalProducts, totalOrders, totalUsers, totalRevenue, lowStock, recentOrders } });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

module.exports = { catRouter, orderRouter, userRouter, reviewRouter, dashRouter };
