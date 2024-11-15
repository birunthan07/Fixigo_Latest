// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');

// const MechanicSchema = new mongoose.Schema({
//   username: { type: String, unique: true, required: true, trim: true },
//   email: { type: String, unique: true, required: true, lowercase: true, match: [/.+\@.+\..+/, 'Please provide a valid email address'] },
//   password: { type: String, required: true },
//   phoneNumber: { type: String, required: true, trim: true },
//   address: { type: String, required: true },
//   verificationCertificate: { type: String, required: true },
//   vehicleType: { type: String, required: true, enum: ['car', 'motorbike', 'bicycle', 'truck', 'other'] },
//   profilePicture: { type: String, default: null },
//   isApproved: { type: Boolean, default: false },
//   role: { type: String, default: 'mechanic' },
//   isAvailable: { type: Boolean, default: false },
//   liveLocation: {
//     type: {
//       type: String,
//       enum: ['Point'],
//       required: true,
//       default: 'Point'
//     },
//     coordinates: {
//       type: [Number],
//       required: true,
//       default: [0, 0]
//     }
//   },
//   dateCreated: { type: Date, default: Date.now }
// });

// // Add the 2dsphere index for geospatial queries
// MechanicSchema.index({ liveLocation: '2dsphere' });

// MechanicSchema.pre('save', async function (next) {
//   if (!this.isModified('password')) return next();
//   try {
//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt);
//     next();
//   } catch (err) {
//     next(err);
//   }
// });

// module.exports = mongoose.model('Mechanic', MechanicSchema);



// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');

// const MechanicSchema = new mongoose.Schema({
//   username: { type: String, unique: true, required: true, trim: true },
//   email: { type: String, unique: true, required: true, lowercase: true, match: [/.+\@.+\..+/, 'Please provide a valid email address'] },
//   password: { type: String, required: true },
//   phoneNumber: { type: String, required: true, trim: true },
//   address: { type: String, required: true },
//   verificationCertificate: { type: String, required: true },
//   vehicleType: { type: String, required: true, enum: ['car', 'motorbike', 'bicycle', 'truck', 'other'] },
//   profilePicture: { type: String, default: null },
//   isApproved: { type: Boolean, default: false },
//   role: { type: String, default: 'mechanic' },
//   isAvailable: { type: Boolean, default: false },
//   liveLocation: {
//     type: {
//       type: String,
//       enum: ['Point'],
//       default: 'Point'
//     },
//     coordinates: {
//       type: [Number],
//       default: [0, 0] // Default coordinates if not set
//     }
//   },
//   dateCreated: { type: Date, default: Date.now }
// });

// MechanicSchema.pre('save', async function (next) {
//   if (!this.isModified('password')) return next();
//   try {
//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt);
//     next();
//   } catch (err) {
//     next(err);
//   }
// });




const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

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
    },
    coordinates: {
      type: [Number],
      required: true,
      default: [0, 0], // default to [0, 0] if no location is provided
    },
  },
  dateCreated: { type: Date, default: Date.now },
});

MechanicSchema.index({ liveLocation: '2dsphere' });

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
