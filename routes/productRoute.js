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
