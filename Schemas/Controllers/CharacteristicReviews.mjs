import CharacteristicReviews from "../Models/CharacteristicReviews";
export const CharacteristicReviewsController = {

    getCharacteristicReviewsByReviewId: async function (reviewId) {
        try {
            const characteristicReviews = await CharacteristicReviews.find({ review_id: reviewId });
            return characteristicReviews;
        } catch (error) {
            throw new Error('Error fetching characteristic reviews by review ID: ' + error.message);
        }
    }
};