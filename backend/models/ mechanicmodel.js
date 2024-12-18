


const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Mechanic Schema
const MechanicSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true, trim: true },
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
    match: [/.+\@.+\..+/, 'Please provide a valid email address'],
  },
  password: { type: String, required: true },
  phoneNumber: { type: String, required: true, trim: true },
  address: { type: String, required: true },
  verificationCertificate: { type: String, required: true },
  vehicleType: {
    type: String,
    required: true,
    enum: ['car', 'motorbike', 'bicycle', 'truck', 'other'],
  },
  profilePicture: { type: String, default: null },
  isApproved: { type: Boolean, default: false },
  role: { type: String, default: 'mechanic' },
  isAvailable: { type: Boolean, default: false },
  liveLocation: {
    type: { 
      type: String, 
      enum: ['Point'], 
      required: true 
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
      index: '2dsphere', // Ensure 2dsphere index for geospatial queries
    },
  },
  dateCreated: { type: Date, default: Date.now },
});

// Create geospatial index for liveLocation
MechanicSchema.index({ liveLocation: '2dsphere' });

// Hash password before saving
MechanicSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model('Mechanic', MechanicSchema);
