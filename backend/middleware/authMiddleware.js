


// const jwt = require('jsonwebtoken');
// const User = require('../models/userModel');
// const Mechanic = require('../models/ mechanicmodel');
// require('dotenv').config();

// // Main Authentication & Role-Based Middleware
// module.exports = async function (req, res, next) {
//     // Extract token from the 'Authorization' header
//     const authHeader = req.headers['authorization'];
//     const token = authHeader && authHeader.split(' ')[1];

//     // Check if the token exists
//     if (!token) {
//         return res.status(401).json({ message: 'User not authenticated' });
//     }

//     try {
//         // Verify the token
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);

//         // Destructure the decoded token
//         const { user } = decoded;

//         // Retrieve user document based on role
//         const userDoc = await User.findById(user.id).select('-password');

//         // Check if user exists
//         if (!userDoc) {
//             return res.status(404).json({ msg: 'User not found' });
//         }

//         // Admin-specific role check
//         if (user.role === 'admin' && userDoc.role !== 'admin') {
//             return res.status(403).json({ msg: 'Admin access denied' });
//         }

//         // Attach the user and role to the request object
//         req.user = userDoc;
//         req.role = user.role;

//         // Optionally check for mechanic role, or include any mechanic-specific checks
//         if (user.role === 'mechanic') {
//             const mechanic = await Mechanic.findOne({ userId: user.id });
//             if (!mechanic) {
//                 return res.status(404).json({ msg: 'Mechanic not found' });
//             }
//             req.mechanic = mechanic; // Attach mechanic info if needed
//         }

//         next();
//     } catch (err) {
//         console.error('Token Verification Error:', err);

//         // Handle token-related errors
//         if (err.name === 'TokenExpiredError') {
//             return res.status(401).json({ msg: 'Token has expired' });
//         } else if (err.name === 'JsonWebTokenError') {
//             return res.status(403).json({ msg: 'Token is invalid' });
//         } else {
//             return res.status(500).json({ msg: 'Token verification failed' });
//         }
//     }
// };



const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const Mechanic = require('../models/ mechanicmodel');
require('dotenv').config();

module.exports = async function (req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'User not authenticated' });
    }

    try {
        // Log the token for debugging
        console.log('Token:', token);

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Check if the decoded token has a valid user structure
        if (!decoded || !decoded.user || !decoded.user.id) {
            return res.status(401).json({ msg: 'Invalid token structure or missing user id' });
        }

        const { user } = decoded;

        // Retrieve user document based on the id from the token
        const userDoc = await User.findById(user.id).select('-password');

        if (!userDoc) {
            return res.status(404).json({ msg: 'User not found' });
        }

        if (userDoc.role !== user.role) {
            return res.status(403).json({ msg: 'Role mismatch. Access denied' });
        }

        req.user = userDoc;
        req.role = user.role;

        // If the user is a mechanic, find the mechanic profile
        if (user.role === 'mechanic') {
            const mechanic = await Mechanic.findOne({ userId: user.id });
            if (!mechanic) {
                return res.status(404).json({ msg: 'Mechanic not found' });
            }
            req.mechanic = mechanic;
        }

        next();
    } catch (err) {
        console.error('Token Verification Error:', err);

        // Handle different types of JWT errors
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ msg: 'Token has expired' });
        } else if (err.name === 'JsonWebTokenError') {
            return res.status(403).json({ msg: 'Token is invalid' });
        } else {
            return res.status(500).json({ msg: 'Token verification failed', error: err.message });
        }
    }
};
