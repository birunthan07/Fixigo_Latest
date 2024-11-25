


const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: [true, 'Username is required'],
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'Email is required'],
        match: [/.+\@.+\..+/, 'Please provide a valid email address'],
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
    },
    role: {
        type: String,
        enum: ['user', 'admin', 'mechanic'],
        default: 'user',
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    address: {
        type: String,
        required: [true, 'Address is required'],
    },
    phoneNumber: {
        type: String,
        required: [true, 'Phone number is required'],
        match: [/^\d{10}$/, 'Please provide a valid phone number'],
    },
    liveLocation: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point',
        },
        coordinates: {
            type: [Number], // Format: [longitude, latitude]
            default: [0, 0],
        },
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Hash the password before saving the user
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

module.exports = mongoose.model('User', UserSchema);
