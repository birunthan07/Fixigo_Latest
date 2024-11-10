const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact.js');

// Route to handle contact form submissions
router.post('/', async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    // Save the contact form submission to the database
    const newContact = new Contact({ name, email, message });
    await newContact.save();

    // Send success response
    res.status(200).json({ message: 'Message received. Thank you!' });
  } catch (error) {
    console.error('Error saving contact message:', error);
    res.status(500).json({ error: 'Server error. Please try again later.' });
  }
});

module.exports = router;
