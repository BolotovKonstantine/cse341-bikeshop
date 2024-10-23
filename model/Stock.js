const mongoose = require('mongoose');
const stockSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Product'
    },
    numItems: {
        type: Number,
        required: true,
        min: 0
    },
    location: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Stock', stockSchema);