const mongoose = require('mongoose');
const skusSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    style_id: {
        type: Number,
        required: true
    },
    size: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    }
});

const SKUs = mongoose.model('SKUs', skusSchema);
module.exports = SKUs;
