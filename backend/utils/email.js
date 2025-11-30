const nodemailer = require('nodemailer');

// Create Gmail transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
};

// Send Email Verification OTP
exports.sendEmailVerificationOTP = async (name, email, otp, userType) => {
  const transporter = createTransporter();
  
  const mailOptions = {
    from: `"E-Commerce Platform" <${process.env.EMAIL_FROM}>`,
    to: email,
    subject: '🔐 Verify Your Email - OTP Code',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; background-color: #f5f5f5; margin: 0; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); overflow: hidden; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
          .content { padding: 30px; }
          .otp-box { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px; margin: 25px 0; }
          .otp-code { font-size: 42px; font-weight: bold; letter-spacing: 8px; margin: 10px 0; font-family: monospace; }
          .footer { background-color: #f8f9fa; padding: 20px; text-align: center; color: #6c757d; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ Email Verification</h1>
          </div>
          <div class="content">
            <p style="font-size: 16px; color: #333;">Hello ${name},</p>
            <p style="color: #666;">Thank you for registering as a ${userType}! Please verify your email address using the OTP below:</p>
            <div class="otp-box">
              <p style="margin: 0; font-size: 14px; opacity: 0.9;">VERIFICATION CODE</p>
              <div class="otp-code">${otp}</div>
              <p style="margin: 0; font-size: 12px; opacity: 0.8;">Valid for 10 minutes</p>
            </div>
            <p style="color: #666;">If you didn't request this, please ignore this email.</p>
          </div>
          <div class="footer">
            <p>© 2024 E-Commerce Platform. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('✅ Email verification OTP sent to:', email);
    return { success: true };
  } catch (error) {
    console.error('❌ Email sending error:', error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

// Send Forgot Password OTP
exports.sendForgotPasswordOTP = async (name, email, otp) => {
  const transporter = createTransporter();
  
  const mailOptions = {
    from: `"E-Commerce Platform" <${process.env.EMAIL_FROM}>`,
    to: email,
    subject: '🔑 Reset Your Password - OTP Code',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; background-color: #f5f5f5; margin: 0; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); overflow: hidden; }
          .header { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 30px; text-align: center; }
          .content { padding: 30px; }
          .otp-box { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 30px; text-align: center; border-radius: 10px; margin: 25px 0; }
          .otp-code { font-size: 42px; font-weight: bold; letter-spacing: 8px; margin: 10px 0; font-family: monospace; }
          .footer { background-color: #f8f9fa; padding: 20px; text-align: center; color: #6c757d; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔑 Password Reset Request</h1>
          </div>
          <div class="content">
            <p style="font-size: 16px; color: #333;">Hello ${name},</p>
            <p style="color: #666;">We received a request to reset your password. Use the OTP below to proceed:</p>
            <div class="otp-box">
              <p style="margin: 0; font-size: 14px; opacity: 0.9;">RESET CODE</p>
              <div class="otp-code">${otp}</div>
              <p style="margin: 0; font-size: 12px; opacity: 0.8;">Valid for 10 minutes</p>
            </div>
            <p style="color: #666;">If you didn't request this, please ignore this email and your password will remain unchanged.</p>
          </div>
          <div class="footer">
            <p>© 2024 E-Commerce Platform. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('✅ Forgot password OTP sent to:', email);
    return { success: true };
  } catch (error) {
    console.error('❌ Email sending error:', error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

// Send Seller Registration OTP to Admin
exports.sendSellerOTP = async (sellerName, sellerEmail, otp) => {
  const transporter = createTransporter();
  
  const mailOptions = {
    from: `"E-Commerce Platform" <${process.env.EMAIL_FROM}>`,
    to: process.env.ADMIN_EMAIL,
    subject: '🔐 New Seller Registration - OTP Required',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; background-color: #f5f5f5; margin: 0; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); overflow: hidden; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
          .content { padding: 30px; }
          .info-box { background-color: #f8f9fa; border-left: 4px solid #667eea; padding: 15px; margin: 20px 0; border-radius: 5px; }
          .otp-box { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px; margin: 25px 0; }
          .otp-code { font-size: 42px; font-weight: bold; letter-spacing: 8px; margin: 10px 0; font-family: monospace; }
          .footer { background-color: #f8f9fa; padding: 20px; text-align: center; color: #6c757d; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 New Seller Registration</h1>
          </div>
          <div class="content">
            <p style="font-size: 16px; color: #333;">Hello Admin,</p>
            <p style="color: #666;">A new seller is requesting to register:</p>
            <div class="info-box">
              <p style="margin: 8px 0;"><strong>Seller Name:</strong> ${sellerName}</p>
              <p style="margin: 8px 0;"><strong>Seller Email:</strong> ${sellerEmail}</p>
            </div>
            <p style="font-size: 16px; color: #333;">Please share this OTP with the seller:</p>
            <div class="otp-box">
              <p style="margin: 0; font-size: 14px; opacity: 0.9;">VERIFICATION CODE</p>
              <div class="otp-code">${otp}</div>
              <p style="margin: 0; font-size: 12px; opacity: 0.8;">Valid for 10 minutes</p>
            </div>
          </div>
          <div class="footer">
            <p>© 2024 E-Commerce Platform. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('✅ Seller registration OTP sent to admin');
    return { success: true };
  } catch (error) {
    console.error('❌ Email sending error:', error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

// Send Product Creation OTP to Admin
exports.sendProductCreationOTP = async (sellerName, productName, otp) => {
  const transporter = createTransporter();
  
  const mailOptions = {
    from: `"E-Commerce Platform" <${process.env.EMAIL_FROM}>`,
    to: process.env.ADMIN_EMAIL,
    subject: '📦 New Product Creation - OTP Required',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; background-color: #f5f5f5; margin: 0; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); overflow: hidden; }
          .header { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 30px; text-align: center; }
          .content { padding: 30px; }
          .info-box { background-color: #f8f9fa; border-left: 4px solid #f093fb; padding: 15px; margin: 20px 0; border-radius: 5px; }
          .otp-box { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 30px; text-align: center; border-radius: 10px; margin: 25px 0; }
          .otp-code { font-size: 42px; font-weight: bold; letter-spacing: 8px; margin: 10px 0; font-family: monospace; }
          .footer { background-color: #f8f9fa; padding: 20px; text-align: center; color: #6c757d; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📦 Product Creation Request</h1>
          </div>
          <div class="content">
            <p style="font-size: 16px; color: #333;">Hello Admin,</p>
            <p style="color: #666;">A seller wants to create a new product:</p>
            <div class="info-box">
              <p style="margin: 8px 0;"><strong>Seller Name:</strong> ${sellerName}</p>
              <p style="margin: 8px 0;"><strong>Product Name:</strong> ${productName}</p>
            </div>
            <p style="font-size: 16px; color: #333;">Please share this OTP with the seller:</p>
            <div class="otp-box">
              <p style="margin: 0; font-size: 14px; opacity: 0.9;">VERIFICATION CODE</p>
              <div class="otp-code">${otp}</div>
              <p style="margin: 0; font-size: 12px; opacity: 0.8;">Valid for 10 minutes</p>
            </div>
          </div>
          <div class="footer">
            <p>© 2024 E-Commerce Platform. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('✅ Product creation OTP sent to admin');
    return { success: true };
  } catch (error) {
    console.error('❌ Email sending error:', error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};