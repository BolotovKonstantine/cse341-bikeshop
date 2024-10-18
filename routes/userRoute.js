const express = require('express');
const router = express.Router();
const user = require('../controller/user');
const { isAuthenticated } = require('../utilities/authenticate');

router.get(
  // #swagger.tags = ['Users']
  '/',
  user.getAllUsers
);

router.get(
    // #swagger.tags = ['Users']
    '/:userId',
    user.getUser
  );

router.post(
  // #swagger.tags = ['Users']
  '/',
  isAuthenticated,
  user.newUser
);

router.put(
  // #swagger.tags = ['Users']
  '/:userId',
  isAuthenticated,
  user.updateUser
);

router.delete(
  // #swagger.tags = ['Users']
  '/:userId',
  isAuthenticated,
  user.deleteUser
);

module.exports = router;
