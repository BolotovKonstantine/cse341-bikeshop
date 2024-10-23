const Stock = require('../model/Stock');

module.exports = {
    createStock: async (req, res) => {
        try {
            const stock = new Stock(req.body);
            await stock.save();
            res.status(201).json(stock);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    getAllProducts: async (req, res) => {
        try {
            const stocks = await Stock.find().populate('productId');
            res.status(200).json(stocks);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    getStockByProduct: async (req, res) => {
        try {
            const { product } = req.params;
            const stocks = await Stock.find({ productId: product }).populate('productId');
            res.status(200).json(stocks);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    updateStock: async (req, res) => {
        try {
            const { stock } = req.params;
            const updatedStock = await Stock.findByIdAndUpdate(stock, req.body, { new: true });
            if (!updatedStock) {
                return res.status(404).json({ error: 'Stock not found' });
            }
            res.status(200).json(updatedStock);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    deleteStock: async (req, res) => {
        try {
            const { stock } = req.params;
            const deletedStock = await Stock.findByIdAndDelete(stock);
            if (!deletedStock) {
                return res.status(404).json({ error: 'Stock not found' });
            }
            res.status(200).json({ message: 'Stock deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};