const mongoose = require('mongoose');
const questionsSchema = new mongoose.Schema({
    question_id: {
        type: Number,
        required: true,
        unique: true
    },
    product_id: {
        type: Number,
        required: true,
        index: true
    },
    question_body: {
        type: String,
        required: true
    },
    question_date: {
        type: Date,
        required: true
    },
    asker_name: {
        type: String,
        required: true
    },
    asker_email: {
        type: String,
        required: true
    },
    reported: {
        type: Boolean,
        required: true,
        default: false
    },
    question_helpfulness: {
        type: Number,
        required: true,
        default: 0
    }
});

const Questions = mongoose.model('Questions', questionsSchema)
module.exports = Questions;
