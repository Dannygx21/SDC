import Answers from "../Models/Answers.js";

export const AnswersController = {

    getAnswersByQuestionId: async function (questionId) {
        try {
            const answers = await Answers.find({ question_id: questionId, reported: false });
            return answers;
        } catch (error) {
            throw new Error('Error fetching answers by question ID: ' + error.message);
        }
    }
};