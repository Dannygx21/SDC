import ReviewPhotos from "../Models/ReviewPhotos.js";
export const ReviewPhotosController = {
    getReviewPhotosByReviewId: async (review_id) => {
        try {
            const photos = await ReviewPhotos.find({ review_id: review_id }, '-__v -_id -review_id');
            return photos;
        } catch (error) {
            console.error("Error fetching review photos:", error);
            throw error;
        }
    },

    createReviewPhotos: async (review_id, photos) => {
        try {
            const photoDocs = photos.map(url => ({ review_id: review_id, url: url }));
            await ReviewPhotos.insertMany(photoDocs);
            console.log("Review photos created successfully for review_id:", review_id);
        } catch (error) {
            console.error("Error creating review photos:", error);
            throw error;
        }
    }
};