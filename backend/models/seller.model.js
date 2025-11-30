const mongoose = require('mongoose');

const sellerSchema = new mongoose.Schema({
  seller_name: {
    type: String,
    required: true,
    trim: true
  },
  seller_address: {
    type: String,
    required: true
  },
  seller_company: {
    type: String,
    required: true,
    trim: true
  },
  seller_email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  seller_phone: {
    type: String,
    required: true,
    unique: true
  },
  seller_password: {
    type: String,
    required: true,
    minlength: 6
  },
  email_verified: {
    type: Boolean,
    default: false
  },
  phone_verified: {
    type: Boolean,
    default: false
  },
  blocked: {
    type: String,
    enum: ['yes', 'no'],
    default: 'no'
  },
  blocked_reason: {
    type: String,
    default: null
  },
  blocked_at: {
    type: Date,
    default: null
  },
  blocked_by: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

module.exports = mongoose.models.Seller || mongoose.model('Seller', sellerSchema);