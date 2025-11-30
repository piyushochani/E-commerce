const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    default: null
  },
  otp: {
    type: String,
    required: true
  },
  otp_type: {
    type: String,
    enum: ['email_verification', 'phone_verification', 'forgot_password', 'seller_registration', 'product_creation'],
    required: true
  },
  user_type: {
    type: String,
    enum: ['customer', 'seller'],
    required: true
  },
  verified: {
    type: Boolean,
    default: false
  },
  additional_data: {
    type: Object,
    default: null
  },
  expires_at: {
    type: Date,
    required: true,
    default: () => new Date(Date.now() + 10 * 60 * 1000)
  }
}, {
  timestamps: true
});

// Auto-delete expired OTPs
otpSchema.index({ expires_at: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.models.OTP || mongoose.model('OTP', otpSchema);