const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');

// Set a timeout for all tests
jest.setTimeout(15000);

// Spy on Mongoose's connect and disconnect methods to prevent real database connections
jest.spyOn(mongoose, 'connect').mockImplementation(() => Promise.resolve());
jest.spyOn(mongoose, 'disconnect').mockImplementation(() => Promise.resolve());

// Mock passport and GithubStrategy to prevent GitHub OAuth call errors
jest.mock('passport', () => {
  const originalModule = jest.requireActual('passport');
  return {
    ...originalModule,
    initialize: jest.fn(() => (req, res, next) => next()),
    session: jest.fn(() => (req, res, next) => next()),
    authenticate: jest.fn((strategy, options) => (req, res, next) => {
      if (strategy === 'github') {
        req.user = { displayName: 'MockUser' }; // Mock user
        return next();
      }
      return originalModule.authenticate(strategy, options)(req, res, next);
    }),
    use: jest.fn(),
    serializeUser: jest.fn(() => (req, res, next) => next()), // Mocking to proceed without `done`
    deserializeUser: jest.fn(() => (req, res, next) => next()), // Mocking to proceed without `done`
  };
});

// Mock the GithubStrategy to avoid real GitHub OAuth setup and add a done function
jest.mock('passport-github2', () => {
  return {
    Strategy: jest.fn((options, verify) => {
      const done = jest.fn(); // Mock done function within the strategy
      verify(null, null, { displayName: 'MockUser' }, done); // Pass done to verify
    }),
  };
});

describe('Server Tests', () => {
  // Define the /error route before all tests, so it’s consistently available
  beforeAll(() => {
    app.get('/error', (req, res, next) => {
      const error = new Error('Test Error');
      error.status = 500;
      next(error);
    });
  });

  test('should return a 200 status for the root route', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
    expect(response.text).toContain('You are logged out');
  });

  test('should handle GitHub OAuth callback and redirect to home', async () => {
    const response = await request(app).get('/oauth/github/callback');
    expect(response.statusCode).toBe(302); // Redirect status
    expect(response.headers.location).toBe('/'); // Redirect to home
  });

  test('should return login failure message', async () => {
    const response = await request(app).get('/login-failure');
    expect(response.statusCode).toBe(200);
    expect(response.text).toBe('Failed attempt to log in.');
  });

  test('should return a 404 for unknown route', async () => {
    const response = await request(app).get('/unknown-route');
    expect(response.statusCode).toBe(404);
    expect(response.body.error).toBe('Sorry, page not found');
  });
});
