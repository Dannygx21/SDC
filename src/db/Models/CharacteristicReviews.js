const mongoose = require('mongoose');
const characteristicsReviewsSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    characteristic_id: {
        type: Number,
        required: true
    },
    review_id: {
        type: Number,
        required: true
    },
    value: {
        type: Number,
        required: true
    }
}, { collection: 'characteristic_reviews', strict: "throw" });

characteristicsReviewsSchema.index({ characteristic_id: 1 });

const CharacteristicReviews = mongoose.model('CharacteristicReviews', characteristicsReviewsSchema);
module.exports = CharacteristicReviews;