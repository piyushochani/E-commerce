const Seller = require('../models/seller.model');


exports.loginSeller = async (req, res) => {
  res.json({ message: "Seller login route working" });
};


// Register a new seller
exports.registerSeller = async (req, res) => {
  try {
    const { seller_name, seller_address, seller_company, seller_email, seller_phone } = req.body;

    // Check if seller already exists
    const existingSeller = await Seller.findOne({ seller_email });
    if (existingSeller) {
      return res.status(400).json({ message: 'Seller already exists with this email' });
    }

    const seller = await Seller.create({
      seller_name,
      seller_address,
      seller_company,
      seller_email,
      seller_phone
    });

    res.status(201).json({ message: 'Seller registered successfully', seller });
  } catch (error) {
    res.status(500).json({ message: 'Error registering seller', error: error.message });
  }
};

// Get seller profile
exports.getSellerProfile = async (req, res) => {
  try {
    const seller = await Seller.findById(req.sellerId);

    if (!seller) {
      return res.status(404).json({ message: 'Seller not found' });
    }

    res.status(200).json({ seller });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile', error: error.message });
  }
};

// Update seller profile
exports.updateSellerProfile = async (req, res) => {
  try {
    const { seller_name, seller_address, seller_company, seller_phone } = req.body;

    const seller = await Seller.findByIdAndUpdate(
      req.sellerId,
      { seller_name, seller_address, seller_company, seller_phone },
      { new: true, runValidators: true }
    );

    res.status(200).json({ message: 'Profile updated successfully', seller });
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
};

// Delete seller account
exports.deleteSeller = async (req, res) => {
  try {
    await Seller.findByIdAndDelete(req.sellerId);
    res.status(200).json({ message: 'Seller account deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting account', error: error.message });
  }
};

// Get all sellers
exports.getAllSellers = async (req, res) => {
  try {
    const sellers = await Seller.find().select('-__v');
    res.status(200).json({ sellers, count: sellers.length });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching sellers', error: error.message });
  }
};