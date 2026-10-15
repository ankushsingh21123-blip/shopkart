import React from 'react';

const CheckoutForm = ({ formData, setFormData, errors }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="glass-panel" style={{ padding: '2rem' }}>
      <h2 style={{ fontSize: '1.4rem', marginBottom: '1.5rem' }}>Shipping Information</h2>

      <div className="form-group">
        <label className="form-label">Full Name *</label>
        <input
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          placeholder="e.g. Aarav Sharma"
          className="form-input"
        />
        {errors?.fullName && (
          <span style={{ color: '#fb7185', fontSize: '0.8rem' }}>{errors.fullName}</span>
        )}
      </div>

      <div className="form-group">
        <label className="form-label">Street Address *</label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Flat / House No., Colony / Street"
          className="form-input"
        />
        {errors?.address && (
          <span style={{ color: '#fb7185', fontSize: '0.8rem' }}>{errors.address}</span>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div className="form-group">
          <label className="form-label">City *</label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="Bengaluru"
            className="form-input"
          />
          {errors?.city && (
            <span style={{ color: '#fb7185', fontSize: '0.8rem' }}>{errors.city}</span>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">State *</label>
          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleChange}
            placeholder="Karnataka"
            className="form-input"
          />
          {errors?.state && (
            <span style={{ color: '#fb7185', fontSize: '0.8rem' }}>{errors.state}</span>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div className="form-group">
          <label className="form-label">PIN / Postal Code *</label>
          <input
            type="text"
            name="postalCode"
            value={formData.postalCode}
            onChange={handleChange}
            placeholder="560001"
            className="form-input"
          />
          {errors?.postalCode && (
            <span style={{ color: '#fb7185', fontSize: '0.8rem' }}>{errors.postalCode}</span>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">Contact Phone *</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="9876543210"
            className="form-input"
          />
          {errors?.phone && (
            <span style={{ color: '#fb7185', fontSize: '0.8rem' }}>{errors.phone}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutForm;
