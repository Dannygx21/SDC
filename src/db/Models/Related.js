const mongoose = require('mongoose');
const relatedSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    current_product_id: {
        type: Number,
        required: true
    },
    related_product_id: {
        type: Number,
        required: true
    }
});

const Related = mongoose.model('Related', relatedSchema);
module.exports = Related;