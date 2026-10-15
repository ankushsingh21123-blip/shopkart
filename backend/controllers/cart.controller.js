const Customer = require('../models/customer.model');
const Product = require('../models/product.model');
const mongoose = require('mongoose');

// Helper to compute derived state
const calculateCartTotals = (cartItems) => {
  let subtotal = 0;
  let totalUnits = 0;

  const validItems = [];

  for (const item of cartItems) {
    if (item.product && typeof item.product === 'object') {
      const price = Number(item.product.price) || 0;
      const qty = Number(item.quantity) || 1;
      subtotal += price * qty;
      totalUnits += qty;
      validItems.push(item);
    }
  }

  return {
    items: validItems,
    subtotal: Math.round(subtotal * 100) / 100,
    totalUnits
  };
};

// @desc    Add product to cart or increment quantity
// @route   POST /cart/:productId
// @access  Private
const addToCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const quantity = Math.max(1, Number(req.body?.quantity) || 1);

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

    if (product.stock < 1) {
      return res.status(400).json({
        success: false,
        message: `Product "${product.name}" is out of stock`
      });
    }

    const customer = await Customer.findById(req.customer._id);
    const existingIndex = customer.cart.findIndex(
      (item) => item.product.toString() === productId.toString()
    );

    if (existingIndex > -1) {
      const newQuantity = customer.cart[existingIndex].quantity + quantity;
      if (newQuantity > product.stock) {
        return res.status(400).json({
          success: false,
          message: `Cannot add more. Requested ${newQuantity} items, but only ${product.stock} in stock`
        });
      }
      customer.cart[existingIndex].quantity = newQuantity;
    } else {
      if (quantity > product.stock) {
        return res.status(400).json({
          success: false,
          message: `Requested quantity (${quantity}) exceeds available stock (${product.stock})`
        });
      }
      customer.cart.push({ product: productId, quantity });
    }

    await customer.save();
    await customer.populate('cart.product');

    const derived = calculateCartTotals(customer.cart);

    return res.status(200).json({
      success: true,
      message: 'Product added to cart',
      ...derived
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to add item to cart',
      error: error.message
    });
  }
};

// @desc    Get user's populated cart with derived totals
// @route   GET /cart
// @access  Private
const getCart = async (req, res) => {
  try {
    const customer = await Customer.findById(req.customer._id).populate('cart.product');
    const derived = calculateCartTotals(customer.cart);

    return res.status(200).json({
      success: true,
      ...derived
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch cart',
      error: error.message
    });
  }
};

// @desc    Update item quantity in cart
// @route   PATCH /cart/:productId
// @access  Private
const updateCartItemQuantity = async (req, res) => {
  try {
    const { productId } = req.params;
    const quantity = Number(req.body.quantity);

    if (isNaN(quantity)) {
      return res.status(400).json({
        success: false,
        message: 'Valid quantity number is required'
      });
    }

    const customer = await Customer.findById(req.customer._id);
    const itemIndex = customer.cart.findIndex(
      (item) => item.product.toString() === productId.toString()
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in cart'
      });
    }

    if (quantity <= 0) {
      customer.cart.splice(itemIndex, 1);
    } else {
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }

      if (quantity > product.stock) {
        return res.status(400).json({
          success: false,
          message: `Cannot update quantity to ${quantity}. Maximum available stock is ${product.stock}`
        });
      }

      customer.cart[itemIndex].quantity = quantity;
    }

    await customer.save();
    await customer.populate('cart.product');

    const derived = calculateCartTotals(customer.cart);

    return res.status(200).json({
      success: true,
      message: quantity <= 0 ? 'Item removed from cart' : 'Cart quantity updated',
      ...derived
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to update cart quantity',
      error: error.message
    });
  }
};

// @desc    Remove product from cart
// @route   DELETE /cart/:productId
// @access  Private
const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    const customer = await Customer.findById(req.customer._id);
    customer.cart = customer.cart.filter(
      (item) => item.product.toString() !== productId.toString()
    );

    await customer.save();
    await customer.populate('cart.product');

    const derived = calculateCartTotals(customer.cart);

    return res.status(200).json({
      success: true,
      message: 'Item removed from cart',
      ...derived
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to remove item from cart',
      error: error.message
    });
  }
};

module.exports = {
  addToCart,
  getCart,
  updateCartItemQuantity,
  removeFromCart
};
