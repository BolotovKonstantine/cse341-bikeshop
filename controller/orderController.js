// const mongoose = require('mongoose');
// const orderSchema = require('../model/Order');
// const userSchema = require('../model/User');
// const productSchema = require('../model/Product')
// const { error } = require('../utilities/productvalidator');
// const { newUser } = require('./user');
// const Order = mongoose.model('Order')
// const Product = mongoose.model('Product');
// const User = mongoose.model('User');
const mongoose = require('mongoose');
const Order = require('../model/Order'); // Import the already defined Order model
const User = require('../model/User');   // Import the already defined User model
const Product = require('../model/Product'); // Import the already defined Product model
const { error } = require('../utilities/productvalidator');
const { newUser } = require('./user');


// productId, quantity, userId


/* --------------------
     POST/DELETE 
   -------------------- */ 

// Create Order
const createOrder = async (req, res, next) => { // TODO: Add functionality to check and update stock quantity
    // const products = req.body.products;
    // const userId = req.body.userId;
    const { products, userId } = req.body;
    const order = new Order({
        products, userId
    })
    try {
        await order.save();  // save the order to the orders collection
        const user = await User.findById(req.body.userId);

        // if user doesn't already have an orders array, make one
        if (!user.orders) {
            user.orders = [];
        }
        user.orders.push(order._id);
        await user.save({ validateBeforeSave: false }); 
        res.status(200).json({message: `Order succesfully created! New orderId: ${order._id}`})

    } catch (error) {
        res.status(500).json({message: `Unknown error occurred while saving order: ${error}` });
    }    
}

//Delete Order
const deleteOrder = async (req, res, next) => {

    const orderNumber = req.params.order;
    if (!isValid(orderNumber)) {error};
    try {

        //Step 1: Delete the order from the orders database
        const orderDelete = await Order.findByIdAndDelete(orderNumber);
        if (!orderDelete) {
        res.status(500).json({ message: `Unknown error occurred while deleting order: ${error}`})
        } 


        //Step 2: Delete the order from the user's order history
        await User.findByIdAndUpdate(orderDelete.userId, {$pull: { orders: new mongoose.Types.ObjectId(orderDelete._id) }}, {new : true});
        res.status(200).json({ message: "Order deleted and user's order history updated"});   
    }
     catch (error){
        res.status(200).json({ message: 'Error deleting order: ' + error});
    }    
}

/* --------------------
           GET 
   -------------------- */ 

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
        if (!isValid(req.params.id)) {error};
        const order = await Order.findById(req.params.id);

        if(!order){
            res.status(400).json({message: 'Order does not exist!'});
        }
        
        res.status(200).json(order);

    } catch (error) {
        res.status(500).json({message: `Error. Unable to get order:  ${error}`})
    }
}

/* --------------------
          PUT 
   -------------------- */ 

// Add a Product
const addProduct = async (req, res) => {
    console.log(req.body.productId);
    if (!isValid(req.body.productId)) {error};
    if(!Product.exists({_id: req.body.productId})){
        res.status(400).json({message: "Invalid Request: Product does not exist"})
    }
    try {
        const order = await Order.findById(req.params.orderId)
        const { productId, quantity} = req.body
        const orderProducts = order.products;

        // Check to see if order already has that product listed
        const existingProduct = orderProducts.find(product => product.productId.toString() === productId.toString());
        if (!existingProduct) { // if it doesn't, add it
            order.products.push({productId: req.body.productId, quantity: req.body.quantity});
        } else { // if it does, update the quantity
            existingProduct.quantity += quantity;
        }
        await order.save();
        return res.status(200).json({message: 'Product added/updated successfully'})
    } catch (error) {
        res.status(500).json({message : `Unable to add/update product.  Error: ${error}`}) 
    };

}
// Remove a product
const deleteProduct = async (req, res) => {
    if (!isValid(req.params.orderId)) {error};
    try{
        const order = await Order.findById(req.params.orderId);
        const [ productId, quantity ] = req.body;
        const orderProducts = order.products;

        const productExists =  orderProducts.find(product => product.productId.toString() === productId.toString());
        if (!productExists) {
            res.status(400).json({message: "Product doesn't exist in order"});
        } else {

            if (productExists.quantity > quantity) {
                await Order.updateOne(
                    { _id: req.params.orderId, 'products.productId': productId },
                    { $set: { 'products.$.quantity': productExists.quantity -= quantity } }
                );
            } else {
                order.products = order.products.filter(product => 
                    !(product.productId.toString() === productId.toString() && product.quantity <= quantity)
                );
                if (order.products.length == 0) {
                    await Order.deleteOne({_id: order._id})
                } else {
                    await order.save()
                }
            }
            // If order.products that matches the product ID has a quantity less than the quantityToDelete amount, remove that product from the list.  
            
            res.status(200).json({message: `Succesfully removed/updated product`})
        }
    } catch (error) {
        res.status(500).json({message: `Unable to remove/update product. Error: ${error}`})
    }
}

//Change User on an Order 
const changeUser = async (req, res) => {
    
    try {
        const { orderId } = req.params;
        const { userId } = req.body
        
        if (!isValid(orderId)) { return res.status(400).json({message: 'Invalid Order ID'})};
    
        if (!await Order.exists({_id: orderId}) || !await User.exists({_id: userId})) { res.status(400).json({message: `Order or User does not exist`})};
    
        const order = await Order.findById(orderId);
        const oldUserId = order.userId;

        //remove order from old user's history
        await User.findByIdAndUpdate(oldUserId, { $pull: {orders: order._id}});

        //add the new user to the order
        await Order.findByIdAndUpdate(orderId, { userId }, {new : true});

        //add the order to the updated User's order history
        await User.findByIdAndUpdate(userId, {$push : {orders: order._id}}, {validateBeforeSave: false});

        return res.status(200).json({message: 'User has been sucessfully changed!'})
    }
    catch (error){
        res.status(400).json({message: error});
    }
}

// ObjectID Validity Checker
const isValid = (id) => {
    if (!mongoose.Types.ObjectId.isValid(id)){
        return error;
    } return true
}

module.exports = { createOrder, deleteOrder, getAllOrders, findOrderById, addProduct, deleteProduct, changeUser}
