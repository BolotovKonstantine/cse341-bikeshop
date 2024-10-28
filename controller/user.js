const User = require('../model/User');
const userSchema = require('../utilities/userValidate');
const mongoose = require('mongoose');

const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();

    if (users.length === 0) {
      return res.send('No users found');
    }
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

const getUser = async (req, res, next) => {
  const userId = req.params.userId;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: 'Invalid Id type' });
  }
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: `User ${userId} not found` });
    }
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

const newUser = async (req, res, next) => {
  const { error, value } = userSchema.validate(req.body, {
    abortEarly: false,
  });
  if (error) {
    return res.status(400).json({
      message: 'Validation Error',
      details: error.details.map((err) => err.message),
    });
  }
  try {
    const user = new User(value);
    const newUser = await user.save();
    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  const userId = req.params.userId;
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: 'Invalid Id type' });
  }
  const { error, value } = userSchema.validate(req.body, {
    abortEarly: false,
  });
  if (error) {
    return res.status(400).json({
      message: 'Validation Error',
      details: error.details.map((err) => err.message),
    });
  }
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: `User ${userId} not found` });
    }
    const userUpdate = await User.findByIdAndUpdate(userId, value);
    res.status(200).json(userUpdate);
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid Id type' });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: `User  ${userId} not found` });
    }
    await User.findByIdAndDelete(userId);
    res.status(200).json({
      message: `User ${userId} has been successfully deleted.`,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllUsers,
  newUser,
  getUser,
  updateUser,
  deleteUser,
};
