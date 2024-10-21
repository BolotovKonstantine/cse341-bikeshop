const router = require('express').Router();
const validation = require('../utilities/orderValidation')
const orderController = require('../controller/orderController');
const { isAuthenticated } = require('../utilities/authenticate');

//------ Create/Delete an Order ------//
// create new order
router.post('/', 
      // #swagger.tags = ['Orders']
    isAuthenticated,
    validation,
    orderController.createOrder)
//delete an order
router.delete('/:order',
    // #swagger.tags = ['Orders']
    isAuthenticated,
    orderController.deleteOrder)

//------ Look Up an Existing Order -----//

router.get('/', 
    // #swagger.tags = ['Orders']
    orderController.getAllOrders
)

// get order by orderId
router.get('/:id', 
    // #swagger.tags = ['Orders']
    orderController.findOrderById)

//------ Updating Existing Orders ------//
//add or remove an item on an order
router.put('/additems/:orderId', 
    // #swagger.tags = ['Orders']
    isAuthenticated,
    orderController.addProduct
)
router.put('/deleteitems/:orderId', 
    // #swagger.tags = ['Orders']
    isAuthenticated,
    orderController.deleteProduct
)

router.put('/changeuser/:orderId',
    // #swagger.tags = ['Orders']
    isAuthenticated,
    orderController.changeUser
)


module.exports = router;