const Stock = require('../model/Stock');
const Product = require('../model/Product');
const {
  addNewStock,
  getAllStocks,
  getStocksByProduct,
  updateStock,
  deleteStockById,
} = require('../controller/stockController');
const mongoose = require('mongoose');
const stockSchema = require('../utilities/stockValidator'); // The Joi schema for validation

jest.mock('../model/Stock');
jest.mock('../model/Product');

describe('Stock Controller', () => {
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
    send: jest.fn(),
  };
  const next = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('addNewStock', () => {
    it('should create and return new stock with status 201', async () => {
      const mockProductId = new mongoose.Types.ObjectId().toString();
      const mockStock = {
        productId: mockProductId,
        numItems: 10,
        location: 'Warehouse A',
      };
      const validatedStock = stockSchema.validate(mockStock);

      Product.exists.mockResolvedValue(true);
      Stock.prototype.save.mockResolvedValue(validatedStock.value);

      const req = { body: mockStock };

      await addNewStock(req, res, next);

      expect(Product.exists).toHaveBeenCalledWith({ _id: mockProductId });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(validatedStock.value);
    });

    it('should return 400 for invalid productId', async () => {
      const req = {
        body: { productId: 'invalid', numItems: 10, location: 'Warehouse A' },
      };

      await addNewStock(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Invalid productId: IDs must be valid',
      });
    });
  });

  describe('getAllStocks', () => {
    it('should return all stocks with status 200', async () => {
      const mockStocks = [
        {
          _id: '1',
          productId: 'product1',
          numItems: 10,
          location: 'Warehouse A',
        },
        {
          _id: '2',
          productId: 'product2',
          numItems: 5,
          location: 'Warehouse B',
        },
      ];
      Stock.find.mockResolvedValue(mockStocks);

      await getAllStocks({}, res, next);
      expect(Stock.find).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockStocks);
    });

    it('should return message if no stocks found', async () => {
      Stock.find.mockResolvedValue([]);

      await getAllStocks({}, res, next);
      expect(Stock.find).toHaveBeenCalledTimes(1);
      expect(res.send).toHaveBeenCalledWith('No stocks found');
    });
  });

  describe('getStocksByProduct', () => {
    it('should return stocks by product ID with status 200', async () => {
      const productId = new mongoose.Types.ObjectId().toString();
      const stocks = [{ productId, numItems: 10, location: 'Warehouse A' }];
      Stock.find.mockResolvedValue(stocks);

      const req = { params: { product: productId } };
      await getStocksByProduct(req, res, next);

      expect(Stock.find).toHaveBeenCalledWith({ productId });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(stocks);
    });

    it('should return 400 for invalid product ID', async () => {
      const req = { params: { product: 'invalidId' } };

      await getStocksByProduct(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid Id type' });
    });
  });

  describe('updateStock', () => {
    it('should update stock and return it with status 200', async () => {
      const stockId = new mongoose.Types.ObjectId().toString();
      const mockUpdateData = {
        productId: new mongoose.Types.ObjectId().toString(),
        numItems: 15,
        location: 'Warehouse A',
      };
      const updatedStock = { _id: stockId, ...mockUpdateData };

      Stock.findById.mockResolvedValue({ _id: stockId });
      Stock.findByIdAndUpdate.mockResolvedValue(updatedStock);
      Product.exists.mockResolvedValue(true);

      const req = { params: { stock: stockId }, body: mockUpdateData };
      await updateStock(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(updatedStock);
    });

    it('should return 400 for invalid stock ID', async () => {
      const req = {
        params: { stock: 'invalidId' },
        body: { numItems: 10, location: 'Warehouse A' },
      };

      await updateStock(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid Id type' });
    });
  });

  describe('deleteStockById', () => {
    it('should delete stock and return success message with status 200', async () => {
      const stockId = new mongoose.Types.ObjectId().toString();
      Stock.findById.mockResolvedValue({ _id: stockId });
      Stock.findByIdAndDelete.mockResolvedValue({});

      const req = { params: { stock: stockId } };
      await deleteStockById(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: `Stock with _id: ${stockId} has been successfully deleted.`,
      });
    });

    it('should return 400 for invalid stock ID', async () => {
      const req = { params: { stock: 'invalidId' } };

      await deleteStockById(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid Id type' });
    });
  });
});
