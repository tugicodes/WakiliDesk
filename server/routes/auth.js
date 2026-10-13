const router = require('express').Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect, allow } = require('../middleware/auth');

const sign = (user) =>
  jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '8h' });

const publicUser = (u) => ({ id: u._id, name: u.name, email: u.email, role: u.role });

// Sign in
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }
  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
  if (!user || !(await user.matches(password))) {
    return res.status(401).json({ message: 'Incorrect email or password' });
  }
  res.json({ token: sign(user), user: publicUser(user) });
});

// Who am I? (used by the frontend to restore a session)
router.get('/me', protect, (req, res) => res.json(publicUser(req.user)));

// Only an Admin can create new users
router.post('/users', protect, allow('Admin'), async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email and password are required' });
  }
  if (await User.findOne({ email: email.toLowerCase() })) {
    return res.status(409).json({ message: 'That email is already registered' });
  }
  const user = await User.create({ name, email, password, role });
  res.status(201).json(publicUser(user));
});

module.exports = router;