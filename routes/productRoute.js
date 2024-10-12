const express = require('express');
const router = express.Router();
const productControl = require('../controller/productController');

router.get('/', productControl.getProducts);

router.post('/', productControl.addNewProduct);

router.get('/:prodId', productControl.getProductById);

router.put('/:prodId', productControl.updateProduct);

router.delete('/:prodId', productControl.deleteProductById);

module.exports = router;
