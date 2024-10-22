const router = require('express').Router();
const validation = require('../utilities/orderValidation')
const orderController = require('../controller/orderController');
const { isAuthenticated } = require('../utilities/authenticate');

//------ Create/Delete an Order ------//

router.post('/', 
      // #swagger.tags = ['Orders']
      // #swagger.description = 'Create a new order'
    isAuthenticated,
    validation,
    orderController.createOrder)

router.delete('/:order',
    // #swagger.tags = ['Orders']
    // #swagger.description = 'Delete an order'
    isAuthenticated,
    orderController.deleteOrder)

//------ Look Up an Existing Order -----//

router.get('/', 
    // #swagger.tags = ['Orders']
    // #swagger.description = 'Display all orders'
    orderController.getAllOrders
)

router.get('/:id', 
    // #swagger.tags = ['Orders']
    // #swagger.description = 'Display a specific order'
    orderController.findOrderById)

//------ Updating Existing Orders ------//

router.put('/additems/:orderId', 
    // #swagger.tags = ['Orders']
    // #swagger.description = 'Add product/quantity to an existing order'
    isAuthenticated,
    orderController.addProduct
)
router.put('/deleteitems/:orderId', 
    // #swagger.tags = ['Orders']
    // #swagger.description = 'Remove product/quantity from an existing order'
    isAuthenticated,
    orderController.deleteProduct
)

router.put('/changeuser/:orderId',
    // #swagger.tags = ['Orders']
    // #swagger.description = 'change a user on an existing order'
    isAuthenticated,
    orderController.changeUser
)


module.exports = router;