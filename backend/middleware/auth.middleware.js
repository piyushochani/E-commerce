const jwt = require('jsonwebtoken');
const Customer = require('../models/Customer.model');
const Seller = require('../models/Seller.model');

// Authenticate Customer
exports.authenticateCustomer = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ 
        success: false,
        message: 'No token provided, authorization denied' 
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded.customerId) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid token format' 
      });
    }

    // Check if customer exists and is not blocked
    const customer = await Customer.findById(decoded.customerId).select('blocked blocked_reason');
    
    if (!customer) {
      return res.status(404).json({ 
        success: false,
        message: 'Customer not found' 
      });
    }

    if (customer.blocked === 'yes') {
      return res.status(403).json({ 
        success: false,
        message: 'Your account has been blocked. Please contact admin.',
        blocked_reason: customer.blocked_reason 
      });
    }

    // Add customer ID to request
    req.customerId = decoded.customerId;
    req.email = decoded.email;

    next();
  } catch (error) {
    console.error('Customer Auth Error:', error);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false,
        message: 'Token has expired' 
      });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid token' 
      });
    }
    if (error.name === 'CastError') {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid token data' 
      });
    }
    
    res.status(401).json({ 
      success: false,
      message: 'Token verification failed', 
      error: error.message 
    });
  }
};

// Authenticate Seller
exports.authenticateSeller = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ 
        success: false,
        message: 'No token provided, authorization denied' 
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded.sellerId) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid token format' 
      });
    }

    // Check if seller exists and is not blocked
    const seller = await Seller.findById(decoded.sellerId).select('blocked blocked_reason');
    
    if (!seller) {
      return res.status(404).json({ 
        success: false,
        message: 'Seller not found' 
      });
    }

    if (seller.blocked === 'yes') {
      return res.status(403).json({ 
        success: false,
        message: 'Your account has been blocked. Please contact admin.',
        blocked_reason: seller.blocked_reason 
      });
    }

    // Add seller ID to request
    req.sellerId = decoded.sellerId;
    req.email = decoded.email;

    next();
  } catch (error) {
    console.error('Seller Auth Error:', error);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false,
        message: 'Token has expired' 
      });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid token' 
      });
    }
    if (error.name === 'CastError') {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid token data' 
      });
    }
    
    res.status(401).json({ 
      success: false,
      message: 'Token verification failed', 
      error: error.message 
    });
  }
};