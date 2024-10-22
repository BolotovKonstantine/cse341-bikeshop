require('../model/User');
require('../model/Product');

const Joi = require('joi');
const mongoose = require('mongoose');
const Product = mongoose.model('Product');
const User = mongoose.model('User');

const productsSchema = Joi.object({
    productId: Joi.string()
      .required()
      .custom(objectIdValidator, 'ObjectId Validation') 
      .messages({
        'string.base': 'Product ID should be a string',
        'string.empty': 'Product ID is required',
        'any.required': 'Product ID is required',
      }),
    quantity: Joi.number().integer().min(1).required().messages({
      'number.base': 'Quantity should be a number',
      'number.integer': 'Quantity must be an integer',
      'number.min': 'Quantity must be at least 1',
      'any.required': 'Quantity is required',
    }),
  });

const orderSchema = Joi.object({
    products: Joi.array().items(productsSchema).min(1).required().messages({
      'array.base': 'Products should be an array',
      'array.min': 'At least one product is required',
      'any.required': 'Products field is required',
    }),
    userId: Joi.string()
      .required()
      .custom(objectIdValidator, 'ObjectId Validation')
      .messages({
        'string.base': 'User ID should be a string',
        'string.empty': 'User ID is required',
        'any.required': 'User ID is required',
      }),
  });

// const validateOrder = async (req, res, next) => {
//     console.log(req.body);
//     try {
//         await orderSchema.validateAsync(req.body);

//         next()
//     } catch (error) {
//         res.status(400).json({message :`Validation error: ${error.message}`})
//     }
// }

const objectIdValidator = (value) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
      throw new Error(`${value} is not a valid ID type`);
    }
    return value;
  };

module.exports = orderSchema;