const request = require('supertest');
const express = require('express');
const userRoute = require('../routes/userRoute');
const user = require('../controller/user');
const { isAuthenticated } = require('../utilities/authenticate');

jest.setTimeout(10000);

jest.mock('../controller/user');
jest.mock('../utilities/authenticate');

const app = express();
app.use(express.json());
app.use('/users', userRoute);

describe('User Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /users', () => {
    it('should return 200 and call getAllUsers', async () => {
      user.getAllUsers.mockImplementation((req, res) =>
        res.status(200).send('All Users')
      );

      const res = await request(app).get('/users');
      expect(res.status).toBe(200);
      expect(res.text).toBe('All Users');
      expect(user.getAllUsers).toHaveBeenCalledTimes(1);
    });
  });

  describe('POST /users', () => {
    it('should call addUser when authenticated', async () => {
      isAuthenticated.mockImplementation((req, res, next) => next());
      user.newUser.mockImplementation((req, res) =>
        res.status(201).send('User created')
      );

      const res = await request(app)
        .post('/users')
        .send({ firstName: 'user', lastName: 'test' });
      expect(res.status).toBe(201);
      expect(res.text).toBe('User created');
      expect(isAuthenticated).toHaveBeenCalledTimes(1);
      expect(user.newUser).toHaveBeenCalledTimes(1);
    });
  });

  describe('GET /users/:userId', () => {
    it('should return 200 and call getUser', async () => {
      const userId = '123';
      user.getUser.mockImplementation((req, res) =>
        res.status(200).send(`User ${userId}`)
      );

      const res = await request(app).get(`/users/${userId}`);
      expect(res.status).toBe(200);
      expect(res.text).toBe(`User ${userId}`);
      expect(user.getUser).toHaveBeenCalledTimes(1);
    });
  });

  describe('PUT /users/:userId', () => {
    it('should call updateUser when authenticated', async () => {
      isAuthenticated.mockImplementation((req, res, next) => next());
      user.updateUser.mockImplementation((req, res) =>
        res.status(200).send('User updated')
      );

      const res = await request(app)
        .put('/users/123')
        .send({ namefirstName: 'Updated', lastName: 'User' });
      expect(res.status).toBe(200);
      expect(res.text).toBe('User updated');
      expect(isAuthenticated).toHaveBeenCalledTimes(1);
      expect(user.updateUser).toHaveBeenCalledTimes(1);
    });
  });

  describe('DELETE /users/:userId', () => {
    it('should call deleteUser when authenticated', async () => {
      isAuthenticated.mockImplementation((req, res, next) => next());
      user.deleteUser.mockImplementation((req, res) =>
        res.status(200).send('User deleted')
      );

      const res = await request(app).delete('/users/123');
      expect(res.status).toBe(200);
      expect(res.text).toBe('User deleted');
      expect(isAuthenticated).toHaveBeenCalledTimes(1);
      expect(user.deleteUser).toHaveBeenCalledTimes(1);
    });
  });
});
