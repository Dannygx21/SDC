import Related from '../Models/Related.js';

export const RelatedController = {

    getRelatedByProductId: async function (productId) {
        try {
            const relatedItems = await Related.find({ current_product_id: productId });
            return relatedItems;
        } catch (error) {
            throw new Error('Error fetching related items by product ID: ' + error.message);
        }
    }
};  
