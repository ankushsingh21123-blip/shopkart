import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Star, ShoppingCart, Heart, Shield, Truck, RefreshCw, ArrowLeft, Check, Plus, Minus, AlertCircle } from 'lucide-react';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, isInWishlist, toggleWishlist } = useCart();
  const { isAuthenticated } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [addingCart, setAddingCart] = useState(false);
  const [addedSuccess, setAddedSuccess] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await api.get(`/products/${id}`);
        if (res.data.success) {
          setProduct(res.data.product);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Product not found.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="container" style={{ padding: '5rem 1.5rem' }}>
        <div className="state-container glass-panel">
          <div className="spinner"></div>
          <h3>Loading product specifications...</h3>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container" style={{ padding: '5rem 1.5rem' }}>
        <div className="state-container glass-panel">
          <AlertCircle size={48} color="#fb7185" style={{ marginBottom: '1rem' }} />
          <h3>Product Not Found</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>{error}</p>
          <Link to="/products" className="btn btn-primary btn-sm">
            <ArrowLeft size={16} /> Return to Catalog
          </Link>
        </div>
      </div>
    );
  }

  const isOutOfStock = product.stock <= 0;
  const inWishlist = isInWishlist(product._id);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (isOutOfStock) return;

    setAddingCart(true);
    const res = await addToCart(product._id, quantity);
    setAddingCart(false);

    if (res.success) {
      setAddedSuccess(true);
      setTimeout(() => setAddedSuccess(false), 2500);
    }
  };

  const handleWishlistToggle = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    await toggleWishlist(product._id);
  };

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem 5rem' }}>
      <Link
        to="/products"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          color: 'var(--text-muted)',
          marginBottom: '2rem',
          fontSize: '0.9rem'
        }}
      >
        <ArrowLeft size={16} /> Back to Products
      </Link>

      <div
        className="glass-panel"
        style={{
          padding: '2.5rem',
          display: 'grid',
          gridTemplateColumns: 'minmax(320px, 1fr) 1fr',
          gap: '3rem'
        }}
      >
        {/* Product Visual */}
        <div style={{ position: 'relative', borderRadius: 'var(--radius-lg)', overflow: 'hidden', background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', aspectRatio: '1/1' }}>
          <img
            src={product.image}
            alt={product.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>

        {/* Product Details */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span className="product-category" style={{ fontSize: '0.85rem' }}>
              {product.category}
            </span>
            <span className={`stock-pill ${isOutOfStock ? 'stock-out' : 'stock-in'}`}>
              {isOutOfStock ? 'Out of Stock' : `${product.stock} units available`}
            </span>
          </div>

          <h1 style={{ fontSize: '2rem', marginBottom: '1rem', lineHeight: '1.3' }}>
            {product.name}
          </h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', color: 'var(--accent-amber)' }}>
            <Star size={18} fill="#f59e0b" color="#f59e0b" />
            <span style={{ fontWeight: '700' }}>{product.rating || 4.5}</span>
            <span style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>
              ({product.numReviews || 12} verified customer reviews)
            </span>
          </div>

          <div style={{ fontSize: '2.25rem', fontWeight: '800', marginBottom: '1.5rem', color: 'var(--text-main)' }}>
            ₹{product.price.toLocaleString('en-IN')}
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.5rem' }}>
              Product Overview
            </h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', fontSize: '1rem' }}>
              {product.description}
            </p>
          </div>

          {/* Quantity Controls & CTA */}
          <div style={{ marginTop: 'auto', paddingTop: '1.5rem', borderTop: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.5rem' }}>
              <span style={{ fontWeight: '600', color: 'var(--text-muted)' }}>Quantity:</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                  disabled={quantity <= 1 || isOutOfStock}
                  className="btn btn-secondary btn-sm"
                  style={{ width: '36px', height: '36px' }}
                >
                  <Minus size={16} />
                </button>
                <span style={{ fontWeight: '700', minWidth: '32px', textAlign: 'center', fontSize: '1.1rem' }}>
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((prev) => Math.min(product.stock, prev + 1))}
                  disabled={quantity >= product.stock || isOutOfStock}
                  className="btn btn-secondary btn-sm"
                  style={{ width: '36px', height: '36px' }}
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={isOutOfStock || addingCart}
                className="btn btn-primary btn-lg"
                style={{ flex: '1 1 220px' }}
              >
                {addingCart ? (
                  'Adding to Cart...'
                ) : addedSuccess ? (
                  <>
                    <Check size={20} /> Added to Cart!
                  </>
                ) : isOutOfStock ? (
                  'Currently Out of Stock'
                ) : (
                  <>
                    <ShoppingCart size={20} /> Add to Cart (₹{(product.price * quantity).toLocaleString('en-IN')})
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleWishlistToggle}
                className={`btn btn-secondary btn-lg ${inWishlist ? 'active' : ''}`}
                style={{ color: inWishlist ? 'var(--accent-pink)' : 'var(--text-main)', borderColor: inWishlist ? 'var(--accent-pink)' : 'var(--border-subtle)' }}
              >
                <Heart size={20} fill={inWishlist ? '#ec4899' : 'none'} />
                {inWishlist ? 'Saved in Wishlist' : 'Add to Wishlist'}
              </button>
            </div>
          </div>

          {/* Guarantees */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '1rem', marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-subtle)', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Truck size={18} color="var(--primary-light)" />
              <span>Free Delivery &gt; ₹999</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Shield size={18} color="var(--accent-emerald)" />
              <span>100% Genuine Brand Warranty</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <RefreshCw size={18} color="var(--accent-cyan)" />
              <span>7 Days Return Guarantee</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
