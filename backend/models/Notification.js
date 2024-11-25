const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  receiverEmail: { type: String, required: true }, // Email of the user or mechanic
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  read: { type: Boolean, default: false },
});

module.exports = mongoose.model('Notification', NotificationSchema);
