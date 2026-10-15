import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { useCart } from './context/CartContext';
import Navbar from './components/Navbar';

// Pages
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Wishlist from './pages/Wishlist';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import Orders from './pages/Orders';
import OrderDetails from './pages/OrderDetails';

// Protected Route Guard
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="container" style={{ padding: '6rem 1.5rem', textAlign: 'center' }}>
        <div className="spinner" style={{ margin: '0 auto 1rem' }}></div>
        <p style={{ color: 'var(--text-muted)' }}>Verifying credentials...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

// Global Toast Banner
const GlobalToast = () => {
  const { actionMessage } = useCart();
  if (!actionMessage) return null;

  const bgMap = {
    success: 'rgba(16, 185, 129, 0.95)',
    error: 'rgba(244, 63, 94, 0.95)',
    warning: 'rgba(245, 158, 11, 0.95)',
    info: 'rgba(99, 102, 241, 0.95)'
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999,
        background: bgMap[actionMessage.type] || bgMap.info,
        color: 'white',
        padding: '0.85rem 1.5rem',
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-lg)',
        fontWeight: '600',
        fontSize: '0.92rem',
        backdropFilter: 'blur(8px)',
        animation: 'fadeIn 0.25s ease'
      }}
    >
      {actionMessage.text}
    </div>
  );
};

const App = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <GlobalToast />

      <main style={{ flexGrow: 1 }}>
        <Routes>
          <Route path="/" element={<Navigate to="/products" replace />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Customer Routes */}
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/wishlist"
            element={
              <ProtectedRoute>
                <Wishlist />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            }
          />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/order-success/:id"
            element={
              <ProtectedRoute>
                <OrderSuccess />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <Orders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders/:id"
            element={
              <ProtectedRoute>
                <OrderDetails />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/products" replace />} />
        </Routes>
      </main>

      <footer
        style={{
          borderTop: '1px solid var(--border-subtle)',
          padding: '2.5rem 0',
          background: 'rgba(10, 13, 20, 0.95)',
          textAlign: 'center',
          color: 'var(--text-dim)',
          fontSize: '0.85rem'
        }}
      >
        <div className="container">
          <p style={{ marginBottom: '0.5rem', color: 'var(--text-muted)' }}>
            <strong>ShopKart</strong> — Full-Stack MERN E-Commerce Architecture (Labs 01 to 06)
          </p>
          <p>
            Secure MVC • HttpOnly Cookie & Bearer JWT • Razorpay Test Mode • SHA256 HMAC Signature Verification
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
