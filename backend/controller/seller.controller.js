const Seller = require('../models/Seller.model');
const SellerOTP = require('../models/sellerotp.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendSellerOTP } = require('../utils/email');

// Generate random 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Step 1: Request OTP for seller registration
exports.requestSellerRegistrationOTP = async (req, res) => {
  try {
    const { seller_name, seller_address, seller_company, seller_email, seller_phone, seller_password } = req.body;

    // Check if seller already exists
    const existingSeller = await Seller.findOne({ seller_email });
    if (existingSeller) {
      return res.status(400).json({ 
        success: false,
        message: 'Seller already exists with this email' 
      });
    }

    // Generate OTP
    const otp = generateOTP();

    // Delete any existing unverified OTPs for this email
    await SellerOTP.deleteMany({ 
      seller_email, 
      otp_type: 'registration',
      verified: false 
    });

    // Save new OTP to database
    await SellerOTP.create({
      seller_email,
      otp,
      otp_type: 'registration',
      expires_at: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
    });

    // Send OTP email to admin (ochanipiyush07@gmail.com)
    await sendSellerOTP(seller_name, seller_email, otp);

    res.status(200).json({
      success: true,
      message: `OTP has been sent to admin email (${process.env.ADMIN_EMAIL}). Please contact admin to get the OTP.`,
      data: {
        seller_email,
        admin_email: process.env.ADMIN_EMAIL,
        otp_valid_for: '10 minutes'
      }
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
    const { seller_name, seller_address, seller_company, seller_email, seller_phone, seller_password, otp } = req.body;

    // Find valid OTP
    const otpRecord = await SellerOTP.findOne({
      seller_email,
      otp,
      otp_type: 'registration',
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
    const hashedPassword = await bcrypt.hash(seller_password, 10);

    // Create seller
    const seller = await Seller.create({
      seller_name,
      seller_address,
      seller_company,
      seller_email,
      seller_phone,
      seller_password: hashedPassword
    });

    // Mark OTP as verified
    otpRecord.verified = true;
    await otpRecord.save();

    // Generate JWT token
    const token = jwt.sign(
      { sellerId: seller._id, email: seller.seller_email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'Seller registered successfully! You can now login.',
      token,
      seller: {
        id: seller._id,
        name: seller.seller_name,
        email: seller.seller_email,
        company: seller.seller_company,
        phone: seller.seller_phone
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

// Login seller (Email + Password, NO OTP)
exports.loginSeller = async (req, res) => {
  try {
    const { seller_email, seller_password } = req.body;

    // Find seller
    const seller = await Seller.findOne({ seller_email });
    if (!seller) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid email or password' 
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(seller_password, seller.seller_password);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid email or password' 
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { sellerId: seller._id, email: seller.seller_email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      seller: {
        id: seller._id,
        name: seller.seller_name,
        email: seller.seller_email,
        company: seller.seller_company,
        phone: seller.seller_phone
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

// Get seller profile
exports.getSellerProfile = async (req, res) => {
  try {
    const seller = await Seller.findById(req.sellerId).select('-seller_password');

    if (!seller) {
      return res.status(404).json({ 
        success: false,
        message: 'Seller not found' 
      });
    }

    res.status(200).json({ 
      success: true,
      seller 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Error fetching profile', 
      error: error.message 
    });
  }
};

// Update seller profile
exports.updateSellerProfile = async (req, res) => {
  try {
    const { seller_name, seller_address, seller_company, seller_phone } = req.body;

    const seller = await Seller.findByIdAndUpdate(
      req.sellerId,
      { seller_name, seller_address, seller_company, seller_phone },
      { new: true, runValidators: true }
    ).select('-seller_password');

    res.status(200).json({ 
      success: true,
      message: 'Profile updated successfully', 
      seller 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Error updating profile', 
      error: error.message 
    });
  }
};

// Delete seller account
exports.deleteSeller = async (req, res) => {
  try {
    await Seller.findByIdAndDelete(req.sellerId);
    res.status(200).json({ 
      success: true,
      message: 'Seller account deleted successfully' 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Error deleting account', 
      error: error.message 
    });
  }
};

// Get all sellers
exports.getAllSellers = async (req, res) => {
  try {
    const sellers = await Seller.find().select('-seller_password');
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