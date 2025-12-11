const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config()

const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorHandler');

// Connect to database
connectDB();

const app = express();

// Set security HTTP headers
app.use(helmet());

app.use(cors());
app.use(express.json());

// Rate limiting to prevent brute-force attacks
const authLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 20, // Limit each IP to 20 requests per window
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

app.use('/api/todos', require('./routes/todoRoutes'));
app.use('/api/users', authLimiter, require('./routes/userRoutes'));

app.use(errorHandler);

// We only want the server to listen when not in a test environment
// The database connection is now handled by connectDB
if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () =>
    console.log(`Server running on port ${PORT}`)
  );
}

module.exports = app; // Export the app for supertest