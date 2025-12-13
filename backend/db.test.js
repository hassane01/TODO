const mongoose = require('mongoose');
const connectDB = require('./config/db');

jest.mock('mongoose');

describe('Database Connection', () => {
  let originalEnv;
  let consoleErrorSpy;
  let processExitSpy;

  beforeEach(() => {
    originalEnv = { ...process.env };
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    processExitSpy = jest.spyOn(process, 'exit').mockImplementation(() => {});
  });

  afterEach(() => {
    process.env = originalEnv;
    jest.restoreAllMocks();
  });

  it('should throw an error and exit if no DB URI is provided', async () => {
    delete process.env.MONGO_URI_TEST; // Ensure URI is missing
    process.env.NODE_ENV = 'test';

    await connectDB();

    expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringContaining('Database URI not found'));
    expect(processExitSpy).toHaveBeenCalledWith(1);
  });

  it('should log an error and exit if mongoose connection fails', async () => {
    const connectionError = new Error('Connection failed');
    mongoose.connect.mockRejectedValue(connectionError);

    await connectDB();

    expect(consoleErrorSpy).toHaveBeenCalledWith(`Error: ${connectionError.message}`);
    expect(processExitSpy).toHaveBeenCalledWith(1);
  });
});