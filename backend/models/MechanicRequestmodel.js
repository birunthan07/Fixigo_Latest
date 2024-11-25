

const mongoose = require('mongoose');

const RequestSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  mechanicEmail: { type: String, required: true },
  status: { type: String, enum: ['Pending', 'Accepted', 'Rejected'], default: 'Pending' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Request', RequestSchema);
