const express = require('express');
const router = express.Router();
const productControl = require('../controller/productController');

router.post('/', productControl.addNewProduct);

module.exports = router;
