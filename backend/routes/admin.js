

const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const Mechanic = require('../models/ mechanicmodel.js');
const authMiddleware = require('../middleware/authMiddleware');
const bcrypt = require('bcryptjs');
// const ServiceRequest = require('../models/ServiceRequest');
// Apply authMiddleware to all routes
router.use(authMiddleware);

// Middleware to check for admin role
const adminCheck = (req, res, next) => {
    if (req.role !== 'admin') {
        return res.status(403).json({ msg: 'Admin access required' });
    }
    next();
};

// GET /api/admin/users - Fetch all users (admin only)
router.get('/users', adminCheck, async (req, res) => {
    try {
        const users = await User.find().select('-password'); // Exclude password
        res.json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});



// PATCH /api/admin/user/:id - Update user details (requires admin role)
router.patch('/users/:id', adminCheck, async (req, res) => {
    const { username, email, password, role } = req.body;

    try {
        let user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ msg: 'User not found' });

        // Update fields conditionally
        if (username) user.username = username;
        if (email) user.email = email;
        if (password) user.password = await bcrypt.hash(password, 10);
        if (role) user.role = role;

        await user.save();
        res.json({ msg: 'User updated successfully', user });
    } catch (err) {
        console.error('Error updating user:', err.message);
        res.status(500).json({ msg: 'Server error' });
    }
});

router.patch('/users/:id/activate', adminCheck, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        user.isActive = true;
        await user.save();
        res.json({ msg: 'User activated', user });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// PATCH /api/admin/user/:id/deactivate - Deactivate a user (requires admin role)
router.patch('/users/:id/deactivate', adminCheck, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ msg: 'User not found' });

        user.isActive = false;
        await user.save();
        res.json({ msg: 'User deactivated successfully', user });
    } catch (err) {
        console.error('Error deactivating user:', err.message);
        res.status(500).json({ msg: 'Server error' });
    }
});

// PATCH /api/admin/user/:id/promote - Promote a user to admin (requires admin role)
router.patch('/users/:id/promote', adminCheck, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ msg: 'User not found' });

        user.role = 'admin';
        await user.save();
        res.json({ msg: 'User promoted to admin', user });
    } catch (err) {
        console.error('Error promoting user:', err.message);
        res.status(500).json({ msg: 'Server error' });
    }
});

// PATCH /api/admin/user/:id/demote - Demote an admin to user (requires admin role)
router.patch('/users/:id/demote', adminCheck, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ msg: 'User not found' });

        user.role = 'user';
        await user.save();
        res.json({ msg: 'Admin demoted to user', user });
    } catch (err) {
        console.error('Error demoting user:', err.message);
        res.status(500).json({ msg: 'Server error' });
    }
});

// DELETE /api/admin/user/:id - Delete a user (requires admin role)
router.delete('/users/:id', adminCheck, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ msg: 'User not found' });

        await user.remove();
        res.json({ msg: 'User deleted successfully' });
    } catch (err) {
        console.error('Error deleting user:', err.message);
        res.status(500).json({ msg: 'Server error' });
    }
});


