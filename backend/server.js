const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config()

const { errorHandler } = require('./middleware/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/todos', require('./routes/todoRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

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

    