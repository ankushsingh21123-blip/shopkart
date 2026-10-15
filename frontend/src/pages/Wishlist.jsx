import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import WishlistCard from '../components/WishlistCard';
import { Heart, ArrowLeft, ShoppingBag } from 'lucide-react';

const Wishlist = () => {
  const { wishlist, loadingWishlist } = useCart();

  if (loadingWishlist) {
    return (
      <div className="container" style={{ padding: '5rem 1.5rem' }}>
        <div className="state-container glass-panel">
          <div className="spinner"></div>
          <h3>Loading your saved wishlist...</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '3rem 1.5rem 5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Heart size={26} color="var(--accent-pink)" fill="var(--accent-pink)" /> My Wishlist
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>
            {wishlist.length} {wishlist.length === 1 ? 'product' : 'products'} saved for later
          </p>
        </div>

        <Link to="/products" className="btn btn-secondary btn-sm">
          <ArrowLeft size={16} /> Continue Shopping
        </Link>
      </div>

      {wishlist.length === 0 ? (
        <div className="state-container glass-panel">
          <Heart size={56} color="var(--text-dim)" style={{ marginBottom: '1.25rem' }} />
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Your wishlist is empty</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', maxWidth: '400px' }}>
            Explore our curated catalog and tap the heart icon on any product to save it here for later.
          </p>
          <Link to="/products" className="btn btn-primary">
            <ShoppingBag size={18} /> Discover Products
          </Link>
        </div>
      ) : (
        <div className="product-grid">
          {wishlist.map((item) => {
            const product = typeof item === 'object' ? item : null;
            if (!product || !product._id) return null;
            return <WishlistCard key={product._id} product={product} />;
          })}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
