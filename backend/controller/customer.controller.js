const Customer = require('../models/customer.model');
const Cart = require('../models/cart.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register a new customer
exports.registerCustomer = async (req, res) => {
  try {
    const { customer_name, customer_address, customer_gender, customer_DOB, customer_email, customer_phone, customer_password } = req.body;

    // Check if customer already exists
    const existingCustomer = await Customer.findOne({ customer_email });
    if (existingCustomer) {
      return res.status(400).json({ message: 'Customer already exists with this email' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(customer_password, 10);

    // Create customer
    const customer = await Customer.create({
      customer_name,
      customer_address,
      customer_gender,
      customer_DOB,
      customer_email,
      customer_phone,
      customer_password: hashedPassword
    });

    // Create cart for customer
    const cart = await Cart.create({
      customer_id: customer._id,
      cart_total_amount: 0,
      cart_quantity: 0
    });

    // Link cart to customer
    customer.cart_id = cart._id;
    await customer.save();

    res.status(201).json({
      message: 'Customer registered successfully',
      customer: {
        id: customer._id,
        name: customer.customer_name,
        email: customer.customer_email
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error registering customer', error: error.message });
  }
};

// Login customer
exports.loginCustomer = async (req, res) => {
  try {
    const { customer_email, customer_password } = req.body;

    // Find customer
    const customer = await Customer.findOne({ customer_email });
    if (!customer) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(customer_password, customer.customer_password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { customerId: customer._id, email: customer.customer_email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      customer: {
        id: customer._id,
        name: customer.customer_name,
        email: customer.customer_email
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
};

// Get customer profile
exports.getCustomerProfile = async (req, res) => {
  try {
    const customer = await Customer.findById(req.customerId)
      .select('-customer_password')
      .populate('cart_id');

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    res.status(200).json({ customer });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile', error: error.message });
  }
};

// Update customer profile
exports.updateCustomerProfile = async (req, res) => {
  try {
    const { customer_name, customer_address, customer_phone } = req.body;

    const customer = await Customer.findByIdAndUpdate(
      req.customerId,
      { customer_name, customer_address, customer_phone },
      { new: true, runValidators: true }
    ).select('-customer_password');

    res.status(200).json({ message: 'Profile updated successfully', customer });
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
};

// Delete customer account
exports.deleteCustomer = async (req, res) => {
  try {
    await Customer.findByIdAndDelete(req.customerId);
    res.status(200).json({ message: 'Customer account deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting account', error: error.message });
  }
};