import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import DonorList from './components/DonorList';
import DonorRegistration from './components/DonorRegistration';
import RequestList from './components/RequestList';
import RequestBlood from './components/RequestBlood';
import CompatibilityMatrix from './components/CompatibilityMatrix';
import { api } from './services/api';
import { Heart, Activity } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [serverOnline, setServerOnline] = useState(true);

  const fetchStats = async () => {
    try {
      const res = await api.getDashboardStats();
      if (res.success) {
        setStats(res.data);
        setServerOnline(true);
      }
    } catch (err) {
      console.warn('Backend server not connected or MongoDB starting:', err.message);
      setServerOnline(false);
    }
  };

  useEffect(() => {
    fetchStats();
    // Poll stats occasionally
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleDonorRegistered = () => {
    fetchStats();
    setActiveTab('donors');
  };

  const handleRequestCreated = () => {
    fetchStats();
    setActiveTab('requests');
  };

  return (
    <div className="app-container">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {!serverOnline && (
        <div style={{
          background: '#fef3c7',
          color: '#92400e',
          padding: '0.65rem 1.5rem',
          fontSize: '0.85rem',
          textAlign: 'center',
          borderBottom: '1px solid #fde68a',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem'
        }}>
          <Activity size={16} />
          <span>
            Backend server not detected at <code>http://localhost:5000</code>. Make sure to run <code>npm run dev</code> inside <code>server/</code>!
          </span>
        </div>
      )}

      <main className="main-content">
        {activeTab === 'dashboard' && (
          <Dashboard
            stats={stats}
            setActiveTab={setActiveTab}
            onRefresh={fetchStats}
          />
        )}

        {activeTab === 'donors' && (
          <DonorList setActiveTab={setActiveTab} />
        )}

        {activeTab === 'register-donor' && (
          <DonorRegistration
            onDonorRegistered={handleDonorRegistered}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'requests' && (
          <RequestList setActiveTab={setActiveTab} />
        )}

        {activeTab === 'request-blood' && (
          <RequestBlood
            onRequestCreated={handleRequestCreated}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'compatibility' && (
          <CompatibilityMatrix setActiveTab={setActiveTab} />
        )}
      </main>

      <footer className="footer">
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            <Heart size={16} fill="var(--primary)" color="var(--primary)" />
            <span>LifeDrop Blood Donation Management Portal</span>
          </div>
          <p>
            Built with React, Node.js, Express & MongoDB • Connecting donors to save lives.
          </p>
        </div>
      </footer>
    </div>
  );
}

