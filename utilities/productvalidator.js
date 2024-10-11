const Joi = require('joi');

const productSchema = Joi.object({
  bikeName: Joi.string().min(2).required(),
  bikeType: Joi.string().min(2).required(),
  manufacturer: Joi.string().min(2).required(),
  description: Joi.string().min(10).required(),
  color: Joi.string().valid('red', 'black', 'blue', 'grey', 'green').required(),
  retailPrice: Joi.number().required(),
  quantity: Joi.number().integer().required(),
  productionYear: Joi.number()
    .integer()
    .min(1900)
    .max(new Date().getFullYear())
    .required(),
  reviews: Joi.string().min(10).optional(),
});

module.exports = productSchema;
