const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');

// Get notifications for a specific user/mechanic
router.get('/notifications/:email', async (req, res) => {
  const { email } = req.params;

  try {
    const notifications = await Notification.find({ receiverEmail: email }).sort({ createdAt: -1 });
    res.status(200).json(notifications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch notifications.' });
  }
});
