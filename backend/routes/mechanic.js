
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
const Notification = require('../models/Notification');
const Request = require('../models/MechanicRequestmodel');
const authenticate = require('../middleware/authMiddleware');


// Mechanic requests route
router.get('/mechanic-requests', authenticate, async (req, res) => {
    const mechanicEmail = req.user.email; // Assuming the mechanic's email is available after authentication
  
    try {
      // Find all requests for this mechanic
      const requests = await Request.find({ mechanicEmail }).sort({ createdAt: -1 });
  
      if (!requests.length) {
        return res.status(404).json({ message: 'No requests found for this mechanic.' });
      }
  
      // Populate user details for each request
      const populatedRequests = await Promise.all(
        requests.map(async (request) => {
          const user = await User.findById(request.userId).select('username email phone address');
          return {
            ...request.toObject(),
            user,
          };
        })
      );
  
      res.status(200).json({ requests: populatedRequests });
    } catch (error) {
      console.error('Error fetching mechanic requests:', error);
      res.status(500).json({ error: 'Failed to fetch mechanic requests', message: error.message });
    }
  });
  

// Send a request from user to mechanic
router.post('/send-request', authenticate, async (req, res) => {
    const { userId, mechanicEmail } = req.body;
  
    try {
      const newRequest = new Request({ userId, mechanicEmail });
      await newRequest.save();
  
      // Add a notification for the mechanic
      const notification = new Notification({
        receiverEmail: mechanicEmail,
        message: `You have a new request from a user.`,
      });
      await notification.save();
  
      res.status(201).json({ message: 'Request sent successfully.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to send request.' });
    }
  });
  
  // Mechanic accepts or rejects the request
  router.patch('/update-request', authenticate, async (req, res) => {
    const { requestId, status } = req.body;
  
    try {
      const request = await Request.findById(requestId);
      if (!request) {
        return res.status(404).json({ message: 'Request not found.' });
      }
  
      request.status = status;
      await request.save();
  
      // Notify the user about the mechanic's response
      const notification = new Notification({
        receiverEmail: request.userId, // Assuming user's email can be derived from userId
        message: `Your request was ${status.toLowerCase()} by the mechanic.`,
      });
      await notification.save();
  
      res.status(200).json({ message: `Request ${status.toLowerCase()} successfully.` });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to update request.' });
    }
  });
  

  router.get('/user-requests', authenticate, async (req, res) => {
    const userId = req.user.id; // Assuming `req.user.id` is set after successful authentication
  
    try {
      // Fetch the requests for the logged-in user
      const requests = await Request.find({ userId })
        .sort({ createdAt: -1 }); // Sort by createdAt in descending order
  
      // Check if the user has any requests
      if (!requests.length) {
        return res.status(404).json({ message: 'No requests found for the user.' });
      }
  
      // Populate mechanic details based on mechanicEmail
      const populatedRequests = await Promise.all(
        requests.map(async (request) => {
          const mechanic = await Mechanic.findOne({ email: request.mechanicEmail }).select('username email');
          return {
            ...request.toObject(),
            mechanic,
          };
        })
      );
  
      // Return the requests with mechanic details
      res.status(200).json({ requests: populatedRequests });
    } catch (error) {
      console.error('Error fetching requests:', error);
      res.status(500).json({ error: 'Failed to fetch requests', message: error.message });
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



// router search mechanics 
router.get('/search', async (req, res) => {
    const { lat, lng, vehicleType } = req.query;

    console.log("Query Params:", { lat, lng, vehicleType });

    if (!lat || !lng || !vehicleType) {
        return res.status(400).json({ message: "Missing required query parameters: lat, lng, vehicleType." });
    }

    try {
        const latFloat = parseFloat(lat);
        const lngFloat = parseFloat(lng);

        if (isNaN(latFloat) || isNaN(lngFloat)) {
            return res.status(400).json({ message: "Invalid latitude or longitude." });
        }

        const mechanics = await Mechanic.aggregate([
            {
                $geoNear: {
                    near: { type: "Point", coordinates: [lngFloat, latFloat] },
                    distanceField: "distance",
                    maxDistance: 5000,  // Adjust this distance as needed
                    query: { vehicleType: vehicleType },
                    spherical: true
                }
            },
            {
                $project: {  // Specify the fields you want to return
                    username: 1,
                    email: 1,
                    verificationCertificate: 1,
                    isApproved: 1,
                    role: 1,
                    isAvailable: 1,
                    liveLocation: 1,
                    distance: 1,  // Optional: include the distance from the search location
                    _id: 0
                }
            }
        ]);

        if (mechanics.length === 0) {
            console.log("No mechanics found for the given query.");
            return res.status(200).json({ message: "No mechanics found." });
        }

        console.log("Fetched Mechanics:", mechanics);

        res.status(200).json({ mechanics });
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
