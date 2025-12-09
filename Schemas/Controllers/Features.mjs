import Features from '../Models/Features.js';

export const FeaturesController = {

    getFeaturesByProductId: async function (productId) {
        try {
            const features = await Features.find({ currentproduct_id: productId });
            return features;
        } catch (error) {
            throw new Error('Error fetching features by product ID: ' + error.message);
        }
    }
};  