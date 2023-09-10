require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const PORT = process.env.PORT;
const dbUrl = process.env.DATABASE;
const allowedOrigin = process.env.ORIGIN;


//routes
const userRoutes = require('./routes/userRoutes.js');
const adminRoutes = require('./routes/adminRoutes.js');

//middlewares
app.use(morgan('dev'))
app.use(express.json());

app.use(cors({
  origin: allowedOrigin,
  credentials: true,
}));

//database connection
mongoose.connect(`${dbUrl}/querix`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch(error => {
        console.error('Error connecting to MongoDB:', error);
    });

//routing
app.use('/', userRoutes);
app.use('/admin', adminRoutes);

//server listen
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));