const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  bikeName: {
    type: String,
    required: true,
  },
  bikeType: {
    type: String,
    required: true,
  },
  manufacturer: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
  retailPrice: {
    type: Number,
    required: true,
  },
  productionYear: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  reviews: {
    type: String,
  },
});

module.exports = mongoose.model('Product', productSchema);
