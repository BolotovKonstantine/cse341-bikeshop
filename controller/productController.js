const Product = require('../model/Product');
const productSchema = require('../utilities/productvalidator');
const mongoose = require('mongoose');

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

const getProductById = async (req, res, next) => {
  const productId = req.params.prodId;

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).json({ message: 'Invalid Id type' });
  }
  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res
        .status(404)
        .json({ message: `Product with _id: ${productId} not found` });
    }
    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  const productId = req.params.prodId;
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).json({ message: 'Invalid Id type' });
  }
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
    const product = await Product.findById(productId);
    if (!product) {
      return res
        .status(404)
        .json({ message: `Product with _id: ${productId} not found` });
    }
    const productUpdate = await Product.findByIdAndUpdate(productId, value);
    res.status(200).json(productUpdate);
  } catch (error) {
    next(error);
  }
};

const deleteProductById = async (req, res, next) => {
  try {
    const productId = req.params.prodId;
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: 'Invalid Id type' });
    }
    const product = await Product.findById(productId);
    if (!product) {
      return res
        .status(404)
        .json({ message: `Product with _id: ${productId} not found` });
    }
    const deleteProduct = await Product.findByIdAndDelete(productId);
    res.status(200).json({
      message: `Product with _id: ${productId} has been successfully deleted.`,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addNewProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProductById,
};
