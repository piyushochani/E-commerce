// FILE: server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

// Import routes
const routes = require('./routes/index');

// Import middleware
const { errorHandler, notFound } = require('./middleware/error.middleware');
const { requestLogger } = require('./middleware/logger.middleware');

// Initialize express app
const app = express();

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(requestLogger); // Log all requests

// Serve static files (uploaded images)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check route
app.get('/', (req, res) => {
  res.json({
    message: 'E-Commerce API is running!',
    version: '1.0.0',
    endpoints: {
      customers: '/api/customers',
      sellers: '/api/sellers',
      products: '/api/products',
      cart: '/api/cart',
      orders: '/api/orders'
    }
  });
});

// API routes
app.use('/api', routes);

// Error handling middleware (must be after routes)
app.use(notFound); // 404 handler
app.use(errorHandler); // Global error handler

// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1); // Exit process with failure
  }
};

// Connect to database
connectDB();

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📍 API URL: http://localhost:${PORT}/api`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err.message);
  process.exit(1);
});