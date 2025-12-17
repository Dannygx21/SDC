const mongoose = require('mongoose');
const reviewsSchema = new mongoose.Schema({
    review_id: {
        type: Number,
        required: true,
        unique: true
    },
    product_id: {
        type: Number,
        required: true
    },
    rating: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    summary: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    recommend: {
        type: Boolean,
        required: true
    },
    reported: {
        type: Boolean,
        required: true
    },
    reviewer_name: {
        type: String,
        required: true
    },
    reviewer_email: {
        type: String,
        required: true
    },
    response: {
        type: String,
        default: undefined
    },
    helpfulness: {
        type: Number,
        required: true
    }
});
const Reviews = mongoose.model('Reviews', reviewsSchema);
module.exports = Reviews;   