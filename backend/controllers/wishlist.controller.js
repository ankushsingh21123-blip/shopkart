const Customer = require('../models/customer.model');
const Product = require('../models/product.model');
const mongoose = require('mongoose');

// @desc    Add product to wishlist
// @route   POST /wishlist/:productId
// @access  Private
const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID'
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const customer = await Customer.findById(req.customer._id);

    // Duplicate Prevention: Check if product already exists in wishlist
    const exists = customer.wishlist.some(
      (id) => id.toString() === productId.toString()
    );

    if (exists) {
      return res.status(409).json({
        success: false,
        message: 'Product is already in your wishlist'
      });
    }

    customer.wishlist.push(productId);
    await customer.save();

    await customer.populate('wishlist');

    return res.status(200).json({
      success: true,
      message: 'Product added to wishlist',
      wishlist: customer.wishlist
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to add item to wishlist',
      error: error.message
    });
  }
};

// @desc    Get user's populated wishlist
// @route   GET /wishlist
// @access  Private
const getWishlist = async (req, res) => {
  try {
    const customer = await Customer.findById(req.customer._id).populate('wishlist');

    return res.status(200).json({
      success: true,
      count: customer.wishlist.length,
      wishlist: customer.wishlist
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve wishlist',
      error: error.message
    });
  }
};

// @desc    Remove product from wishlist
// @route   DELETE /wishlist/:productId
// @access  Private
const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;

    const customer = await Customer.findById(req.customer._id);
    customer.wishlist = customer.wishlist.filter(
      (id) => id.toString() !== productId.toString()
    );

    await customer.save();
    await customer.populate('wishlist');

    return res.status(200).json({
      success: true,
      message: 'Product removed from wishlist',
      wishlist: customer.wishlist
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to remove product from wishlist',
      error: error.message
    });
  }
};

// @desc    Toggle product in wishlist (Add if not present, remove if present)
// @route   PATCH /wishlist/:productId/toggle
// @access  Private
const toggleWishlist = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID'
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const customer = await Customer.findById(req.customer._id);
    const index = customer.wishlist.findIndex(
      (id) => id.toString() === productId.toString()
    );

    let inWishlist = false;
    if (index > -1) {
      customer.wishlist.splice(index, 1);
      inWishlist = false;
    } else {
      customer.wishlist.push(productId);
      inWishlist = true;
    }

    await customer.save();
    await customer.populate('wishlist');

    return res.status(200).json({
      success: true,
      inWishlist,
      message: inWishlist ? 'Added to wishlist' : 'Removed from wishlist',
      wishlist: customer.wishlist
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to toggle wishlist item',
      error: error.message
    });
  }
};

module.exports = {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
  toggleWishlist
};
