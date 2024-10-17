const mongoose = require('mongoose');
const dotenv = require('dotenv').config();
const Product = require('../model/Product');
const Order = require('../model/Order')


const validateOrder = async (req, res, next) => {
    const errors = [];
    // Check that products listed are valid products
    const products = req.body.products;
    products.forEach(item => {
        
        if (!mongoose.Types.ObjectId.isValid(item.productId)){
            errors.push({ message: `Invalid Product Number: ${item}`})
        }
        else if (checkProducts(item.productId) == false){
            errors.push( {message: `Product does not exist: ${item}`})
        }
         });
        // and that quantity is >= 1
        if (products.quantity < 1) {
            errors.push( { message: 'Quantity cannot be less than 1.'})
        }

    // Check that the user listed is valid
    if (!mongoose.Types.ObjectId.isValid(req.body.userId)){
        errors.push({ message: `Invalid User ID`})
    }

    // and that the user exists in the database
    if (checkUser(req.body.userId) == false) {
        console.log('oh well')
    }
    
    // if (checkUser(req.body.userId) == false){
    //     errors.push( {message: `User doesn't exist`})
    // }


    // Return error messages if any, or pass to next
    if (errors.length > 0){
        return res.status(400).json({ errors: errors })
    }
    else {
        next();
    }
}

async function checkProducts(id){
    const productExists = await Product.exists({_id: id});
    if (!productExists) {
        return false;
    } else {
        return true;
    }
}

async function checkOrder(req, res, next) {
    const orderExists = await Order.exists({_id : req.params.id})
    if (!orderExists) {
        res.status(400).json({message: "Error. Order doesn't exist."})
    } else {
        next()
    }
}

async function checkUser(id) {
    try {
        await mongoose.connect(process.env.MONGODB_URI); // Ensure connection is established
        const collection = mongoose.connection.db.collection('users');

        // Use `new` when creating an ObjectId
        const userId = new mongoose.Types.ObjectId(id); 

        const userExists = await collection.findOne({ _id: userId });

        // If no user is found, return false
        return !!userExists;

    } catch (error) {
        console.error('Error connecting to the database', error);
        return false;
    }
}
    //Once the User Model is updated               
    // const userExists = await User.exists({_id: id});
    //if (!userExists) {
    // return false }
    //else {
    // return true}

// }


module.exports = { validateOrder, checkOrder }