// GET /api/admin/mechanics - Fetch all mechanics (admin only)
router.get('/mechanics', adminCheck, async (req, res) => {
    try {
        const mechanics = await Mechanic.find().select('-password');
        res.json(mechanics);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// GET /api/admin/mechanic/:id - Fetch a specific mechanic's details (requires admin role)
router.get('/mechanic/:id', adminCheck, async (req, res) => {
    try {
        const mechanic = await Mechanic.findById(req.params.id).select('-password');
        if (!mechanic) {
            return res.status(404).json({ msg: 'Mechanic not found' });
        }
        res.json(mechanic);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

router.patch('/mechanic/:id/activate', adminCheck, async (req, res) => {
    try {
        const mechanic = await Mechanic.findById(req.params.id);
        if (!mechanic) return res.status(404).json({ msg: 'Mechanic not found' });

        mechanic.isActive = true; 
        await mechanic.save();
        res.json({ msg: 'Mechanic activated successfully', mechanic });
    } catch (err) {
        console.error('Error activating mechanic:', err.message);
        res.status(500).json({ msg: 'Server error' });
    }
});

// PATCH /api/admin/mechanic/:id/approve - Approve a mechanic (requires admin role)
// PATCH /api/admin/mechanic/:id/approve - Approve a mechanic (requires admin role)
router.patch('/mechanic/:id/approve', adminCheck, async (req, res) => {
    try {
        const mechanic = await Mechanic.findById(req.params.id);
        if (!mechanic) {
            return res.status(404).json({ msg: 'Mechanic not found' });
        }
        mechanic.isApproved = true;
        await mechanic.save();
        res.json({ msg: 'Mechanic approved', mechanic });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// PATCH /api/admin/mechanic/:id/reject - Reject a mechanic (requires admin role)
router.patch('/mechanic/:id/reject', adminCheck, async (req, res) => {
    try {
        const mechanic = await Mechanic.findById(req.params.id);
        if (!mechanic) {
            return res.status(404).json({ msg: 'Mechanic not found' });
        }
        mechanic.isApproved = false;
        await mechanic.save();
        res.json({ msg: 'Mechanic rejected', mechanic });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// DELETE /api/admin/mechanic/:id - Delete a mechanic (requires admin role)
router.delete('/admin/mechanic/:id', adminCheck, async (req, res) => {
    try {
        // Log the mechanic ID to confirm it's being passed correctly
        console.log(`Attempting to delete mechanic with ID: ${req.params.id}`);

        const mechanic = await Mechanic.findById(req.params.id);

        // Check if mechanic exists
        if (!mechanic) {
            console.log(`Mechanic with ID ${req.params.id} not found`);
            return res.status(404).json({ msg: 'Mechanic not found' });
        }

        // Remove the mechanic
        await mechanic.remove();
        console.log(`Mechanic with ID ${req.params.id} has been deleted`);

        // Send success response
        res.json({ msg: 'Mechanic deleted' });
    } catch (err) {
        console.error('Error deleting mechanic:', err.message);
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
});



// PATCH /api/admin/mechanic/:id - Update mechanic details (requires admin role)
router.patch('/mechanic/:id', adminCheck, async (req, res) => {
    const { username, email, vehicleType, licenseNumber } = req.body;

    try {
        const mechanic = await Mechanic.findById(req.params.id);
        if (!mechanic) return res.status(404).json({ msg: 'Mechanic not found' });

        // Update fields conditionally
        if (username) mechanic.username = username;
        if (email) mechanic.email = email;
        if (vehicleType) mechanic.vehicleType = vehicleType;
        if (licenseNumber) mechanic.licenseNumber = licenseNumber;

        await mechanic.save();
        res.json({ msg: 'Mechanic updated', mechanic });
    } catch (err) {
        console.error('Error updating mechanic:', err.message);
        res.status(500).json({ msg: 'Server error' });
    }
});



// PATCH /api/admin/mechanic/:id - Update mechanic details (requires admin role)
router.patch('/mechanic/:id', adminCheck, async (req, res) => {
    const { username, email, specialization, certification } = req.body;

    try {
        const mechanic = await Mechanic.findById(req.params.id);
        if (!mechanic) {
            return res.status(404).json({ msg: 'Mechanic not found' });
        }

        if (username) mechanic.username = username;
        if (email) mechanic.email = email;
        if (specialization) mechanic.specialization = specialization;
        if (certification) mechanic.certification = certification;

        await mechanic.save();
        res.json(mechanic);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});



// GET /api/admin/servicerequests - Fetch all service requests (requires admin role)
router.get('/servicerequests', adminCheck, async (req, res) => {
    try {
        const serviceRequests = await ServiceRequest.find()
            .populate('userId', 'name email')
            .populate('mechanicId', 'name specialization')
            .select('-__v');

        const serviceRequestsWithDefaults = serviceRequests.map((request) => ({
            ...request._doc,
            pickup: request.pickup || { address: 'Not provided' },
            dropoff: request.dropoff || { address: 'Not provided' }
        }));

        res.json(serviceRequestsWithDefaults);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
