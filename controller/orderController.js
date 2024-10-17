const mongoose = require('mongoose');
const orderSchema = require('../model/Order');
const { error } = require('../utilities/productvalidator');
const Order = mongoose.model('Order')
// productId, quantity, userId

// Get all Orders
const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find();
        res.status(200).json(orders);
    } catch (error){
        res.status(500).json({message: `Error: Unable to get orders.  ${error}`})
    }
}

// Get Order by orderId
const findOrderById = async (req, res) => {
    try {
        const orderId = req.params.id;
        const order = await Order.findById(orderId);

        if(!order){
            res.status(400).json({message: 'Order does not exist!'});
        }
        
        res.status(200).json(order);

    } catch (error) {
        res.status(500).json({message: `Error. Unable to get order:  ${error}`})
    }
}


// Create Order
const createOrder = async (req, res, next) => {
    const products = req.body.products;
    const userId = req.body.userId;
    const order = new Order({
        products: products,
        userId: userId
    })
    try {
        await order.save();  // save the order to the orders collection
        // await User.findByIdAndUpdate(userId, {$push : {orders : Order}}) // save the order to the user's order history
        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({message: `Unknown error occurred while saving order: ${error}` });
    }    
}

//Change Order


//Delete Order
const deleteOrder = async (req, res, next) => {
    const orderNumber = req.params.order;
    try {

        //Step 1: Delete the order from the orders database
        const orderDelete = await Order.findByIdAndDelete(orderNumber);
        if (!orderDelete) {
        res.status(500).json({ message: `Unknown error occurred while deleting order: ${error}`})
        } 
    } catch {
        res.status(200).json({ message: 'Error deleting order: ' + error}) // catch moves after step 2 is added
    }
        //Step 2: Delete the order from the user's order history
        /* const userId = Order.userId 
        await User.updateOne( {orders: Orders._id}, {$pull: {orders : Order._id}});
        
        res.status(200).json({ message: "Order deleted and user's order history updated"});
        
        
    } catch (error){
        res.status(200).json({ message: 'Error deleting order: ' + error}); */
    }
    

module.exports = { createOrder, deleteOrder, getAllOrders, findOrderById }
