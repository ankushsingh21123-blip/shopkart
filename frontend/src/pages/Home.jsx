import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import api from '../services/api';
import { User, Mail, Phone, MapPin, Heart, ShoppingCart, Package, KeyRound, Check, AlertCircle } from 'lucide-react';

const Home = () => {
  const { customer, fetchProfile } = useAuth();
  const { wishlist, totalUnits } = useCart();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState({ type: '', text: '' });
  const [updatingPassword, setUpdatingPassword] = useState(false);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordMsg({ type: '', text: '' });

    if (!currentPassword || !newPassword) {
      setPasswordMsg({ type: 'error', text: 'Both fields are required.' });
      return;
    }

    if (newPassword.length < 6) {
      setPasswordMsg({ type: 'error', text: 'New password must be at least 6 characters.' });
      return;
    }

    setUpdatingPassword(true);
    try {
      const res = await api.patch('/customers/change-password', {
        currentPassword,
        newPassword
      });
      if (res.data.success) {
        setPasswordMsg({ type: 'success', text: 'Password successfully changed!' });
        setCurrentPassword('');
        setNewPassword('');
      }
    } catch (err) {
      setPasswordMsg({
        type: 'error',
        text: err.response?.data?.message || 'Failed to update password.'
      });
    } finally {
      setUpdatingPassword(false);
    }
  };

  return (
    <div className="container" style={{ padding: '3rem 1.5rem 5rem' }}>
      {/* Header Profile Banner */}
      <div
        className="glass-panel"
        style={{
          padding: '2.5rem',
          marginBottom: '2rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1.5rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--primary), var(--accent-pink))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.8rem',
              fontWeight: '800',
              color: 'white',
              boxShadow: '0 8px 20px rgba(99, 102, 241, 0.4)'
            }}
          >
            {customer?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div>
            <h1 style={{ fontSize: '1.8rem', marginBottom: '0.25rem' }}>{customer?.name}</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
              <Mail size={16} />
              <span>{customer?.email}</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link to="/products" className="btn btn-primary btn-sm">
            Explore Catalog
          </Link>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <Link to="/cart" className="glass-panel glass-panel-hover" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ padding: '12px', borderRadius: 'var(--radius-md)', background: 'rgba(99, 102, 241, 0.15)', color: 'var(--primary-light)' }}>
            <ShoppingCart size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Cart Items</div>
            <div style={{ fontSize: '1.5rem', fontWeight: '800' }}>{totalUnits} Units</div>
          </div>
        </Link>

        <Link to="/wishlist" className="glass-panel glass-panel-hover" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ padding: '12px', borderRadius: 'var(--radius-md)', background: 'rgba(236, 72, 153, 0.15)', color: 'var(--accent-pink)' }}>
            <Heart size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Saved in Wishlist</div>
            <div style={{ fontSize: '1.5rem', fontWeight: '800' }}>{wishlist.length} Items</div>
          </div>
        </Link>

        <Link to="/orders" className="glass-panel glass-panel-hover" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ padding: '12px', borderRadius: 'var(--radius-md)', background: 'rgba(16, 185, 129, 0.15)', color: 'var(--accent-emerald)' }}>
            <Package size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Order History</div>
            <div style={{ fontSize: '1.5rem', fontWeight: '800' }}>View Orders</div>
          </div>
        </Link>
      </div>

      {/* Profile Details & Security Split */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        {/* Customer Info Card */}
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h2 style={{ fontSize: '1.3rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <User size={20} color="var(--primary-light)" /> Profile Information
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Full Name</label>
              <div style={{ fontSize: '1.05rem', fontWeight: '600' }}>{customer?.name}</div>
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Email</label>
              <div style={{ fontSize: '1.05rem', fontWeight: '600' }}>{customer?.email}</div>
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Phone</label>
              <div style={{ fontSize: '1.05rem', fontWeight: '600' }}>{customer?.phone || 'Not provided'}</div>
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Saved Address</label>
              <div style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>
                {customer?.address?.street ? (
                  `${customer.address.street}, ${customer.address.city}, ${customer.address.state} - ${customer.address.postalCode}`
                ) : (
                  'No default address saved yet.'
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Change Password Card */}
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h2 style={{ fontSize: '1.3rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <KeyRound size={20} color="var(--accent-pink)" /> Security & Password
          </h2>

          {passwordMsg.text && (
            <div
              style={{
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                marginBottom: '1rem',
                fontSize: '0.88rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: passwordMsg.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)',
                color: passwordMsg.type === 'success' ? '#34d399' : '#fb7185',
                border: `1px solid ${passwordMsg.type === 'success' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(244, 63, 94, 0.3)'}`
              }}
            >
              {passwordMsg.type === 'success' ? <Check size={18} /> : <AlertCircle size={18} />}
              <span>{passwordMsg.text}</span>
            </div>
          )}

          <form onSubmit={handlePasswordChange}>
            <div className="form-group">
              <label className="form-label">Current Password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                className="form-input"
                required
              />
            </div>

            <button
              type="submit"
              disabled={updatingPassword}
              className="btn btn-secondary"
              style={{ marginTop: '0.5rem' }}
            >
              {updatingPassword ? 'Updating Password...' : 'Update Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Home;
