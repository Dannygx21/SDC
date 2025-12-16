import Reviews from '../Models/Reviews.js';

export const ReviewsController = {
    getReviewsByProductIdByPageCountAndSort: async (product_id, page = 1, count = 5, sort = 'newest') => {
        try {
            const reviews = await Reviews.find({ product_id: product_id, reported: false }, '-__v -_id -product_id -reported')
                .skip((page - 1) * count)
                .limit(count)
                .sort(sort === 'newest' ? { date: -1 } : sort === 'helpful' ? { helpfulness: -1 } : {});
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
    }

};
