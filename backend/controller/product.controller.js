const Product = require('../models/product.model');

// Create a new product
exports.createProduct = async (req, res) => {
  try {
    const { product_name, product_price, product_description, product_img, product_sex, product_size, product_quantity, product_brand, product_type } = req.body;

    const product = await Product.create({
      product_name,
      product_price,
      product_description,
      product_img,
      product_sex,
      product_size,
      product_quantity,
      product_brand,
      product_type,
      seller_id: req.sellerId // Assuming seller is authenticated
    });

    res.status(201).json({ message: 'Product created successfully', product });
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