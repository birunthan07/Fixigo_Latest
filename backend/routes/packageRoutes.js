const express = require('express');
const router = express.Router();
const Package = require('../models/Packages');

// Add a new package
router.post('/', async (req, res) => {
    const { name, description, price } = req.body;
    try {
        const newPackage = new Package({ name, description, price });
        await newPackage.save();
        res.status(201).json(newPackage);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update a package by ID
router.put('/:id', async (req, res) => {
    const { name, description, price, available } = req.body;
    try {
        const updatedPackage = await Package.findByIdAndUpdate(
            req.params.id,
            { name, description, price, available },
            { new: true }
        );
        if (!updatedPackage) {
            return res.status(404).json({ message: 'Package not found' });
        }
        res.json(updatedPackage);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete a package by ID
router.delete('/:id', async (req, res) => {
    try {
        const deletedPackage = await Package.findByIdAndDelete(req.params.id);
        if (!deletedPackage) {
            return res.status(404).json({ message: 'Package not found' });
        }
        res.json({ message: 'Package deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get all packages
router.get('/', async (req, res) => {
    try {
        const packages = await Package.find();
        res.json(packages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get a package by ID
router.get('/:id', async (req, res) => {
    try {
        const package = await Package.findById(req.params.id);
        if (!package) {
            return res.status(404).json({ message: 'Package not found' });
        }
        res.json(package);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
