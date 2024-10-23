const router = require('express').Router();
const { validateStock } = require('../utilities/stockValidator')
const stockController = require('../controller/stockController');
const { isAuthenticated } = require('../utilities/authenticate');


router.post('/', validateStock, stockController.createStock);

router.get('/all-products', stockController.getAllProducts);

router.get('/:product', stockController.getStockByProduct);

router.put('/:stock', validateStock, stockController.updateStock);

router.delete('/:stock', stockController.deleteStock);

module.exports = router;