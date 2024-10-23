const Stock = require('../model/Stock');
const stockSchema = require('../utilities/stockValidator');
const mongoose = require('mongoose');
const Product = require('../model/Product');

// Utility function to check valid ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const addNewStock = async (req, res, next) => {
    const { error, value } = stockSchema.validate(req.body, { abortEarly: false });
    if (error) {
        return res.status(400).json({
            message: 'Validation Error',
            details: error.details.map((err) => err.message),
        });
    }

    try {
        if (!isValidObjectId(value.productId)) {
            return res.status(400).json({ error: 'Invalid productId: IDs must be valid' });
        }

        const productExists = await Product.exists({ _id: value.productId });
        if (!productExists) {
            return res.status(400).json({ error: 'Invalid productId: Product does not exist' });
        }

        const stock = new Stock(value);
        const newStock = await stock.save();
        res.status(201).json(newStock);
    } catch (error) {
        next(error);
    }
};

const getAllStocks = async (req, res, next) => {
    try {
        const stocks = await Stock.find().populate('productId');
        if (!stocks) {
            return res.send('No stocks found');
        }
        res.status(200).json(stocks);
    } catch (error) {
        next(error);
    }
};

const getStocksByProduct = async (req, res, next) => {
    const productId = req.params.product;

    if (!isValidObjectId(productId)) {
       return res.status(400).json({ message: 'Invalid Id type' });
   }

    try {
        const stocks = await Stock.find({ productId }).populate('productId');
        if (!stocks.length) {
            return res.status(404).json({ message: `No stocks found for product with _id: ${productId}` });
        }
        res.status(200).json(stocks);
    } catch (error) {
        next(error);
    }
};

const updateStock = async (req, res, next) => {
    const stockId = req.params.stock;

    if (!isValidObjectId(stockId)) {
        return res.status(400).json({ message: 'Invalid Id type' });
    }

    const { error, value } = stockSchema.validate(req.body, { abortEarly: false });
    if (error) {
        return res.status(400).json({
            message: 'Validation Error',
            details: error.details.map((err) => err.message),
        });
    }

    try {
        const stock = await Stock.findById(stockId);
        if (!stock) {
            return res.status(404).json({ message: `Stock with _id: ${stockId} not found` });
        }

        if (!isValidObjectId(value.productId)) {
            return res.status(400).json({ error: 'Invalid productId: IDs must be valid' });
        }

        const productExists = await Product.exists({ _id: value.productId });
        if (!productExists) {
            return res.status(400).json({ error: 'Invalid productId: Product does not exist' });
        }

        const stockUpdate = await Stock.findByIdAndUpdate(stockId, value, { new: true });
        res.status(200).json(stockUpdate);
    } catch (error) {
        next(error);
    }
};

const deleteStockById = async (req, res, next) => {
    const stockId = req.params.stock;

    if (!isValidObjectId(stockId)) {
        return res.status(400).json({ message: 'Invalid Id type' });
    }

    try {
        const stock = await Stock.findById(stockId);
        if (!stock) {
            return res.status(404).json({ message: `Stock with _id: ${stockId} not found` });
        }

        await Stock.findByIdAndDelete(stockId);
        res.status(200).json({ message: `Stock with _id: ${stockId} has been successfully deleted.` });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    addNewStock,
    getAllStocks,
    getStocksByProduct,
    updateStock,
    deleteStockById,
};