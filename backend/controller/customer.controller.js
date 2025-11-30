const Customer = require('../models/Customer.model');
const Cart = require('../models/Cart.model');
const OTP = require('../models/otp.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendEmailVerificationOTP, sendForgotPasswordOTP } = require('../utils/email');

// Generate random 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Step 1: Request OTP for registration (Email Verification)
exports.requestRegistrationOTP = async (req, res) => {
  try {
    const { customer_name, customer_email, customer_phone } = req.body;

    // Check if customer already exists
    const existingCustomer = await Customer.findOne({ 
      $or: [{ customer_email }, { customer_phone }] 
    });
    
    if (existingCustomer) {
      return res.status(400).json({ 
        success: false,
        message: 'Customer already exists with this email or phone number' 
      });
    }

    // Generate OTP
    const otp = generateOTP();

    // Delete any existing unverified OTPs for this email
    await OTP.deleteMany({ 
      email: customer_email, 
      user_type: 'customer',
      otp_type: 'email_verification',
      verified: false 
    });

    // Save new OTP to database
    await OTP.create({
      email: customer_email,
      phone: customer_phone,
      otp,
      otp_type: 'email_verification',
      user_type: 'customer',
      expires_at: new Date(Date.now() + 10 * 60 * 1000)
    });

    // Send OTP email
    await sendEmailVerificationOTP(customer_name, customer_email, otp, 'customer');

    res.status(200).json({
      success: true,
      message: 'OTP sent to your email. Please verify to complete registration.',
      email: customer_email
    });
  } catch (error) {
    console.error('Error requesting OTP:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error requesting OTP', 
      error: error.message 
    });
  }
};

// Step 2: Verify OTP and complete registration
exports.verifyOTPAndRegister = async (req, res) => {
  try {
    const { customer_name, customer_address, customer_gender, customer_DOB, customer_email, customer_phone, customer_password, otp } = req.body;

    // Find valid OTP
    const otpRecord = await OTP.findOne({
      email: customer_email,
      otp,
      otp_type: 'email_verification',
      user_type: 'customer',
      verified: false,
      expires_at: { $gt: new Date() }
    });

    if (!otpRecord) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid or expired OTP. Please request a new OTP.' 
      });
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
      customer_password: hashedPassword,
      email_verified: true,
      phone_verified: true
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

    // Mark OTP as verified
    otpRecord.verified = true;
    await otpRecord.save();

    // Generate JWT token
    const token = jwt.sign(
      { customerId: customer._id, email: customer.customer_email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'Customer registered successfully!',
      token,
      customer: {
        id: customer._id,
        name: customer.customer_name,
        email: customer.customer_email,
        phone: customer.customer_phone
      }
    });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error verifying OTP', 
      error: error.message 
    });
  }
};

// Login customer
exports.loginCustomer = async (req, res) => {
  try {
    const { customer_email, customer_password } = req.body;

    // Find customer
    const customer = await Customer.findOne({ customer_email });
    if (!customer) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid email or password' 
      });
    }

    // Check if customer is blocked
    if (customer.blocked === 'yes') {
      return res.status(403).json({
        success: false,
        message: 'Your account has been blocked. Please contact admin.',
        blocked_reason: customer.blocked_reason,
        blocked_at: customer.blocked_at
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(customer_password, customer.customer_password);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid email or password' 
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { customerId: customer._id, email: customer.customer_email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      customer: {
        id: customer._id,
        name: customer.customer_name,
        email: customer.customer_email,
        phone: customer.customer_phone
      }
    });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error logging in', 
      error: error.message 
    });
  }
};

// Step 1: Request Forgot Password OTP
exports.requestForgotPasswordOTP = async (req, res) => {
  try {
    const { customer_email } = req.body;

    // Find customer
    const customer = await Customer.findOne({ customer_email });
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'No account found with this email'
      });
    }

    // Check if customer is blocked
    if (customer.blocked === 'yes') {
      return res.status(403).json({
        success: false,
        message: 'Your account has been blocked. Please contact admin.'
      });
    }

    // Generate OTP
    const otp = generateOTP();

    // Delete any existing forgot password OTPs
    await OTP.deleteMany({
      email: customer_email,
      user_type: 'customer',
      otp_type: 'forgot_password',
      verified: false
    });

    // Save new OTP
    await OTP.create({
      email: customer_email,
      otp,
      otp_type: 'forgot_password',
      user_type: 'customer',
      expires_at: new Date(Date.now() + 10 * 60 * 1000)
    });

    // Send OTP email
    await sendForgotPasswordOTP(customer.customer_name, customer_email, otp);

    res.status(200).json({
      success: true,
      message: 'Password reset OTP sent to your email',
      email: customer_email
    });
  } catch (error) {
    console.error('Error requesting forgot password OTP:', error);
    res.status(500).json({
      success: false,
      message: 'Error requesting OTP',
      error: error.message
    });
  }
};

// Step 2: Verify OTP and Reset Password
exports.resetPassword = async (req, res) => {
  try {
    const { customer_email, otp, new_password } = req.body;

    // Find valid OTP
    const otpRecord = await OTP.findOne({
      email: customer_email,
      otp,
      otp_type: 'forgot_password',
      user_type: 'customer',
      verified: false,
      expires_at: { $gt: new Date() }
    });

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP'
      });
    }

    // Find customer
    const customer = await Customer.findOne({ customer_email });
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(new_password, 10);

    // Update password
    customer.customer_password = hashedPassword;
    await customer.save();

    // Mark OTP as verified
    otpRecord.verified = true;
    await otpRecord.save();

    res.status(200).json({
      success: true,
      message: 'Password reset successful. You can now login with your new password.'
    });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({
      success: false,
      message: 'Error resetting password',
      error: error.message
    });
  }
};

// Get customer profile
exports.getCustomerProfile = async (req, res) => {
  try {
    const customer = await Customer.findById(req.customerId)
      .select('-customer_password')
      .populate('cart_id');

    if (!customer) {
      return res.status(404).json({ 
        success: false,
        message: 'Customer not found' 
      });
    }

    // Check if blocked
    if (customer.blocked === 'yes') {
      return res.status(403).json({
        success: false,
        message: 'Your account has been blocked',
        blocked_reason: customer.blocked_reason
      });
    }

    res.status(200).json({ 
      success: true,
      customer 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Error fetching profile', 
      error: error.message 
    });
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

    res.status(200).json({ 
      success: true,
      message: 'Profile updated successfully', 
      customer 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Error updating profile', 
      error: error.message 
    });
  }
};

// Delete customer account
exports.deleteCustomer = async (req, res) => {
  try {
    await Customer.findByIdAndDelete(req.customerId);
    res.status(200).json({ 
      success: true,
      message: 'Customer account deleted successfully' 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Error deleting account', 
      error: error.message 
    });
  }
};