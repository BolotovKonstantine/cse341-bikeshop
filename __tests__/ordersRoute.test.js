const request = require('supertest');
const express = require('express');
const orderRoute = require('../routes/ordersRoute');
const orderController = require('../controller/orderController');
const { isAuthenticated } = require('../utilities/authenticate');
const validation = require('../utilities/orderValidation');

jest.setTimeout(10000);

jest.mock('../controller/orderController');
jest.mock('../utilities/authenticate');
jest.mock('../utilities/orderValidation');

let app;
beforeAll(() => {
  app = express();
  app.use(express.json());
  app.use('/orders', orderRoute);
});

describe('Order Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /orders', () => {
    it('should create a new order when authenticated and valid', async () => {
      isAuthenticated.mockImplementation((req, res, next) => next());
      validation.mockImplementation((req, res, next) => next());
      orderController.createOrder.mockImplementation((req, res) =>
        res.status(201).send('Order created')
      );

      const res = await request(app)
        .post('/orders')
        .send({ item: 'product', quantity: 2 });
      expect(res.status).toBe(201);
      expect(res.text).toBe('Order created');
      expect(isAuthenticated).toHaveBeenCalledTimes(1);
      expect(validation).toHaveBeenCalledTimes(1);
      expect(orderController.createOrder).toHaveBeenCalledTimes(1);
    });
  });

  describe('DELETE /orders/:order', () => {
    it('should delete an order when authenticated', async () => {
      isAuthenticated.mockImplementation((req, res, next) => next());
      orderController.deleteOrder.mockImplementation((req, res) =>
        res.status(200).send('Order deleted')
      );

      const res = await request(app).delete('/orders/123');
      expect(res.status).toBe(200);
      expect(res.text).toBe('Order deleted');
      expect(isAuthenticated).toHaveBeenCalledTimes(1);
      expect(orderController.deleteOrder).toHaveBeenCalledTimes(1);
    });
  });

  describe('GET /orders', () => {
    it('should return all orders', async () => {
      orderController.getAllOrders.mockImplementation((req, res) =>
        res.status(200).send('All orders')
      );

      const res = await request(app).get('/orders');
      expect(res.status).toBe(200);
      expect(res.text).toBe('All orders');
      expect(orderController.getAllOrders).toHaveBeenCalledTimes(1);
    });
  });

  describe('GET /orders/:id', () => {
    it('should return a specific order by id', async () => {
      const orderId = '123';
      orderController.findOrderById.mockImplementation((req, res) =>
        res.status(200).send(`Order ${orderId}`)
      );

      const res = await request(app).get(`/orders/${orderId}`);
      expect(res.status).toBe(200);
      expect(res.text).toBe(`Order ${orderId}`);
      expect(orderController.findOrderById).toHaveBeenCalledTimes(1);
    });
  });

  describe('PUT /orders/additems/:orderId', () => {
    it('should add product to an existing order when authenticated', async () => {
      isAuthenticated.mockImplementation((req, res, next) => next());
      orderController.addProduct.mockImplementation((req, res) =>
        res.status(200).send('Product added')
      );

      const res = await request(app)
        .put('/orders/additems/123')
        .send({ item: 'new product', quantity: 1 });
      expect(res.status).toBe(200);
      expect(res.text).toBe('Product added');
      expect(isAuthenticated).toHaveBeenCalledTimes(1);
      expect(orderController.addProduct).toHaveBeenCalledTimes(1);
    });
  });

  describe('PUT /orders/deleteitems/:orderId', () => {
    it('should delete product from an existing order when authenticated', async () => {
      isAuthenticated.mockImplementation((req, res, next) => next());
      orderController.deleteProduct.mockImplementation((req, res) =>
        res.status(200).send('Product deleted')
      );

      const res = await request(app).put('/orders/deleteitems/123');
      expect(res.status).toBe(200);
      expect(res.text).toBe('Product deleted');
      expect(isAuthenticated).toHaveBeenCalledTimes(1);
      expect(orderController.deleteProduct).toHaveBeenCalledTimes(1);
    });
  });

  describe('PUT /orders/changeuser/:orderId', () => {
    it('should change the user on an existing order when authenticated', async () => {
      isAuthenticated.mockImplementation((req, res, next) => next());
      orderController.changeUser.mockImplementation((req, res) =>
        res.status(200).send('User changed')
      );

      const res = await request(app)
        .put('/orders/changeuser/123')
        .send({ newUserId: '456' });
      expect(res.status).toBe(200);
      expect(res.text).toBe('User changed');
      expect(isAuthenticated).toHaveBeenCalledTimes(1);
      expect(orderController.changeUser).toHaveBeenCalledTimes(1);
    });
  });
});
