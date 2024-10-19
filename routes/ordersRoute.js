const router = require('express').Router();
const validation = require('../utilities/orderValidation')
const orderController = require('../controller/orderController');

//------ Create/Delete an Order ------//
// create new order
router.post('/', 
    validation,
    orderController.createOrder)
//delete an order
router.delete('/:order',
    orderController.deleteOrder)

//------ Look Up an Existing Order -----//

router.get('/', 
    orderController.getAllOrders
)

// get order by order id
router.get('/:id', 
    orderController.findOrderById)

// get all orders for user
router.get('/user/:user', (req, res) => {
    console.log('this is your orders by user route')
})


//------ Updating Existing Orders ------//
//add or remove an item on an order
router.put('/additems/:orderId', 
    orderController.addProduct
)
router.put('/deleteitems/:orderId', 
    orderController.deleteProduct
)

router.put('/changeuser/:orderId',
    orderController.changeUser
)


module.exports = router;