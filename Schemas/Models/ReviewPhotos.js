const mongoose = require('mongoose');
const reviewPhotosSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    review_id: {
        type: Number,
        required: true
    },
    url: {
        type: String,
        required: true
    }
});
const ReviewPhotos = mongoose.model('ReviewPhotos', reviewPhotosSchema);
module.exports = ReviewPhotos;