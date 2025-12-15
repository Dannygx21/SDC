import Reviews from '../Models/Reviews.js';

export const ReviewsController = {
    getReviewsByProductIdByPageCountAndSort: async (product_id, page = 1, count = 5, sort = 'newest') => {
        try {
            const reviews = await Reviews.find({ product_id: product_id, reported: false })
                .skip((page - 1) * count)
                .limit(count)
                .sort(sort === 'newest' ? { date: -1 } : sort === 'helpful' ? { helpfulness: -1 } : {});
            return reviews;
        } catch (error) {
            console.error("Error fetching reviews:", error);
            throw error;
        }
    }
};