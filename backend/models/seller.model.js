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
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Seller', sellerSchema);