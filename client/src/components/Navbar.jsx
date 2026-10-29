import React from 'react';
import { 
  Heart, 
  Users, 
  UserPlus, 
  FileText, 
  PlusCircle, 
  LayoutDashboard, 
  GitMerge 
} from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'donors', label: 'Find Donors', icon: Users },
    { id: 'register-donor', label: 'Register Donor', icon: UserPlus },
    { id: 'requests', label: 'Blood Requests', icon: FileText },
    { id: 'compatibility', label: 'Compatibility Matrix', icon: GitMerge }
  ];

  return (
    <header className="navbar">
      <div className="nav-inner">
        <div 
          className="nav-brand" 
          onClick={() => setActiveTab('dashboard')} 
          style={{ cursor: 'pointer' }}
        >
          <div className="brand-icon">
            <Heart size={22} fill="white" />
          </div>
          <div>
            <span>Life<span style={{ color: 'var(--primary)' }}>Drop</span></span>
            <div style={{ fontSize: '0.65rem', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.04em' }}>
              BLOOD MANAGEMENT PORTAL
            </div>
          </div>
        </div>

        <nav>
          <ul className="nav-links">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <li key={item.id}>
                  <button
                    className={`nav-btn ${isActive ? 'active' : ''}`}
                    onClick={() => setActiveTab(item.id)}
                  >
                    <Icon size={16} />
                    <span>{item.label}</span>
                  </button>
                </li>
              );
            })}

            <li>
              <button
                className="nav-btn nav-emergency-btn"
                onClick={() => setActiveTab('request-blood')}
              >
                <PlusCircle size={16} />
                <span>Request Blood</span>
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

