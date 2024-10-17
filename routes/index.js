const express = require('express');
const router = express.Router();

router.use('/products', require('./productRoute'));
router.use('/orders', require('./ordersRoute'));

module.exports = router;
