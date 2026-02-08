const mongoose = require('mongoose');
const characteristicsSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    product_id: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    }
});
const Characteristics = mongoose.model('Characteristics', characteristicsSchema);
module.exports = Characteristics;