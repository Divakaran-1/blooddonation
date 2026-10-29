import React, { useState } from 'react';
import { UserPlus, Droplet, Check, AlertCircle } from 'lucide-react';
import { api } from '../services/api';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export default function DonorRegistration({ onDonorRegistered, setActiveTab }) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    bloodGroup: 'A+',
    age: '',
    gender: 'Male',
    city: '',
    address: '',
    pincode: '',
    lastDonationDate: '',
    isAvailable: true,
    medicalNotes: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleBloodGroupSelect = (group) => {
    setFormData((prev) => ({ ...prev, bloodGroup: group }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Basic frontend validations
    if (Number(formData.age) < 18 || Number(formData.age) > 65) {
      setError('Eligible donors must be between 18 and 65 years old.');
      return;
    }

    setLoading(true);
    try {
      const response = await api.registerDonor({
        ...formData,
        age: Number(formData.age)
      });
      setSuccess('Congratulations! You have been registered successfully as a blood donor.');
      if (onDonorRegistered) onDonorRegistered(response.data);
      // Reset form
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        bloodGroup: 'A+',
        age: '',
        gender: 'Male',
        city: '',
        address: '',
        pincode: '',
        lastDonationDate: '',
        isAvailable: true,
        medicalNotes: ''
      });
    } catch (err) {
      setError(err.message || 'Failed to submit registration. Please check your data.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-card">
      <div className="form-header">
        <h2>
          <UserPlus style={{ color: 'var(--primary)' }} /> Voluntary Donor Registration
        </h2>
        <p>
          Register yourself in our blood donor network. Your single donation can save up to 3 lives.
        </p>
      </div>

      {error && (
        <div className="alert alert-error">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        </div>
      )}

      {success && (
        <div className="alert alert-success">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Check size={18} />
            <span>{success}</span>
          </div>
          <button 
            className="btn btn-sm btn-outline" 
            style={{ borderColor: '#065f46', color: '#065f46' }}
            onClick={() => setActiveTab('donors')}
          >
            View Donor List
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          {/* Blood Group Selector */}
          <div className="form-group full-width">
            <label className="form-label">
              <Droplet size={14} style={{ color: 'var(--primary)' }} />
              Select Blood Group <span className="required">*</span>
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(70px, 1fr))', gap: '0.5rem' }}>
              {BLOOD_GROUPS.map((bg) => {
                const selected = formData.bloodGroup === bg;
                return (
                  <button
                    type="button"
                    key={bg}
                    onClick={() => handleBloodGroupSelect(bg)}
                    style={{
                      padding: '0.65rem 0.5rem',
                      borderRadius: 'var(--radius-md)',
                      border: selected ? '2px solid var(--primary)' : '1px solid var(--border)',
                      background: selected ? 'var(--primary-light)' : 'white',
                      color: selected ? 'var(--primary-dark)' : 'var(--text-primary)',
                      fontWeight: 700,
                      fontSize: '1rem',
                      cursor: 'pointer',
                      transition: 'var(--transition)'
                    }}
                  >
                    {bg}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Full Name */}
          <div className="form-group">
            <label className="form-label">
              Full Name <span className="required">*</span>
            </label>
            <input
              type="text"
              name="fullName"
              className="form-control"
              placeholder="e.g. John Doe"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>

          {/* Email */}
          <div className="form-group">
            <label className="form-label">
              Email Address <span className="required">*</span>
            </label>
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="john@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Phone */}
          <div className="form-group">
            <label className="form-label">
              Phone Number <span className="required">*</span>
            </label>
            <input
              type="tel"
              name="phone"
              className="form-control"
              placeholder="+91 98765 43210"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          {/* Age */}
          <div className="form-group">
            <label className="form-label">
              Age (18 - 65 yrs) <span className="required">*</span>
            </label>
            <input
              type="number"
              name="age"
              min="18"
              max="65"
              className="form-control"
              placeholder="e.g. 25"
              value={formData.age}
              onChange={handleChange}
              required
            />
          </div>

          {/* Gender */}
          <div className="form-group">
            <label className="form-label">
              Gender <span className="required">*</span>
            </label>
            <select
              name="gender"
              className="form-control"
              value={formData.gender}
              onChange={handleChange}
              required
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* City */}
          <div className="form-group">
            <label className="form-label">
              City / District <span className="required">*</span>
            </label>
            <input
              type="text"
              name="city"
              className="form-control"
              placeholder="e.g. Chennai, Bangalore, Delhi"
              value={formData.city}
              onChange={handleChange}
              required
            />
          </div>

          {/* Address */}
          <div className="form-group">
            <label className="form-label">Area / Street Address</label>
            <input
              type="text"
              name="address"
              className="form-control"
              placeholder="e.g. 24 Green Street"
              value={formData.address}
              onChange={handleChange}
            />
          </div>

          {/* Pincode */}
          <div className="form-group">
            <label className="form-label">Pincode / Postal Code</label>
            <input
              type="text"
              name="pincode"
              className="form-control"
              placeholder="e.g. 600001"
              value={formData.pincode}
              onChange={handleChange}
            />
          </div>

          {/* Last Donation Date */}
          <div className="form-group">
            <label className="form-label">Last Blood Donation Date (If any)</label>
            <input
              type="date"
              name="lastDonationDate"
              className="form-control"
              value={formData.lastDonationDate}
              onChange={handleChange}
            />
          </div>

          {/* Availability checkbox */}
          <div className="form-group" style={{ justifyContent: 'center' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', marginTop: '1.5rem' }}>
              <input
                type="checkbox"
                name="isAvailable"
                checked={formData.isAvailable}
                onChange={handleChange}
                style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }}
              />
              <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>
                I am currently available for emergency calls
              </span>
            </label>
          </div>

          {/* Medical Notes */}
          <div className="form-group full-width">
            <label className="form-label">Medical Notes / Any Health Remarks (Optional)</label>
            <textarea
              name="medicalNotes"
              className="form-control"
              placeholder="Mention any existing allergies, recent travels, or preferred contact hours..."
              value={formData.medicalNotes}
              onChange={handleChange}
            />
          </div>
        </div>

        <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
          <button 
            type="button" 
            className="btn btn-secondary" 
            onClick={() => setActiveTab('donors')}
            disabled={loading}
          >
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Registering...' : 'Register as Blood Donor'}
          </button>
        </div>
      </form>
    </div>
  );
}

