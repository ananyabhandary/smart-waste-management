const router = require('express').Router();
const Bin = require('../models/Bin');
const { protect, allow, wrap } = require('../middleware/auth');

router.use(protect);

router.get('/', wrap(async (req, res) => {
  res.json(await Bin.find().sort({ fillLevel: -1 }));
}));

router.post('/', allow('admin'), wrap(async (req, res) => {
  const { name, address, fillLevel } = req.body;
  if (!name || !address) return res.status(400).json({ message: 'Name and address are required' });
  const bin = await Bin.create({ name, address, fillLevel: Number(fillLevel) || 0 });
  res.status(201).json(bin);
}));

router.patch('/:id/level', allow('admin', 'collector'), wrap(async (req, res) => {
  const bin = await Bin.findById(req.params.id);
  if (!bin) return res.status(404).json({ message: 'Bin not found' });
  const level = Number(req.body.fillLevel);
  if (Number.isNaN(level) || level < 0 || level > 100)
    return res.status(400).json({ message: 'Fill level must be between 0 and 100' });
  bin.fillLevel = level;
  await bin.save();
  res.json(bin);
}));

router.delete('/:id', allow('admin'), wrap(async (req, res) => {
  const bin = await Bin.findByIdAndDelete(req.params.id);
  if (!bin) return res.status(404).json({ message: 'Bin not found' });
  res.json({ message: 'Bin deleted' });
}));

module.exports = router;
