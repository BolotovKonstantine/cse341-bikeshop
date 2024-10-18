const Joi = require('joi');

const userSchema = Joi.object({
  firstName: Joi.string().min(2).required(),
  lastName: Joi.string().min(2).required(),
  address: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string()
    .pattern(/^\d{3}-?\d{3}-?\d{4}$/)
    .required(),
});

module.exports = userSchema;
