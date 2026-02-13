export const checkIfNumber = (value, model, field, id) => {
    const num = Number(value);
    if (Number.isNaN(num)) {
        throw new Error(`Value "${value}" cannot be converted to a number for model "${model}", field "${field}", and id "${id}".`);
    } else {
        return num;
    }
};