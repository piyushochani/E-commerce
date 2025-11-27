const Product = require('../models/product.model');
const Seller = require('../models/Seller.model');
const SellerOTP = require('../models/sellerotp.model');
const { sendProductCreationOTP } = require('../utils/email');

// Generate OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Step 1: Request OTP for product creation
exports.requestProductCreationOTP = async (req, res) => {
  try {
    const { product_name } = req.body;

    // Get seller details
    const seller = await Seller.findById(req.sellerId);
    if (!seller) {
      return res.status(404).json({ message: 'Seller not found' });
    }

    // Generate OTP
    const otp = generateOTP();

    // Save OTP and product data
    await SellerOTP.create({
      seller_email: seller.seller_email,
      otp,
      otp_type: 'product_creation',
      product_data: req.body,
      expires_at: new Date(Date.now() + 10 * 60 * 1000)
    });

    // Send OTP to admin
    const emailResult = await sendProductCreationOTP(seller.seller_name, product_name, otp);

    res.status(200).json({
      message: 'OTP has been sent to admin. Please contact admin to get the OTP.',
      seller_email: seller.seller_email,
      // FOR TESTING: Include preview URL and OTP in development
      ...(process.env.NODE_ENV === 'development' && {
        otp: otp,
        emailPreviewUrl: emailResult.previewUrl,
        note: 'OTP is shown only in development mode. Check console for email preview URL.'
      })
    });
  } catch (error) {
    res.status(500).json({ message: 'Error requesting OTP', error: error.message });
  }
};

// Step 2: Verify OTP and create product
exports.verifyOTPAndCreateProduct = async (req, res) => {
  try {
    const { otp } = req.body;

    // Get seller
    const seller = await Seller.findById(req.sellerId);
    if (!seller) {
      return res.status(404).json({ message: 'Seller not found' });
    }

    // Find valid OTP
    const otpRecord = await SellerOTP.findOne({
      seller_email: seller.seller_email,
      otp,
      otp_type: 'product_creation',
      verified: false,
      expires_at: { $gt: new Date() }
    }).sort({ createdAt: -1 });

    if (!otpRecord) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Get product data from OTP record
    const productData = otpRecord.product_data;

    // Create product
    const product = await Product.create({
      ...productData,
      seller_id: req.sellerId
    });

    // Mark OTP as verified
    otpRecord.verified = true;
    await otpRecord.save();

    res.status(201).json({
      message: 'Product created successfully',
      product
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating product', error: error.message });
  }
};

// Get all products with filters
exports.getAllProducts = async (req, res) => {
  try {
    const { product_type, product_sex, product_brand, min_price, max_price, page = 1, limit = 20 } = req.query;

    const filter = {};
    if (product_type) filter.product_type = product_type;
    if (product_sex) filter.product_sex = product_sex;
    if (product_brand) filter.product_brand = product_brand;
    if (min_price || max_price) {
      filter.product_price = {};
      if (min_price) filter.product_price.$gte = Number(min_price);
      if (max_price) filter.product_price.$lte = Number(max_price);
    }

    const products = await Product.find(filter)
      .populate('seller_id', 'seller_name seller_company')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const count = await Product.countDocuments(filter);

    res.status(200).json({
      products,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error: error.message });
  }
};

// Get single product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('seller_id');

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({ product });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product', error: error.message });
  }
};

// Update product
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({ message: 'Product updated successfully', product });
  } catch (error) {
    res.status(500).json({ message: 'Error updating product', error: error.message });
  }
};

// Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product', error: error.message });
  }
};

// Get products by seller
exports.getProductsBySeller = async (req, res) => {
  try {
    const products = await Product.find({ seller_id: req.sellerId });
    res.status(200).json({ products, count: products.length });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error: error.message });
  }
};