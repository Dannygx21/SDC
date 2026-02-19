import Reviews from '../Models/Reviews.js';

export const ReviewsController = {
    getReviewsByProductIdByPageCountAndSort: async (product_id, sortOptions) => {
        try {
            const reviews = await Reviews.find({ product_id: product_id }, '-__v -_id ')
                .sort(sortOptions[sort] || sortOptions.newest)
                .skip((page - 1) * count)
                .limit(count)
                .lean()
            return reviews;
        } catch (error) {
            console.error("Error fetching reviews:", error);
            throw error;
        }
    },

    postReview: async (reviewData) => {
        console.log("Posting new review with data:", reviewData);
        try {
            const newReview = new Reviews(reviewData);
            await newReview.save();
            return newReview;
        } catch (error) {
            console.error("Error posting new review:", error);
            throw error;
        }
    },

    markReviewAsHelpful: async (review_id) => {
        try {
            await Reviews.updateOne({ review_id: review_id }, { $inc: { helpfulness: 1 } });
            console.log("Marked review as helpful, review_id:", review_id);
        } catch (error) {
            console.error("Error marking review as helpful:", error);
            throw error;
        }
    },

    reportReview: async (review_id) => {
        try {
            await Reviews.updateOne({ review_id: review_id }, { reported: true });
            console.log("Reported review, review_id:", review_id);
        } catch (error) {
            console.error("Error reporting review:", error);
            throw error;
        }
    },

    aggregateRatingsAndRecommended: async (productId) => {
        try {
            await Reviews.aggregate([
                { $match: { product_id: productId } },
                {
                    $group: {
                        _id: null,
                        ratings: {
                            $push: "$rating"
                        },
                        recommended: {
                            $push: "$recommendj"
                        }
                    }
                }
            ])
        } catch (error) {
            console.error("Error aggregate Reviews:", error)
            throw error;
        }
    }

};
