const router = require('express').Router();
const Matter = require('../models/Matter');
const Client = require('../models/Client');
const { protect, allow } = require('../middleware/auth');

router.use(protect, allow('Admin', 'Advocate'));

// List, with optional ?q=search and ?status=Active
router.get('/', async (req, res) => {
  const { q, status } = req.query;
  const filter = {};
  if (status && status !== 'All') filter.status = status;

  let matters = await Matter.find(filter)
    .populate('client', 'name')
    .populate('advocate', 'name')
    .sort({ createdAt: -1 })
    .lean();

  if (q) {
    const s = q.toLowerCase();
    matters = matters.filter((m) =>
      `${m.title} ${m.caseNumber} ${m.client?.name || ''}`.toLowerCase().includes(s)
    );
  }
  res.json(matters);
});

router.get('/:id', async (req, res) => {
  const matter = await Matter.findById(req.params.id)
    .populate('client')
    .populate('advocate', 'name')
    .lean();
  if (!matter) return res.status(404).json({ message: 'Matter not found' });
  res.json(matter);
});

router.post('/', async (req, res) => {
  const { caseNumber, title, client, court, type, advocate } = req.body;
  if (!caseNumber || !title || !client) {
    return res.status(400).json({ message: 'Case number, title and client are required' });
  }
  if (!(await Client.exists({ _id: client }))) {
    return res.status(400).json({ message: 'That client does not exist' });
  }
  const matter = await Matter.create({
    caseNumber, title, client, court, type,
    advocate: advocate || req.user._id, // defaults to whoever opens the matter
  });
  res.status(201).json(matter);
});

router.put('/:id', async (req, res) => {
  const fields = ['caseNumber', 'title', 'client', 'court', 'type', 'status', 'advocate'];
  const update = {};
  fields.forEach((f) => {
    if (req.body[f] !== undefined) update[f] = req.body[f];
  });
  const matter = await Matter.findByIdAndUpdate(req.params.id, update, {
    new: true,
    runValidators: true,
  });
  if (!matter) return res.status(404).json({ message: 'Matter not found' });
  res.json(matter);
});

module.exports = router;