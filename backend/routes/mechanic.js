
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Mechanic = require('../models/ mechanicmodel'); // Updated to use the Mechanic model
const authMiddleware = require('../middleware/authMiddleware');
const mongoose = require('mongoose');

router.post('/service-requests/:token', async (req, res) => {
    const { token } = req.params;

    try {
        // Verify the token and get mechanic ID
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const mechanicId = decoded.mechanic.id;
        console.log(mechanicId);

        const mechanic = await Mechanic.findById(mechanicId);
        if (!mechanic) {
            return res.status(404).json({ message: 'Mechanic not found' });
        }

        const { specialization, location: liveLocation } = mechanic;

        console.log('Mechanic Location:', liveLocation.coordinates);

        // Fetch all service requests that match the mechanic's specialization
        const serviceRequests = await ServiceRequest.find({
            specialization: specialization.toLowerCase(),
            status: 'pending'
        });

        res.json({ nearbyRequest: serviceRequests[serviceRequests.length - 1] });
        
    } catch (error) {
        console.error('Error fetching service requests:', error);
        res.status(500).json({ message: 'Failed to fetch service requests' });
    }
});


// Find user
router.get('/user/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error('Error fetching user details:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


// Define the upload directory
const uploadDir = path.join(__dirname, '../uploads');

// Create the upload directory if it does not exist
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir); // Specify the upload directory
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname); // Customize the file name
    }
});

const upload = multer({ storage });

// POST /api/mechanic/register - Register Mechanic with document uploads

router.post('/register', 
    upload.single('verificationCertificate'), // Require one file upload for verification certificate
    async (req, res) => {
        const { username, email, password, phoneNumber, address, vehicleType } = req.body;

        try {
            // Check if the mechanic already exists
            let mechanic = await Mechanic.findOne({ email });
            if (mechanic) {
                return res.status(400).json({ msg: 'Mechanic already exists' });
            }

            // Ensure verification certificate is uploaded
            if (!req.file) { 
                return res.status(400).json({ msg: 'Verification certificate must be uploaded' });
            }

            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Create new mechanic instance
            mechanic = new Mechanic({
                username,
                email,
                password: hashedPassword,
                phoneNumber,
                address,
                vehicleType,
                verificationCertificate: req.file.path, // Save the path to the uploaded certificate
                liveLocation: {
                    type: "Point",
                    coordinates: [0, 0] // Initialize with default coordinates
                },
                isApproved: false
            });

            // Save mechanic to the database
            await mechanic.save();

            // Generate JWT token
            const payload = {
                mechanic: {
                    id: mechanic.id,
                    role: 'mechanic'
                }
            };

            jwt.sign(
                payload,
                process.env.JWT_SECRET,
                { expiresIn: '1h' },
                (err, token) => {
                    if (err) throw err;
                    res.json({ token, role: 'mechanic', mechanicId: mechanic.id });
                }
            );
        } catch (error) {
            console.error('Registration Error:', error);
            if (error.name === 'ValidationError') {
                const errors = Object.values(error.errors).map(err => err.message);
                return res.status(400).json({ errors });
            }
            res.status(500).json({ message: 'Registration failed. Please try again.' });
        }
    }
);

// POST /api/mechanic/login - Login Mechanic
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Attempt to find the mechanic by email
        let mechanic = await Mechanic.findOne({ email });
        if (!mechanic) {
            console.log("Mechanic not found with email:", email); // Logging for debugging
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        // Check if the mechanic's account is approved
        if (!mechanic.isApproved) {
            console.log("Mechanic account is not approved"); // Logging for debugging
            return res.status(403).json({ msg: 'Your account is not approved yet.' });
        }

        // Validate password
        const isMatch = await bcrypt.compare(password, mechanic.password);
        if (!isMatch) {
            console.log("Password does not match"); // Logging for debugging
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const payload = {
            mechanic: {
                id: mechanic.id,
                role: 'mechanic',
            },
        };

        // Sign JWT token
        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' },
            (err, token) => {
                if (err) throw err;
                res.json({ mechanicId: mechanic.id, token, role: 'mechanic' });
            }
        );
    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).send('Server error');
    }
});


// Get all users (mechanics)
router.get('/mechanics', async (req, res) => {
    try {
        const users = await Mechanic.find(); // Use the Mechanic model or User model as appropriate
        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Error retrieving users. Please try again.' });
    }
});


// Get mechanic by ID
router.get('/mechanics/:id', async (req, res) => {
    try {
        // Validate ObjectId format
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ msg: 'Invalid user ID format' });
        }

        // Fetch mechanic by ID
        const mechanic = await Mechanic.findById(req.params.id);
        if (!mechanic) {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.status(200).json(mechanic);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ message: 'Error retrieving user. Please try again.' });
    }
});

// Update a mechanic by ID
router.put('/mechanics/:id', async (req, res) => {
    const { username, email, password, vehicleType } = req.body;
    const updates = { username, email, password, vehicleType };

    try {
        const mechanic = await Mechanic.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true }); // Update and return the new document
        if (!mechanic) {
            return res.status(404).json({ msg: 'Mechanic not found' });
        }
        res.status(200).json(mechanic); // Return the updated mechanic data
    } catch (error) {
        console.error('Error updating mechanic:', error);
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ errors });
        }
        res.status(500).json({ message: 'Error updating mechanic. Please try again.' });
    }
});

// Block a mechanic by ID
router.put('/mechanics/:id/block', async (req, res) => {
    try {
        const mechanic = await Mechanic.findByIdAndUpdate(req.params.id, { isBlocked: true }, { new: true }); // Update to block the mechanic
        if (!mechanic) {
            return res.status(404).json({ msg: 'Mechanic not found' });
        }
        res.status(200).json({ msg: 'Mechanic blocked successfully', mechanic });
    } catch (error) {
        console.error('Error blocking mechanic:', error);
        res.status(500).json({ message: 'Error blocking mechanic. Please try again.' });
    }
});


