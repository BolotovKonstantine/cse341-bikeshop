const express = require('express');
const router = express.Router();
const productControl = require('../controller/productController');

router.get(
  // #swagger.tag = ['Products']
  '/',
  productControl.getProducts
);

router.post(
  // #swagger.tag = ['Products']
  '/',
  productControl.addNewProduct
);

router.get(
  // #swagger.tag = ['Products']
  '/:prodId',
  productControl.getProductById
);

router.put(
  // #swagger.tag = ['Products']
  '/:prodId',
  productControl.updateProduct
);

router.delete(
  // #swagger.tag = ['Products']
  '/:prodId',
  productControl.deleteProductById
);

module.exports = router;
