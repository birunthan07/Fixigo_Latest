const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MechanicSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: [true, 'Username is required']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'Email is required'],
        match: [/.+\@.+\..+/, 'Please provide a valid email address']
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    verificationCertificate: {
        type: String,
        required: [true, 'Verification certificate is required']
    },
    isApproved: {
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        default: 'mechanic'  // Updated role to 'mechanic'
    },
    isAvailable: {
        type: Boolean,
        default: false
    },
    liveLocation: {
        type: {
            latitude: Number,
            longitude: Number
        },
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Hash password before saving
MechanicSchema.pre('save', async function(next) {
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
