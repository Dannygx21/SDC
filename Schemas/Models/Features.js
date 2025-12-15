const mongoose = require('mongoose');
const featuresSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    product_id: {
        type: Number,
        required: true
    },
    feature: {
        type: String,
        required: true
    },
    value: {
        type: String,
        required: false,
        default: undefined
    }
});

const Features = mongoose.model('Features', featuresSchema);
module.exports = Features;