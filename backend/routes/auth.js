const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middleware/authMiddleware'); 

// POST /api/auth/register - Register a new mechanic or user
router.post('/register', async (req, res) => {
    const { username, email, password, role, phoneNumber, address } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        user = new User({
            username,
            email,
            password: hashedPassword,
            role: role || 'user',
            phoneNumber,
            address,
            isBlocked: false,  // Default isBlocked to false
            isActive: true,    // Default isActive to true
        });

        await user.save();

        const payload = { user: { id: user.id, role: user.role } };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );
    } catch (error) {
        console.error('Registration Error:', error);
        res.status(500).json({ message: 'Registration failed. Please try again.' });
    }
});

// POST /api/auth/login - Log in a mechanic or user
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: 'Invalid Credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid Credentials' });

        const payload = { user: { id: user.id, role: user.role } };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' },
            (err, token) => {
                if (err) throw err;
                res.json({ token, role: user.role });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Update a user by ID
router.put('/users/:id', async (req, res) => {
    const { username, email, password, role, phoneNumber, address } = req.body;

    try {
        let user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ msg: 'User not found' });

        user.username = username || user.username;
        user.email = email || user.email;
        user.role = role || user.role;
        user.phoneNumber = phoneNumber || user.phoneNumber;
        user.address = address || user.address;

        // If password is provided, hash it before saving
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            user.password = hashedPassword;
        }

        await user.save();
        res.status(200).json({ msg: 'User updated successfully', user });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Error updating user. Please try again.' });
    }
});

// Block a user by setting isBlocked to true
router.put('/users/:id/block', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ msg: 'User not found' });

        user.isBlocked = true;
        await user.save();
        res.status(200).json({ msg: 'User has been blocked', user });
    } catch (error) {
        console.error('Error blocking user:', error);
        res.status(500).json({ message: 'Error blocking user. Please try again.' });
    }
});

// Deactivate a user by setting isActive to false
router.patch('/user/:id/deactivate', async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { isActive: false },
            { new: true, runValidators: false }
        );

        if (!user) return res.status(404).json({ msg: 'User not found' });
        res.status(200).json({ msg: 'User has been deactivated', user });
    } catch (error) {
        console.error('Error deactivating user:', error);
        res.status(500).json({ message: 'Error deactivating user. Please try again.' });
    }
});

module.exports = router;
