require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const PORT = 7000;

//routes
const userRoutes = require('./routes/userRoutes.js');
const adminRoutes = require('./routes/adminRoutes.js');

//middlewares
app.use(morgan('dev'))
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173', // allow requests from this origin
    credentials: true, // allow credentials to be sent with the request
}));

//database connection
mongoose.set("strictQuery", false);
mongoose.connect("mongodb://127.0.0.1:27017/querix");

//routing
app.use('/', userRoutes);
app.use('/admin', adminRoutes);

//server listen
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));