// src/routes/mechanic.js

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const Mechanic = require('../models/ mechanicmodel.js'); // Updated import path
const authMiddleware = require('../middleware/authMiddleware');
const ServiceRequest = require('../models/MechanicRequestmodel.js');
const User = require('../models/userModel.js'); 

// Define the upload directory
const uploadDir = path.join(__dirname, '../uploads');

// Ensure upload directory exists
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });


// Register a new mechanic
router.post('/register', 
    upload.single('verificationCertificate'), 
    async (req, res) => {
        const { username, email, password, phoneNumber, address, vehicleType, longitude, latitude } = req.body;

        try {
            // Check if mechanic exists
            let mechanic = await Mechanic.findOne({ email });
            if (mechanic) {
                return res.status(400).json({ msg: 'Mechanic already exists' });
            }

            // Ensure verification certificate is uploaded
            if (!req.file) {
                return res.status(400).json({ msg: 'Verification certificate must be uploaded' });
            }

            // Validate coordinates
            if (!longitude || !latitude) {
                return res.status(400).json({ msg: 'Longitude and latitude are required' });
            }

            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Create new mechanic
            mechanic = new Mechanic({
                username,
                email,
                password: hashedPassword,
                phoneNumber,
                address,
                vehicleType,
                verificationCertificate: req.file.path,
                liveLocation: {
                    type: 'Point',
                    coordinates: [parseFloat(longitude), parseFloat(latitude)]
                },
                isApproved: false
            });

            await mechanic.save();

            // Generate JWT token
            const payload = { mechanic: { id: mechanic.id, role: 'mechanic' } };
            const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

            res.json({ token, role: 'mechanic', mechanicId: mechanic.id });
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

// Login mechanic
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ msg: 'Email and password are required' });
    }

    try {
        let mechanic = await Mechanic.findOne({ email });

        if (!mechanic) {
            console.log("Mechanic not found with email:", email);
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        // Ensure the mechanic is approved
        if (!mechanic.isApproved) {
            console.log("Mechanic account is not approved:", mechanic.email);
            return res.status(403).json({ msg: 'Your account is not approved yet.' });
        }

        // Password comparison
        console.log("Password entered:", password);
        console.log("Stored hashed password:", mechanic.password);

        const isMatch = await bcrypt.compare(password, mechanic.password);

        if (!isMatch) {
            console.log("Password does not match for email:", email);
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        // Generate JWT token if password matches
        const payload = { mechanic: { id: mechanic.id, role: 'mechanic' } };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        console.log("Successfully logged in mechanic:", mechanic.email);
        return res.status(200).json({ mechanicId: mechanic.id, token, role: 'mechanic' });

    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).json({ msg: 'Server error' });
    }
});

// Get all mechanics
router.get('/mechanics', async (req, res) => {
    try {
        const users = await Mechanic.find();
        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Error retrieving users. Please try again.' });
    }
});


// Get mechanic by ID
router.get('/mechanics/:id', async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ msg: 'Invalid user ID format' });
    }

    try {
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


// Update mechanic availability and location
router.post('/update-availability', async (req, res) => {
    const { mechanicId, isAvailable, liveLocation } = req.body;

    try {
        const updateData = { isAvailable };

        if (isAvailable && liveLocation) {
            updateData.liveLocation = {
                type: "Point",
                coordinates: liveLocation.coordinates
            };
        } else {
            updateData.liveLocation = null;
        }

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
        res.status(500).json({ message: 'Server error' });
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

// // Route to search mechanics by location and vehicle type
// router.get('/search', async (req, res) => {
//     const { lat, lng, vehicleType } = req.query;

//     // Validate query parameters
//     if (!lat || !lng || !vehicleType) {
//         return res.status(400).json({ message: "Missing required query parameters: lat, lng, vehicleType." });
//     }

//     try {
//         const mechanics = await Mechanic.aggregate([
//             {
//                 $geoNear: {
//                     near: { type: "Point", coordinates: [parseFloat(lng), parseFloat(lat)] },
//                     distanceField: "distance",
//                     maxDistance: 5000, // Adjust radius as needed
//                     query: { vehicleType: vehicleType },
//                     spherical: true
//                 }
//             }
//         ]);

//         if (mechanics.length === 0) {
//             return res.status(404).json({ message: "No mechanics found nearby." });
//         }

//         res.status(200).json({ mechanics });
//     } catch (error) {
//         console.error("Error fetching mechanics:", error);
//         res.status(500).json({ message: "Error fetching mechanics. Please try again later." });
//     }
// });



// Search mechanics within a radius (in meters)
router.get('/search', async (req, res) => {
    const { lat, lng, vehicleType } = req.query;  // Get latitude, longitude, and vehicleType from query params
    const radius = 5000000;  // 5000 km in meters
  
    try {
      // Validate lat, lng, and vehicleType
      if (!lat || !lng || !vehicleType) {
        return res.status(400).json({ message: 'Missing required fields' });
      }
  
      // Find mechanics within the radius using $geoNear
      const mechanics = await Mechanic.aggregate([
        {
          $geoNear: {
            near: { type: "Point", coordinates: [parseFloat(lng), parseFloat(lat)] },
            distanceField: "distance",  // Adds the calculated distance to each mechanic
            maxDistance: radius,        // Filter mechanics within the radius
            spherical: true,            // Use spherical Earth model
          },
        },
        {
          $match: { vehicleType: vehicleType }  // Optional: Filter by vehicle type
        },
        {
          $project: {
            name: 1,
            location: 1,
            distance: 1  // Include distance in the result
          }
        }
      ]);
  
      // Return the list of mechanics
      return res.json({ mechanics });
    } catch (error) {
      console.error('Error fetching mechanics:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  });

module.exports = router;
