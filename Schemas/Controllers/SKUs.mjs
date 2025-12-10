import SKUs from "../Models/SKUs.js";

export const SKUsController = {

    getSKUsByStylesId: async function (styleId) {
        try {
            const skus = await SKUs.find({ style_id: styleId });
            return skus;
        } catch (error) {
            throw new Error('Error fetching SKUs by style ID: ' + error.message);
        }
    }
};  