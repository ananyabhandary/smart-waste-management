const mongoose = require('mongoose');

const binSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    fillLevel: { type: Number, default: 0, min: 0, max: 100 },
    status: { type: String, enum: ['low', 'medium', 'full'], default: 'low' },
  },
  { timestamps: true }
);

binSchema.pre('save', function (next) {
  this.status = this.fillLevel >= 80 ? 'full' : this.fillLevel >= 50 ? 'medium' : 'low';
  next();
});

module.exports = mongoose.model('Bin', binSchema);
