require('../model/User');
require('../model/Product');

const Joi = require('joi');
const mongoose = require('mongoose');
const Product = mongoose.model('Product');
const User = mongoose.model('User');

const productsSchema = Joi.object({
    productId: Joi.string().hex().length(24).required()
        .custom(async (product, helpers) => {
        const productExists = await Product.exists({_id: product.productId});
        if (!productExists) {
            return helpers.message(`Product with ID ${product.productId} does not exist`)
        }
        return product;
    }),
    quantity: Joi.number().integer().min(1).required()
})

const orderSchema = Joi.object({
    products: Joi.array().items(productsSchema),
    userId: Joi.string().custom(async (userId, helpers) => {
        const userExists = await User.exists({_id: userId});
        if (!userExists) {
            return helpers.message("User doesn't exist")
        }
        return userId;
    })
});

const validateOrder = async (req, res, next) => {
    console.log(req.body);
    try {
        await orderSchema.validateAsync(req.body);

        next()
    } catch (error) {
        res.status(400).json({message :`Validation error: ${error.message}`})
    }
}

module.exports = validateOrder;