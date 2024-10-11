const Product = require('../model/Product');
const productSchema = require('../utilities/productvalidator');

const addNewProduct = async (req, res, next) => {
  const { error, value } = productSchema.validate(req.body, {
    abortEarly: false,
  });
  if (error) {
    return res.status(400).json({
      message: 'Validation Error',
      details: error.details.map((err) => err.message),
    });
  }
  try {
    const product = new Product(value);
    const newProduct = await product.save();
    res.status(201).json(newProduct);
  } catch (error) {
    next(error);
  }
};

const getProducts = async (req, res, next) => {
  try {
    const products = await Product.find();

    if (!products) {
      return res.send('No products found');
    }
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addNewProduct,
  getProducts,
};
