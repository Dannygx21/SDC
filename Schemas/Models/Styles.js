const mongoose = require('mongoose');
const stylesSchema = new mongoose.Schema({
    style_id: {
        type: Number,
        required: true,
        unique: true
    },
    product_id: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    sale_price: {
        type: String,
        required: false
    },
    original_price: {
        type: String,
        required: true
    },
    default_style: {
        type: Boolean,
        required: true
    }
});
const Styles = mongoose.model('Styles', stylesSchema);
module.exports = Styles;