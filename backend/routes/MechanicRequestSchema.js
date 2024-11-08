

const express = require('express');
const router = express.Router();
const MechanicRequest = require('../models/MechanicRequestmodel.js');
const authMiddleware = require('../middleware/authMiddleware.js');
const { io } = require('../server.js');


// Haversine formula to calculate distance
const calculateDistance = (coords1, coords2) => {
  const toRad = x => (x * Math.PI) / 180;
  const R = 6371; // Earth's radius in km

  const lat1 = coords1[1];
  const lon1 = coords1[0];
  const lat2 = coords2[1];
  const lon2 = coords2[0];

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Validation middleware
const validateServiceRequest = (req, res, next) => {
  const { issueDescription, location, vehicleType } = req.body;

  if (!issueDescription || !location?.address || !location?.coordinates || !vehicleType) {
      return res.status(400).json({
          message: 'Missing required fields',
          required: {
              issueDescription: 'string',
              location: { address: 'string', coordinates: '[longitude, latitude]' },
              vehicleType: 'string'
          }
      });
  }

  if (!Array.isArray(location.coordinates) || location.coordinates.length !== 2) {
      return res.status(400).json({ message: 'Invalid coordinates format' });
  }

  next();
};

// Create service request endpoint
router.post('/create', authMiddleware, validateServiceRequest, async (req, res) => {
  try {
      const { issueDescription, location, vehicleType } = req.body;
      console.log('Creating service request:', { issueDescription, location, vehicleType });

      // Create service request
      const newServiceRequest = new ServiceRequest({
          userId: req.user._id,
          issueDescription,
          location: {
              address: location.address,
              coordinates: {
                  type: 'Point',
                  coordinates: location.coordinates
              }
          },
          vehicleType: vehicleType.toLowerCase(),
          status: 'pending'
      });

    const newMechanicRequest = new MechanicRequest({
      location: {
        address: location,
        coordinates: locationCoords,
      },
      serviceType,
      userId: req.user._id,
    });
      await newServiceRequest.save();
      console.log('Service request saved:', newServiceRequest._id);

      // Find nearby available mechanics
      const nearbyMechanics = await Mechanic.find({
          location: {
              $near: {
                  $geometry: {
                      type: 'Point',
                      coordinates: location.coordinates
                  },
                  $maxDistance: 10000 // 10km in meters
              }
          },
          vehicleType: vehicleType.toLowerCase(),
          isAvailable: true,
          isApproved: true
      }).limit(10);

      console.log(`Found ${nearbyMechanics.length} nearby mechanics`);

      if (nearbyMechanics.length > 0) {
          // Notify each nearby mechanic
          const notificationPromises = nearbyMechanics.map(mechanic => {
              if (mechanic.socketId) {
                  const distance = calculateDistance(location.coordinates, mechanic.location.coordinates);
                  return new Promise((resolve) => {
                      io.to(mechanic.socketId).emit('newServiceRequest', {
                          serviceRequest: {
                              id: newServiceRequest._id,
                              location: newServiceRequest.location,
                              issueDescription: newServiceRequest.issueDescription,
                              distance: distance.toFixed(2)
                          }
                      });
                      resolve();
                  });
              }
              return Promise.resolve();
          });

          await Promise.all(notificationPromises);

          res.status(200).json({
              success: true,
              message: 'Service request created and mechanics notified.',
              serviceRequest: newServiceRequest,
              nearbyMechanicsCount: nearbyMechanics.length
          });
      } else {
          res.status(200).json({
              success: true,
              message: 'No nearby mechanics found. Your request has been saved.',
              serviceRequest: newServiceRequest,
              nearbyMechanicsCount: 0
          });
      }
  } catch (error) {
      console.error('Error creating service request:', error);
      res.status(500).json({
          success: false,
          message: 'Server error while processing service request.',
          error: error.message
      });
  }
});

// Update mechanic location endpoint
router.post('/mechanic/location', authMiddleware, async (req, res) => {
  try {
      const { coordinates } = req.body;

      if (!coordinates || !Array.isArray(coordinates) || coordinates.length !== 2) {
          return res.status(400).json({
              success: false,
              message: 'Invalid coordinates format'
          });
      }

      const mechanic = await Mechanic.findByIdAndUpdate(
          req.user._id,
          {
              location: {
                  type: 'Point',
                  coordinates: coordinates
              },
              lastLocationUpdate: Date.now()
          },
          { new: true }
      );

      if (!mechanic) {
          return res.status(404).json({
              success: false,
              message: 'Mechanic not found'
          });
      }

      res.status(200).json({
          success: true,
          message: 'Location updated successfully',
          location: mechanic.location
      });
  } catch (error) {
      console.error('Error updating mechanic location:', error);
      res.status(500).json({
          success: false,
          message: 'Server error while updating location',
          error: error.message
      });
  }
});

// Get service request count endpoint
router.get('/count', async (req, res) => {
  try {
      const serviceCount = await ServiceRequest.countDocuments();
      res.json({ count: serviceCount });
  } catch (error) {
      console.error('Error fetching service count:', error);
      res.status(500).json({ error: 'Failed to fetch service count' });
  }
});

module.exports = router;
