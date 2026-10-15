import React from 'react';
import { ShieldCheck, CreditCard, ArrowRight } from 'lucide-react';

const OrderSummary = ({
  subtotal,
  totalUnits,
  onProceed,
  buttonText = 'Proceed to Checkout',
  loading = false,
  disabled = false
}) => {
  const shipping = subtotal >= 999 ? 0 : 99;
  const grandTotal = subtotal + shipping;

  return (
    <div className="glass-panel" style={{ padding: '1.75rem', position: 'sticky', top: '92px' }}>
      <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-subtle)' }}>
        Order Summary
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
          <span>Items Total ({totalUnits} units):</span>
          <span style={{ color: 'var(--text-main)', fontWeight: '600' }}>
            ₹{subtotal.toLocaleString('en-IN')}
          </span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
          <span>Standard Delivery:</span>
          <span style={{ color: shipping === 0 ? 'var(--accent-emerald)' : 'var(--text-main)', fontWeight: '600' }}>
            {shipping === 0 ? 'FREE' : `₹${shipping}`}
          </span>
        </div>

        {subtotal < 999 && subtotal > 0 && (
          <div style={{ fontSize: '0.78rem', color: 'var(--accent-amber)', background: 'rgba(245, 158, 11, 0.1)', padding: '6px 10px', borderRadius: 'var(--radius-sm)' }}>
            Add ₹{(999 - subtotal).toLocaleString('en-IN')} more to unlock FREE Delivery!
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
          <span>Taxes:</span>
          <span style={{ color: 'var(--text-main)', fontWeight: '600' }}>Included (GST)</span>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: '1rem',
            borderTop: '1px solid var(--border-subtle)',
            fontSize: '1.15rem'
          }}
        >
          <span style={{ fontWeight: '700' }}>Grand Total:</span>
          <span style={{ fontWeight: '800', fontSize: '1.45rem', color: 'var(--text-main)' }}>
            ₹{grandTotal.toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      {onProceed && (
        <button
          onClick={onProceed}
          disabled={disabled || loading || totalUnits === 0}
          className="btn btn-primary btn-lg"
          style={{ width: '100%', marginBottom: '1.25rem' }}
        >
          {loading ? (
            'Processing Order...'
          ) : (
            <>
              {buttonText} <ArrowRight size={18} />
            </>
          )}
        </button>
      )}

      {/* Trust & Payment Badges */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)', fontSize: '0.8rem', color: 'var(--text-dim)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ShieldCheck size={16} color="var(--accent-emerald)" />
          <span>256-bit SSL Bank Grade Secure Checkout</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CreditCard size={16} color="var(--primary-light)" />
          <span>Powered by Razorpay Payments Engine</span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
