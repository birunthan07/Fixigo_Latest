

const mongoose = require('mongoose');

const MechanicRequestSchema = new mongoose.Schema({
    location: {
        address: { type: String, required: true },
        coordinates: { type: [Number], required: true }, // [longitude, latitude]
    },
    serviceType: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('MechanicRequest', MechanicRequestSchema);

