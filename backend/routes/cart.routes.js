const express = require('express');
const router = express.Router();
const {
  addToCart,
  getCart,
  updateCartItemQuantity,
  removeFromCart
} = require('../controllers/cart.controller');
const { protect } = require('../middlewares/auth.middleware');

router.use(protect);

router.post('/:productId', addToCart);
router.get('/', getCart);
router.patch('/:productId', updateCartItemQuantity);
router.delete('/:productId', removeFromCart);

module.exports = router;
