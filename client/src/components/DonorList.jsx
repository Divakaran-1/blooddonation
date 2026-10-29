import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  Trash2, 
  ToggleLeft, 
  ToggleRight, 
  UserCheck, 
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { api } from '../services/api';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export default function DonorList({ setActiveTab }) {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filter States
  const [selectedGroup, setSelectedGroup] = useState('all');
  const [selectedAvailability, setSelectedAvailability] = useState('all');
  const [cityFilter, setCityFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [compatibilityMode, setCompatibilityMode] = useState(false);
  const [recipientBloodGroup, setRecipientBloodGroup] = useState('O+');

  const fetchDonors = async () => {
    setLoading(true);
    setError(null);
    try {
      if (compatibilityMode) {
        const res = await api.getCompatibleDonors(recipientBloodGroup, cityFilter);
        setDonors(res.data || []);
      } else {
        const params = {};
        if (selectedGroup !== 'all') params.bloodGroup = selectedGroup;
        if (selectedAvailability !== 'all') params.isAvailable = selectedAvailability;
        if (cityFilter.trim()) params.city = cityFilter.trim();
        if (searchTerm.trim()) params.search = searchTerm.trim();

        const res = await api.getDonors(params);
        setDonors(res.data || []);
      }
    } catch (err) {
      setError(err.message || 'Failed to load donors');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonors();
  }, [selectedGroup, selectedAvailability, compatibilityMode, recipientBloodGroup]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchDonors();
  };

  const handleToggleAvailability = async (id) => {
    try {
      const res = await api.toggleDonorAvailability(id);
      setDonors((prev) =>
        prev.map((d) => (d._id === id ? { ...d, isAvailable: res.data.isAvailable } : d))
      );
    } catch (err) {
      alert(err.message || 'Error updating status');
    }
  };

  const handleDeleteDonor = async (id, name) => {
    if (!window.confirm(`Are you sure you want to remove donor "${name}"?`)) return;
    try {
      await api.deleteDonor(id);
      setDonors((prev) => prev.filter((d) => d._id !== id));
    } catch (err) {
      alert(err.message || 'Error deleting donor');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Blood Donor Directory</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Browse registered donors, filter by compatibility, and reach out immediately
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button 
            className={`btn btn-sm ${compatibilityMode ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setCompatibilityMode(!compatibilityMode)}
          >
            {compatibilityMode ? '✓ Compatibility Matching Mode' : 'Match by Recipient Blood Group'}
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => setActiveTab('register-donor')}>
            + Add Donor
          </button>
        </div>
      </div>

      {/* Compatibility Matching Banner (when active) */}
      {compatibilityMode && (
        <div style={{
          background: '#fff1f2',
          border: '1px solid #fecdd3',
          padding: '1rem 1.25rem',
          borderRadius: 'var(--radius-lg)',
          marginBottom: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <div style={{ fontWeight: 700, color: 'var(--primary-dark)', fontSize: '0.95rem' }}>
              Compatible Donor Finder
            </div>
            <div style={{ fontSize: '0.825rem', color: '#9f1239' }}>
              Showing only donors who can safely donate to a <strong>{recipientBloodGroup}</strong> recipient.
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Recipient Blood Group:</span>
            <select
              value={recipientBloodGroup}
              onChange={(e) => setRecipientBloodGroup(e.target.value)}
              className="form-control"
              style={{ width: 'auto', padding: '0.35rem 0.75rem', fontWeight: 700, color: 'var(--primary)' }}
            >
              {BLOOD_GROUPS.map((bg) => (
                <option key={bg} value={bg}>{bg}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <form onSubmit={handleSearchSubmit} className="filter-bar">
        <div className="filter-inputs">
          {/* Keyword Search */}
          <div className="search-input-wrap">
            <Search size={16} />
            <input
              type="text"
              placeholder="Search by name, phone, city..."
              className="form-control"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Blood Group Filter (if not in compatibility mode) */}
          {!compatibilityMode && (
            <select
              className="form-control"
              style={{ width: 'auto', minWidth: '140px' }}
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
            >
              <option value="all">All Blood Groups</option>
              {BLOOD_GROUPS.map((bg) => (
                <option key={bg} value={bg}>{bg}</option>
              ))}
            </select>
          )}

          {/* City Filter */}
          <input
            type="text"
            placeholder="Filter by city..."
            className="form-control"
            style={{ width: 'auto', minWidth: '150px' }}
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
          />

          {/* Availability Filter */}
          {!compatibilityMode && (
            <select
              className="form-control"
              style={{ width: 'auto', minWidth: '150px' }}
              value={selectedAvailability}
              onChange={(e) => setSelectedAvailability(e.target.value)}
            >
              <option value="all">All Availabilities</option>
              <option value="true">Available Now</option>
              <option value="false">Unavailable</option>
            </select>
          )}
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button type="submit" className="btn btn-secondary btn-sm">
            Apply Filters
          </button>
          <button 
            type="button" 
            className="btn btn-outline btn-sm" 
            onClick={() => {
              setSearchTerm('');
              setCityFilter('');
              setSelectedGroup('all');
              setSelectedAvailability('all');
              setCompatibilityMode(false);
              fetchDonors();
            }}
          >
            <RefreshCw size={14} /> Reset
          </button>
        </div>
      </form>

      {/* Error notification */}
      {error && (
        <div className="alert alert-error">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
          <button className="btn btn-sm btn-outline" onClick={fetchDonors}>
            Retry
          </button>
        </div>
      )}

      {/* Donor Count */}
      <div style={{ marginBottom: '1rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
        Showing <strong>{donors.length}</strong> donor(s)
      </div>

      {/* Donors Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <RefreshCw className="animate-spin" size={32} style={{ color: 'var(--primary)', margin: '0 auto' }} />
          <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>Loading verified donors...</p>
        </div>
      ) : donors.length === 0 ? (
        <div className="empty-state">
          <Search size={48} />
          <h3>No Donors Found</h3>
          <p>We couldn't find any donors matching your criteria. Try adjusting your filters or register a new donor.</p>
          <button className="btn btn-primary" style={{ marginTop: '1rem' }} onClick={() => setActiveTab('register-donor')}>
            Register a Donor
          </button>
        </div>
      ) : (
        <div className="card-grid">
          {donors.map((donor) => (
            <div key={donor._id} className="entity-card">
              <div>
                <div className="entity-card-header">
                  <div className="blood-type-pill">{donor.bloodGroup}</div>
                  <span className={`status-badge ${donor.isAvailable ? 'available' : 'unavailable'}`}>
                    <span style={{
                      display: 'inline-block',
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: donor.isAvailable ? 'var(--success)' : 'var(--text-muted)'
                    }}></span>
                    {donor.isAvailable ? 'Available' : 'Unavailable'}
                  </span>
                </div>

                <div className="entity-title">{donor.fullName}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {donor.age} yrs • {donor.gender}
                </div>

                <div className="entity-meta">
                  <div className="meta-row">
                    <MapPin size={15} style={{ color: 'var(--text-muted)' }} />
                    <span>{donor.city} {donor.pincode ? `(${donor.pincode})` : ''}</span>
                  </div>

                  <div className="meta-row">
                    <Phone size={15} style={{ color: 'var(--text-muted)' }} />
                    <a href={`tel:${donor.phone}`} style={{ color: 'var(--text-primary)', textDecoration: 'none', fontWeight: 600 }}>
                      {donor.phone}
                    </a>
                  </div>

                  <div className="meta-row">
                    <Mail size={15} style={{ color: 'var(--text-muted)' }} />
                    <a href={`mailto:${donor.email}`} style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>
                      {donor.email}
                    </a>
                  </div>

                  {donor.lastDonationDate && (
                    <div className="meta-row" style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      <Calendar size={14} />
                      <span>Last Donated: {new Date(donor.lastDonationDate).toLocaleDateString()}</span>
                    </div>
                  )}

                  {donor.medicalNotes && (
                    <div style={{
                      background: '#f8fafc',
                      padding: '0.4rem 0.6rem',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.75rem',
                      marginTop: '0.4rem',
                      color: 'var(--text-secondary)'
                    }}>
                      <strong>Note:</strong> {donor.medicalNotes}
                    </div>
                  )}
                </div>
              </div>

              <div className="entity-footer">
                <button
                  className="btn btn-outline btn-sm"
                  onClick={() => handleToggleAvailability(donor._id)}
                  title="Toggle Available / Unavailable status"
                >
                  {donor.isAvailable ? (
                    <>
                      <ToggleRight size={16} color="var(--success)" /> Mark Unavailable
                    </>
                  ) : (
                    <>
                      <ToggleLeft size={16} /> Mark Available
                    </>
                  )}
                </button>

                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  <a
                    href={`tel:${donor.phone}`}
                    className="btn btn-primary btn-sm"
                    style={{ padding: '0.4rem 0.65rem' }}
                    title="Call Donor"
                  >
                    <Phone size={14} /> Call
                  </a>

                  <button
                    className="btn btn-outline btn-sm"
                    style={{ color: 'var(--danger)', padding: '0.4rem 0.65rem' }}
                    onClick={() => handleDeleteDonor(donor._id, donor.fullName)}
                    title="Remove Donor"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

