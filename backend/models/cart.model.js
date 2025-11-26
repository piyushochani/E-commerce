const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  customer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  cart_total_amount: {
    type: Number,
    default: 0,
    min: 0
  },
  cart_quantity: {
    type: Number,
    default: 0,
    min: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Cart', cartSchema);