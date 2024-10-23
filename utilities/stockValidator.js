const Joi = require('joi');

const stockSchema = Joi.object({
    productId: Joi.string().required(),
    numItems: Joi.number().integer().min(0).required(),
    location: Joi.string().required(),
});

module.exports = stockSchema;