import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import CheckoutForm from '../components/CheckoutForm';
import OrderSummary from '../components/OrderSummary';
import api from '../services/api';
import { ShieldCheck, ArrowLeft, AlertCircle } from 'lucide-react';

const Checkout = () => {
  const { cartItems, subtotal, totalUnits, clearCartState } = useCart();
  const { customer } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: customer?.name || '',
    address: customer?.address?.street || '',
    city: customer?.address?.city || '',
    state: customer?.address?.state || '',
    postalCode: customer?.address?.postalCode || '',
    phone: customer?.phone || ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const validateForm = () => {
    const errs = {};
    if (!formData.fullName.trim()) errs.fullName = 'Full name is required';
    if (!formData.address.trim()) errs.address = 'Street address is required';
    if (!formData.city.trim()) errs.city = 'City is required';
    if (!formData.state.trim()) errs.state = 'State is required';
    if (!formData.postalCode.trim()) errs.postalCode = 'Postal code is required';
    if (!formData.phone.trim()) errs.phone = 'Phone number is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handlePaymentSuccess = async (orderId, rzpOrderId, rzpPaymentId, rzpSignature) => {
    try {
      const res = await api.post('/orders/verify-payment', {
        orderId,
        razorpay_order_id: rzpOrderId,
        razorpay_payment_id: rzpPaymentId,
        razorpay_signature: rzpSignature
      });

      if (res.data.success) {
        clearCartState();
        navigate(`/order-success/${orderId}`);
      }
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Payment signature verification failed.');
      setLoading(false);
    }
  };

  const handleInitiatePayment = async () => {
    setErrorMessage('');
    if (!validateForm()) return;
    if (cartItems.length === 0) {
      setErrorMessage('Your cart is empty.');
      return;
    }

    setLoading(true);

    try {
      // Step 1: Create Order on backend with Server-Side Revalidation
      const res = await api.post('/orders/create-payment-order', {
        shippingAddress: formData
      });

      if (!res.data.success) {
        throw new Error(res.data.message || 'Failed to create order');
      }

      const { order, razorpayOrder } = res.data;

      // Check if window.Razorpay is loaded
      if (typeof window.Razorpay !== 'undefined' && razorpayOrder.key && !razorpayOrder.key.includes('placeholder')) {
        const options = {
          key: razorpayOrder.key,
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency,
          name: 'ShopKart',
          description: `Order #${order._id.substring(0, 8)} Payment`,
          order_id: razorpayOrder.id,
          prefill: {
            name: formData.fullName,
            email: customer?.email,
            contact: formData.phone
          },
          theme: {
            color: '#6366f1'
          },
          handler: async function (response) {
            await handlePaymentSuccess(
              order._id,
              response.razorpay_order_id,
              response.razorpay_payment_id,
              response.razorpay_signature
            );
          },
          modal: {
            ondismiss: function () {
              setLoading(false);
            }
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (response) {
          setErrorMessage(`Payment failed: ${response.error?.description || 'Unknown error'}`);
          setLoading(false);
        });
        rzp.open();
      } else {
        // Deterministic Test Simulation (Zero-config development & testing mode)
        const mockPaymentId = `pay_sim_${Date.now()}`;
        // Automatically verify with server
        await handlePaymentSuccess(
          order._id,
          razorpayOrder.id,
          mockPaymentId,
          'simulated_test_signature'
        );
      }
    } catch (err) {
      setErrorMessage(err.response?.data?.message || err.message || 'Checkout failed. Please try again.');
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="container" style={{ padding: '5rem 1.5rem' }}>
        <div className="state-container glass-panel">
          <AlertCircle size={48} color="#f59e0b" style={{ marginBottom: '1rem' }} />
          <h3>Your cart is empty</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            Add items to your cart before proceeding to checkout.
          </p>
          <Link to="/products" className="btn btn-primary btn-sm">
            Return to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '3rem 1.5rem 5rem' }}>
      <Link
        to="/cart"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          color: 'var(--text-muted)',
          marginBottom: '2rem',
          fontSize: '0.9rem'
        }}
      >
        <ArrowLeft size={16} /> Back to Cart
      </Link>

      <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Checkout & Payment</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
        Review your delivery destination and confirm payment with Razorpay
      </p>

      {errorMessage && (
        <div
          style={{
            background: 'rgba(244, 63, 94, 0.15)',
            border: '1px solid rgba(244, 63, 94, 0.3)',
            color: '#fb7185',
            padding: '1rem',
            borderRadius: 'var(--radius-md)',
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem'
          }}
        >
          <AlertCircle size={20} />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="checkout-layout">
        {/* Shipping Form */}
        <CheckoutForm formData={formData} setFormData={setFormData} errors={errors} />

        {/* Order Summary & Payment Button */}
        <div>
          <OrderSummary
            subtotal={subtotal}
            totalUnits={totalUnits}
            onProceed={handleInitiatePayment}
            buttonText="Pay with Razorpay"
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default Checkout;
