const mongoose = require('mongoose');


const orderSchema = new mongoose.Schema({
    products: [
        {
            productId: {type: mongoose.Types.ObjectId, ref: 'Product', required: true},
            quantity: {type: Number, required: true}
        }
    ],
    userId: { 
        type: mongoose.Types.ObjectId, 
        ref: 'User',
        required: true }
})

module.exports = mongoose.model('Order', orderSchema);