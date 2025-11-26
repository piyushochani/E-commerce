const Order = require('../models/order.model');
const OrderItem = require('../models/orderitem.model');
const Cart = require('../models/cart.model');
const CartItem = require('../models/cartitem.model');
const Product = require('../models/product.model');

// Place a new order
exports.placeOrder = async (req, res) => {
  try {
    const { shipping_address } = req.body;

    // Get customer's cart
    const cart = await Cart.findOne({ customer_id: req.customerId });
    if (!cart || cart.cart_quantity === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Get cart items
    const cartItems = await CartItem.find({ cart_id: cart._id }).populate('product_id');

    // Create order
    const order = await Order.create({
      customer_id: req.customerId,
      order_date: new Date(),
      order_status: 'pending',
      order_total_amount: cart.cart_total_amount,
      shipping_address
    });

    // Create order items
    for (const item of cartItems) {
      await OrderItem.create({
        order_id: order._id,
        product_id: item.product_id._id,
        quantity: item.quantity,
        price_at_purchase: item.price_at_addition
      });

      // Update product quantity
      const product = await Product.findById(item.product_id._id);
      product.product_quantity -= item.quantity;
      await product.save();
    }

    // Clear cart
    await CartItem.deleteMany({ cart_id: cart._id });
    cart.cart_quantity = 0;
    cart.cart_total_amount = 0;
    await cart.save();

    res.status(201).json({ message: 'Order placed successfully', order });
  } catch (error) {
    res.status(500).json({ message: 'Error placing order', error: error.message });
  }
};

// Get all orders for a customer
exports.getCustomerOrders = async (req, res) => {
  try {
    const orders = await Order.find({ customer_id: req.customerId })
      .sort({ order_date: -1 });

    res.status(200).json({ orders, count: orders.length });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders', error: error.message });
  }
};

// Get order by ID with items
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('customer_id', 'customer_name customer_email');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const orderItems = await OrderItem.find({ order_id: order._id })
      .populate('product_id');

    res.status(200).json({ order, orderItems });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching order', error: error.message });
  }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { order_status } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { order_status },
      { new: true, runValidators: true }
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({ message: 'Order status updated', order });
  } catch (error) {
    res.status(500).json({ message: 'Error updating order', error: error.message });
  }
};

// Cancel order
exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.order_status !== 'pending' && order.order_status !== 'confirmed') {
      return res.status(400).json({ message: 'Cannot cancel order at this stage' });
    }

    order.order_status = 'cancelled';
    await order.save();

    // Restore product quantities
    const orderItems = await OrderItem.find({ order_id: order._id });
    for (const item of orderItems) {
      const product = await Product.findById(item.product_id);
      product.product_quantity += item.quantity;
      await product.save();
    }

    res.status(200).json({ message: 'Order cancelled successfully', order });
  } catch (error) {
    res.status(500).json({ message: 'Error cancelling order', error: error.message });
  }
};