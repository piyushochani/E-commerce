const dotenv = require('dotenv');
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./database/mongodb_connect');

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ===================
//      ROUTES
// ===================

// Customer routes
const customerRoutes = require('./routes/customer.routes');
app.use('/api/customer', customerRoutes);

// Seller routes
const sellerRoutes = require('./routes/seller.routes');
app.use('/api/seller', sellerRoutes);

// Product routes
const productRoutes = require('./routes/product.routes');
app.use('/api/product', productRoutes);

// Cart routes
const cartRoutes = require('./routes/cart.routes');
app.use('/api/cart', cartRoutes);

// Order routes
const orderRoutes = require('./routes/order.routes');
app.use('/api/order', orderRoutes);

// Test Route
app.get('/', (req, res) => {
  res.json({ message: 'E-Commerce API is running...' });
});

// =====================
//  GLOBAL ERROR HANDLER
// =====================
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// =====================
//  START SERVER
// =====================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`-----------------------------------`);
  console.log(`Server Running On Port: ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`-----------------------------------`);
});
