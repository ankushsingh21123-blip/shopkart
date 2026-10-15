const Razorpay = require('razorpay');
require('dotenv').config();

const keyId = process.env.RAZORPAY_KEY_ID || 'rzp_test_shopkart12345';
const keySecret = process.env.RAZORPAY_KEY_SECRET || 'shopkart_razorpay_secret_67890';

let razorpayInstance = null;

try {
  razorpayInstance = new Razorpay({
    key_id: keyId,
    key_secret: keySecret
  });
} catch (err) {
  console.warn('Razorpay initialization warning (running with fallback mock):', err.message);
}

module.exports = {
  razorpayInstance,
  keyId,
  keySecret
};
