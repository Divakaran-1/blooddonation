import React from 'react';
import { 
  Users, 
  Droplet, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight, 
  HeartPulse,
  PlusCircle,
  Clock
} from 'lucide-react';

export default function Dashboard({ stats, setActiveTab, onRefresh }) {
  const bloodGroupStats = stats?.bloodGroupStats || [
    { bloodGroup: 'A+', donorCount: 0, availableDonorCount: 0, requestCount: 0 },
    { bloodGroup: 'A-', donorCount: 0, availableDonorCount: 0, requestCount: 0 },
    { bloodGroup: 'B+', donorCount: 0, availableDonorCount: 0, requestCount: 0 },
    { bloodGroup: 'B-', donorCount: 0, availableDonorCount: 0, requestCount: 0 },
    { bloodGroup: 'AB+', donorCount: 0, availableDonorCount: 0, requestCount: 0 },
    { bloodGroup: 'AB-', donorCount: 0, availableDonorCount: 0, requestCount: 0 },
    { bloodGroup: 'O+', donorCount: 0, availableDonorCount: 0, requestCount: 0 },
    { bloodGroup: 'O-', donorCount: 0, availableDonorCount: 0, requestCount: 0 },
  ];

  return (
    <div>
      {/* Hero Banner */}
      <section className="hero-banner">
        <div className="hero-content">
          <div className="hero-tag">
            <HeartPulse size={14} /> 24/7 Lifeline Network
          </div>
          <h1 className="hero-title">
            Every Drop Saves a <span>Human Life</span>.
          </h1>
          <p className="hero-subtitle">
            Connect voluntary blood donors with hospitals and critical patients instantly.
            Join our registered donor community or post an emergency blood request today.
          </p>
          <div className="hero-actions">
            <button className="btn btn-primary" onClick={() => setActiveTab('register-donor')}>
              <Droplet size={18} /> Register as Donor
            </button>
            <button 
              className="btn btn-secondary" 
              style={{ background: 'rgba(255,255,255,0.12)', color: 'white' }}
              onClick={() => setActiveTab('request-blood')}
            >
              <PlusCircle size={18} /> Request Blood
            </button>
          </div>
        </div>
      </section>

      {/* Key Statistics */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-info">
            <h3>Registered Donors</h3>
            <div className="stat-value">{stats?.totalDonors ?? 0}</div>
            <div className="stat-subtext">Verified community donors</div>
          </div>
          <div className="stat-icon red">
            <Users size={26} />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-info">
            <h3>Available Now</h3>
            <div className="stat-value">{stats?.availableDonors ?? 0}</div>
            <div className="stat-subtext">Ready for immediate donation</div>
          </div>
          <div className="stat-icon green">
            <CheckCircle2 size={26} />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-info">
            <h3>Pending Requests</h3>
            <div className="stat-value">{stats?.pendingRequests ?? 0}</div>
            <div className="stat-subtext">Awaiting donor match</div>
          </div>
          <div className="stat-icon amber">
            <Clock size={26} />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-info">
            <h3>Critical Emergencies</h3>
            <div className="stat-value" style={{ color: 'var(--danger)' }}>
              {stats?.urgentRequests ?? 0}
            </div>
            <div className="stat-subtext">Require urgent attention</div>
          </div>
          <div className="stat-icon red">
            <AlertCircle size={26} />
          </div>
        </div>
      </div>

      {/* Blood Inventory / Availability Overview */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Blood Group Availability Breakdown</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Real-time available donors and patient demands per blood type
            </p>
          </div>
          <button className="btn btn-outline btn-sm" onClick={() => setActiveTab('compatibility')}>
            View Compatibility Chart <ArrowRight size={14} />
          </button>
        </div>

        <div className="blood-groups-grid">
          {bloodGroupStats.map((item) => (
            <div 
              key={item.bloodGroup} 
              className="blood-group-badge-card"
              style={{ cursor: 'pointer' }}
              onClick={() => setActiveTab('donors')}
              title={`Click to view ${item.bloodGroup} donors`}
            >
              <div className="blood-badge">{item.bloodGroup}</div>
              <div className="blood-stat-label">Available Donors</div>
              <div className="blood-donor-count">{item.availableDonorCount || 0}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                {item.requestCount || 0} active req.
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Jump Action Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
        <div 
          className="entity-card" 
          style={{ cursor: 'pointer', background: 'linear-gradient(180deg, #ffffff 0%, #fff5f5 100%)' }}
          onClick={() => setActiveTab('donors')}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--primary)', fontWeight: 700 }}>
              <Users size={20} />
              <span>Blood Donor Directory</span>
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              Search Donors by Blood Group & City
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              Find compatible, verified donors nearest to your hospital or patient location instantly.
            </p>
          </div>
          <div style={{ marginTop: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', fontWeight: 600, fontSize: '0.9rem' }}>
            Browse directory <ArrowRight size={16} />
          </div>
        </div>

        <div 
          className="entity-card" 
          style={{ cursor: 'pointer', background: 'linear-gradient(180deg, #ffffff 0%, #fff8eb 100%)' }}
          onClick={() => setActiveTab('requests')}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--warning)', fontWeight: 700 }}>
              <AlertCircle size={20} />
              <span>Emergency Board</span>
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              Active Hospital & Patient Requests
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              View live blood requests, track fulfillment status, and connect donors to emergencies.
            </p>
          </div>
          <div style={{ marginTop: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#b45309', fontWeight: 600, fontSize: '0.9rem' }}>
            View emergency board <ArrowRight size={16} />
          </div>
        </div>
      </div>
    </div>
  );
}

