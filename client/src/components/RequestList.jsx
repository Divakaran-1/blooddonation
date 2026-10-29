import React, { useState, useEffect } from 'react';
import { 
  Search, 
  MapPin, 
  Phone, 
  Calendar, 
  AlertCircle, 
  CheckCircle2, 
  RefreshCw, 
  Trash2,
  Users,
  Building2,
  Package
} from 'lucide-react';
import { api } from '../services/api';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const STATUSES = ['Pending', 'Approved', 'Fulfilled', 'Cancelled'];

export default function RequestList({ setActiveTab }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedGroup, setSelectedGroup] = useState('all');
  const [selectedUrgency, setSelectedUrgency] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchRequests = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (selectedStatus !== 'all') params.status = selectedStatus;
      if (selectedGroup !== 'all') params.bloodGroup = selectedGroup;
      if (selectedUrgency !== 'all') params.urgency = selectedUrgency;
      if (searchTerm.trim()) params.search = searchTerm.trim();

      const res = await api.getRequests(params);
      setRequests(res.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load blood requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [selectedStatus, selectedGroup, selectedUrgency]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchRequests();
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await api.updateRequestStatus(id, newStatus);
      setRequests((prev) =>
        prev.map((r) => (r._id === id ? { ...r, status: res.data.status } : r))
      );
    } catch (err) {
      alert(err.message || 'Error updating status');
    }
  };

  const handleDeleteRequest = async (id, patient) => {
    if (!window.confirm(`Delete blood request for "${patient}"?`)) return;
    try {
      await api.deleteRequest(id);
      setRequests((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      alert(err.message || 'Error deleting request');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Emergency Blood Requests</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Active transfusion requests from verified hospitals & emergency wards
          </p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => setActiveTab('request-blood')}>
          + New Blood Request
        </button>
      </div>

      {/* Filter and Search Bar */}
      <form onSubmit={handleSearchSubmit} className="filter-bar">
        <div className="filter-inputs">
          <div className="search-input-wrap">
            <Search size={16} />
            <input
              type="text"
              placeholder="Search by patient, hospital, city..."
              className="form-control"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Status Filter */}
          <select
            className="form-control"
            style={{ width: 'auto', minWidth: '140px' }}
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="all">All Statuses</option>
            {STATUSES.map((st) => (
              <option key={st} value={st}>{st}</option>
            ))}
          </select>

          {/* Blood Group Filter */}
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

          {/* Urgency Filter */}
          <select
            className="form-control"
            style={{ width: 'auto', minWidth: '130px' }}
            value={selectedUrgency}
            onChange={(e) => setSelectedUrgency(e.target.value)}
          >
            <option value="all">All Urgencies</option>
            <option value="Critical">Critical</option>
            <option value="Urgent">Urgent</option>
            <option value="Standard">Standard</option>
          </select>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button type="submit" className="btn btn-secondary btn-sm">
            Apply
          </button>
          <button 
            type="button" 
            className="btn btn-outline btn-sm"
            onClick={() => {
              setSearchTerm('');
              setSelectedStatus('all');
              setSelectedGroup('all');
              setSelectedUrgency('all');
              fetchRequests();
            }}
          >
            <RefreshCw size={14} /> Reset
          </button>
        </div>
      </form>

      {error && (
        <div className="alert alert-error">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
          <button className="btn btn-sm btn-outline" onClick={fetchRequests}>Retry</button>
        </div>
      )}

      <div style={{ marginBottom: '1rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
        Showing <strong>{requests.length}</strong> request(s)
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <RefreshCw className="animate-spin" size={32} style={{ color: 'var(--primary)', margin: '0 auto' }} />
          <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>Loading blood requests...</p>
        </div>
      ) : requests.length === 0 ? (
        <div className="empty-state">
          <CheckCircle2 size={48} style={{ color: 'var(--success)' }} />
          <h3>No Blood Requests Found</h3>
          <p>There are no active blood requests matching the selected criteria.</p>
          <button className="btn btn-primary" style={{ marginTop: '1rem' }} onClick={() => setActiveTab('request-blood')}>
            Post a Blood Request
          </button>
        </div>
      ) : (
        <div className="card-grid">
          {requests.map((req) => (
            <div key={req._id} className="entity-card">
              <div>
                <div className="entity-card-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <div className="blood-type-pill">{req.bloodGroup}</div>
                    <div>
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)' }}>
                        {req.unitsRequired} {req.unitsRequired === 1 ? 'UNIT' : 'UNITS'}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>REQUIRED</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.3rem' }}>
                    <span className={`status-badge ${req.urgency?.toLowerCase()}`}>
                      {req.urgency}
                    </span>
                    <span className={`status-badge ${req.status?.toLowerCase()}`}>
                      {req.status}
                    </span>
                  </div>
                </div>

                <div className="entity-title">{req.patientName}</div>
                <div style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
                  Reason: <strong>{req.reason || 'Medical Transfusion'}</strong>
                </div>

                <div className="entity-meta">
                  <div className="meta-row">
                    <Building2 size={15} style={{ color: 'var(--text-muted)' }} />
                    <span style={{ fontWeight: 600 }}>{req.hospitalName}</span>
                  </div>

                  <div className="meta-row">
                    <MapPin size={15} style={{ color: 'var(--text-muted)' }} />
                    <span>{req.city}</span>
                  </div>

                  <div className="meta-row">
                    <Phone size={15} style={{ color: 'var(--text-muted)' }} />
                    <span>{req.contactPerson}: </span>
                    <a href={`tel:${req.contactPhone}`} style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>
                      {req.contactPhone}
                    </a>
                  </div>

                  {req.neededDate && (
                    <div className="meta-row" style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      <Calendar size={14} />
                      <span>Needed by: {new Date(req.neededDate).toLocaleDateString()}</span>
                    </div>
                  )}

                  {req.notes && (
                    <div style={{
                      background: '#f8fafc',
                      padding: '0.4rem 0.6rem',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.75rem',
                      marginTop: '0.4rem',
                      color: 'var(--text-secondary)'
                    }}>
                      {req.notes}
                    </div>
                  )}
                </div>
              </div>

              <div className="entity-footer">
                {/* Status Switcher Dropdown */}
                <select
                  value={req.status}
                  onChange={(e) => handleStatusChange(req._id, e.target.value)}
                  className="form-control"
                  style={{ width: 'auto', padding: '0.3rem 0.6rem', fontSize: '0.8rem', fontWeight: 600 }}
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>

                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  <button
                    className="btn btn-secondary btn-sm"
                    style={{ padding: '0.4rem 0.65rem' }}
                    onClick={() => setActiveTab('donors')}
                    title="Find Donors in Directory"
                  >
                    <Users size={14} /> Find Donors
                  </button>

                  <button
                    className="btn btn-outline btn-sm"
                    style={{ color: 'var(--danger)', padding: '0.4rem 0.65rem' }}
                    onClick={() => handleDeleteRequest(req._id, req.patientName)}
                    title="Delete Request"
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

