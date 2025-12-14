const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Use a different database for testing
    const dbURI =
      process.env.NODE_ENV === 'test'
        ? process.env.MONGO_URI_TEST
        : process.env.MONGO_URI;

    if (!dbURI) {
      throw new Error('Database URI not found. Please set MONGO_URI or MONGO_URI_TEST in your .env file.');
    }

    const conn = await mongoose.connect(dbURI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    // In a test environment, we should throw the error to allow the test suite to fail gracefully.
    // In other environments, exiting the process is a valid "fail-fast" strategy.
    if (process.env.NODE_ENV !== 'test') {
      process.exit(1);
    } else {
      throw error; // Re-throw the error in test environment
    }
  }
};

module.exports = connectDB;
