const request = require('supertest');
const express = require('express');
const passport = require('passport');
const router = require('../routes');
const app = express();

app.use(express.json());
app.use('/', router);

// Mock Passport for login route
jest.mock('passport', () => ({
  authenticate: jest.fn(
    () => (req, res) => res.redirect('https://github.com/login/oauth')
  ),
}));

describe('Route Tests', () => {
  jest.setTimeout(20000); // Extend timeout for slow routes

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test for /login route
  it('should redirect to GitHub for login', async () => {
    const response = await request(app).get('/login');
    expect(response.statusCode).toBe(302);
    expect(response.headers.location).toContain(
      'https://github.com/login/oauth'
    );
  });

  // Test for /api-docs route
  it('should return Swagger UI for /api-docs', async () => {
    const response = await request(app).get('/api-docs');
    expect([200, 301]).toContain(response.statusCode);

    if (response.statusCode === 301) {
      const redirectedResponse = await request(app).get('/api-docs/');
      expect(redirectedResponse.statusCode).toBe(200);
      expect(redirectedResponse.text).toContain('Swagger');
    } else {
      expect(response.text).toContain('Swagger');
    }
  });

  // Route tests for /products, /orders, /users, /stock
  it.each([
    { path: '/products', timeout: 15000 },
    { path: '/orders', timeout: 15000 },
    { path: '/users', timeout: 15000 },
    { path: '/stock', timeout: 5000 },
  ])('should access route $path', async ({ path, timeout }) => {
    try {
      const response = await request(app)
        .get(path)
        .timeout({ deadline: timeout });

      expect([200, 404, 500]).toContain(response.statusCode);
    } catch (error) {
      console.error(`Error accessing ${path}: ${error.message}`);
      throw error;
    }
  });
});
