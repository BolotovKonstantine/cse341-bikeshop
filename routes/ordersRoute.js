const router = require('express').Router();
const validation = require('../utilities/orderValidation')
const orderController = require('../controller/orderController')

//------ Create/Delete an Order ------//
// create new order
router.post('/', 
    validation.validateOrder,
    orderController.createOrder)
//delete an order
// router.delete('/:order')

//------ Look Up an Existing Order -----//

// get order by id
router.get('/:order', (req, res) => {
    console.log('this is your route for orders by id')
})
// get all orders for user
router.get('/user/:user', (req, res) => {
    console.log('this is your orders by user route')
})


//------ Updating Existing Orders ------//
//add or remove an item on an order
router.put('updateitems/:order', (req, res) => {
    console.log('this is your route for changing orders')})


module.exports = router;