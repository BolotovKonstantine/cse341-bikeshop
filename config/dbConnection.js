const mongoose = require('mongoose');

const connectMongodb = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
  } catch (error) {
    console.log(error);
  }
};

module.exports = connectMongodb;
