const mongoose = require('mongoose');
const featuresSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    currentproduct_id: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    feature: {
        type: String,
        required: false,
        default: null
    }
});

const Features = mongoose.model('Features', featuresSchema);
module.exports = Features;