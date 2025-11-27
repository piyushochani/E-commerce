// Validate Customer Registration
exports.validateCustomerRegistration = (req, res, next) => {
  const { customer_name, customer_address, customer_gender, customer_DOB, customer_email, customer_phone, customer_password } = req.body;

  // Check if all required fields are present
  if (!customer_name || !customer_address || !customer_gender || !customer_DOB || !customer_email || !customer_phone || !customer_password) {
    return res.status(400).json({ message: 'All fields are required' });
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

  // Validate phone number (basic validation)
  const phoneRegex = /^[0-9]{10,15}$/;
  if (!phoneRegex.test(customer_phone.replace(/[\s\-\(\)]/g, ''))) {
    return res.status(400).json({ message: 'Invalid phone number format' });
  }

  // Validate gender
  if (!['male', 'female', 'other'].includes(customer_gender)) {
    return res.status(400).json({ message: 'Gender must be male, female, or other' });
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

  next();
};

// Validate Product Creation
exports.validateProductCreation = (req, res, next) => {
  const { product_name, product_price, product_description, product_img, product_sex, product_quantity, product_brand, product_type } = req.body;

  if (!product_name || !product_price || !product_description || !product_img || !product_sex || product_quantity === undefined || !product_brand || !product_type) {
    return res.status(400).json({ message: 'All required fields must be provided' });
  }

  // Validate price
  if (product_price < 0) {
    return res.status(400).json({ message: 'Price cannot be negative' });
  }

  // Validate quantity
  if (product_quantity < 0) {
    return res.status(400).json({ message: 'Quantity cannot be negative' });
  }

  // Validate product_sex
  if (!['male', 'female', 'both'].includes(product_sex)) {
    return res.status(400).json({ message: 'Product sex must be male, female, or both' });
  }

  // Validate product_type
  const validTypes = ['electronics', 'clothing', 'basic_needs', 'furniture', 'books', 'toys', 'sports', 'beauty', 'other'];
  if (!validTypes.includes(product_type)) {
    return res.status(400).json({ message: `Product type must be one of: ${validTypes.join(', ')}` });
  }

  next();
};

// Validate Add to Cart
exports.validateAddToCart = (req, res, next) => {
  const { product_id, quantity } = req.body;

  if (!product_id || !quantity) {
    return res.status(400).json({ message: 'Product ID and quantity are required' });
  }

  if (quantity < 1) {
    return res.status(400).json({ message: 'Quantity must be at least 1' });
  }

  next();
};

// Validate Place Order
exports.validatePlaceOrder = (req, res, next) => {
  const { shipping_address } = req.body;

  if (!shipping_address) {
    return res.status(400).json({ message: 'Shipping address is required' });
  }

  if (shipping_address.trim().length < 10) {
    return res.status(400).json({ message: 'Please provide a complete shipping address' });
  }

  next();
};

// Validate Seller Registration
exports.validateSellerRegistration = (req, res, next) => {
  const { seller_name, seller_address, seller_company, seller_email, seller_phone } = req.body;

  if (!seller_name || !seller_address || !seller_company || !seller_email || !seller_phone) {
    return res.status(400).json({ message: 'All fields are required' });
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

  next();
};