import React, { useState } from 'react';
import { PlusCircle, Droplet, AlertTriangle, Check, AlertCircle } from 'lucide-react';
import { api } from '../services/api';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export default function RequestBlood({ onRequestCreated, setActiveTab }) {
  const [formData, setFormData] = useState({
    patientName: '',
    bloodGroup: 'O+',
    unitsRequired: 1,
    hospitalName: '',
    city: '',
    contactPerson: '',
    contactPhone: '',
    urgency: 'Urgent',
    neededDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    reason: '',
    notes: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBloodGroupSelect = (group) => {
    setFormData((prev) => ({ ...prev, bloodGroup: group }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    setLoading(true);
    try {
      const response = await api.createRequest({
        ...formData,
        unitsRequired: Number(formData.unitsRequired)
      });
      setSuccess('Emergency blood request posted successfully! The community has been notified.');
      if (onRequestCreated) onRequestCreated(response.data);
      // Reset form
      setFormData({
        patientName: '',
        bloodGroup: 'O+',
        unitsRequired: 1,
        hospitalName: '',
        city: '',
        contactPerson: '',
        contactPhone: '',
        urgency: 'Urgent',
        neededDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        reason: '',
        notes: ''
      });
    } catch (err) {
      setError(err.message || 'Failed to submit blood request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-card">
      <div className="form-header">
        <h2>
          <PlusCircle style={{ color: 'var(--primary)' }} /> Request Blood / Emergency Transfusion
        </h2>
        <p>
          Post a request for patients in urgent need of blood. Verified donors will be alerted in real time.
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
            onClick={() => setActiveTab('requests')}
          >
            View Requests Board
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          {/* Blood Group Required */}
          <div className="form-group full-width">
            <label className="form-label">
              <Droplet size={14} style={{ color: 'var(--primary)' }} />
              Required Blood Group <span className="required">*</span>
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

          {/* Urgency Level */}
          <div className="form-group full-width">
            <label className="form-label">
              <AlertTriangle size={14} style={{ color: 'var(--warning)' }} />
              Urgency Level <span className="required">*</span>
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
              {[
                { level: 'Standard', desc: 'Within 2-3 days' },
                { level: 'Urgent', desc: 'Within 24 hours' },
                { level: 'Critical', desc: 'Immediate / Next few hours' }
              ].map((item) => {
                const active = formData.urgency === item.level;
                return (
                  <div
                    key={item.level}
                    onClick={() => setFormData((prev) => ({ ...prev, urgency: item.level }))}
                    style={{
                      border: active ? '2px solid var(--primary)' : '1px solid var(--border)',
                      background: active ? '#fff1f2' : 'white',
                      borderRadius: 'var(--radius-md)',
                      padding: '0.75rem',
                      cursor: 'pointer',
                      textAlign: 'center',
                      transition: 'var(--transition)'
                    }}
                  >
                    <div style={{ fontWeight: 700, color: item.level === 'Critical' ? 'var(--danger)' : 'var(--text-primary)' }}>
                      {item.level}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.desc}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Patient Name */}
          <div className="form-group">
            <label className="form-label">
              Patient Full Name <span className="required">*</span>
            </label>
            <input
              type="text"
              name="patientName"
              className="form-control"
              placeholder="e.g. Michael Smith"
              value={formData.patientName}
              onChange={handleChange}
              required
            />
          </div>

          {/* Units Required */}
          <div className="form-group">
            <label className="form-label">
              Units / Bags Required <span className="required">*</span>
            </label>
            <input
              type="number"
              name="unitsRequired"
              min="1"
              max="20"
              className="form-control"
              placeholder="e.g. 2"
              value={formData.unitsRequired}
              onChange={handleChange}
              required
            />
          </div>

          {/* Hospital Name */}
          <div className="form-group">
            <label className="form-label">
              Hospital / Clinic Name <span className="required">*</span>
            </label>
            <input
              type="text"
              name="hospitalName"
              className="form-control"
              placeholder="e.g. City General Hospital"
              value={formData.hospitalName}
              onChange={handleChange}
              required
            />
          </div>

          {/* City */}
          <div className="form-group">
            <label className="form-label">
              City / Location <span className="required">*</span>
            </label>
            <input
              type="text"
              name="city"
              className="form-control"
              placeholder="e.g. Chennai, Bangalore"
              value={formData.city}
              onChange={handleChange}
              required
            />
          </div>

          {/* Contact Person */}
          <div className="form-group">
            <label className="form-label">
              Attendant / Contact Person <span className="required">*</span>
            </label>
            <input
              type="text"
              name="contactPerson"
              className="form-control"
              placeholder="e.g. Sarah (Sister)"
              value={formData.contactPerson}
              onChange={handleChange}
              required
            />
          </div>

          {/* Contact Phone */}
          <div className="form-group">
            <label className="form-label">
              Emergency Contact Phone <span className="required">*</span>
            </label>
            <input
              type="tel"
              name="contactPhone"
              className="form-control"
              placeholder="+91 98765 00000"
              value={formData.contactPhone}
              onChange={handleChange}
              required
            />
          </div>

          {/* Needed Date */}
          <div className="form-group">
            <label className="form-label">Needed By Date</label>
            <input
              type="date"
              name="neededDate"
              className="form-control"
              value={formData.neededDate}
              onChange={handleChange}
            />
          </div>

          {/* Medical Reason */}
          <div className="form-group">
            <label className="form-label">Medical Reason / Purpose</label>
            <input
              type="text"
              name="reason"
              className="form-control"
              placeholder="e.g. Emergency surgery, dengue, anemia"
              value={formData.reason}
              onChange={handleChange}
            />
          </div>

          {/* Additional Notes */}
          <div className="form-group full-width">
            <label className="form-label">Additional Instructions / Hospital Ward</label>
            <textarea
              name="notes"
              className="form-control"
              placeholder="Specify room number, blood bank desk, or special instructions..."
              value={formData.notes}
              onChange={handleChange}
            />
          </div>
        </div>

        <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
          <button 
            type="button" 
            className="btn btn-secondary" 
            onClick={() => setActiveTab('requests')}
            disabled={loading}
          >
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Submitting Request...' : 'Publish Emergency Request'}
          </button>
        </div>
      </form>
    </div>
  );
}

