import Photos from "../Models/Photos.js";
export const PhotosController = {

    getPhotosByStyleId: async function (styleId) {
        try {
            const photos = await Photos.find({ styleId: styleId }, '-_id -__v -styleId -id');
            return photos;
        }
        catch (error) {
            throw new Error('Error fetching photos by style ID: ' + error.message);
        }
    }
};