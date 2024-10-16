const express = require('express');
const router = express.Router();
const productControl = require('../controller/productController');
const { isAuthenticated } = require('../utilities/authenticate');

router.get(
  // #swagger.tags = ['Products']
  '/',
  productControl.getProducts
);

router.post(
  // #swagger.tags = ['Products']
  // #swagger.description = 'Add a new product'
  /* #swagger.parameters['body'] = {
      in: 'body',
      description: 'Product object',
      required: true,
      schema: { $ref: '#/components/schemas/Product' }
    }
  */
  // #swagger.responses[201] = { description: 'Product created' }
  // #swagger.responses[400] = { description: 'Validation error' }
  '/',
  isAuthenticated,
  productControl.addNewProduct
);

router.get(
  // #swagger.tags = ['Products']
  '/:prodId',
  productControl.getProductById
);

router.put(
  // #swagger.tags = ['Products']
  // #swagger.description = 'Update an existing product'
  /* #swagger.parameters['prodId'] = {
      in: 'path',
      description: 'Product ID',
      required: true,
      type: 'string'
    }
  */
  /* #swagger.parameters['body'] = {
      in: 'body',
      description: 'Updated product object',
      required: true,
      schema: { $ref: '#/components/schemas/Product' }
    }
  */
  // #swagger.responses[200] = { description: 'Product updated' }
  // #swagger.responses[400] = { description: 'Validation error' }
  '/:prodId',
  isAuthenticated,
  productControl.updateProduct
);

router.delete(
  // #swagger.tags = ['Products']
  '/:prodId',
  isAuthenticated,
  productControl.deleteProductById
);

module.exports = router;
