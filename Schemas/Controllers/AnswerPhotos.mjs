import AnswerPhotos from "../Models/AnswerPhotos.js";

export const AnswerPhotosController = {

    getAnswerPhotosByAnswerId: async function (answerId) {
        try {
            const answerPhotos = await AnswerPhotos.find({ answer_id: answerId }, '-__v -_id -answer_id');
            return answerPhotos;
        } catch (error) {
            throw new Error('Error fetching answer photos by answer ID: ' + error.message);
        }
    },
    addAnswerPhoto: async function (photoData) {
        try {
            const newAnswerPhoto = new AnswerPhotos(photoData);
            const savedAnswerPhoto = await newAnswerPhoto.save();
            return savedAnswerPhoto;
        } catch (error) {
            throw new Error('Error adding new answer photo: ' + error.message);
        }
    }
};