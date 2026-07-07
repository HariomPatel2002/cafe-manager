const express = require('express');
const cors = require('cors');

const connection = require('./connection');
const userRoutes = require('./routes/user.routes');
const categoryRoutes = require('./routes/category.routes');
const productRoutes = require('./routes/product.routes');
const billRoutes = require('./routes/bill.routes');
const dashboard = require('./routes/dashboard');

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/user', userRoutes);
app.use('/category', categoryRoutes);
app.use('/product', productRoutes);
app.use('/bill', billRoutes);
app.use('/dashboard',dashboard);

module.exports = app;