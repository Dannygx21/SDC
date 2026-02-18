const mongoose = require('mongoose');
const photosSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
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
}, { collection: 'photos', strict: "throw" });

photosSchema.index({ styleId: 1 });

const Photos = mongoose.model('Photos', photosSchema);
module.exports = Photos;