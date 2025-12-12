import ReviewPhotos from "../Models/ReviewPhotos.js";
export const ReviewPhotosController = {
    getReviewPhotosByReviewId: async (review_id) => {
        try {
            const photos = await ReviewPhotos.find({ review_id: review_id });
            return photos;
        } catch (error) {
            console.error("Error fetching review photos:", error);
            throw error;
        }
    }
};