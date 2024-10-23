const express = require('express');
const router = express.Router();
const passport = require('passport');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger.json');

router.use('/api-docs', swaggerUi.serve);
router.get('/api-docs', swaggerUi.setup(swaggerDocument));

router.get('/login', passport.authenticate('github'));

router.get('/logout', (req, res, next) => {
  req.logout((error) => {
    if (error) {
      return next(error);
    }
    res.send('You are logged out.');
  });
});

router.use('/products', require('./productRoute'));
router.use('/orders', require('./ordersRoute'));
router.use('/users', require('./userRoute'));
router.use('/stock', require('./stockRoute'));

module.exports = router;
