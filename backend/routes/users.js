const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

router.get('/', protect, authorize('admin'), async (req, res) => {
  try {
    const users = await User.find().sort('-createdAt');
    res.json({ success: true, data: users });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.post('/employee', protect, authorize('admin'), async (req, res) => {
  try {
    const emp = await User.create({ ...req.body, role: 'employee' });
    res.status(201).json({ success: true, data: emp });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.put('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const { password, ...rest } = req.body; // don't allow password change via this route
    const user = await User.findByIdAndUpdate(req.params.id, rest, { new: true });
    res.json({ success: true, data: user });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'User removed' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

module.exports = router;
