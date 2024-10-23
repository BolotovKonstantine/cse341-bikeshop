const express = require('express');
const router = express.Router();
const stockController = require('../controller/stockController');

router.post('/', stockController.addNewStock);
router.get('/all-products', stockController.getAllStocks);
router.get('/:product',  stockController.getStocksByProduct);
// router.put('/:stock', stockController.updateStock);
router.delete('/:stock', stockController.deleteStockById);

module.exports = router;