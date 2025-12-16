import CharacteristicReviews from "../Models/CharacteristicReviews.js";
export const CharacteristicReviewsController = {

    getCharacteristicReviewsByReviewId: async function (reviewId) {
        try {
            const characteristicReviews = await CharacteristicReviews.find({ review_id: reviewId });
            return characteristicReviews;
        } catch (error) {
            throw new Error('Error fetching characteristic reviews by review ID: ' + error.message);
        }
    },

    getCharacteristicReviewsByCharacteristicId: async function (characteristicId) {
        try {
            const characteristicReviews = await CharacteristicReviews.find({ characteristic_id: characteristicId }, '-__v -_id -characteristic_id -review_id');
            return characteristicReviews;
        } catch (error) {
            throw new Error('Error fetching characteristic reviews by characteristic ID: ' + error.message);
        }
    },

    addCharacteristicReview: async function (characteristicId, reviewId, value) {
        try {
            const newCharacteristicReview = new CharacteristicReviews({
                characteristic_id: characteristicId,
                review_id: reviewId,
                value: value
            });
            await newCharacteristicReview.save();
            return newCharacteristicReview;
        } catch (error) {
            throw new Error('Error adding characteristic review: ' + error.message);
        }
    }
};