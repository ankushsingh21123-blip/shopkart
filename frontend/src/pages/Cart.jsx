import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import CartItem from '../components/CartItem';
import OrderSummary from '../components/OrderSummary';
import { ShoppingCart, ArrowLeft, ShoppingBag } from 'lucide-react';

const Cart = () => {
  const { cartItems, subtotal, totalUnits, loadingCart } = useCart();
  const navigate = useNavigate();

  if (loadingCart) {
    return (
      <div className="container" style={{ padding: '5rem 1.5rem' }}>
        <div className="state-container glass-panel">
          <div className="spinner"></div>
          <h3>Loading your shopping cart...</h3>
        </div>
      </div>
    );
  }

  const handleCheckout = () => {
    navigate('/checkout');
  };

  return (
    <div className="container" style={{ padding: '3rem 1.5rem 5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <ShoppingCart size={26} color="var(--primary-light)" /> Shopping Cart
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>
            {totalUnits} {totalUnits === 1 ? 'item' : 'items'} in your bag
          </p>
        </div>

        <Link to="/products" className="btn btn-secondary btn-sm">
          <ArrowLeft size={16} /> Continue Shopping
        </Link>
      </div>

      {cartItems.length === 0 ? (
        <div className="state-container glass-panel">
          <ShoppingCart size={56} color="var(--text-dim)" style={{ marginBottom: '1.25rem' }} />
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Your cart is empty</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', maxWidth: '400px' }}>
            Looks like you haven't added anything yet. Start exploring and discover top tech deals!
          </p>
          <Link to="/products" className="btn btn-primary">
            <ShoppingBag size={18} /> Browse Products
          </Link>
        </div>
      ) : (
        <div className="cart-layout">
          {/* Cart Items List */}
          <div>
            {cartItems.map((item) => (
              <CartItem key={item._id || item.product._id} item={item} />
            ))}
          </div>

          {/* Sticky Order Summary */}
          <div>
            <OrderSummary
              subtotal={subtotal}
              totalUnits={totalUnits}
              onProceed={handleCheckout}
              buttonText="Proceed to Checkout"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
