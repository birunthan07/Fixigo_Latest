

// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');

// const UserSchema = new mongoose.Schema({
//     username: {
//         type: String,
//         unique: true,
//         required: [true, 'Username is required']
//     },
//     email: {
//         type: String,
//         unique: true,
//         required: [true, 'Email is required'],
//         match: [/.+\@.+\..+/, 'Please provide a valid email address']  // Validate email format
//     },
//     password: {
//         type: String,
//         required: [true, 'Password is required']
//     },
//     role: {
//         type: String,
//         enum: ['user', 'admin'],  // Define valid roles, including mechanic
//         default: 'user'           // Default role
//     },
//     isActive: {
//         type: Boolean,
//         default: true             // Default to active user
//     },
//     address: {
//         type: String,
//         required: [true, 'Address is required']  // User address for locating services
//     },
//     phoneNumber: {
//         type: String,
//         required: [true, 'Phone number is required'],  // Contact number
//         match: [/^\d{10}$/, 'Please provide a valid phone number']  // Validate phone format
//     },
//     createdAt: {
//         type: Date,
//         default: Date.now        // Track account creation date
//     }
// });

// // Hash password before saving
// UserSchema.pre('save', async function(next) {
//     if (!this.isModified('password')) {
//         return next();
//     }
//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt);
//     next();
// });

// module.exports = mongoose.model('User', UserSchema);




const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: function() { return this.isNew || this.isModified('username'); }  // Required on creation or username change
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'Email is required'],
        match: [/.+\@.+\..+/, 'Please provide a valid email address']  // Validate email format
    },
    password: {
        type: String,
        required: function() { return this.isNew || this.isModified('password'); }
    },
    role: {
        type: String,
        enum: ['user', 'admin'],  // Define valid roles, including mechanic
        default: 'user'           // Default role
    },
    isActive: {
        type: Boolean,
        default: true
    },
    address: {
        type: String,
        required: [true, 'Address is required']  // User address for locating services
    },
    phoneNumber: {
        type: String,
        required: [true, 'Phone number is required'],  // Contact number
        match: [/^\d{10}$/, 'Please provide a valid phone number']  // Validate phone format
    },
    createdAt: {
        type: Date,
        default: Date.now        // Track account creation date
    }
});
