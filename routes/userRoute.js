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
  /* #swagger.parameters['body'] = {
      in: 'body',
      description: 'User object',
      required: true,
      schema: { $ref: '#/components/schemas/User' }
    }
      */
  '/',
  isAuthenticated,
  user.newUser
);

router.put(
  // #swagger.tags = ['Users']
  /* #swagger.parameters['body'] = {
      in: 'body',
      description: 'User object',
      required: true,
      schema: { $ref: '#/components/schemas/User' }
    }
      */
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
