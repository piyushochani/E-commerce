const Cart = require('../models/cart.model');
const CartItem = require('../models/cartitem.model');
const Product = require('../models/product.model');

// Get customer's cart
exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ customer_id: req.customerId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const cartItems = await CartItem.find({ cart_id: cart._id })
      .populate('product_id');

    res.status(200).json({ cart, cartItems });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cart', error: error.message });
  }
};

// Add item to cart
exports.addToCart = async (req, res) => {
  try {
    const { product_id, quantity } = req.body;

    // Find cart
    const cart = await Cart.findOne({ customer_id: req.customerId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Find product
    const product = await Product.findById(product_id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if product already in cart
    let cartItem = await CartItem.findOne({ cart_id: cart._id, product_id });

    if (cartItem) {
      // Update quantity
      cartItem.quantity += quantity;
      await cartItem.save();
    } else {
      // Create new cart item
      cartItem = await CartItem.create({
        cart_id: cart._id,
        product_id,
        quantity,
        price_at_addition: product.product_price
      });
    }

    // Update cart totals
    const cartItems = await CartItem.find({ cart_id: cart._id });
    const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalAmount = cartItems.reduce((sum, item) => sum + (item.quantity * item.price_at_addition), 0);

    cart.cart_quantity = totalQuantity;
    cart.cart_total_amount = totalAmount;
    await cart.save();

    res.status(200).json({ message: 'Item added to cart', cart, cartItem });
  } catch (error) {
    res.status(500).json({ message: 'Error adding to cart', error: error.message });
  }
};

// Update cart item quantity
exports.updateCartItem = async (req, res) => {
  try {
    const { cart_item_id, quantity } = req.body;

    const cartItem = await CartItem.findById(cart_item_id);
    if (!cartItem) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    cartItem.quantity = quantity;
    await cartItem.save();

    // Update cart totals
    const cart = await Cart.findById(cartItem.cart_id);
    const cartItems = await CartItem.find({ cart_id: cart._id });
    const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalAmount = cartItems.reduce((sum, item) => sum + (item.quantity * item.price_at_addition), 0);

    cart.cart_quantity = totalQuantity;
    cart.cart_total_amount = totalAmount;
    await cart.save();

    res.status(200).json({ message: 'Cart item updated', cartItem, cart });
  } catch (error) {
    res.status(500).json({ message: 'Error updating cart item', error: error.message });
  }
};

// Remove item from cart
exports.removeFromCart = async (req, res) => {
  try {
    const { cart_item_id } = req.params;

    const cartItem = await CartItem.findByIdAndDelete(cart_item_id);
    if (!cartItem) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    // Update cart totals
    const cart = await Cart.findById(cartItem.cart_id);
    const cartItems = await CartItem.find({ cart_id: cart._id });
    const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalAmount = cartItems.reduce((sum, item) => sum + (item.quantity * item.price_at_addition), 0);

    cart.cart_quantity = totalQuantity;
    cart.cart_total_amount = totalAmount;
    await cart.save();

    res.status(200).json({ message: 'Item removed from cart', cart });
  } catch (error) {
    res.status(500).json({ message: 'Error removing item', error: error.message });
  }
};

// Clear cart
exports.clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ customer_id: req.customerId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    await CartItem.deleteMany({ cart_id: cart._id });

    cart.cart_quantity = 0;
    cart.cart_total_amount = 0;
    await cart.save();

    res.status(200).json({ message: 'Cart cleared successfully', cart });
  } catch (error) {
    res.status(500).json({ message: 'Error clearing cart', error: error.message });
  }
};