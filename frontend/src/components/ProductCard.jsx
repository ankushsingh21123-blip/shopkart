import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, Star, Check, Loader2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const ProductCard = ({ product }) => {
  const { isInWishlist, toggleWishlist, addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);
  const [justAddedToCart, setJustAddedToCart] = useState(false);

  const inWishlist = isInWishlist(product._id);
  const isOutOfStock = product.stock <= 0;

  const handleWishlistToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setWishlistLoading(true);
    await toggleWishlist(product._id);
    setWishlistLoading(false);
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (isOutOfStock) return;

    setCartLoading(true);
    const res = await addToCart(product._id, 1);
    setCartLoading(false);

    if (res.success) {
      setJustAddedToCart(true);
      setTimeout(() => setJustAddedToCart(false), 2000);
    }
  };

  return (
    <div className="glass-panel glass-panel-hover product-card">
      <Link to={`/products/${product._id}`} className="product-image-wrap">
        <img
          src={product.image}
          alt={product.name}
          className="product-image"
          loading="lazy"
        />

        {/* Wishlist Button with Micro-state transitions */}
        <button
          type="button"
          onClick={handleWishlistToggle}
          disabled={wishlistLoading}
          className={`product-wishlist-btn ${inWishlist ? 'active' : ''}`}
          title={
            wishlistLoading
              ? 'Saving...'
              : inWishlist
              ? 'Remove from Wishlist'
              : 'Add to Wishlist'
          }
        >
          {wishlistLoading ? (
            <Loader2 size={16} className="spinner" style={{ width: '16px', height: '16px', margin: 0 }} />
          ) : inWishlist ? (
            <Heart size={18} fill="#ec4899" color="#ec4899" />
          ) : (
            <Heart size={18} />
          )}
        </button>
      </Link>

      <div className="product-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className="product-category">{product.category}</span>
          <span className={`stock-pill ${isOutOfStock ? 'stock-out' : 'stock-in'}`}>
            {isOutOfStock ? 'Out of Stock' : `${product.stock} in stock`}
          </span>
        </div>

        <Link to={`/products/${product._id}`}>
          <h3 className="product-title" title={product.name}>
            {product.name}
          </h3>
        </Link>

        <div className="product-rating">
          <Star size={15} fill="#f59e0b" color="#f59e0b" />
          <span>{product.rating || 4.5}</span>
          <span style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>
            ({product.numReviews || 12})
          </span>
        </div>

        <div className="product-footer">
          <div className="product-price">
            ₹{product.price.toLocaleString('en-IN')}
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isOutOfStock || cartLoading}
            className={`btn btn-sm ${justAddedToCart ? 'btn-secondary' : 'btn-primary'}`}
            style={justAddedToCart ? { borderColor: 'var(--accent-emerald)', color: '#34d399' } : {}}
          >
            {cartLoading ? (
              <Loader2 size={14} className="spinner" style={{ width: '14px', height: '14px', margin: 0 }} />
            ) : justAddedToCart ? (
              <>
                <Check size={14} /> Added
              </>
            ) : isOutOfStock ? (
              'Sold Out'
            ) : (
              <>
                <ShoppingCart size={14} /> Add
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
