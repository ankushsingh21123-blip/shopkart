import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { CheckCircle2, Package, ArrowRight, Home, Calendar, MapPin } from 'lucide-react';

const OrderSuccess = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await api.get(`/orders/${id}`);
        if (res.data.success) {
          setOrder(res.data.order);
        }
      } catch (err) {
        console.error('Failed to load confirmed order:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  return (
    <div className="container" style={{ maxWidth: '640px', padding: '5rem 1.5rem' }}>
      <div className="glass-panel" style={{ padding: '3rem 2rem', textAlign: 'center' }}>
        <div
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'rgba(16, 185, 129, 0.15)',
            border: '2px solid rgba(16, 185, 129, 0.4)',
            color: '#34d399',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem',
            boxShadow: '0 0 30px rgba(16, 185, 129, 0.25)'
          }}
        >
          <CheckCircle2 size={46} />
        </div>

        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Payment Successful!</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.75rem', fontSize: '1rem' }}>
          Thank you for your purchase. Your order has been placed and confirmed.
        </p>

        <div
          style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem',
            textAlign: 'left',
            marginBottom: '2rem'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>Order Reference</span>
            <span style={{ fontFamily: 'monospace', fontWeight: '700', color: 'var(--primary-light)' }}>
              #{id}
            </span>
          </div>

          {order && (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <span style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>Amount Paid</span>
                <span style={{ fontWeight: '700' }}>₹{order.totalAmount?.toLocaleString('en-IN')}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <span style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>Payment Status</span>
                <span className="status-pill status-paid" style={{ padding: '2px 8px' }}>
                  {order.paymentStatus}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>Estimated Delivery</span>
                <span style={{ fontWeight: '600', color: 'var(--accent-cyan)' }}>
                  3 - 5 Business Days
                </span>
              </div>
            </>
          )}
        </div>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <Link to={`/orders/${id}`} className="btn btn-secondary">
            <Package size={18} /> View Order Details
          </Link>
          <Link to="/products" className="btn btn-primary">
            Continue Shopping <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
