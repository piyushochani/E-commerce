// validation.middleware.js

// Validate Customer Registration
exports.validateCustomerRegistration = (req, res, next) => {
  const { customer_name, customer_email, customer_phone, customer_password, customer_address } = req.body;

  if (!customer_name || !customer_email || !customer_phone || !customer_password) {
    return res.status(400).json({ message: 'Name, email, phone, and password are required' });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(customer_email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }

  // Validate phone number
  const phoneRegex = /^[0-9]{10,15}$/;
  if (!phoneRegex.test(customer_phone.replace(/[\s\-\(\)]/g, ''))) {
    return res.status(400).json({ message: 'Invalid phone number format' });
  }

  // Validate password length
  if (customer_password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters long' });
  }

  next();
};

// Validate Customer Login
exports.validateCustomerLogin = (req, res, next) => {
  const { customer_email, customer_password } = req.body;

  if (!customer_email || !customer_password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(customer_email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }

  // Validate password length
  if (customer_password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters long' });
  }

  next();
};

// Validate Seller Login
exports.validateSellerLogin = (req, res, next) => {
  const { seller_email, seller_password } = req.body;

  if (!seller_email || !seller_password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(seller_email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }

  // Validate password length
  if (seller_password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters long' });
  }

  next();
};
// Validate Add to Cart
exports.validateAddToCart = (req, res, next) => {
  const { product_id, quantity } = req.body;

  if (!product_id) {
    return res.status(400).json({ message: 'Product ID is required' });
  }

  if (!quantity || quantity < 1) {
    return res.status(400).json({ message: 'Quantity must be at least 1' });
  }

  if (!Number.isInteger(quantity)) {
    return res.status(400).json({ message: 'Quantity must be a valid integer' });
  }

  next();
};



// Validate Place Order
exports.validatePlaceOrder = (req, res, next) => {
  const { shipping_address, payment_method } = req.body;

  if (!shipping_address) {
    return res.status(400).json({ message: 'Shipping address is required' });
  }

  if (!payment_method) {
    return res.status(400).json({ message: 'Payment method is required' });
  }

  // Validate payment method is one of the accepted types
  const validPaymentMethods = ['credit_card', 'debit_card', 'paypal', 'cash_on_delivery', 'upi'];
  if (!validPaymentMethods.includes(payment_method)) {
    return res.status(400).json({ 
      message: 'Invalid payment method. Must be one of: ' + validPaymentMethods.join(', ') 
    });
  }

  next();
};







// Validate Seller Registration
exports.validateSellerRegistration = (req, res, next) => {
  const { seller_name, seller_address, seller_company, seller_email, seller_phone, seller_password } = req.body;

  if (!seller_name || !seller_address || !seller_company || !seller_email || !seller_phone || !seller_password) {
    return res.status(400).json({ message: 'All fields are required including password' });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(seller_email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }

  // Validate phone number
  const phoneRegex = /^[0-9]{10,15}$/;
  if (!phoneRegex.test(seller_phone.replace(/[\s\-\(\)]/g, ''))) {
    return res.status(400).json({ message: 'Invalid phone number format' });
  }

  // Validate password
  if (seller_password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters long' });
  }

  next();
};