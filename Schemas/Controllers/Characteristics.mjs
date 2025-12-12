import Characteristics from "../Models/Characteristics.js";
export const CharacteristicsController = {

    getCharacteristicsByProductId: async function (productId) {
        try {
            const characteristics = await Characteristics.find({ product_id: productId });
            return characteristics;
        } catch (error) {
            throw new Error('Error fetching characteristics by product ID: ' + error.message);
        }
    }
};  