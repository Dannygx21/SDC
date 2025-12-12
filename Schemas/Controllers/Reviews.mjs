import Reviews from '../Models/Reviews.js';

export const ReviewsController = {
    getReviewsByProductIdByPageAndCount: async (product_id, page = 1, count = 5) => {
        try {
            const reviews = await Reviews.find({ product_id: product_id, reported: false })
                .skip((page - 1) * count)
                .limit(count);
            return reviews;
        } catch (error) {
            console.error("Error fetching reviews:", error);
            throw error;
        }
    }
};