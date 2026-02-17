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
}, { collection: 'related', strict: "throw" });

const Related = mongoose.model('Related', relatedSchema);
module.exports = Related;