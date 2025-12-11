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
    process.exit(1);
  }
};

module.exports = connectDB;
