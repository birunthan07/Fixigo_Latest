const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const Mechanic = require('../models/ mechanicmodel')
require('dotenv').config();

// Main Authentication & Role-Based Middleware
module.exports = async function (req, res, next) {
    // Extract token from the 'Authorization' header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    // Check if the token exists
    if (!token) {
        return res.status(401).json({ message: 'User not authenticated' });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Destructure the decoded token
        const { user } = decoded;

        // Retrieve user document based on role
        const userDoc = await User.findById(user.id).select('-password');

        // Check if user exists
        if (!userDoc) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // Admin-specific role check
        if (user.role === 'admin' && userDoc.role !== 'admin') {
            return res.status(403).json({ msg: 'Admin access denied' });
        }

        // Attach the user and role to the request object
        req.user = userDoc;
        req.role = user.role;

        next();
    } catch (err) {
        console.error('Token Verification Error:', err);

        // Handle token-related errors
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ msg: 'Token has expired' });
        } else if (err.name === 'JsonWebTokenError') {
            return res.status(403).json({ msg: 'Token is invalid' });
        } else {
            return res.status(500).json({ msg: 'Token verification failed' });
        }
    }
};
