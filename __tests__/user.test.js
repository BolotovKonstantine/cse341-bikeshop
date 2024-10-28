const mongoose = require('mongoose');
const {
  getAllUsers,
  newUser,
  getUser,
  updateUser,
  deleteUser,
} = require('../controller/user');
const User = require('../model/User');
jest.mock('../model/User');

describe('User Controller', () => {
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
    send: jest.fn(),
  };
  const next = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /users', () => {
    it('should return all users with status 200', async () => {
      const users = [{ name: 'John Doe', email: 'john@example.com' }];
      User.find.mockResolvedValue(users);

      await getAllUsers({}, res, next);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(users);
    });

    it('should return a message if no users are found', async () => {
      User.find.mockResolvedValue([]);
      await getAllUsers({}, res, next);
      expect(res.send).toHaveBeenCalledWith('No users found');
    });
  });

  describe('GET /users/:userId', () => {
    it('should return user by ID with status 200', async () => {
      const userId = new mongoose.Types.ObjectId();
      const user = { _id: userId, name: 'John Doe', email: 'john@example.com' };
      User.findById.mockResolvedValue(user);

      await getUser({ params: { userId } }, res, next);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(user);
    });

    it('should return 400 if ID is invalid', async () => {
      await getUser({ params: { userId: 'invalidId' } }, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid Id type' });
    });

    it('should return 404 if user is not found', async () => {
      const userId = new mongoose.Types.ObjectId();
      User.findById.mockResolvedValue(null);

      await getUser({ params: { userId } }, res, next);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: `User ${userId} not found`,
      });
    });
  });

  describe('POST /users', () => {
    it('should create a new user with status 201', async () => {
      const req = {
        body: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'test@mail.com',
          phone: '012-345-6789',
          address: 'test address',
        },
      };
      User.mockImplementation(() => ({
        save: jest.fn().mockResolvedValue(req.body),
      }));
      await newUser(req, res, next);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(req.body);
    });

    it('should return 400 for validation errors', async () => {
      const invalidUserData = { name: '' };
      await newUser({ body: invalidUserData }, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'Validation Error' })
      );
    });
  });

  describe('PUT /users/:userId', () => {
    it('should update a user and return status 200', async () => {
      const req = {
        params: { userId: new mongoose.Types.ObjectId().toString() },
        body: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'test@mail.com',
          phone: '012-345-6789',
          address: 'test address',
        },
      };
      const user = { firstname: 'Jane' };
      User.findById.mockResolvedValue(user);
      User.findByIdAndUpdate.mockResolvedValue(req.body);

      await updateUser(req, res, next);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(req.body);
    });

    it('should return 400 for invalid ID', async () => {
      const req = { params: { userId: 'different' } };

      await getUser(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid Id type' });
    });

    it('should return 404 if user not found', async () => {
      const req = {
        params: { userId: new mongoose.Types.ObjectId().toString() },
        body: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'test@mail.com',
          phone: '012-345-6789',
          address: 'test address',
        },
      };
      User.findById.mockResolvedValue(null);
      await updateUser(req, res, next);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: `User ${req.params.userId} not found`,
      });
    });
  });

  describe('DELETE /users/:userId', () => {
    it('should delete a user and return status 200', async () => {
      const userId = new mongoose.Types.ObjectId();
      User.findById.mockResolvedValue({ _id: userId });
      User.findByIdAndDelete.mockResolvedValue({ _id: userId });

      await deleteUser({ params: { userId } }, res, next);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: `User ${userId} has been successfully deleted.`,
      });
    });

    it('should return 400 for invalid ID', async () => {
      await deleteUser({ params: { userId: 'invalidId' } }, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid Id type' });
    });

    it('should return 404 if user not found', async () => {
      const userId = new mongoose.Types.ObjectId();
      User.findById.mockResolvedValue(null);

      await deleteUser({ params: { userId } }, res, next);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: `User ${userId} not found`,
      });
    });
  });
});
