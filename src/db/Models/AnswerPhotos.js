const mongoose = require('mongoose');
const answerPhotosSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    answer_id: {
        type: Number,
        required: true
    },
    url: {
        type: String,
        required: true
    }
}, { collection: 'answer_photos', strict: "throw" });
const AnswerPhotos = mongoose.model('AnswerPhotos', answerPhotosSchema);
module.exports = AnswerPhotos;