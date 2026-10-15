import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Minus, Trash2, Loader2 } from 'lucide-react';
import { useCart } from '../context/CartContext';

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();
  const [updating, setUpdating] = useState(false);

  const product = item.product;
  if (!product) return null;

  const currentQty = item.quantity;
  const maxStock = product.stock || 1;

  const handleIncrement = async () => {
    if (currentQty >= maxStock) return;
    setUpdating(true);
    await updateQuantity(product._id, currentQty + 1);
    setUpdating(false);
  };

  const handleDecrement = async () => {
    setUpdating(true);
    if (currentQty <= 1) {
      await removeFromCart(product._id);
    } else {
      await updateQuantity(product._id, currentQty - 1);
    }
    setUpdating(false);
  };

  const handleRemove = async () => {
    setUpdating(true);
    await removeFromCart(product._id);
    setUpdating(false);
  };

  const lineTotal = (product.price || 0) * currentQty;

  return (
    <div
      className="glass-panel"
      style={{
        padding: '1.25rem',
        marginBottom: '1rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1.25rem'
      }}
    >
      <Link to={`/products/${product._id}`}>
        <img
          src={product.image}
          alt={product.name}
          style={{
            width: '90px',
            height: '90px',
            objectFit: 'cover',
            borderRadius: 'var(--radius-md)',
            background: 'var(--bg-secondary)'
          }}
        />
      </Link>

      <div style={{ flexGrow: 1 }}>
        <span className="product-category">{product.category}</span>
        <Link to={`/products/${product._id}`}>
          <h4 style={{ fontSize: '1.05rem', fontWeight: '700', marginBottom: '0.25rem' }}>
            {product.name}
          </h4>
        </Link>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          ₹{product.price?.toLocaleString('en-IN')} each
        </div>
      </div>

      {/* Quantity Selector */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
        <button
          onClick={handleDecrement}
          disabled={updating}
          className="btn btn-secondary btn-sm"
          style={{ width: '32px', height: '32px', padding: 0 }}
        >
          <Minus size={14} />
        </button>

        <span style={{ fontWeight: '700', minWidth: '24px', textAlign: 'center' }}>
          {currentQty}
        </span>

        <button
          onClick={handleIncrement}
          disabled={updating || currentQty >= maxStock}
          className="btn btn-secondary btn-sm"
          style={{ width: '32px', height: '32px', padding: 0 }}
          title={currentQty >= maxStock ? 'Max stock reached' : 'Add one'}
        >
          <Plus size={14} />
        </button>
      </div>

      {/* Line Total */}
      <div style={{ minWidth: '110px', textAlign: 'right' }}>
        <div style={{ fontWeight: '800', fontSize: '1.15rem' }}>
          ₹{lineTotal.toLocaleString('en-IN')}
        </div>
        <button
          onClick={handleRemove}
          disabled={updating}
          style={{
            background: 'none',
            border: 'none',
            color: '#fb7185',
            fontSize: '0.8rem',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.2rem',
            marginTop: '0.25rem'
          }}
        >
          <Trash2 size={13} /> Remove
        </button>
      </div>
    </div>
  );
};

export default CartItem;
