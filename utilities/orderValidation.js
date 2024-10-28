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
    }).messages({
      'string.base': 'Product ID should be a string',
      'string.empty': 'Product ID is required',
      'any.required': 'Product ID is required',
    }),
    quantity: Joi.number().integer().min(1).required().messages({
      'number.base': 'Quantity should be a number',
      'number.integer': 'Quantity must be an integer',
      'number.min': 'Quantity must be at least 1',
      'any.required': 'Quantity is required'
})
});

const orderSchema = Joi.object({
    products: Joi.array().items(productsSchema).messages({
      'array.base': 'Products should be an array',
      'array.min': 'At least one product is required',
      'any.required': 'Products field is required',
    }),
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