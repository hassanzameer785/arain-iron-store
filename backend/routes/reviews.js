const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const { Review } = require('../models/index');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const filter = req.query.general === 'true' ? { isGeneral: true, isApproved: true } : { isApproved: true };
    if (req.query.product) filter.product = req.query.product;
    const reviews = await Review.find(filter).populate('user', 'name').sort('-createdAt').limit(20);
    res.json({ success: true, data: reviews });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.post('/', protect, async (req, res) => {
  try {
    const review = await Review.create({ ...req.body, user: req.user._id, name: req.user.name });
    res.status(201).json({ success: true, data: review });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.put('/:id/approve', protect, authorize('admin'), async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(req.params.id, { isApproved: true }, { new: true });
    res.json({ success: true, data: review });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    await Review.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Review deleted' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

module.exports = router;
