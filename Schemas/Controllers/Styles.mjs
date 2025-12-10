import Styles from "../Models/Styles.js";

export const StylesController = {

    getStylesByProductId: async function (productId) {
        try {
            const styles = await Styles.find({ product_id: productId });
            return styles;
        }
        catch (error) {
            throw new Error('Error fetching styles by product ID: ' + error.message);
        }
    }
};