router.post('/update-availability', async (req, res) => {
    const { mechanicId, isAvailable, liveLocation } = req.body;

    try {
        // Prepare the update data
        const updateData = { isAvailable };

        // Only update liveLocation if it is provided and isAvailable is true
        if (isAvailable && liveLocation && Array.isArray(liveLocation.coordinates)) {
            const [longitude, latitude] = liveLocation.coordinates;
            if (typeof longitude === 'number' && typeof latitude === 'number') {
                updateData.liveLocation = {
                    type: "Point", // GeoJSON type
                    coordinates: [longitude, latitude], // Ensure correct [longitude, latitude] format
                };
            } else {
                return res.status(400).json({ message: 'Invalid live location coordinates' });
            }
        } else if (!isAvailable) {
            // If the mechanic is not available, clear the liveLocation
            updateData.liveLocation = null;
        }

        // Update mechanic's status and location
        const updatedMechanic = await Mechanic.findByIdAndUpdate(
            mechanicId,
            updateData,
            { new: true }
        );

        if (!updatedMechanic) {
            return res.status(404).json({ message: 'Mechanic not found' });
        }

        res.json(updatedMechanic);
    } catch (error) {
        console.error('Error updating mechanic availability:', error);
        res.status(500).json({ message: 'Server error', error });
    }
});



// Mechanic Profile
router.get('/profile/:mechanicId', async (req, res) => {
    try {
        const mechanic = await Mechanic.findById(req.params.mechanicId);
        if (!mechanic) {
            return res.status(404).json({ message: 'Mechanic not found' });
        }
        res.json({
            _id: mechanic._id,
            username: mechanic.username,
            certificationNumber: mechanic.certificationNumber,
            specialization: mechanic.specialization,
            vehicleSpecialization: mechanic.vehicleSpecialization,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// Accept service request
router.put('/accept/:serviceRequestId', async (req, res) => {
    const { serviceRequestId } = req.params;

    try {
        const updatedRequest = await ServiceRequest.findByIdAndUpdate(
            serviceRequestId,
            { status: 'accepted', acceptedAt: new Date() },
            { new: true }
        );

        if (!updatedRequest) {
            return res.status(404).json({ message: 'Service request not found' });
        }

        res.json({
            message: 'Service request status updated to accepted',
            serviceRequest: updatedRequest
        });
    } catch (error) {
        console.error('Error updating service request status:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
});


// Check if latest request is accepted
router.get('/service-requests', async (req, res) => {
    try {
        const serviceRequests = await serviceRequest.find();

        if (serviceRequests.length > 0) {
            const firstRequest = serviceRequests[serviceRequests.length - 1];
            const isAccepted = firstRequest.status === 'accepted';
            return res.json({ accepted: isAccepted });
        } else {
            return res.json({ accepted: false });
        }
    } catch (error) {
        console.error('Error fetching service requests:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
});



// // Mechanic search route
// router.get('/search', async (req, res) => {
//     const { lat, lng, vehicleType } = req.query;

//     // Validate query parameters
//     if (!lat || !lng || !vehicleType) {
//         return res.status(400).json({
//             message: 'Latitude, longitude, and vehicle type are required.'
//         });
//     }

//     try {
//         // Define search parameters
//         const radiusInMeters = 5000; // 5 km radius
//         const mechanics = await Mechanic.find({
//             liveLocation: {
//                 $near: {
//                     $geometry: {
//                         type: 'Point',
//                         coordinates: [parseFloat(lng), parseFloat(lat)], // [longitude, latitude]
//                     },
//                     $maxDistance: radiusInMeters,
//                 },
//             },
//             vehicleType: vehicleType, // Match vehicle type
//             isAvailable: true, // Filter by availability
//         });

//         // Return results
//         res.status(200).json({ mechanics });
//     } catch (error) {
//         console.error('Error searching mechanics:', error);
//         res.status(500).json({
//             message: 'Server error while searching mechanics',
//             error: error.message,
//         });
//     }
// });

router.get('/search', async (req, res) => {
    const { lat, lng, vehicleType } = req.query;

    if (!lat || !lng || !vehicleType) {
        return res.status(400).json({ message: "Missing required query parameters: lat, lng, vehicleType." });
    }

    try {
        // Ensure coordinates are parsed as floats
        const latFloat = parseFloat(lat);
        const lngFloat = parseFloat(lng);

        if (isNaN(latFloat) || isNaN(lngFloat)) {
            return res.status(400).json({ message: "Invalid latitude or longitude." });
        }

        const mechanics = await Mechanic.aggregate([
            {
                $geoNear: {
                    near: { type: "Point", coordinates: [lngFloat, latFloat] },  // Correcting coordinates order
                    distanceField: "distance",
                    maxDistance: 5000,  // Distance in meters
                    query: { vehicleType: vehicleType },
                    spherical: true
                }
            }
        ]);

        // Return mechanics found
        res.json({ mechanics });
    } catch (error) {
        console.error("Error fetching mechanics:", error);
        res.status(500).json({ message: "Error fetching mechanics." });
    }
});

// Backend route to fetch live locations of available mechanics
router.get('/live-locations', async (req, res) => {
    try {
        const mechanics = await Mechanic.find({
            isAvailable: true,
            liveLocation: { $ne: null } // Ensure liveLocation is not null
        }).select('username vehicleType isAvailable liveLocation');

        res.json({ mechanics });
    } catch (error) {
        console.error('Error fetching live locations:', error);
        res.status(500).json({ message: 'Failed to fetch mechanics live locations' });
    }
});

  
  module.exports = router;  
