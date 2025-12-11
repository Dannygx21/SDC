import AnswerPhotos from "../Models/AnswerPhotos.js";

export const AnswerPhotosController = {

    getAnswerPhotosByAnswerId: async function (answerId) {
        try {
            const answerPhotos = await AnswerPhotos.find({ answer_id: answerId });
            return answerPhotos;
        } catch (error) {
            throw new Error('Error fetching answer photos by answer ID: ' + error.message);
        }
    }
};