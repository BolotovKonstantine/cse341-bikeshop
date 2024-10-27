const request = require('supertest');
const express = require('express');
const stockRoute = require('../routes/stockRoute'); // Adjust path as needed
const stockController = require('../controller/stockController');
const { isAuthenticated } = require('../utilities/authenticate');

const app = express();
app.use(express.json());
app.use('/stock', stockRoute);

jest.mock('../controller/stockController');
jest.mock('../utilities/authenticate');

describe('Stock Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /stock', () => {
    it('should add new stock when authenticated', async () => {
      isAuthenticated.mockImplementation((req, res, next) => next());
      stockController.addNewStock.mockImplementation((req, res) =>
        res.status(201).json({ message: 'Stock added' })
      );

      const response = await request(app).post('/stock').send({
        /* example stock data */
      });

      expect(isAuthenticated).toHaveBeenCalled();
      expect(stockController.addNewStock).toHaveBeenCalled();
      expect(response.status).toBe(201);
      expect(response.body.message).toBe('Stock added');
    });

    it('should return 401 if not authenticated', async () => {
      isAuthenticated.mockImplementation((req, res) =>
        res.status(401).json({ message: 'Unauthorized' })
      );

      const response = await request(app).post('/stock').send({
        /* example stock data */
      });

      expect(isAuthenticated).toHaveBeenCalled();
      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Unauthorized');
    });
  });

  describe('GET /stock/all-products', () => {
    it('should retrieve all stocks', async () => {
      stockController.getAllStocks.mockImplementation((req, res) =>
        res.status(200).json([
          {
            /* example stock data */
          },
        ])
      );

      const response = await request(app).get('/stock/all-products');

      expect(stockController.getAllStocks).toHaveBeenCalled();
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('GET /stock/:product', () => {
    it('should retrieve stock by product name', async () => {
      const product = 'exampleProduct';
      stockController.getStocksByProduct.mockImplementation((req, res) =>
        res.status(200).json({ product })
      );

      const response = await request(app).get(`/stock/${product}`);

      expect(stockController.getStocksByProduct).toHaveBeenCalledTimes(1);

      expect(
        stockController.getStocksByProduct.mock.calls[0][0].params.product
      ).toBe(product);
      expect(response.status).toBe(200);
      expect(response.body.product).toBe(product);
    });
  });

  describe('PUT /stock/:stock', () => {
    it('should update stock when authenticated', async () => {
      const stockId = 'exampleStockId';
      isAuthenticated.mockImplementation((req, res, next) => next());
      stockController.updateStock.mockImplementation((req, res) =>
        res.status(200).json({ message: 'Stock updated' })
      );

      const response = await request(app).put(`/stock/${stockId}`).send({
        /* example updated stock data */
      });

      expect(isAuthenticated).toHaveBeenCalled();
      expect(stockController.updateStock).toHaveBeenCalled();
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Stock updated');
    });

    it('should return 401 if not authenticated', async () => {
      isAuthenticated.mockImplementation((req, res) =>
        res.status(401).json({ message: 'Unauthorized' })
      );

      const response = await request(app).put('/stock/exampleStockId').send({
        /* example updated stock data */
      });

      expect(isAuthenticated).toHaveBeenCalled();
      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Unauthorized');
    });
  });

  describe('DELETE /stock/:stock', () => {
    it('should delete stock by ID when authenticated', async () => {
      const stockId = 'exampleStockId';
      isAuthenticated.mockImplementation((req, res, next) => next());
      stockController.deleteStockById.mockImplementation((req, res) =>
        res.status(200).json({ message: 'Stock deleted' })
      );

      const response = await request(app).delete(`/stock/${stockId}`);

      expect(isAuthenticated).toHaveBeenCalled();
      expect(stockController.deleteStockById).toHaveBeenCalled();
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Stock deleted');
    });

    it('should return 401 if not authenticated', async () => {
      isAuthenticated.mockImplementation((req, res) =>
        res.status(401).json({ message: 'Unauthorized' })
      );

      const response = await request(app).delete('/stock/exampleStockId');

      expect(isAuthenticated).toHaveBeenCalled();
      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Unauthorized');
    });
  });
});
