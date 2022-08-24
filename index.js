require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const connection = require('./db');
const userRoutes = require('./routes/users');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth');
const carRoutes = require('./routes/cars');

// database connection
connection();

// middlewares
app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));
app.use(cors({
    origin: ['http://localhost:3000'],
    credentials: true,
}));

// routes
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/cars', carRoutes);

const port = process.env.PORT || 8080;
app.listen(port, console.log(`Listening on port ${port}...`));
