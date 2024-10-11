const express = require('express');
const router = express.Router();

router.use('/products', require('./productRoute'));

module.exports = router;
