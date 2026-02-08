import Answers from "../Models/Answers.js";

export const AnswersController = {

    getAnswersByQuestionId: async function (questionId) {
        try {
            const answers = await Answers.find({ question_id: questionId, reported: false }, '-__v -_id -question_id');
            return answers;
        } catch (error) {
            throw new Error('Error fetching answers by question ID: ' + error.message);
        }
    },
    postAnswer: async function (answerData) {
        try {
            const newAnswer = new Answers(answerData);
            const savedAnswer = await newAnswer.save();
            return savedAnswer;
        } catch (error) {
            throw new Error('Error posting new answer: ' + error.message);
        }
    },
    markAnswerAsHelpful: async function (answerId) {
        try {
            const updatedAnswer = await Answers.findByIdAndUpdate(
                answerId,
                { $inc: { helpfulness: 1 } },
                { new: true }
            );
            return updatedAnswer;
        } catch (error) {
            throw new Error('Error marking answer as helpful: ' + error.message);
        }
    },
    reportAnswer: async function (answerId) {
        try {
            const reportedAnswer = await Answers.findByIdAndUpdate(
                answerId,
                { reported: true },
                { new: true }
            );
            return reportedAnswer;
        } catch (error) {
            throw new Error('Error reporting answer: ' + error.message);
        }
    }
};