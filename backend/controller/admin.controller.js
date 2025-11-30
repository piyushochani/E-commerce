const Customer = require('../models/customer.model');
const Seller = require('../models/Seller.model');
const Product = require('../models/product.model');
const Order = require('../models/Order.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Admin Login
exports.adminLogin = async (req, res) => {
  try {
    const { admin_email, admin_password } = req.body;

    // Check admin credentials
    if (admin_email !== process.env.ADMIN_EMAIL || admin_password !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({
        success: false,
        message: 'Invalid admin credentials'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        adminEmail: admin_email,
        role: 'admin',
        name: process.env.ADMIN_NAME
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      success: true,
      message: 'Admin login successful',
      token,
      admin: {
        name: process.env.ADMIN_NAME,
        email: process.env.ADMIN_EMAIL,
        phone: process.env.ADMIN_PHONE
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error logging in',
      error: error.message
    });
  }
};

// Get Dashboard Stats (excluding blocked users)
exports.getDashboardStats = async (req, res) => {
  try {
    const totalCustomers = await Customer.countDocuments({ blocked: 'no' });
    const totalSellers = await Seller.countDocuments({ blocked: 'no' });
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();

    const blockedCustomers = await Customer.countDocuments({ blocked: 'yes' });
    const blockedSellers = await Seller.countDocuments({ blocked: 'yes' });

    const totalRevenue = await Order.aggregate([
      { $match: { order_status: { $in: ['delivered', 'shipped'] } } },
      { $group: { _id: null, total: { $sum: '$order_total_amount' } } }
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalCustomers,
        totalSellers,
        totalProducts,
        totalOrders,
        totalRevenue: totalRevenue[0]?.total || 0,
        blockedCustomers,
        blockedSellers
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching stats',
      error: error.message
    });
  }
};

// Get All Customers (excluding blocked by default)
exports.getAllCustomers = async (req, res) => {
  try {
    const { includeBlocked } = req.query;
    const filter = includeBlocked === 'true' ? {} : { blocked: 'no' };

    const customers = await Customer.find(filter)
      .select('-customer_password')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: customers.length,
      customers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching customers',
      error: error.message
    });
  }
};

// Get All Sellers (excluding blocked by default)
exports.getAllSellers = async (req, res) => {
  try {
    const { includeBlocked } = req.query;
    const filter = includeBlocked === 'true' ? {} : { blocked: 'no' };

    const sellers = await Seller.find(filter)
      .select('-seller_password')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: sellers.length,
      sellers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching sellers',
      error: error.message
    });
  }
};

// Blacklist Customer
exports.blacklistCustomer = async (req, res) => {
  try {
    const { customer_id } = req.params;
    const { reason } = req.body;

    const customer = await Customer.findByIdAndUpdate(
      customer_id,
      {
        blocked: 'yes',
        blocked_reason: reason || 'No reason provided',
        blocked_at: new Date(),
        blocked_by: req.adminEmail
      },
      { new: true }
    ).select('-customer_password');

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Customer blacklisted successfully',
      customer
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error blacklisting customer',
      error: error.message
    });
  }
};

// Unblock Customer
exports.unblockCustomer = async (req, res) => {
  try {
    const { customer_id } = req.params;

    const customer = await Customer.findByIdAndUpdate(
      customer_id,
      {
        blocked: 'no',
        blocked_reason: null,
        blocked_at: null,
        blocked_by: null
      },
      { new: true }
    ).select('-customer_password');

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Customer unblocked successfully',
      customer
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error unblocking customer',
      error: error.message
    });
  }
};

// Blacklist Seller
exports.blacklistSeller = async (req, res) => {
  try {
    const { seller_id } = req.params;
    const { reason } = req.body;

    const seller = await Seller.findByIdAndUpdate(
      seller_id,
      {
        blocked: 'yes',
        blocked_reason: reason || 'No reason provided',
        blocked_at: new Date(),
        blocked_by: req.adminEmail
      },
      { new: true }
    ).select('-seller_password');

    if (!seller) {
      return res.status(404).json({
        success: false,
        message: 'Seller not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Seller blacklisted successfully',
      seller
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error blacklisting seller',
      error: error.message
    });
  }
};

// Unblock Seller
exports.unblockSeller = async (req, res) => {
  try {
    const { seller_id } = req.params;

    const seller = await Seller.findByIdAndUpdate(
      seller_id,
      {
        blocked: 'no',
        blocked_reason: null,
        blocked_at: null,
        blocked_by: null
      },
      { new: true }
    ).select('-seller_password');

    if (!seller) {
      return res.status(404).json({
        success: false,
        message: 'Seller not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Seller unblocked successfully',
      seller
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error unblocking seller',
      error: error.message
    });
  }
};

// Get Blocked Users
exports.getBlockedUsers = async (req, res) => {
  try {
    const blockedCustomers = await Customer.find({ blocked: 'yes' })
      .select('-customer_password')
      .sort({ blocked_at: -1 });

    const blockedSellers = await Seller.find({ blocked: 'yes' })
      .select('-seller_password')
      .sort({ blocked_at: -1 });

    res.status(200).json({
      success: true,
      blockedCustomers: {
        count: blockedCustomers.length,
        data: blockedCustomers
      },
      blockedSellers: {
        count: blockedSellers.length,
        data: blockedSellers
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching blocked users',
      error: error.message
    });
  }
};