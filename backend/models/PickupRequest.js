const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    address: { type: String, required: true, trim: true },
    wasteType: {
      type: String,
      enum: ['household', 'recyclable', 'organic', 'hazardous', 'e-waste'],
      default: 'household',
    },
    notes: { type: String, default: '' },
    status: { type: String, enum: ['pending', 'assigned', 'collected'], default: 'pending' },
    collector: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('PickupRequest', requestSchema);
