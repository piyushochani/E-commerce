const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  customer_name: {
    type: String,
    required: true,
    trim: true
  },
  customer_address: {
    type: String,
    required: true
  },
  customer_gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    required: true
  },
  customer_DOB: {
    type: Date,
    required: true
  },
  customer_email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  customer_phone: {
    type: String,
    required: true,
    unique: true
  },
  customer_password: {
    type: String,
    required: true,
    minlength: 6
  },
  cart_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cart'
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

// Check if model exists before creating
const Customer = mongoose.models.Customer || mongoose.model('Customer', customerSchema);

module.exports = Customer;