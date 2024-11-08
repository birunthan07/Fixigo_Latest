

// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');

// const MechanicSchema = new mongoose.Schema({
//     username: {
//         type: String,
//         unique: true,
//         required: [true, 'Username is required'],
//         trim: true,
//     },
//     email: {
//         type: String,
//         unique: true,
//         required: [true, 'Email is required'],
//         lowercase: true,
//         match: [/.+\@.+\..+/, 'Please provide a valid email address'],
//     },
//     password: {
//         type: String,
//         required: [true, 'Password is required'],
//     },
//     verificationCertificate: {
//         type: String,
//         required: [true, 'Verification certificate is required'],
//     },
//     isApproved: {
//         type: Boolean,
//         default: false,
//     },
//     role: {
//         type: String,
//         default: 'mechanic',  // Default role as 'mechanic'
//     },
//     phoneNumber: {
//         type: String,
//         required: true,
//         trim: true,
//     },
//     address: {
//         type: String,
//         required: true,
//     },
//     vehicleType: {
//         type: String,
//         required: true,
//         enum: ['bike', 'car', 'truck', 'bus'], // Adjust based on allowed types
//     },
//     profilePicture: {
//         type: String, // Path to uploaded file
//         default: null,
//     },
 
//     isAvailable: {
//         type: Boolean,
//         default: false,
//     },
//     available: {
//         type: Boolean,
//         default: false,
//     },
//     liveLocation: {
//         type: {
//             coordinates: {
//                 type: [Number], // Store latitude and longitude as an array
//                 required: false
//             }
//         },
//         default: { coordinates: [0, 0] } // Default location
//     },
//     createdAt: {
//         type: Date,
//         default: Date.now
//     }
// });

// // Hash password before saving
// MechanicSchema.pre('save', async function (next) {
//     if (!this.isModified('password')) {
//         return next();
//     }
//     try {
//         const salt = await bcrypt.genSalt(10);
//         this.password = await bcrypt.hash(this.password, salt);
//         next();
//     } catch (err) {
//         next(err);
//     }
// });

// module.exports = mongoose.model('Mechanic', MechanicSchema);


// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');

// const MechanicSchema = new mongoose.Schema({
//     username: {
//         type: String,
//         unique: true,
//         required: [true, 'Username is required'],
//         trim: true,
//     },
//     email: {
//         type: String,
//         unique: true,
//         required: [true, 'Email is required'],
//         lowercase: true,
//         match: [/.+\@.+\..+/, 'Please provide a valid email address'],
//     },
//     password: {
//         type: String,
//         required: [true, 'Password is required'],
//     },
//     phoneNumber: {
//         type: String,
//         required: [true, 'Phone number is required'],
//         trim: true,
//     },
//     address: {
//         type: String,
//         required: [true, 'Address is required'],
//     },
//     verificationCertificate: {
//         type: String,
//         required: [true, 'Verification certificate is required'],
//     },
//     vehicleType: {
//         type: String,
//         required: [true, 'Vehicle type is required'],
//         enum: ['car', 'motorbike', 'bicycle', 'truck', 'other'], // Updated to match dropdown options
//     },
//     profilePicture: {
//         type: String, // Path to the uploaded profile picture
//         default: null,
//     },
//     isApproved: {
//         type: Boolean,
//         default: false,
//     },
//     role: {
//         type: String,
//         default: 'mechanic',  // Default role as 'mechanic'
//     },
//     isAvailable: {
//         type: Boolean,
//         default: false,
//     },
//     liveLocation: {
//         type: {
//             latitude: Number,
//             longitude: Number,
//         },
//         default: null,
//     },
//     dateCreated: {
//         type: Date,
//         default: Date.now,
//     },
// });

// // Hash password before saving
// MechanicSchema.pre('save', async function(next) {
//     if (!this.isModified('password')) {
//         return next();
//     }
//     try {
//         const salt = await bcrypt.genSalt(10);
//         this.password = await bcrypt.hash(this.password, salt);
//         next();
//     } catch (err) {
//         next(err);
//     }
// });

// module.exports = mongoose.model('Mechanic', MechanicSchema);


const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MechanicSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: [true, 'Username is required'],
    trim: true,
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'Email is required'],
    lowercase: true,
    match: [/.+\@.+\..+/, 'Please provide a valid email address'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
  },
  phoneNumber: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
  },
  verificationCertificate: {
    type: String,
    required: [true, 'Verification certificate is required'],
  },
  vehicleType: {
    type: String,
    required: [true, 'Vehicle type is required'],
    enum: ['car', 'motorbike', 'bicycle', 'truck', 'other'],
  },
  profilePicture: {
    type: String,
    default: null,
  },
  isApproved: {
    type: Boolean,
    default: false,
  },
  role: {
    type: String,
    default: 'mechanic',
  },
  isAvailable: {
    type: Boolean,
    default: false,
  },
  liveLocation: {
    type: {
      latitude: Number,
      longitude: Number,
    },
    default: null,
  },
  dateCreated: {
    type: Date,
    default: Date.now,
  },
});

// Hash password before saving
MechanicSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model('Mechanic', MechanicSchema);
