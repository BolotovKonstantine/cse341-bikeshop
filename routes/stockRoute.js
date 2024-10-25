const express = require('express');
const router = express.Router();
const stockController = require('../controller/stockController');

router.post(
  // #swagger.tags = ['Stocks']
  '/',
  stockController.addNewStock
);
router.get(
  // #swagger.tags = ['Stocks']
  '/all-products',
  stockController.getAllStocks
);
router.get(
  // #swagger.tags = ['Stocks']
  '/:product',
  stockController.getStocksByProduct
);
// router.put('/:stock', stockController.updateStock);
router.delete(
  // #swagger.tags = ['Stocks']
  '/:stock',
  stockController.deleteStockById
);

module.exports = router;
