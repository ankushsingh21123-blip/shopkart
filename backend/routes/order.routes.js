const express = require('express');
const router = express.Router();
const {
  createPaymentOrder,
  verifyPayment,
  getCustomerOrders,
  getOrderById,
  updateOrderStatus
} = require('../controllers/order.controller');
const { protect } = require('../middlewares/auth.middleware');

router.use(protect);

router.post('/create-payment-order', createPaymentOrder);
router.post('/verify-payment', verifyPayment);
router.get('/', getCustomerOrders);
router.get('/:id', getOrderById);
router.patch('/:id/status', updateOrderStatus);

module.exports = router;
