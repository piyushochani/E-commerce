const nodemailer = require('nodemailer');

// Create Gmail transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // true for 465, false for 587
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
};

// Send OTP email to admin for seller registration
exports.sendSellerOTP = async (sellerName, sellerEmail, otp) => {
  const transporter = createTransporter();
  
  const mailOptions = {
    from: `"E-Commerce Platform" <${process.env.EMAIL_FROM}>`,
    to: process.env.ADMIN_EMAIL, // ochanipiyush07@gmail.com
    subject: '🔐 New Seller Registration - OTP Required',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; background-color: #f5f5f5; margin: 0; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); overflow: hidden; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
          .header h1 { margin: 0; font-size: 24px; }
          .content { padding: 30px; }
          .info-box { background-color: #f8f9fa; border-left: 4px solid #667eea; padding: 15px; margin: 20px 0; border-radius: 5px; }
          .info-box p { margin: 8px 0; color: #333; }
          .info-box strong { color: #667eea; }
          .otp-box { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px; margin: 25px 0; }
          .otp-code { font-size: 42px; font-weight: bold; letter-spacing: 8px; margin: 10px 0; font-family: monospace; }
          .notice { background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 5px; }
          .notice p { margin: 0; color: #856404; }
          .footer { background-color: #f8f9fa; padding: 20px; text-align: center; color: #6c757d; font-size: 12px; }
          .button { display: inline-block; padding: 12px 30px; background-color: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 New Seller Registration Request</h1>
          </div>
          
          <div class="content">
            <p style="font-size: 16px; color: #333;">Hello Admin,</p>
            <p style="color: #666;">A new seller is requesting to register on your E-Commerce platform.</p>
            
            <div class="info-box">
              <p><strong>👤 Seller Name:</strong> ${sellerName}</p>
              <p><strong>📧 Seller Email:</strong> ${sellerEmail}</p>
              <p><strong>📅 Request Time:</strong> ${new Date().toLocaleString()}</p>
            </div>
            
            <p style="font-size: 16px; color: #333; margin-top: 25px;">
              <strong>Please share the following OTP with the seller to complete their registration:</strong>
            </p>
            
            <div class="otp-box">
              <p style="margin: 0; font-size: 14px; opacity: 0.9;">VERIFICATION CODE</p>
              <div class="otp-code">${otp}</div>
              <p style="margin: 0; font-size: 12px; opacity: 0.8;">Valid for 10 minutes</p>
            </div>
            
            <div class="notice">
              <p><strong>⏰ Important:</strong> This OTP will expire in 10 minutes. Please share it with the seller promptly.</p>
            </div>
            
            <p style="color: #666; margin-top: 20px;">
              If you did not expect this registration request, you can safely ignore this email.
            </p>
          </div>
          
          <div class="footer">
            <p>This is an automated email from your E-Commerce Platform.</p>
            <p>Please do not reply to this email.</p>
            <p style="margin-top: 10px;">© 2024 E-Commerce Platform. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    
    console.log('✅ Email sent successfully!');
    console.log('📧 To:', process.env.ADMIN_EMAIL);
    console.log('📧 Message ID:', info.messageId);
    console.log('📧 OTP:', otp);
    console.log('📧 Seller:', sellerName, '-', sellerEmail);
    
    return { 
      success: true, 
      message: 'OTP sent successfully to admin',
      messageId: info.messageId
    };
  } catch (error) {
    console.error('❌ Email sending error:', error);
    throw new Error(`Failed to send OTP email: ${error.message}`);
  }
};

// Send OTP for product creation
exports.sendProductCreationOTP = async (sellerName, productName, otp) => {
  const transporter = createTransporter();
  
  const mailOptions = {
    from: `"E-Commerce Platform" <${process.env.EMAIL_FROM}>`,
    to: process.env.ADMIN_EMAIL,
    subject: '📦 New Product Creation Request - OTP Required',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; background-color: #f5f5f5; margin: 0; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); overflow: hidden; }
          .header { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 30px; text-align: center; }
          .header h1 { margin: 0; font-size: 24px; }
          .content { padding: 30px; }
          .info-box { background-color: #f8f9fa; border-left: 4px solid #f093fb; padding: 15px; margin: 20px 0; border-radius: 5px; }
          .info-box p { margin: 8px 0; color: #333; }
          .info-box strong { color: #f5576c; }
          .otp-box { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 30px; text-align: center; border-radius: 10px; margin: 25px 0; }
          .otp-code { font-size: 42px; font-weight: bold; letter-spacing: 8px; margin: 10px 0; font-family: monospace; }
          .notice { background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 5px; }
          .notice p { margin: 0; color: #856404; }
          .footer { background-color: #f8f9fa; padding: 20px; text-align: center; color: #6c757d; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📦 New Product Creation Request</h1>
          </div>
          
          <div class="content">
            <p style="font-size: 16px; color: #333;">Hello Admin,</p>
            <p style="color: #666;">A seller wants to add a new product to the platform.</p>
            
            <div class="info-box">
              <p><strong>👤 Seller Name:</strong> ${sellerName}</p>
              <p><strong>📦 Product Name:</strong> ${productName}</p>
              <p><strong>📅 Request Time:</strong> ${new Date().toLocaleString()}</p>
            </div>
            
            <p style="font-size: 16px; color: #333; margin-top: 25px;">
              <strong>Please share the following OTP with the seller to approve this product:</strong>
            </p>
            
            <div class="otp-box">
              <p style="margin: 0; font-size: 14px; opacity: 0.9;">VERIFICATION CODE</p>
              <div class="otp-code">${otp}</div>
              <p style="margin: 0; font-size: 12px; opacity: 0.8;">Valid for 10 minutes</p>
            </div>
            
            <div class="notice">
              <p><strong>⏰ Important:</strong> This OTP will expire in 10 minutes. Please verify and approve promptly.</p>
            </div>
            
            <p style="color: #666; margin-top: 20px;">
              If you did not expect this product creation request, please contact the seller directly.
            </p>
          </div>
          
          <div class="footer">
            <p>This is an automated email from your E-Commerce Platform.</p>
            <p>Please do not reply to this email.</p>
            <p style="margin-top: 10px;">© 2024 E-Commerce Platform. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    
    console.log('✅ Product creation email sent!');
    console.log('📧 To:', process.env.ADMIN_EMAIL);
    console.log('📧 Message ID:', info.messageId);
    console.log('📧 OTP:', otp);
    console.log('📦 Product:', productName, 'by', sellerName);
    
    return { 
      success: true, 
      message: 'OTP sent successfully to admin',
      messageId: info.messageId
    };
  } catch (error) {
    console.error('❌ Email sending error:', error);
    throw new Error(`Failed to send OTP email: ${error.message}`);
  }
};