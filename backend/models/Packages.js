const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    },
    available: {
        type: Boolean,
        default: true,
    },
}, { timestamps: true });

const Package = mongoose.model('Package', packageSchema);

module.exports = Package;
