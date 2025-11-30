const Seller = require('../models/Seller.model');
const OTP = require('../models/otp.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendEmailVerificationOTP, sendForgotPasswordOTP, sendSellerOTP } = require('../utils/email');

// Generate random 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Step 1: Request OTP for email verification
exports.requestEmailVerificationOTP = async (req, res) => {
  try {
    const { seller_name, seller_email, seller_phone } = req.body;

    // Check if seller already exists
    const existingSeller = await Seller.findOne({ 
      $or: [{ seller_email }, { seller_phone }] 
    });
    
    if (existingSeller) {
      return res.status(400).json({ 
        success: false,
        message: 'Seller already exists with this email or phone number' 
      });
    }

    // Generate OTP
    const otp = generateOTP();

    // Delete any existing unverified OTPs
    await OTP.deleteMany({ 
      email: seller_email, 
      user_type: 'seller',
      otp_type: 'email_verification',
      verified: false 
    });

    // Save new OTP
    await OTP.create({
      email: seller_email,
      phone: seller_phone,
      otp,
      otp_type: 'email_verification',
      user_type: 'seller',
      expires_at: new Date(Date.now() + 10 * 60 * 1000)
    });

    // Send OTP email
    await sendEmailVerificationOTP(seller_name, seller_email, otp, 'seller');

    res.status(200).json({
      success: true,
      message: 'OTP sent to your email. Please verify to proceed.',
      email: seller_email
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

// Step 2: Verify email OTP and request admin approval OTP
exports.verifyEmailAndRequestAdminOTP = async (req, res) => {
  try {
    const { seller_name, seller_email, otp } = req.body;

    // Find valid OTP
    const otpRecord = await OTP.findOne({
      email: seller_email,
      otp,
      otp_type: 'email_verification',
      user_type: 'seller',
      verified: false,
      expires_at: { $gt: new Date() }
    });

    if (!otpRecord) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid or expired OTP' 
      });
    }

    // Mark email OTP as verified
    otpRecord.verified = true;
    await otpRecord.save();

    // Generate admin approval OTP
    const adminOTP = generateOTP();

    // Save admin approval OTP
    await OTP.create({
      email: seller_email,
      otp: adminOTP,
      otp_type: 'seller_registration',
      user_type: 'seller',
      expires_at: new Date(Date.now() + 10 * 60 * 1000)
    });

    // Send OTP to admin
    await sendSellerOTP(seller_name, seller_email, adminOTP);

    res.status(200).json({
      success: true,
      message: 'Email verified! Admin approval OTP has been sent to admin. Please contact admin to get the OTP.',
      admin_email: process.env.ADMIN_EMAIL
    });
  } catch (error) {
    console.error('Error verifying email:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error verifying email', 
      error: error.message 
    });
  }
};

// Step 3: Verify admin OTP and complete registration
exports.verifyAdminOTPAndRegister = async (req, res) => {
  try {
    const { seller_name, seller_address, seller_company, seller_email, seller_phone, seller_password, admin_otp } = req.body;

    // Find valid admin OTP
    const otpRecord = await OTP.findOne({
      email: seller_email,
      otp: admin_otp,
      otp_type: 'seller_registration',
      user_type: 'seller',
      verified: false,
      expires_at: { $gt: new Date() }
    });

    if (!otpRecord) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid or expired admin OTP' 
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
      seller_password: hashedPassword,
      email_verified: true,
      phone_verified: true
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
      message: 'Seller registered successfully!',
      token,
      seller: {
        id: seller._id,
        name: seller.seller_name,
        email: seller.seller_email,
        company: seller.seller_company
      }
    });
  } catch (error) {
    console.error('Error completing registration:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error completing registration', 
      error: error.message 
    });
  }
};

// Login seller
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

    // Check if seller is blocked
    if (seller.blocked === 'yes') {
      return res.status(403).json({
        success: false,
        message: 'Your account has been blocked. Please contact admin.',
        blocked_reason: seller.blocked_reason,
        blocked_at: seller.blocked_at
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
        company: seller.seller_company
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
    const { seller_email } = req.body;

    // Find seller
    const seller = await Seller.findOne({ seller_email });
    if (!seller) {
      return res.status(404).json({
        success: false,
        message: 'No account found with this email'
      });
    }

    // Check if seller is blocked
    if (seller.blocked === 'yes') {
      return res.status(403).json({
        success: false,
        message: 'Your account has been blocked. Please contact admin.'
      });
    }

    // Generate OTP
    const otp = generateOTP();

    // Delete any existing forgot password OTPs
    await OTP.deleteMany({
      email: seller_email,
      user_type: 'seller',
      otp_type: 'forgot_password',
      verified: false
    });

    // Save new OTP
    await OTP.create({
      email: seller_email,
      otp,
      otp_type: 'forgot_password',
      user_type: 'seller',
      expires_at: new Date(Date.now() + 10 * 60 * 1000)
    });

    // Send OTP email
    await sendForgotPasswordOTP(seller.seller_name, seller_email, otp);

    res.status(200).json({
      success: true,
      message: 'Password reset OTP sent to your email',
      email: seller_email
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
    const { seller_email, otp, new_password } = req.body;

    // Find valid OTP
    const otpRecord = await OTP.findOne({
      email: seller_email,
      otp,
      otp_type: 'forgot_password',
      user_type: 'seller',
      verified: false,
      expires_at: { $gt: new Date() }
    });

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP'
      });
    }

    // Find seller
    const seller = await Seller.findOne({ seller_email });
    if (!seller) {
      return res.status(404).json({
        success: false,
        message: 'Seller not found'
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(new_password, 10);

    // Update password
    seller.seller_password = hashedPassword;
    await seller.save();

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

    // Check if blocked
    if (seller.blocked === 'yes') {
      return res.status(403).json({
        success: false,
        message: 'Your account has been blocked',
        blocked_reason: seller.blocked_reason
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

// Get all sellers (public - excluding blocked)
exports.getAllSellers = async (req, res) => {
  try {
    const sellers = await Seller.find({ blocked: 'no' }).select('-seller_password');
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