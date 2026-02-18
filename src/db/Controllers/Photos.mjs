import Photos from "../Models/Photos.js";
export const PhotosController = {

    getPhotosByStyleId: async function (styleId) {
        try {
            const photos = await Photos.find({ styleId: { $in: styleId } }, '-_id -__v').lean();
            return photos;
        }
        catch (error) {
            throw new Error('Error fetching photos by style ID: ' + error.message);
        }
    }
};