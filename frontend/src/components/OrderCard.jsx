import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Package, ArrowRight, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';

const OrderCard = ({ order }) => {
  const formattedDate = new Date(order.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  const isPaid = order.paymentStatus === 'PAID';

  return (
    <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
      {/* Order Header */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1rem',
          paddingBottom: '1rem',
          borderBottom: '1px solid var(--border-subtle)'
        }}
      >
        <div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Order ID
          </div>
          <span style={{ fontFamily: 'monospace', fontWeight: '700', color: 'var(--primary-light)' }}>
            #{order._id}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          <Calendar size={15} />
          <span>Placed on {formattedDate}</span>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <span className={`status-pill ${isPaid ? 'status-paid' : 'status-pending'}`}>
            {isPaid ? <CheckCircle2 size={13} /> : <Clock size={13} />}
            {order.paymentStatus}
          </span>
          <span className="status-pill" style={{ background: 'var(--bg-tertiary)', color: 'var(--text-main)', border: '1px solid var(--border-subtle)' }}>
            {order.orderStatus}
          </span>
        </div>
      </div>

      {/* Items Preview */}
      <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', padding: '1.25rem 0' }}>
        {order.items?.map((item, idx) => (
          <div
            key={idx}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              background: 'var(--bg-secondary)',
              padding: '0.5rem 0.75rem',
              borderRadius: 'var(--radius-md)',
              minWidth: '220px'
            }}
          >
            <img
              src={item.image}
              alt={item.name}
              style={{ width: '45px', height: '45px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }}
            />
            <div style={{ overflow: 'hidden' }}>
              <div
                style={{
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                {item.name}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Qty: {item.quantity} × ₹{item.price?.toLocaleString('en-IN')}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer & Total */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: '1rem',
          borderTop: '1px solid var(--border-subtle)'
        }}
      >
        <div>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginRight: '0.5rem' }}>
            Total Paid:
          </span>
          <span style={{ fontWeight: '800', fontSize: '1.25rem' }}>
            ₹{order.totalAmount?.toLocaleString('en-IN')}
          </span>
        </div>

        <Link to={`/orders/${order._id}`} className="btn btn-secondary btn-sm">
          View Details <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
};

export default OrderCard;
