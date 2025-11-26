const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  product_name: {
    type: String,
    required: true,
    trim: true
  },
  product_price: {
    type: Number,
    required: true,
    min: 0
  },
  product_description: {
    type: String,
    required: true
  },
  product_img: {
    type: String,
    required: true // Cloudinary URL
  },
  product_sex: {
    type: String,
    enum: ['male', 'female', 'both'],
    required: true
  },
  product_size: {
    type: Number,
    default: -1 // -1 denotes one size
  },
  product_quantity: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  product_brand: {
    type: String,
    required: true,
    trim: true
  },
  product_type: {
    type: String,
    enum: ['electronics', 'clothing', 'basic_needs', 'furniture', 'books', 'toys', 'sports', 'beauty', 'other'],
    required: true
  },
  seller_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Seller',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Product', productSchema);