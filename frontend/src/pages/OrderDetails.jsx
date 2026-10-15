import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { ArrowLeft, Package, MapPin, CreditCard, Calendar, CheckCircle2, AlertCircle, Truck, Clock } from 'lucide-react';

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/orders/${id}`);
        if (res.data.success) {
          setOrder(res.data.order);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch order details');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="container" style={{ padding: '5rem 1.5rem' }}>
        <div className="state-container glass-panel">
          <div className="spinner"></div>
          <h3>Loading order breakdown...</h3>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container" style={{ padding: '5rem 1.5rem' }}>
        <div className="state-container glass-panel">
          <AlertCircle size={48} color="#fb7185" style={{ marginBottom: '1rem' }} />
          <h3>Order Not Found</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>{error}</p>
          <Link to="/orders" className="btn btn-primary btn-sm">
            <ArrowLeft size={16} /> Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  const isPaid = order.paymentStatus === 'PAID';
  const formattedDate = new Date(order.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="container" style={{ maxWidth: '960px', padding: '3rem 1.5rem 5rem' }}>
      <Link
        to="/orders"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          color: 'var(--text-muted)',
          marginBottom: '2rem',
          fontSize: '0.9rem'
        }}
      >
        <ArrowLeft size={16} /> Back to All Orders
      </Link>

      {/* Header Info */}
      <div
        className="glass-panel"
        style={{
          padding: '2rem',
          marginBottom: '2rem',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1rem'
        }}
      >
        <div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Confirmed Order
          </div>
          <h1 style={{ fontSize: '1.6rem', fontFamily: 'monospace', color: 'var(--primary-light)' }}>
            #{order._id}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            <Calendar size={15} /> Placed on {formattedDate}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <span className={`status-pill ${isPaid ? 'status-paid' : 'status-pending'}`}>
            {isPaid ? <CheckCircle2 size={14} /> : <Clock size={14} />}
            Payment: {order.paymentStatus}
          </span>
          <span className="status-pill" style={{ background: 'var(--bg-tertiary)', color: 'var(--text-main)', border: '1px solid var(--border-subtle)' }}>
            Status: {order.orderStatus}
          </span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem' }}>
        {/* Purchased Items Snapshot List */}
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Package size={20} color="var(--primary-light)" /> Purchased Items Snapshot
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {order.items?.map((item, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '0.75rem',
                  background: 'var(--bg-secondary)',
                  borderRadius: 'var(--radius-md)'
                }}
              >
                <img
                  src={item.image}
                  alt={item.name}
                  style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }}
                />
                <div style={{ flexGrow: 1 }}>
                  <div style={{ fontWeight: '600', fontSize: '0.95rem' }}>{item.name}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    ₹{item.price?.toLocaleString('en-IN')} × {item.quantity}
                  </div>
                </div>
                <div style={{ fontWeight: '700', fontSize: '1.05rem' }}>
                  ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: '1.5rem',
              paddingTop: '1rem',
              borderTop: '1px solid var(--border-subtle)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <span style={{ fontWeight: '700', fontSize: '1.1rem' }}>Grand Total Paid:</span>
            <span style={{ fontWeight: '800', fontSize: '1.4rem', color: 'var(--text-main)' }}>
              ₹{order.totalAmount?.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* Shipping & Payment Metadata */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Shipping Address */}
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MapPin size={18} color="var(--accent-pink)" /> Delivery Address
            </h3>
            <div style={{ fontSize: '0.95rem', lineHeight: '1.6' }}>
              <div style={{ fontWeight: '600' }}>{order.shippingAddress?.fullName}</div>
              <div style={{ color: 'var(--text-muted)' }}>{order.shippingAddress?.address}</div>
              <div style={{ color: 'var(--text-muted)' }}>
                {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.postalCode}
              </div>
              <div style={{ color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                Phone: {order.shippingAddress?.phone}
              </div>
            </div>
          </div>

          {/* Razorpay Transaction Details */}
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CreditCard size={18} color="var(--accent-emerald)" /> Payment Verification
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.85rem' }}>
              <div>
                <span style={{ color: 'var(--text-dim)' }}>Razorpay Order ID:</span>
                <div style={{ fontFamily: 'monospace', fontWeight: '600' }}>
                  {order.razorpayOrderId}
                </div>
              </div>
              <div>
                <span style={{ color: 'var(--text-dim)' }}>Payment Transaction ID:</span>
                <div style={{ fontFamily: 'monospace', fontWeight: '600' }}>
                  {order.razorpayPaymentId || 'N/A'}
                </div>
              </div>
              <div>
                <span style={{ color: 'var(--text-dim)' }}>HMAC Verification:</span>
                <div style={{ color: isPaid ? 'var(--accent-emerald)' : 'var(--accent-amber)', fontWeight: '600' }}>
                  {isPaid ? 'Verified & Authenticated (SHA256)' : 'Pending Verification'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
