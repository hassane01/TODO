const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config()

const { errorHandler } = require('./middleware/errorHandler');

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

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
    .then(()=>{
        app.listen(PORT ,()=> console.log(`Server running on port ${PORT} and connected to MongoDB`));
    })
    .catch((eror)=>{
        console.error('MongoDB connection error:', eror);
        process.exit(1); // Exit process with failure
    })

    