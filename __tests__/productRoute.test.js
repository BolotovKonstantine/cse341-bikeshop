const request = require('supertest');
const express = require('express');
const productRoute = require('../routes/productRoute');
const productControl = require('../controller/productController');
const { isAuthenticated } = require('../utilities/authenticate');

jest.setTimeout(10000);

jest.mock('../controller/productController');
jest.mock('../utilities/authenticate');

const app = express();
app.use(express.json());
app.use('/products', productRoute);

describe('Product Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /products', () => {
    it('should return 200 and call getProducts', async () => {
      productControl.getProducts.mockImplementation((req, res) =>
        res.status(200).send('All products')
      );

      const res = await request(app).get('/products');
      expect(res.status).toBe(200);
      expect(res.text).toBe('All products');
      expect(productControl.getProducts).toHaveBeenCalledTimes(1);
    });
  });

  describe('POST /products', () => {
    it('should call addNewProduct when authenticated', async () => {
      isAuthenticated.mockImplementation((req, res, next) => next());
      productControl.addNewProduct.mockImplementation((req, res) =>
        res.status(201).send('Product created')
      );

      const res = await request(app)
        .post('/products')
        .send({ name: 'New Product', price: 100 });
      expect(res.status).toBe(201);
      expect(res.text).toBe('Product created');
      expect(isAuthenticated).toHaveBeenCalledTimes(1);
      expect(productControl.addNewProduct).toHaveBeenCalledTimes(1);
    });
  });

  describe('GET /products/:prodId', () => {
    it('should return 200 and call getProductById', async () => {
      const prodId = '123';
      productControl.getProductById.mockImplementation((req, res) =>
        res.status(200).send(`Product ${prodId}`)
      );

      const res = await request(app).get(`/products/${prodId}`);
      expect(res.status).toBe(200);
      expect(res.text).toBe(`Product ${prodId}`);
      expect(productControl.getProductById).toHaveBeenCalledTimes(1);
    });
  });

  describe('PUT /products/:prodId', () => {
    it('should call updateProduct when authenticated', async () => {
      isAuthenticated.mockImplementation((req, res, next) => next());
      productControl.updateProduct.mockImplementation((req, res) =>
        res.status(200).send('Product updated')
      );

      const res = await request(app)
        .put('/products/123')
        .send({ name: 'Updated Product', price: 200 });
      expect(res.status).toBe(200);
      expect(res.text).toBe('Product updated');
      expect(isAuthenticated).toHaveBeenCalledTimes(1);
      expect(productControl.updateProduct).toHaveBeenCalledTimes(1);
    });
  });

  describe('DELETE /products/:prodId', () => {
    it('should call deleteProductById when authenticated', async () => {
      isAuthenticated.mockImplementation((req, res, next) => next());
      productControl.deleteProductById.mockImplementation((req, res) =>
        res.status(200).send('Product deleted')
      );

      const res = await request(app).delete('/products/123');
      expect(res.status).toBe(200);
      expect(res.text).toBe('Product deleted');
      expect(isAuthenticated).toHaveBeenCalledTimes(1);
      expect(productControl.deleteProductById).toHaveBeenCalledTimes(1);
    });
  });
});
