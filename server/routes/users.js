const router = require('express').Router();
const User = require('../models/User');
const { protect, allow } = require('../middleware/auth');

router.get('/advocates', protect, allow('Admin', 'Advocate'), async (req, res) => {
  const users = await User.find({ role: { $in: ['Admin', 'Advocate'] } })
    .select('name role')
    .sort({ name: 1 });
  res.json(users);
});

module.exports = router;