import Questions from "../Models/Questions.js";
export const QuestionsController = {
    getQuestionsByProductId: async function (productId, page = 1, count = 5) {
        const skip = (page - 1) * count;
        try {
            const questions = await Questions.find({ product_id: productId, reported: false })
                .skip(skip)
                .limit(count);
            return questions;
        } catch (error) {
            throw new Error('Error fetching questions by product ID: ' + error.message);
        }
    }
};