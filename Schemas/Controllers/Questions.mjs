import Questions from "../Models/Questions.js";
export const QuestionsController = {
    getQuestionsByProductId: async function (productId, page = 1, count = 5) {
        const skip = (page - 1) * count;
        try {
            const questions = await Questions.find({ product_id: productId, reported: false }, '-__v -_id -product_id')
                .skip(skip)
                .limit(count);
            return questions;
        } catch (error) {
            throw new Error('Error fetching questions by product ID: ' + error.message);
        }
    },

    postQuestion: async function (questionData) {
        try {
            const newQuestion = new Questions(questionData);
            const savedQuestion = await newQuestion.save();
            return savedQuestion;
        } catch (error) {
            throw new Error('Error posting new question: ' + error.message);
        }
    },

    markQuestionAsHelpful: async function (questionId) {
        try {
            const updatedQuestion = await Questions.findByIdAndUpdate(
                questionId,
                { $inc: { helpfulness: 1 } },
                { new: true }
            );
            return updatedQuestion;
        } catch (error) {
            throw new Error('Error marking question as helpful: ' + error.message);
        }
    },

    reportQuestion: async function (questionId) {
        try {
            const reportedQuestion = await Questions.findByIdAndUpdate(
                questionId,
                { reported: true },
                { new: true }
            );
            return reportedQuestion;
        } catch (error) {
            throw new Error('Error reporting question: ' + error.message);
        }
    }
};