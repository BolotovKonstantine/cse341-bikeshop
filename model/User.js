const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['customer', 'employee', 'manager'],
    default: 'customer',
  },
  orders: { // added by Kjirsten
    type: Array,
    default: []
  }
});

module.exports = mongoose.model('User', userSchema);
