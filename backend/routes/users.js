const router = require('express').Router();
const User = require('../models/User');
const { protect, allow, wrap } = require('../middleware/auth');

router.get('/collectors', protect, allow('admin'), wrap(async (req, res) => {
  res.json(await User.find({ role: 'collector' }).select('name email'));
}));

module.exports = router;
