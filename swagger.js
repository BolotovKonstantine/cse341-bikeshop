const swaggerAutogen = require('swagger-autogen')();
const Joi = require('joi');
const joiToSwagger = require('joi-to-swagger');

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

const userSchema = Joi.object({
  firstName: Joi.string().min(2).required(),
  lastName: Joi.string().min(2).required(),
  address: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string()
    .pattern(/^\d{3}-?\d{3}-?\d{4}$/)
    .required(),
});

const newStockSchema = Joi.object({
  productId: Joi.string().required(),
  numItems: Joi.number().required(),
  location: Joi.string().required()
});

const updateStockSchema = Joi.object({
  numItems: Joi.number().required(),
  location: Joi.string().optional()
});

const productSchemaSwagger = joiToSwagger(productSchema).swagger;
const userSchemaSwagger = joiToSwagger(userSchema).swagger;
const newStockSchemaSwagger = joiToSwagger(newStockSchema).swagger;
const updateStockSchemaSwagger = joiToSwagger(updateStockSchema).swagger;

const doc = {
  info: {
    title: 'My API',
    description: 'Description',
  },
  host: 'cse341-bikeshop-5jff.onrender.com',
  schemes: ['http', 'https'],
  components: {
    schemas: {
      Product: productSchemaSwagger,
      User: userSchemaSwagger,
      NewStock: newStockSchemaSwagger,
      UpdateStock: updateStockSchemaSwagger,
    },
  },
};

const outputFile = './swagger.json';
const routes = ['./routes/index.js'];

swaggerAutogen(outputFile, routes, doc);
