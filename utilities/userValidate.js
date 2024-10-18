const Joi = require('joi');

const userSchema = Joi.object({
  firstName: Joi.string().min(2).required(),
  lastName: Joi.string().min(2).required(),
  address: Joi.address().min(10).required(),
  email: Joi.email().min(10).required(),
  phone: Joi.string().valid('red', 'black', 'blue', 'grey', 'green').required(),
  role: Joi.string().valid('employee', 'manager', 'customer').required()
});

module.exports = userSchema;
