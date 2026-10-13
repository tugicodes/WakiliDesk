const mongoose = require('mongoose');

const matterSchema = new mongoose.Schema(
  {
    caseNumber: { type: String, required: true, unique: true, trim: true },
    title: { type: String, required: true, trim: true },
    client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
    court: { type: String, trim: true },
    type: {
      type: String,
      enum: ['Civil', 'Criminal', 'Land', 'Family', 'Succession', 'Commercial', 'Other'],
      default: 'Civil',
    },
    status: { type: String, enum: ['Active', 'Pending', 'Closed'], default: 'Active' },
    advocate: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Matter', matterSchema);