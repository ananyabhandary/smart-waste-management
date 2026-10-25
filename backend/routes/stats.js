const router = require('express').Router();
const Bin = require('../models/Bin');
const User = require('../models/User');
const PickupRequest = require('../models/PickupRequest');
const { protect, allow, wrap } = require('../middleware/auth');

router.get('/', protect, allow('admin'), wrap(async (req, res) => {
  const [totalBins, fullBins, pending, collected, collectors, citizens] = await Promise.all([
    Bin.countDocuments(),
    Bin.countDocuments({ status: 'full' }),
    PickupRequest.countDocuments({ status: { $ne: 'collected' } }),
    PickupRequest.countDocuments({ status: 'collected' }),
    User.countDocuments({ role: 'collector' }),
    User.countDocuments({ role: 'citizen' }),
  ]);
  res.json({ totalBins, fullBins, pending, collected, collectors, citizens });
}));

module.exports = router;
