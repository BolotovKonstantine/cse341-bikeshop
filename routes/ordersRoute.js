const router = require('express').Router();
const validation = require('../utilities/orderValidation')
const orderController = require('../controller/orderController');
const { valid } = require('joi');

//------ Create/Delete an Order ------//
// create new order
router.post('/', 
    validation.validateOrder,
    orderController.createOrder)
//delete an order
router.delete('/:order',
    validation.checkOrder,
    orderController.deleteOrder)

//------ Look Up an Existing Order -----//

router.get('/', 
    orderController.getAllOrders
)

// get order by id
router.get('/:id', 
    validation.checkOrder,
    orderController.findOrderById)

// get all orders for user
router.get('/user/:user', (req, res) => {
    console.log('this is your orders by user route')
})


//------ Updating Existing Orders ------//
//add or remove an item on an order
router.put('updateitems/:order', (req, res) => {
    console.log('this is your route for changing orders')})


module.exports = router;