const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const { Order } = require('../models/index');
const Product = require('../models/Product');
const User = require('../models/User');

const router = express.Router();

router.get('/stats', protect, authorize('admin', 'employee'), async (req, res) => {
  try {
    const [totalProducts, totalOrders, totalUsers, paidOrders, lowStock, recentOrders] = await Promise.all([
      Product.countDocuments({ isActive: true }),
      Order.countDocuments(),
      User.countDocuments({ role: 'customer' }),
      Order.find({ paymentStatus: 'paid' }),
      Product.find({ stock: { $lte: 10 }, isActive: true }).select('name stock').limit(10),
      Order.find().populate('customer', 'name').sort('-createdAt').limit(5),
    ]);
    const totalRevenue = paidOrders.reduce((sum, o) => sum + o.totalAmount, 0);
    res.json({ success: true, data: { totalProducts, totalOrders, totalUsers, totalRevenue, lowStock, recentOrders } });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.get('/sales', protect, authorize('admin', 'employee'), async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const [daily, monthly, allTime] = await Promise.all([
      Order.aggregate([{ $match: { createdAt: { $gte: startOfDay }, paymentStatus: 'paid' } }, { $group: { _id: null, total: { $sum: '$totalAmount' }, count: { $sum: 1 } } }]),
      Order.aggregate([{ $match: { createdAt: { $gte: startOfMonth }, paymentStatus: 'paid' } }, { $group: { _id: null, total: { $sum: '$totalAmount' }, count: { $sum: 1 } } }]),
      Order.aggregate([{ $match: { paymentStatus: 'paid' } }, { $group: { _id: null, total: { $sum: '$totalAmount' }, count: { $sum: 1 } } }]),
    ]);

    res.json({ success: true, data: {
      daily:   { revenue: daily[0]?.total || 0,   orders: daily[0]?.count || 0 },
      monthly: { revenue: monthly[0]?.total || 0, orders: monthly[0]?.count || 0 },
      allTime: { revenue: allTime[0]?.total || 0, orders: allTime[0]?.count || 0 },
    }});
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

module.exports = router;
