import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, ShoppingCart, Loader2 } from 'lucide-react';
import { useCart } from '../context/CartContext';

const WishlistCard = ({ product }) => {
  const { toggleWishlist, addToCart } = useCart();
  const [loadingMove, setLoadingMove] = useState(false);
  const [loadingRemove, setLoadingRemove] = useState(false);

  const handleMoveToCart = async () => {
    if (product.stock <= 0) return;
    setLoadingMove(true);
    const res = await addToCart(product._id, 1);
    if (res.success) {
      await toggleWishlist(product._id);
    }
    setLoadingMove(false);
  };

  const handleRemove = async () => {
    setLoadingRemove(true);
    await toggleWishlist(product._id);
    setLoadingRemove(false);
  };

  const isOutOfStock = product.stock <= 0;

  return (
    <div className="glass-panel glass-panel-hover" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ position: 'relative', width: '100%', aspectRatio: '16/10', overflow: 'hidden', background: 'var(--bg-secondary)' }}>
        <img
          src={product.image}
          alt={product.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <button
          onClick={handleRemove}
          disabled={loadingRemove}
          className="btn btn-secondary btn-sm"
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            padding: '6px',
            borderRadius: '50%',
            background: 'rgba(15, 23, 42, 0.75)',
            color: '#fb7185'
          }}
          title="Remove from wishlist"
        >
          {loadingRemove ? <Loader2 size={16} className="spinner" style={{ width: '16px', height: '16px', margin: 0 }} /> : <Trash2 size={16} />}
        </button>
      </div>

      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        <span className="product-category">{product.category}</span>
        <Link to={`/products/${product._id}`}>
          <h4 style={{ fontSize: '1rem', marginBottom: '0.5rem', color: 'var(--text-main)' }}>
            {product.name}
          </h4>
        </Link>

        <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontWeight: '800', fontSize: '1.2rem' }}>
              ₹{product.price.toLocaleString('en-IN')}
            </div>
            <span className={`stock-pill ${isOutOfStock ? 'stock-out' : 'stock-in'}`}>
              {isOutOfStock ? 'Out of Stock' : 'In Stock'}
            </span>
          </div>

          <button
            onClick={handleMoveToCart}
            disabled={isOutOfStock || loadingMove}
            className="btn btn-primary btn-sm"
          >
            {loadingMove ? (
              <Loader2 size={14} className="spinner" style={{ width: '14px', height: '14px', margin: 0 }} />
            ) : (
              <>
                <ShoppingCart size={14} /> Move to Cart
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WishlistCard;
