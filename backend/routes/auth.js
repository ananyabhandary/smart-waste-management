const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect, wrap } = require('../middleware/auth');

const sign = (u) => jwt.sign({ id: u._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
const out = (u) => ({ id: u._id, name: u.name, email: u.email, role: u.role });

router.post('/register', wrap(async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password) return res.status(400).json({ message: 'All fields are required' });
  if (password.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters' });
  if (await User.findOne({ email: email.toLowerCase() }))
    return res.status(400).json({ message: 'Email already registered' });
  const safeRole = ['citizen', 'collector'].includes(role) ? role : 'citizen';
  const user = await User.create({ name, email, password: await bcrypt.hash(password, 10), role: safeRole });
  res.status(201).json({ token: sign(user), user: out(user) });
}));

router.post('/login', wrap(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: (email || '').toLowerCase() });
  if (!user || !(await bcrypt.compare(password || '', user.password)))
    return res.status(401).json({ message: 'Invalid email or password' });
  res.json({ token: sign(user), user: out(user) });
}));

router.get('/me', protect, (req, res) => res.json({ user: out(req.user) }));

module.exports = router;
