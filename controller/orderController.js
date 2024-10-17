const mongoose = require('mongoose');
const orderSchema = require('../model/Order')
const Order = mongoose.model('Order')
// productId, quantity, userId

// Create Order
const createOrder = async (req, res, next) => {
    console.log('started to create order');
    const products = req.body.products;
    const userId = req.body.userId;
    const order = new Order({
        products: products,
        userId: userId
    })
    console.log(order)
    try {
        await order.save();
        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({message: `Unknown error occurred while saving order: ${error}` });
    }
    //need to update order history under user
}
//Change Order


//Delete Order

module.exports = { createOrder }
