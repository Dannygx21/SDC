import Features from '../Models/Features.js';

export const FeaturesController = {

    getFeaturesByProductId: async function (productId) {
        try {
            // Exclude unnecessary fields: _id, __v, product_id, id
            const features = await Features.find({ product_id: productId }, '-_id -__v -product_id -id');
            return features;
        } catch (error) {
            throw new Error('Error fetching features by product ID: ' + error.message);
        }
    }
};  