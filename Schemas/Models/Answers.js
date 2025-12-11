const mongoose = require('mongoose');
const answersSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    question_id: {
        type: Number,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    date_written: {
        type: Date,
        required: true,
        default: Date.now
    },
    answerer_name: {
        type: String,
        required: true
    },
    answerer_email: {
        type: String,
        required: true
    },
    reported: {
        type: Boolean,
        required: true,
        default: false
    },
    helpful: {
        type: Number,
        required: true,
        default: 0
    }

});
const Answers = mongoose.model('Answers', answersSchema);
module.exports = Answers;
