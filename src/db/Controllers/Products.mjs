import Product from '../Models/Products.js';

export const ProductController = {

    getProductsByPageAndCount: async function (page = 1, count = 25) {
        const skip = (page - 1) * count;
        try {
            const products = await Product.find({}, '-_id -__v').skip(skip).limit(count);
            return products;
        } catch (error) {
            throw new Error('Error fetching products by page and count: ' + error.message);
        }
    },

    getProductById: async function (productId) {
        try {
            const product = await Product.findOne({ id: productId });
            return product;
        } catch (error) {
            throw new Error('Error fetching product by ID: ' + error.message);
        }

    }
};
