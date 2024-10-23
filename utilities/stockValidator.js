const Joi = require('joi');
const mongoose = require('mongoose');
const Product = require('../model/Product');

const stockSchema = Joi.object({
    productId: Joi.string().required(),
    numItems: Joi.number().integer().min(0).required(),
    location: Joi.string().required()
});

module.exports = {
    validateStock: async (req, res, next) => {
        try {
            const { error } = stockSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ error: error.details[0].message });
            }

            // Check if productId exists in the Product collection
            const productExists = await Product.exists({ _id: mongoose.Types.ObjectId(req.body.productId) });
            if (!productExists) {
                return res.status(400).json({ error: 'Invalid productId: Product does not exist' });
            }

            next();
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
};