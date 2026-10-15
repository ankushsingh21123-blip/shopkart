import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import OrderCard from '../components/OrderCard';
import { Package, ArrowLeft, ShoppingBag } from 'lucide-react';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await api.get('/orders');
        if (res.data.success) {
          setOrders(res.data.orders || []);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to retrieve order history');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="container" style={{ padding: '5rem 1.5rem' }}>
        <div className="state-container glass-panel">
          <div className="spinner"></div>
          <h3>Loading past purchase orders...</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '3rem 1.5rem 5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Package size={26} color="var(--accent-emerald)" /> My Orders
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Track, review and inspect your past purchases and delivery statuses
          </p>
        </div>

        <Link to="/products" className="btn btn-secondary btn-sm">
          <ArrowLeft size={16} /> Explore Catalog
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="state-container glass-panel">
          <Package size={56} color="var(--text-dim)" style={{ marginBottom: '1.25rem' }} />
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>No orders placed yet</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', maxWidth: '400px' }}>
            When you complete a checkout, your verified purchase records and tracking will appear here.
          </p>
          <Link to="/products" className="btn btn-primary">
            <ShoppingBag size={18} /> Start Shopping
          </Link>
        </div>
      ) : (
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          {orders.map((order) => (
            <OrderCard key={order._id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
