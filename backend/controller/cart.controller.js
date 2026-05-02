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

    // #region agent log
    fetch('http://127.0.0.1:7259/ingest/9b1b1ad4-3fdb-4c8c-a5bd-c063fece2236',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'8b7eee'},body:JSON.stringify({sessionId:'8b7eee',location:'cart.controller.js:addToCart:beforeMerge',message:'addToCart merge decision',data:{hypothesisId:'H1',mergePath:!!cartItem,catalogUnitPrice:product.product_price,lineUnitPrice:cartItem?cartItem.price_at_addition:null,priceStale:!!cartItem&&Number(cartItem.price_at_addition)!==Number(product.product_price),addQty:quantity},timestamp:Date.now(),runId:'pre-fix'})}).catch(()=>{});
    // #endregion

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

    // #region agent log
    const sumCheck = cartItems.reduce((s, it) => s + Number(it.quantity) * Number(it.price_at_addition), 0);
    fetch('http://127.0.0.1:7259/ingest/9b1b1ad4-3fdb-4c8c-a5bd-c063fece2236',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'8b7eee'},body:JSON.stringify({sessionId:'8b7eee',location:'cart.controller.js:addToCart:afterTotals',message:'cart totals after add',data:{hypothesisId:'H3',totalAmount,sumCheckNumeric:sumCheck,amountMismatch:Math.abs(totalAmount-sumCheck)>1e-6,lineCount:cartItems.length},timestamp:Date.now(),runId:'pre-fix'})}).catch(()=>{});
    // #endregion

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
    const cart_item_id = req.params.cart_item_id || req.body.cart_item_id;
    const { quantity } = req.body;

    // #region agent log
    fetch('http://127.0.0.1:7259/ingest/9b1b1ad4-3fdb-4c8c-a5bd-c063fece2236',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'8b7eee'},body:JSON.stringify({sessionId:'8b7eee',location:'cart.controller.js:updateCartItem:resolveId',message:'resolved cart line id',data:{hypothesisId:'H_ROUTE',fromParams:!!req.params.cart_item_id,hasResolvedId:!!cart_item_id,cartItemIdLen:cart_item_id?String(cart_item_id).length:0},timestamp:Date.now(),runId:'post-fix'})}).catch(()=>{});
    // #endregion

    const cartItem = await CartItem.findById(cart_item_id);
    if (!cartItem) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    cartItem.quantity = quantity;
    await cartItem.save();

    const productForLine = await Product.findById(cartItem.product_id);
    // #region agent log
    fetch('http://127.0.0.1:7259/ingest/9b1b1ad4-3fdb-4c8c-a5bd-c063fece2236',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'8b7eee'},body:JSON.stringify({sessionId:'8b7eee',location:'cart.controller.js:updateCartItem:afterQty',message:'update qty vs catalog',data:{hypothesisId:'H2',catalogUnitPrice:productForLine?.product_price,lineUnitPrice:cartItem.price_at_addition,priceStale:productForLine&&Number(cartItem.price_at_addition)!==Number(productForLine.product_price),newQty:quantity},timestamp:Date.now(),runId:'pre-fix'})}).catch(()=>{});
    // #endregion

    // Update cart totals
    const cart = await Cart.findById(cartItem.cart_id);
    const cartItems = await CartItem.find({ cart_id: cart._id });
    const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalAmount = cartItems.reduce((sum, item) => sum + (item.quantity * item.price_at_addition), 0);

    cart.cart_quantity = totalQuantity;
    cart.cart_total_amount = totalAmount;
    await cart.save();

    // #region agent log
    fetch('http://127.0.0.1:7259/ingest/9b1b1ad4-3fdb-4c8c-a5bd-c063fece2236',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'8b7eee'},body:JSON.stringify({sessionId:'8b7eee',location:'cart.controller.js:updateCartItem:afterSave',message:'cart totals persisted',data:{hypothesisId:'H_ROUTE',cartTotalAmount:cart.cart_total_amount,cartQty:cart.cart_quantity,lineQty:cartItem.quantity},timestamp:Date.now(),runId:'post-fix'})}).catch(()=>{});
    // #endregion

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