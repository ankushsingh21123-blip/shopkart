const Product = require('../models/product.model');
const mongoose = require('mongoose');

// @desc    Create a new product
// @route   POST /products
// @access  Public (or Admin)
const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, image, stock, rating, numReviews } = req.body;

    if (!name || !description || price === undefined || !category || !image) {
      return res.status(400).json({
        success: false,
        message: 'Name, description, price, category, and image are required'
      });
    }

    if (Number(price) < 0 || (stock !== undefined && Number(stock) < 0)) {
      return res.status(400).json({
        success: false,
        message: 'Price and stock must be non-negative numbers'
      });
    }

    const product = await Product.create({
      name: name.trim(),
      description,
      price: Number(price),
      category: category.trim(),
      image,
      stock: stock !== undefined ? Number(stock) : 0,
      rating: rating ? Number(rating) : 4.5,
      numReviews: numReviews ? Number(numReviews) : 0
    });

    return res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to create product',
      error: error.message
    });
  }
};

// @desc    Get all products with filtering, searching, and sorting
// @route   GET /products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const { search, q, category, sort } = req.query;
    const filter = {};

    const searchQuery = search || q;
    if (searchQuery && searchQuery.trim() !== '') {
      filter.name = { $regex: searchQuery.trim(), $options: 'i' };
    }

    if (category && category.trim() !== '' && category.toLowerCase() !== 'all') {
      filter.category = { $regex: new RegExp(`^${category.trim()}$`, 'i') };
    }

    let sortOptions = { createdAt: -1 }; // default newest first
    if (sort === 'price_asc' || sort === 'price-low') {
      sortOptions = { price: 1 };
    } else if (sort === 'price_desc' || sort === 'price-high') {
      sortOptions = { price: -1 };
    } else if (sort === 'rating') {
      sortOptions = { rating: -1 };
    } else if (sort === 'name_asc') {
      sortOptions = { name: 1 };
    }

    const products = await Product.find(filter).sort(sortOptions);
    const categories = await Product.distinct('category');

    return res.status(200).json({
      success: true,
      count: products.length,
      categories,
      products
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch products',
      error: error.message
    });
  }
};

// @desc    Get single product by ID
// @route   GET /products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        success: false,
        message: 'Product not found (invalid ID format)'
      });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    return res.status(200).json({
      success: true,
      product
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch product details',
      error: error.message
    });
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProductById
};
