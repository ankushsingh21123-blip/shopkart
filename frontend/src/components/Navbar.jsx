import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, Heart, ShoppingCart, User, LogOut, Package } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { customer, isAuthenticated, logout } = useAuth();
  const { totalUnits, wishlist } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="container nav-container">
        {/* Brand Logo */}
        <Link to="/products" className="nav-brand">
          <div className="nav-brand-icon">
            <ShoppingBag size={22} />
          </div>
          <span>ShopKart</span>
        </Link>

        {/* Navigation Items */}
        <div className="nav-links">
          <Link
            to="/products"
            className={`nav-item ${isActive('/products') ? 'active' : ''}`}
          >
            <span className="link-text">Catalog</span>
          </Link>

          {isAuthenticated ? (
            <>
              <Link
                to="/wishlist"
                className={`nav-item ${isActive('/wishlist') ? 'active' : ''}`}
                title="Wishlist"
              >
                <Heart size={18} />
                <span className="link-text">Wishlist</span>
                {wishlist.length > 0 && (
                  <span className="badge badge-pink">{wishlist.length}</span>
                )}
              </Link>

              <Link
                to="/cart"
                className={`nav-item ${isActive('/cart') ? 'active' : ''}`}
                title="Shopping Cart"
              >
                <ShoppingCart size={18} />
                <span className="link-text">Cart</span>
                {totalUnits > 0 && (
                  <span className="badge">{totalUnits}</span>
                )}
              </Link>

              <Link
                to="/orders"
                className={`nav-item ${isActive('/orders') ? 'active' : ''}`}
                title="Order History"
              >
                <Package size={18} />
                <span className="link-text">Orders</span>
              </Link>

              <Link
                to="/home"
                className={`nav-item ${isActive('/home') ? 'active' : ''}`}
                title="My Account"
              >
                <User size={18} />
                <span className="link-text">{customer?.name?.split(' ')[0] || 'Profile'}</span>
              </Link>

              <button
                onClick={handleLogout}
                className="btn btn-secondary btn-sm"
                title="Sign Out"
                style={{ marginLeft: '0.5rem' }}
              >
                <LogOut size={16} />
                <span className="link-text">Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-secondary btn-sm">
                Sign In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
