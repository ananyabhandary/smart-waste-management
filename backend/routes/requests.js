const router = require('express').Router();
const PickupRequest = require('../models/PickupRequest');
const User = require('../models/User');
const { protect, allow, wrap } = require('../middleware/auth');

router.use(protect);

router.post('/', allow('citizen'), wrap(async (req, res) => {
  const { address, wasteType, notes } = req.body;
  if (!address) return res.status(400).json({ message: 'Address is required' });
  const request = await PickupRequest.create({ user: req.user._id, address, wasteType, notes });
  res.status(201).json(request);
}));

router.get('/', wrap(async (req, res) => {
  const filter =
    req.user.role === 'citizen' ? { user: req.user._id }
    : req.user.role === 'collector' ? { collector: req.user._id }
    : {};
  const list = await PickupRequest.find(filter)
    .populate('user', 'name email')
    .populate('collector', 'name')
    .sort({ createdAt: -1 });
  res.json(list);
}));

router.patch('/:id/assign', allow('admin'), wrap(async (req, res) => {
  const collector = await User.findOne({ _id: req.body.collectorId, role: 'collector' });
  if (!collector) return res.status(400).json({ message: 'Invalid collector' });
  const request = await PickupRequest.findById(req.params.id);
  if (!request) return res.status(404).json({ message: 'Request not found' });
  request.collector = collector._id;
  request.status = 'assigned';
  await request.save();
  res.json(request);
}));

router.patch('/:id/collect', allow('admin', 'collector'), wrap(async (req, res) => {
  const request = await PickupRequest.findById(req.params.id);
  if (!request) return res.status(404).json({ message: 'Request not found' });
  if (req.user.role === 'collector' && String(request.collector) !== String(req.user._id))
    return res.status(403).json({ message: 'This request is not assigned to you' });
  request.status = 'collected';
  await request.save();
  res.json(request);
}));

module.exports = router;
