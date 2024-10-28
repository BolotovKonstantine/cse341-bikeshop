const mongoose = require('mongoose');
const {
  addNewProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProductById,
} = require('../controller/productController');
const Product = require('../model/Product');
jest.mock('../model/Product');

describe('Product Controller', () => {
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
    send: jest.fn(),
  };
  const next = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('addNewProduct', () => {
    it('should return 201 if product is successfully added', async () => {
      const req = {
        body: {
          bikeName: 'Mountain Bike',
          bikeType: 'Off-road',
          manufacturer: 'BikeCo',
          description: 'A durable mountain bike for rough terrains.',
          color: 'black',
          retailPrice: 500,
          quantity: 10,
          productionYear: 2023,
          reviews: 'Great bike for mountain trails!',
        },
      };
      Product.mockImplementation(() => ({
        save: jest.fn().mockResolvedValue(req.body),
      }));

      await addNewProduct(req, res, next);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(req.body);
    });

    it('should return 400 if validation fails', async () => {
      const req = { body: { bikeName: '', retailPrice: -10 } }; // Invalid input
      await addNewProduct(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'Validation Error' })
      );
    });
  });

  describe('getProducts', () => {
    it('should return 200 and list of products', async () => {
      const products = [
        { bikeName: 'Road Bike' },
        { bikeName: 'Mountain Bike' },
      ];
      Product.find.mockResolvedValue(products);

      await getProducts({}, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(products);
    });

    it('should send message if no products are found', async () => {
      Product.find.mockResolvedValue([]);

      await getProducts({}, res, next);

      expect(res.send).toHaveBeenCalledWith('No products found');
    });
  });

  describe('getProductById', () => {
    it('should return 400 if invalid ID is provided', async () => {
      const req = { params: { prodId: 'invalidId' } };
      await getProductById(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid Id type' });
    });

    it('should return 404 if product not found', async () => {
      const req = {
        params: { prodId: new mongoose.Types.ObjectId().toString() },
      };
      Product.findById.mockResolvedValue(null);

      await getProductById(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining('not found'),
        })
      );
    });

    it('should return 200 and product if found', async () => {
      const req = {
        params: { prodId: new mongoose.Types.ObjectId().toString() },
      };
      const product = { bikeName: 'Hybrid Bike' };
      Product.findById.mockResolvedValue(product);

      await getProductById(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(product);
    });
  });

  describe('updateProduct', () => {
    it('should return 404 if product to update is not found', async () => {
      const req = {
        params: { prodId: new mongoose.Types.ObjectId().toString() },
        body: {
          bikeName: 'Updated Bike',
          bikeType: 'Off-road',
          manufacturer: 'Updated Manufacturer',
          description: 'An updated durable bike for all terrains.',
          color: 'red',
          retailPrice: 600,
          quantity: 15,
          productionYear: 2022,
        },
      };
      Product.findById.mockResolvedValue(null);

      await updateProduct(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining('not found'),
        })
      );
    });

    it('should update and return 200 for a valid product update', async () => {
      const req = {
        params: { prodId: new mongoose.Types.ObjectId().toString() },
        body: {
          bikeName: 'Updated Bike',
          bikeType: 'Off-road',
          manufacturer: 'Updated Manufacturer',
          description: 'An updated durable bike for all terrains.',
          color: 'red',
          retailPrice: 600,
          quantity: 15,
          productionYear: 2022,
        },
      };
      const product = { bikeName: 'Old Bike' };
      Product.findById.mockResolvedValue(product);
      Product.findByIdAndUpdate.mockResolvedValue(req.body);

      await updateProduct(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(req.body);
    });
  });

  describe('deleteProductById', () => {
    it('should return 404 if product to delete is not found', async () => {
      const req = {
        params: { prodId: new mongoose.Types.ObjectId().toString() },
      };
      Product.findById.mockResolvedValue(null);

      await deleteProductById(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining('not found'),
        })
      );
    });

    it('should delete and return 200 for a valid product', async () => {
      const req = {
        params: { prodId: new mongoose.Types.ObjectId().toString() },
      };
      const product = { _id: req.params.prodId, bikeName: 'Hybrid Bike' };
      Product.findById.mockResolvedValue(product);
      Product.findByIdAndDelete.mockResolvedValue({});

      await deleteProductById(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: `Product with _id: ${req.params.prodId} has been successfully deleted.`,
        })
      );
    });
  });
});
