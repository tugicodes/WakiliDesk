const router = require('express').Router();
const Client = require('../models/Client');
const Matter = require('../models/Matter');
const { protect, allow } = require('../middleware/auth');

router.use(protect);

// Everyone signed in can view clients (Accounts needs them for invoices)
router.get('/', async (req, res) => {
  const clients = await Client.find().sort({ name: 1 }).lean();
  const counts = await Matter.aggregate([{ $group: { _id: '$client', n: { $sum: 1 } } }]);
  const byClient = Object.fromEntries(counts.map((c) => [String(c._id), c.n]));
  res.json(clients.map((c) => ({ ...c, matterCount: byClient[String(c._id)] || 0 })));
});

router.post('/', allow('Admin', 'Advocate'), async (req, res) => {
  const { name, type, phone, email } = req.body;
  if (!name || !name.trim()) {
    return res.status(400).json({ message: 'Client name is required' });
  }
  const client = await Client.create({ name, type, phone, email });
  res.status(201).json(client);
});

router.put('/:id', allow('Admin', 'Advocate'), async (req, res) => {
  const { name, type, phone, email } = req.body;
  const client = await Client.findByIdAndUpdate(
    req.params.id,
    { name, type, phone, email },
    { new: true, runValidators: true }
  );
  if (!client) return res.status(404).json({ message: 'Client not found' });
  res.json(client);
});

// A client with matters cannot be deleted
router.delete('/:id', allow('Admin'), async (req, res) => {
  if (await Matter.exists({ client: req.params.id })) {
    return res.status(409).json({ message: 'This client still has matters, so it cannot be deleted' });
  }
  const client = await Client.findByIdAndDelete(req.params.id);
  if (!client) return res.status(404).json({ message: 'Client not found' });
  res.json({ ok: true });
});

module.exports = router;