const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const { Order } = require('../models/index');
const Product = require('../models/Product');
const { generateInvoiceHTML } = require('../utils/invoice');

const router = express.Router();

router.post('/', protect, async (req, res) => {
  try {
    const { items, shippingAddress, notes } = req.body;
    let totalAmount = 0;
    const orderItems = [];
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) return res.status(404).json({ success: false, message: `Product not found` });
      if (product.stock < item.quantity) return res.status(400).json({ success: false, message: `Insufficient stock for ${product.name}` });
      totalAmount += product.price * item.quantity;
      orderItems.push({ product: product._id, name: product.name, price: product.price, quantity: item.quantity, unit: product.unit });
      await Product.findByIdAndUpdate(product._id, { $inc: { stock: -item.quantity } });
    }
    const order = await Order.create({ 
      customer: req.user._id, 
      items: orderItems, 
      totalAmount, 
      shippingAddress, 
      notes,
      paymentStatus: req.body.paymentStatus || 'unpaid',
      paymentMethod: req.body.paymentMethod || 'online'
    });
    res.status(201).json({ success: true, data: order });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.get('/my', protect, async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.user._id }).populate('items.product', 'name images').sort('-createdAt');
    res.json({ success: true, data: orders });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.get('/', protect, authorize('admin', 'employee'), async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = status ? { status } : {};
    const orders = await Order.find(query).populate('customer', 'name email phone').sort('-createdAt').limit(Number(limit)).skip((page-1)*Number(limit));
    res.json({ success: true, data: orders, total: await Order.countDocuments(query) });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('customer', 'name email phone');
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    if (req.user.role === 'customer' && order.customer._id.toString() !== req.user._id.toString())
      return res.status(403).json({ success: false, message: 'Access denied' });
    res.json({ success: true, data: order });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.put('/:id/status', protect, authorize('admin', 'employee'), async (req, res) => {
  try {
    const { status, paymentStatus } = req.body;
    const update = {};
    if (status) update.status = status;
    if (paymentStatus) update.paymentStatus = paymentStatus;
    const order = await Order.findByIdAndUpdate(req.params.id, update, { new: true });
    res.json({ success: true, data: order });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.get('/:id/invoice', protect, authorize('admin', 'employee'), async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('customer', 'name email');
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    res.setHeader('Content-Type', 'text/html');
    res.send(generateInvoiceHTML(order));
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

module.exports = router;
