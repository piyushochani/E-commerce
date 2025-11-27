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
    unique: true,
    required: true
  },
  customer_password: {
    type: String,
    required: true,
    minlength: 6
  },
  cart_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cart'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Customer', customerSchema);