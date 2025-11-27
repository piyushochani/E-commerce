const mongoose = require('mongoose');

const sellerOTPSchema = new mongoose.Schema({
  seller_email: {
    type: String,
    required: true
  },
  otp: {
    type: String,
    required: true
  },
  otp_type: {
    type: String,
    enum: ['registration', 'product_creation'],
    required: true
  },
  verified: {
    type: Boolean,
    default: false
  },
  product_data: {
    type: Object,
    default: null
  },
  expires_at: {
    type: Date,
    required: true,
    default: () => new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
  }
}, {
  timestamps: true
});

// Auto-delete expired OTPs
sellerOTPSchema.index({ expires_at: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('SellerOTP', sellerOTPSchema);