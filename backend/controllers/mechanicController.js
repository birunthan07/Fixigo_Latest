const Mechanic = require('../models/ mechanicmodel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Mechanic Registration
exports.registerMechanic = async (req, res) => {
    const { username, email, password, vehicleType } = req.body;
    const { verificationCertificate } = req.files || {}; // Ensure req.files exists

    // Check if the required verification document is uploaded
    if (!verificationCertificate) {
        return res.status(400).json({ msg: 'Verification certificate is required.' });
    }

    try {
        let mechanic = await Mechanic.findOne({ email });
        if (mechanic) {
            return res.status(400).json({ msg: 'Mechanic already exists' });
        }

        // Create new mechanic object
        mechanic = new Mechanic({
            username,
            email,
            password,
            vehicleType,
            verificationCertificate: verificationCertificate[0]?.path // Handle file paths properly
        });

        // Hash the password before saving
        mechanic.password = await bcrypt.hash(password, 10);
        await mechanic.save();

        // Generate JWT token
        const payload = {
            mechanic: {
                id: mechanic.id,
                isApproved: mechanic.isApproved // Include approval status
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' },
            (err, token) => {
                if (err) {
                    console.error('Token generation error:', err);
                    return res.status(500).json({ msg: 'Token generation error' });
                }
                res.json({ token });
            }
        );
    } catch (err) {
        console.error('Server error during registration:', err.message);
        res.status(500).json({ msg: 'Server error during registration' });
    }
};

// Mechanic Login
exports.loginMechanic = async (req, res) => {
    const { email, password } = req.body;

    try {
        let mechanic = await Mechanic.findOne({ email });
        if (!mechanic) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // Check if the mechanic's account is approved
        if (!mechanic.isApproved) {
            return res.status(403).json({ msg: 'Your account is pending approval by the admin' });
        }

        const isMatch = await bcrypt.compare(password, mechanic.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const payload = {
            mechanic: {
                id: mechanic.id,
                isApproved: mechanic.isApproved
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' },
            (err, token) => {
                if (err) {
                    console.error('Token generation error:', err);
                    return res.status(500).json({ msg: 'Token generation error' });
                }
                res.json({ token });
            }
        );
    } catch (err) {
        console.error('Server error during login:', err.message);
        res.status(500).json({ msg: 'Server error during login' });
    }
};

// Get Mechanic Profile
exports.getMechanic = async (req, res) => {
    try {
        const mechanic = await Mechanic.findById(req.mechanic.id).select('-password');
        if (!mechanic) {
            return res.status(404).json({ msg: 'Mechanic not found' });
        }
        res.json(mechanic);
    } catch (err) {
        console.error('Server error fetching mechanic profile:', err.message);
        res.status(500).json({ msg: 'Server error fetching mechanic profile' });
    }
};

// Update Mechanic Profile
exports.updateMechanic = async (req, res) => {
    const { username, email, password, vehicleType } = req.body;
    const { verificationCertificate } = req.files || {}; // Ensure req.files exists

    try {
        const mechanic = await Mechanic.findById(req.mechanic.id);
        if (!mechanic) {
            return res.status(404).json({ msg: 'Mechanic not found' });
        }

        if (username) mechanic.username = username;
        if (email && email !== mechanic.email) {
            const emailExists = await Mechanic.findOne({ email });
            if (emailExists) {
                return res.status(400).json({ msg: 'Email already in use' });
            }
            mechanic.email = email;
        }
        if (password) mechanic.password = await bcrypt.hash(password, 10);
        if (vehicleType) mechanic.vehicleType = vehicleType;
        if (verificationCertificate) mechanic.verificationCertificate = verificationCertificate[0]?.path;

        await mechanic.save();
        res.json(mechanic);
    } catch (err) {
        console.error('Server error updating mechanic profile:', err.message);
        res.status(500).json({ msg: 'Server error updating mechanic profile' });
    }
};

// Delete Mechanic Profile
exports.deleteMechanic = async (req, res) => {
    try {
        const mechanic = await Mechanic.findByIdAndRemove(req.mechanic.id);
        if (!mechanic) {
            return res.status(404).json({ msg: 'Mechanic not found' });
        }
        res.json({ msg: 'Mechanic deleted' });
    } catch (err) {
        console.error('Server error deleting mechanic profile:', err.message);
        res.status(500).json({ msg: 'Server error deleting mechanic profile' });
    }
};

// Admin Approval of Mechanic
exports.approveMechanic = async (req, res) => {
    try {
        const mechanic = await Mechanic.findById(req.params.mechanicId);
        if (!mechanic) {
            return res.status(404).json({ msg: 'Mechanic not found' });
        }

        if (mechanic.isApproved) {
            return res.status(400).json({ msg: 'Mechanic is already approved' });
        }

        mechanic.isApproved = true;
        await mechanic.save();
        res.json({ msg: 'Mechanic approved successfully' });
    } catch (err) {
        console.error('Server error approving mechanic:', err.message);
        res.status(500).json({ msg: 'Server error approving mechanic' });
    }
};
