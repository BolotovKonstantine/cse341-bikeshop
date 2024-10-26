const express = require('express');
const router = express.Router();
const stockController = require('../controller/stockController');
const { isAuthenticated } = require('../utilities/authenticate');

router.post(
    '/',
    /*
    #swagger.tags = ['Stock']
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Stock data to be added',
      required: true,
      schema: {
        $ref: '#/components/schemas/NewStock'
      }
    }
    */
    isAuthenticated,
    stockController.addNewStock
);

router.get(
    '/all-products',
    // #swagger.tags = ['Stock']
    stockController.getAllStocks
);

router.get(
    '/:product',
    // #swagger.tags = ['Stock']
    stockController.getStocksByProduct
);

router.put(
    '/:stock',
    /*
    #swagger.tags = ['Stock']
    #swagger.parameters['stock'] = {
      in: 'path',
      description: 'Stock ID',
      required: true,
      type: 'string'
    }
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Updated stock data',
      required: true,
      schema: {
        $ref: '#/components/schemas/UpdateStock'
      }
    }
    */
    isAuthenticated,
    stockController.updateStock
);

router.delete(
    '/:stock',
    // #swagger.tags = ['Stock']
    isAuthenticated,
    stockController.deleteStockById
);

module.exports = router;