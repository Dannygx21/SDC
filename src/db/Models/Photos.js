const mongoose = require('mongoose');
const photosSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    styleId: {
        type: Number,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    thumbnail_url: {
        type: String,
        required: true
    }
});
const Photos = mongoose.model('Photos', photosSchema);
module.exports = Photos;