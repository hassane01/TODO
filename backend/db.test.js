const mongoose = require('mongoose');
const connectDB = require('./config/db');

jest.mock('mongoose');

describe('Database Connection', () => {
  let originalEnv;
  let consoleErrorSpy;

  beforeEach(() => {
    originalEnv = { ...process.env };
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    // Ensure all tests in this suite run in the 'test' environment
    process.env.NODE_ENV = 'test';
  });

  afterEach(() => {
    process.env = originalEnv;
    jest.restoreAllMocks();
  });

  it('should throw an error if no DB URI is provided', async () => {
    delete process.env.MONGO_URI_TEST; // Ensure URI is missing

    // In a test environment, the function should throw an error, not exit.
    await expect(connectDB()).rejects.toThrow('Database URI not found');

    expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringContaining('Database URI not found'));
  });

  it('should throw an error if mongoose connection fails', async () => {
    process.env.MONGO_URI_TEST = 'mongodb://localhost/test_db'; // Set a dummy URI
    const connectionError = new Error('Connection failed');
    mongoose.connect.mockRejectedValue(connectionError);

    await expect(connectDB()).rejects.toThrow('Connection failed');

    expect(consoleErrorSpy).toHaveBeenCalledWith(`Error: ${connectionError.message}`);
  });
});