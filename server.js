require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const connectDB = require('./config/dbConnection');
const PORT = process.env.PORT || 5000;

connectDB();

app.use(bodyParser.json());

app.use('/', require('./routes'));

//Error handling.
//No new codes to be added below these lines
app.use((req, res, next) => {
  const error = new Error('Sorry, page not found');
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({ error: error.message });
  next();
});

mongoose.connection.once('open', () => {
  console.log('The database is now connected');
  app.listen(PORT, () => {
    console.log(`Server is open at PORT ${PORT}`);
  });
});
