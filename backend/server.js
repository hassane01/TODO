const express = require('express');
const cors = require('cors');
const path = require('path');
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

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
  // Set the build folder for our static assets
  app.use(express.static(path.join(__dirname, '../frontend/dist')));

  // API routes must be defined before the catch-all route
  app.use('/api/todos', require('./routes/todoRoutes'));
  app.use('/api/users', authLimiter, require('./routes/userRoutes'));

  // For all other GET requests that are not for our API,
  // send them to the frontend's index.html file.
  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, '../', 'frontend', 'dist', 'index.html'))
  );
} else {
  // In development, just define the API routes
  app.use('/api/todos', require('./routes/todoRoutes'));
  app.use('/api/users', authLimiter, require('./routes/userRoutes'));
}

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